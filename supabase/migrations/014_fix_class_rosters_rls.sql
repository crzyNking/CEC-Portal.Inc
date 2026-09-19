-- Fix class_rosters RLS: allow students to see classmates in the same class
DROP POLICY IF EXISTS "rosters_select" ON public.class_rosters;

CREATE POLICY "rosters_select" ON public.class_rosters FOR SELECT TO authenticated
  USING (
    public.has_permission('manage_classes')
    OR public.has_permission('view_students')
    OR student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.class_rosters cr
      WHERE cr.class_id = class_rosters.class_id
        AND cr.student_id = auth.uid()
    )
  );
