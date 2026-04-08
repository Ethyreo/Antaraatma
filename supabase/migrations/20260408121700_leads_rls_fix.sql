-- Fix leads RLS policies:
-- 1. Allow anonymous users to INSERT (public form submissions)
-- 2. Allow authenticated admin users to SELECT, UPDATE, DELETE leads
-- 3. Allow any authenticated user to INSERT (logged-in form submissions)

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "anon_insert_leads" ON public.leads;
DROP POLICY IF EXISTS "admin_select_leads" ON public.leads;
DROP POLICY IF EXISTS "admin_update_leads" ON public.leads;
DROP POLICY IF EXISTS "admin_delete_leads" ON public.leads;
DROP POLICY IF EXISTS "auth_insert_leads" ON public.leads;

-- Allow anonymous users to insert leads (public website form)
CREATE POLICY "anon_insert_leads"
ON public.leads FOR INSERT TO anon
WITH CHECK (true);

-- Allow authenticated users to insert leads (logged-in form submissions)
CREATE POLICY "auth_insert_leads"
ON public.leads FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow admin users to select all leads
CREATE POLICY "admin_select_leads"
ON public.leads FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role = 'admin'::public.user_role
  )
);

-- Allow admin users to update leads (e.g. change status)
CREATE POLICY "admin_update_leads"
ON public.leads FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role = 'admin'::public.user_role
  )
)
WITH CHECK (true);

-- Allow admin users to delete leads
CREATE POLICY "admin_delete_leads"
ON public.leads FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role = 'admin'::public.user_role
  )
);
