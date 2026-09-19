-- =====================================================
-- 018: Auth validation + persistent unenrollment + student archive
-- =====================================================

-- ---------- 1. EMAIL REGISTRATION CHECK (secure, no service-role exposure) ----------
-- profiles rows are auto-created for every auth user (migration 011),
-- so checking profiles.email reliably reflects registered accounts.
CREATE OR REPLACE FUNCTION public.check_email_registered(p_email text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE lower(profiles.email) = lower(p_email)
  );
$function$;

GRANT EXECUTE ON FUNCTION public.check_email_registered(text) TO anon, authenticated;

-- ---------- 2. PERSISTENT STUDENT UNENROLLMENT ----------
-- Students may withdraw themselves from a class. The row is kept with
-- status = 'withdrawn' (matches existing DB design); app queries filter
-- status = 'enrolled', so the change persists across refresh/devices.
DROP POLICY IF EXISTS "rosters_student_update" ON public.class_rosters;
DROP POLICY IF EXISTS "rosters_student_delete" ON public.class_rosters;

CREATE POLICY "rosters_student_update" ON public.class_rosters
  FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "rosters_student_delete" ON public.class_rosters
  FOR DELETE TO authenticated
  USING (student_id = auth.uid());

-- ---------- 3. STUDENT RECORD ARCHIVE (soft delete) ----------
ALTER TABLE public.enrollment_submissions
  ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false;
ALTER TABLE public.enrollment_submissions
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;
