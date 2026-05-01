-- ============================================================
-- LEADS RLS FINAL FIX
-- Drops every possible leads policy (including the original
-- "admin_manage_leads" from the full schema migration) and
-- recreates them cleanly so anonymous users can INSERT.
-- ============================================================

-- Ensure RLS is enabled
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop ALL known leads policies (exhaustive list)
DROP POLICY IF EXISTS "admin_manage_leads"          ON public.leads;
DROP POLICY IF EXISTS "anon_insert_leads"            ON public.leads;
DROP POLICY IF EXISTS "auth_insert_leads"            ON public.leads;
DROP POLICY IF EXISTS "admin_select_leads"           ON public.leads;
DROP POLICY IF EXISTS "admin_update_leads"           ON public.leads;
DROP POLICY IF EXISTS "admin_delete_leads"           ON public.leads;
DROP POLICY IF EXISTS "auth_select_leads"            ON public.leads;
DROP POLICY IF EXISTS "auth_update_leads"            ON public.leads;
DROP POLICY IF EXISTS "auth_delete_leads"            ON public.leads;

-- 1. Allow anonymous users to INSERT (public website form submissions)
CREATE POLICY "anon_insert_leads"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (true);

-- 2. Allow authenticated users to INSERT (logged-in form submissions)
CREATE POLICY "auth_insert_leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Allow authenticated users to SELECT all leads (admin dashboard)
CREATE POLICY "auth_select_leads"
ON public.leads
FOR SELECT
TO authenticated
USING (true);

-- 4. Allow authenticated users to UPDATE leads (status changes)
CREATE POLICY "auth_update_leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Allow authenticated users to DELETE leads
CREATE POLICY "auth_delete_leads"
ON public.leads
FOR DELETE
TO authenticated
USING (true);
