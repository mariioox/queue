# Q-LINE

Digital queue system for local businesses. Customers find shops, join a line from their phone, and track their spot live; shop owners run the queue from a real-time dashboard.

## Stack

- React 19 + TypeScript + Vite (SWC)
- Tailwind CSS v4
- [Clerk](https://clerk.com) — authentication
- [Supabase](https://supabase.com) — Postgres, realtime, storage
- react-router-dom 7 — routing
- Deployed on Vercel

## Getting started

```bash
npm install
cp .env.example .env   # fill in your keys
npm run dev
```

Required environment variables:

| Variable | Purpose |
| --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk auth |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build |

## Project structure

```
src/
  components/   Navbar, Footer, ShopCard, admin dashboard, onboarding wizard
  lib/          Supabase client, shared constants, helpers
  pages/        Routes: Home, Explore, ShopDetails, MyQueue, Admin, auth
  types/        Shared Shop/Booking types
```

CI (GitHub Actions) runs `tsc -b`, lint, and build on every push and PR.
