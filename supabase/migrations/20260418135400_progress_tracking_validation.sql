-- ============================================================
-- PROGRESS TRACKING VALIDATION & AUTO-INITIALIZATION
-- Ensures:
--   1. Unique index on progress_records(user_id, lesson_id) exists
--   2. When a student enrolls, progress_records rows are auto-created (all at 0%)
--   3. When a new lesson is added to a program, enrolled students get a progress row
--   4. Admin can read all progress records
-- ============================================================

-- ─── STEP 1: Ensure unique index exists ──────────────────────
-- (idempotent — IF NOT EXISTS)
CREATE UNIQUE INDEX IF NOT EXISTS idx_progress_user_lesson
  ON public.progress_records(user_id, lesson_id);

CREATE INDEX IF NOT EXISTS idx_progress_user_program_completed
  ON public.progress_records(user_id, program_id, is_completed);

-- ─── STEP 2: Function — initialize progress for a student + program ──
-- Called when a student enrolls; creates one progress_record per published lesson
-- with is_completed=false, progress_percent=0
CREATE OR REPLACE FUNCTION public.initialize_student_progress(
  p_user_id UUID,
  p_program_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.progress_records (
    user_id,
    lesson_id,
    module_id,
    course_id,
    program_id,
    is_completed,
    progress_percent,
    last_accessed_at,
    created_at,
    updated_at
  )
  SELECT
    p_user_id,
    l.id,
    l.module_id,
    l.course_id,
    l.program_id,
    false,
    0,
    NOW(),
    NOW(),
    NOW()
  FROM public.lessons l
  WHERE l.program_id = p_program_id
    AND l.status = 'published'
  ON CONFLICT (user_id, lesson_id) DO NOTHING;
END;
$$;

-- ─── STEP 3: Trigger — auto-init progress on new enrollment ──
CREATE OR REPLACE FUNCTION public.handle_new_enrollment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only initialize for active enrollments
  IF NEW.enrollment_status = 'active' THEN
    PERFORM public.initialize_student_progress(NEW.user_id, NEW.program_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_init_progress_on_enrollment ON public.enrollments;
CREATE TRIGGER trg_init_progress_on_enrollment
  AFTER INSERT ON public.enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_enrollment();

-- Also fire when enrollment_status changes to 'active' (e.g. admin activates)
DROP TRIGGER IF EXISTS trg_init_progress_on_enrollment_update ON public.enrollments;
CREATE TRIGGER trg_init_progress_on_enrollment_update
  AFTER UPDATE OF enrollment_status ON public.enrollments
  FOR EACH ROW
  WHEN (NEW.enrollment_status = 'active' AND OLD.enrollment_status <> 'active')
  EXECUTE FUNCTION public.handle_new_enrollment();

-- ─── STEP 4: Trigger — auto-init progress when a new lesson is published ──
-- When admin adds/publishes a lesson, all enrolled students get a progress row
CREATE OR REPLACE FUNCTION public.handle_new_lesson_for_enrolled_students()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only act when a lesson becomes published
  IF NEW.status = 'published' AND (TG_OP = 'INSERT' OR OLD.status <> 'published') THEN
    INSERT INTO public.progress_records (
      user_id,
      lesson_id,
      module_id,
      course_id,
      program_id,
      is_completed,
      progress_percent,
      last_accessed_at,
      created_at,
      updated_at
    )
    SELECT
      e.user_id,
      NEW.id,
      NEW.module_id,
      NEW.course_id,
      NEW.program_id,
      false,
      0,
      NOW(),
      NOW(),
      NOW()
    FROM public.enrollments e
    WHERE e.program_id = NEW.program_id
      AND e.enrollment_status = 'active'
    ON CONFLICT (user_id, lesson_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_init_progress_on_new_lesson ON public.lessons;
CREATE TRIGGER trg_init_progress_on_new_lesson
  AFTER INSERT OR UPDATE OF status ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_lesson_for_enrolled_students();

-- ─── STEP 5: Backfill — initialize progress for all existing enrollments ──
-- This ensures existing enrolled students who have no progress records get rows at 0%
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT e.user_id, e.program_id
    FROM public.enrollments e
    WHERE e.enrollment_status = 'active'
  LOOP
    PERFORM public.initialize_student_progress(rec.user_id, rec.program_id);
  END LOOP;
  RAISE NOTICE 'Progress backfill complete for all active enrollments.';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Progress backfill error: %', SQLERRM;
END;
$$;

-- ─── STEP 6: RLS — ensure service role can always write progress ──
-- The existing policy "users_manage_own_progress" covers authenticated users.
-- Service role bypasses RLS by default, so no extra policy needed.
-- But we add an explicit admin read policy if not already present.

DROP POLICY IF EXISTS "admin_read_all_progress" ON public.progress_records;
CREATE POLICY "admin_read_all_progress"
ON public.progress_records
FOR SELECT
TO authenticated
USING (public.is_admin());

-- ─── STEP 7: Helper function — get progress summary for a user + program ──
CREATE OR REPLACE FUNCTION public.get_program_progress(
  p_user_id UUID,
  p_program_id UUID
)
RETURNS TABLE(
  total_lessons BIGINT,
  completed_lessons BIGINT,
  progress_percent INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    COUNT(*)::BIGINT AS total_lessons,
    COUNT(*) FILTER (WHERE pr.is_completed = true)::BIGINT AS completed_lessons,
    CASE
      WHEN COUNT(*) = 0 THEN 0
      ELSE ROUND((COUNT(*) FILTER (WHERE pr.is_completed = true)::NUMERIC / COUNT(*)::NUMERIC) * 100)::INTEGER
    END AS progress_percent
  FROM public.progress_records pr
  WHERE pr.user_id = p_user_id
    AND pr.program_id = p_program_id;
$$;
