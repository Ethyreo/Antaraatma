# Antaraatma

Antaraatma is a Next.js 15 application for Antaraatma's healing ecosystem. It includes:

- Public marketing pages for programs, services, and blog content
- Student onboarding, dashboard, progress tracking, and resource access
- Admin tools for content, students, leads, enrollments, and program management
- Supabase-backed authentication, data storage, and row-level-security policies

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth and Postgres

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create `.env` with the required Supabase variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:4028`.

## Scripts

- `npm run dev` starts the dev server on port `4028`
- `npm run build` builds the app
- `npm run serve` starts the production server
- `npm run lint` runs ESLint
- `npm run lint:fix` applies ESLint fixes
- `npm run format` formats `src/**/*.{ts,tsx,css,md,json}`
- `npm run type-check` runs TypeScript without emitting files

## Project Notes

- `main` is the current source-of-truth branch.
- The historical `rocket-update` work has already been merged into `main`.
- Core schema and data changes live in `supabase/migrations/`.
- Some pages still use legacy mock data while newer flows are already Supabase-backed.

## Key Paths

- `src/app/` application routes and API handlers
- `src/components/` shared UI and layout components
- `src/contexts/AuthContext.tsx` client auth state
- `src/lib/supabase/` Supabase browser and route helpers
- `supabase/migrations/` database schema and migration history

## Deployment

The project is configured for Netlify and standard Next.js production builds.
