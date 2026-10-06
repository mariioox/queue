-- Q-LINE schema inspection — SINGLE query (your editor only shows the
-- last statement's result, so everything is combined into one grid).
-- Read-only. Run it once and paste the whole result table back.

select * from (
  -- 1. columns + types
  select 1 as q, 'columns' as section,
         table_name || ' :: ' ||
         string_agg(column_name || ' ' || data_type, ', ' order by ordinal_position) as detail
  from information_schema.columns
  where table_schema = 'public'
    and table_name in ('shops', 'bookings', 'profiles')
  group by table_name

  union all
  -- 2. RLS enabled?
  select 2, 'rls',
         tablename || ' rowsecurity=' || rowsecurity
  from pg_tables
  where schemaname = 'public'
    and tablename in ('shops', 'bookings', 'profiles')

  union all
  -- 3. existing policies
  select 3, 'policies',
         tablename || ' | ' || policyname || ' | ' || cmd ||
         ' | using: ' || coalesce(qual, '-') ||
         ' | check: ' || coalesce(with_check, '-')
  from pg_policies
  where schemaname = 'public'

  union all
  -- 4a. constraints
  select 4, 'constraints',
         conrelid::regclass || ' | ' || conname || ' | ' || pg_get_constraintdef(oid)
  from pg_constraint
  where connamespace = 'public'::regnamespace

  union all
  -- 4b. indexes
  select 4, 'indexes',
         indexname || ' | ' || indexdef
  from pg_indexes
  where schemaname = 'public'

  union all
  -- 5. functions
  select 5, 'functions',
         p.proname || '(' || pg_get_function_arguments(p.oid) || ') returns ' ||
         coalesce(pg_get_function_result(p.oid), '?')
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'

  union all
  -- 6. realtime publication
  select 6, 'realtime', schemaname || '.' || tablename
  from pg_publication_tables
  where pubname = 'supabase_realtime'

  union all
  -- 7. storage bucket
  select 7, 'storage_bucket', id || ' :: public=' || public
  from storage.buckets
  where id = 'shop-images'

  union all
  -- 7b. storage policies
  select 7, 'storage_policies',
         tablename || ' | ' || policyname || ' | ' || cmd ||
         ' | using: ' || coalesce(qual, '-')
  from pg_policies
  where schemaname = 'storage'
) t
order by q, section, detail;
