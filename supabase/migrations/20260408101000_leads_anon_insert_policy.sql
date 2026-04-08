-- Allow anonymous users to insert leads (website form submissions)
DROP POLICY IF EXISTS "anon_insert_leads" ON public.leads;
CREATE POLICY "anon_insert_leads"
ON public.leads FOR INSERT TO anon
WITH CHECK (true);
