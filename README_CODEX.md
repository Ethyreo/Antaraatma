# Antaraatma Project Overview (Codex Guide)

## Current State & Branching Logic
- **Primary Branch:** `rocket-update`
  - This branch contains the most recent and significant updates, including a complete overhaul of the admin dashboard, student onboarding flows, API routes, and Supabase integrations.
  - **Do not use `main` for development**, as it contains outdated code.
- **Platform:** Next.js 15 (App Router), React 19, Tailwind CSS.
- **Origin:** Created via [Rocket.ai](https://rocket.new).
- **Hosting:** Netlify (Custom Domain).

## 🛠️ Supabase & Data Architecture
- **Connection:** Configured via `.env` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Database Schema:** Located in `supabase/migrations/`.
  - The core schema is in `20260408083700_antaraatma_full_schema.sql`.
  - Recent migrations (April/May 2026) added leads management, student enrollment, and progress tracking.
  - **RLS Policies:** Row Level Security is heavily utilized. Check `20260409093300_leads_rls_final_fix.sql` for lead submission patterns and `src/components/AdminGuard.tsx` for access control.
- **Seed Data:** Admin account (`theantaraatmahealing@gmail.com`) is seeded via `20260501181900_reset_data_and_seed_admin.sql`.

## 🔐 Authentication & Security
- **Auth Provider:** Supabase Auth via `@supabase/ssr`.
- **Context:** `src/contexts/AuthContext.tsx` provides the `useAuth` hook for user state.
- **Middleware:** `src/middleware.ts` handles redirects for `/admin` and `/student-dashboard` based on user roles and session status.
- **Admin Protection:** `src/components/AdminGuard.tsx` ensures only users with the `admin` role can access management pages.

## 📦 Key Application Modules
1. **Admin Suite (`/admin-dashboard`, `/admin/*`)**:
   - Advanced management for Blog, Leads, Orders, Students, services, and shipments.
   - Includes KPI grids and health panels for content.
2. **Student Experience**:
   - **Onboarding (`/student-onboarding`)**: Interactive tour and signup flow.
   - **Dashboard (`/student-dashboard`)**: Progress tracking, current lessons, and resource access.
   - **Resource Vault (`/resource-vault`)**: Central repository for student assets.
3. **Program Management**:
   - Complex "Module Tree" UI for managing courses and lessons (`src/app/program-management/components/ModuleTree.tsx`).

## 🚀 Development Notes
- **Local Port:** `4028`.
- **Mass Rename:** The project was migrated from `VijayHeals` to `Antaraatma`. All code references have been updated, but watch for any hardcoded strings in external service configurations.
- **NPM Optimization:** The `npm` prefix and cache have been moved to the D: drive to handle local disk space constraints.

## 📋 Task History & Progress
- [x] Pull repo and checkout `rocket-update`.
- [x] Perform global rename (Folder, Repo, Code).
- [x] Configure npm for D: drive.
- [x] Update Supabase migration file names.
- [x] Verify local build/install.
