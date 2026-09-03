# Antaraatma Project Overview (Codex Guide)

## Current State

- Primary branch: `main`
- Historical branch: `rocket-update` has already been merged into `main`
- Platform: Next.js 15 App Router, React 19, Tailwind CSS
- Hosting target: Netlify

## Supabase and Data

- Client auth uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server-side admin workflows also require `SUPABASE_SERVICE_ROLE_KEY`
- Core schema lives in `supabase/migrations/20260408083700_antaraatma_full_schema.sql`
- Later migrations add student invitations, enrollment flow, and progress auto-initialization
- Admin seed/reset lives in `supabase/migrations/20260501181900_reset_data_and_seed_admin.sql`

## Auth and Access Control

- Client auth state is managed in `src/contexts/AuthContext.tsx`
- Route protection and role redirects are handled in `src/middleware.ts`
- Admin pages use `src/components/AdminGuard.tsx` as a client-side secondary check
- API routes now need to use shared helpers from `src/lib/supabase/route.ts` when service-role access is involved

## Application Areas

1. Admin suite
- `src/app/admin-dashboard`
- `src/app/admin/*`
- `src/app/program-management`

2. Student experience
- `src/app/sign-up-login`
- `src/app/student-onboarding`
- `src/app/student-dashboard`
- `src/app/progress-tracking`
- `src/app/resource-vault`
- `src/app/community`

3. Public site
- `src/app/homepage`
- `src/app/awareness-session`
- `src/app/foundation-course`
- `src/app/transformation-mastery`
- `src/app/services`
- `src/app/programs-overview`
- `src/app/blog`

## Known Migration Debt

- Some public and student-facing pages still read from `src/lib/data/mockData.ts`
- Admin CRUD and progress flows are much more Supabase-backed than the marketing pages
- Some built-with-Rocket metadata and deployment URLs are still hardcoded in the app shell

## Development Notes

- Local port: `4028`
- The repo was renamed from `VijayHeals` to `Antaraatma`
- npm cache/prefix were moved to `D:` because of local disk constraints

## Recommended Next Work

- Continue replacing mock-data-driven pages with Supabase reads
- Keep tightening API authorization around service-role routes
- Clean up remaining rebrand leftovers and hardcoded Rocket URLs where appropriate
