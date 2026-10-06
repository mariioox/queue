-- ============================================================================
-- Q-LINE security hardening
-- Run this whole file in the Supabase SQL editor, BEFORE deploying the
-- matching client update (the client sends Clerk session tokens).
--
--  1. public.clerk_uid()  — auth.uid() casts `sub` to uuid and breaks on
--                           Clerk's text user ids, so we read auth.jwt() instead.
--  2. RLS policies        — replace the "using (true)" free-for-all with
--                           owner/user-scoped policies.
--  3. Data cleanup        — cancel duplicate active bookings, then enforce
--                           one active booking per user+shop with a partial
--                           unique index (kills the join double-booking race).
--  4. RPCs                — security-definer queue mutations (join, call next,
--                           finish, cancel) + public count/position reads.
--  5. Storage             — uploads restricted to a per-user folder.
--
-- Idempotent: safe to re-run.
-- ============================================================================

-- ── 1. Clerk user id helper ──────────────────────────────────────────────────

create or replace function public.clerk_uid()
returns text
language sql
stable
as $$
  select nullif(auth.jwt() ->> 'sub', '')
$$;

comment on function public.clerk_uid() is
  'Current request''s Clerk user id (text), or null when unauthenticated.';


-- ── 2. RLS policies ──────────────────────────────────────────────────────────

-- profiles -------------------------------------------------------------------
drop policy if exists "Enable insert for all users"       on public.profiles;
drop policy if exists "Enable select for all users"       on public.profiles;
drop policy if exists "Enable update for users"           on public.profiles;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;

create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "users insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (id = (select public.clerk_uid()));

create policy "users update their own profile"
  on public.profiles for update
  to authenticated
  using  (id = (select public.clerk_uid()))
  with check (id = (select public.clerk_uid()));

-- shops -----------------------------------------------------------------------
drop policy if exists "Shops are viewable by everyone"  on public.shops;
drop policy if exists "Users can insert their own shop" on public.shops;

create policy "shops are publicly readable"
  on public.shops for select
  using (true);

create policy "owners insert their own shop"
  on public.shops for insert
  to authenticated
  with check (owner_id = (select public.clerk_uid()));

create policy "owners update their own shop"
  on public.shops for update
  to authenticated
  using  (owner_id = (select public.clerk_uid()))
  with check (owner_id = (select public.clerk_uid()));

create policy "owners delete their own shop"
  on public.shops for delete
  to authenticated
  using (owner_id = (select public.clerk_uid()));

-- bookings ---------------------------------------------------------------------
drop policy if exists "Enable insert for all"     on public.bookings;
drop policy if exists "Enable select for all"     on public.bookings;
drop policy if exists "Enable update for owners"  on public.bookings;

-- Customers see their own rows; shop owners see rows for their shop.
-- Anonymous users see no booking rows at all — public counts go through RPCs.
create policy "read own bookings or own shop's bookings"
  on public.bookings for select
  to authenticated
  using (
    user_id = (select public.clerk_uid())
    or exists (
      select 1 from public.shops s
      where s.id = bookings.shop_id
        and s.owner_id = (select public.clerk_uid())
    )
  );

create policy "join the queue as yourself"
  on public.bookings for insert
  to authenticated
  with check (
    user_id = (select public.clerk_uid())
    and status = 'waiting'
  );

-- Direct updates are limited to customers cancelling their own active ticket.
-- Shop-owner status changes go through the security-definer RPCs below.
create policy "cancel your own active booking"
  on public.bookings for update
  to authenticated
  using  (user_id = (select public.clerk_uid()) and status in ('waiting', 'serving'))
  with check (user_id = (select public.clerk_uid()) and status = 'cancelled');


-- ── 3. Dedup existing data + unique active-booking index ─────────────────────

with ranked as (
  select id,
         row_number() over (
           partition by user_id, shop_id
           order by (status = 'serving') desc, created_at, id
         ) as rn
  from public.bookings
  where status in ('waiting', 'serving')
)
update public.bookings b
set status = 'cancelled'
from ranked r
where b.id = r.id
  and r.rn > 1;

create unique index if not exists bookings_one_active_per_user_shop
  on public.bookings (user_id, shop_id)
  where status in ('waiting', 'serving');


-- ── 4. RPCs ──────────────────────────────────────────────────────────────────

-- Join (idempotent): returns the caller's existing active booking if there is
-- one, otherwise inserts. unique_violation race is caught and re-read.
create or replace function public.join_queue(p_shop_id uuid, p_customer_name text default null)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid text := (select public.clerk_uid());
  v_row public.bookings;
begin
  if v_uid is null then
    raise exception 'You need to sign in to join the queue';
  end if;

  if not exists (select 1 from public.shops where id = p_shop_id) then
    raise exception 'Shop not found';
  end if;

  select * into v_row
  from public.bookings
  where user_id = v_uid
    and shop_id = p_shop_id
    and status in ('waiting', 'serving')
  limit 1;

  if found then
    return v_row;
  end if;

  begin
    insert into public.bookings (shop_id, user_id, customer_name, status)
    values (p_shop_id, v_uid, nullif(trim(coalesce(p_customer_name, '')), ''), 'waiting')
    returning * into v_row;
  exception when unique_violation then
    select * into v_row
    from public.bookings
    where user_id = v_uid
      and shop_id = p_shop_id
      and status in ('waiting', 'serving')
    limit 1;
    if not found then
      raise;
    end if;
  end;

  return v_row;
end;
$$;

-- Shop owner: complete whoever is being served, then serve the oldest waiting
-- customer. Atomic (single function call).
create or replace function public.call_next(p_shop_id uuid)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid text := (select public.clerk_uid());
  v_row public.bookings;
begin
  if v_uid is null or not exists (
    select 1 from public.shops where id = p_shop_id and owner_id = v_uid
  ) then
    raise exception 'You can only manage your own shop';
  end if;

  update public.bookings
  set status = 'completed'
  where shop_id = p_shop_id and status = 'serving';

  select * into v_row
  from public.bookings
  where shop_id = p_shop_id and status = 'waiting'
  order by created_at, id
  limit 1;

  if not found then
    return null;
  end if;

  update public.bookings
  set status = 'serving'
  where id = v_row.id
  returning * into v_row;

  return v_row;
end;
$$;

-- Shop owner: finish the current session without calling anyone new.
create or replace function public.finish_session(p_shop_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid text := (select public.clerk_uid());
begin
  if v_uid is null or not exists (
    select 1 from public.shops where id = p_shop_id and owner_id = v_uid
  ) then
    raise exception 'You can only manage your own shop';
  end if;

  update public.bookings
  set status = 'completed'
  where shop_id = p_shop_id and status = 'serving';
end;
$$;

-- Customer: cancel their own active booking.
create or replace function public.cancel_booking(p_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid text := (select public.clerk_uid());
begin
  if v_uid is null then
    raise exception 'You need to sign in';
  end if;

  update public.bookings
  set status = 'cancelled'
  where id = p_booking_id
    and user_id = v_uid
    and status in ('waiting', 'serving');

  if not found then
    raise exception 'This ticket can no longer be cancelled';
  end if;
end;
$$;

-- Public reads (safe: counts only, never names).
create or replace function public.queue_counts(p_shop_id uuid)
returns bigint
language sql
security definer
stable
set search_path = public
as $$
  select count(*)
  from public.bookings
  where shop_id = p_shop_id
    and status = 'waiting'
$$;

create or replace function public.queue_position(p_shop_id uuid, p_created_at timestamptz)
returns bigint
language sql
security definer
stable
set search_path = public
as $$
  select count(*) + 1
  from public.bookings
  where shop_id = p_shop_id
    and status = 'waiting'
    and created_at < p_created_at
$$;

create or replace function public.shop_waiting_counts()
returns table (shop_id uuid, waiting_count bigint)
language sql
security definer
stable
set search_path = public
as $$
  select b.shop_id, count(*) as waiting_count
  from public.bookings b
  where b.status = 'waiting'
  group by b.shop_id
$$;

-- Function execute grants (functions default to EXECUTE for PUBLIC).
revoke execute on function public.join_queue(uuid, text)             from public, anon;
revoke execute on function public.call_next(uuid)                    from public, anon;
revoke execute on function public.finish_session(uuid)               from public, anon;
revoke execute on function public.cancel_booking(uuid)               from public, anon;
revoke execute on function public.queue_counts(uuid)                 from public;
revoke execute on function public.queue_position(uuid, timestamptz)  from public;
revoke execute on function public.shop_waiting_counts()              from public;

grant execute on function public.join_queue(uuid, text)             to authenticated;
grant execute on function public.call_next(uuid)                    to authenticated;
grant execute on function public.finish_session(uuid)               to authenticated;
grant execute on function public.cancel_booking(uuid)               to authenticated;
grant execute on function public.queue_counts(uuid)                 to anon, authenticated;
grant execute on function public.queue_position(uuid, timestamptz)  to anon, authenticated;
grant execute on function public.shop_waiting_counts()              to anon, authenticated;


-- ── 5. Storage: uploads only into the caller's own folder ────────────────────
-- Files must be uploaded as "<clerk_uid>/<anything>".
-- Existing flat images stay publicly readable (public SELECT policy kept).

drop policy if exists "Allow public uploads"       on storage.objects;
drop policy if exists "Image Upload 1qv9g6n_0"     on storage.objects;

create policy "shop image uploads go to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'shop-images'
    and (storage.foldername(name))[1] = (select public.clerk_uid())
  );


-- ── Verify (expect 10 public policies, 7 functions, 1 unique index) ───────────
--
-- select tablename, policyname, cmd from pg_policies
--   where schemaname = 'public' order by tablename, policyname;
--
-- select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--   where n.nspname = 'public' order by 1;
--
-- select indexdef from pg_indexes
--   where indexname = 'bookings_one_active_per_user_shop';
