-- Inquiries (Help desk tickets) + Classwork + Submissions

-- ---------- 1. INQUIRIES ----------
CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  department text NOT NULL DEFAULT 'registrar'::text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  admin_notes text DEFAULT ''::text,
  handled_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inquiries_student_manage" ON public.inquiries
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "inquiries_admin_manage" ON public.inquiries
  FOR ALL TO authenticated
  USING (public.has_permission('manage_enrollment') OR public.has_permission('manage_users') OR public.has_role('super_admin'))
  WITH CHECK (public.has_permission('manage_enrollment') OR public.has_permission('manage_users') OR public.has_role('super_admin'));

CREATE INDEX IF NOT EXISTS idx_inquiries_student ON public.inquiries (student_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries (status);

-- ---------- 2. CLASSWORK ----------
CREATE TABLE IF NOT EXISTS public.classwork (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id),
  type text DEFAULT 'material'::text CHECK (type IN ('material', 'assignment', 'quiz', 'doc')),
  title text NOT NULL,
  description text DEFAULT ''::text,
  due_date date,
  points integer DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.classwork ENABLE ROW LEVEL SECURITY;

-- Students can read classwork for classes they are enrolled in
CREATE POLICY "classwork_select" ON public.classwork FOR SELECT TO authenticated
  USING (
    public.has_permission('manage_classes')
    OR EXISTS (
      SELECT 1 FROM public.class_rosters cr
      WHERE cr.class_id = classwork.class_id
        AND cr.student_id = auth.uid()
    )
  );

CREATE POLICY "classwork_write" ON public.classwork FOR ALL TO authenticated
  USING (public.has_permission('manage_classes')) WITH CHECK (public.has_permission('manage_classes'));

CREATE INDEX IF NOT EXISTS idx_classwork_class ON public.classwork (class_id);
CREATE INDEX IF NOT EXISTS idx_classwork_due ON public.classwork (due_date);

-- ---------- 3. CLASSWORK SUBMISSIONS (Mark as done) ----------
CREATE TABLE IF NOT EXISTS public.classwork_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classwork_id uuid NOT NULL REFERENCES public.classwork(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'done'::text,
  submitted_at timestamptz DEFAULT now(),
  UNIQUE (classwork_id, student_id)
);

ALTER TABLE public.classwork_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "submissions_student_manage" ON public.classwork_submissions
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "submissions_admin_view" ON public.classwork_submissions
  FOR ALL TO authenticated
  USING (public.has_permission('manage_classes')) WITH CHECK (public.has_permission('manage_classes'));

CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.classwork_submissions (student_id);
