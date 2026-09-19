-- Appointments table for student appointment requests
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT ''::text,
  office text NOT NULL DEFAULT 'registrar'::text,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  admin_notes text DEFAULT ''::text,
  handled_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Students can manage their own appointments
CREATE POLICY "appointments_student_manage" ON public.appointments
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Admins can view and manage all appointments
CREATE POLICY "appointments_admin_manage" ON public.appointments
  FOR ALL TO authenticated
  USING (public.has_permission('manage_appointments') OR public.has_role('super_admin'))
  WITH CHECK (public.has_permission('manage_appointments') OR public.has_role('super_admin'));

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_appointments_student ON public.appointments (student_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments (status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments (appointment_date);
