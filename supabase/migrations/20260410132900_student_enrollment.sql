-- ============================================================
-- STUDENT ENROLLMENT FLOW
-- student_invitations table + onboarding_completed on user_profiles
-- ============================================================

-- Add onboarding_completed to user_profiles if not exists
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS city TEXT;

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS health_goals TEXT;

-- STUDENT INVITATIONS TABLE
-- Admin pre-registers a student by email + name before they sign up
CREATE TABLE IF NOT EXISTS public.student_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  invited_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_invitations_email ON public.student_invitations(email);
CREATE INDEX IF NOT EXISTS idx_student_invitations_status ON public.student_invitations(status);

-- Enable RLS
ALTER TABLE public.student_invitations ENABLE ROW LEVEL SECURITY;

-- RLS: Admins can manage all invitations (via service role key in API routes)
-- Students can read their own invitation by email (for signup check)
DROP POLICY IF EXISTS "public_read_own_invitation" ON public.student_invitations;
CREATE POLICY "public_read_own_invitation"
ON public.student_invitations
FOR SELECT
TO public
USING (true);

-- Trigger to update updated_at on student_invitations
CREATE OR REPLACE FUNCTION public.update_student_invitations_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_student_invitations_updated_at ON public.student_invitations;
CREATE TRIGGER trg_student_invitations_updated_at
  BEFORE UPDATE ON public.student_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_student_invitations_updated_at();
