-- ============================================================
-- 013: RBAC + Student Enrollment / ID Number System
-- ============================================================

-- ---------- 1. ENROLLMENT / ID NUMBER (extend existing table) ----------
ALTER TABLE public.enrollment_submissions
  ADD COLUMN IF NOT EXISTS id_number text UNIQUE,
  ADD COLUMN IF NOT EXISTS student_id uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS claimed_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_enrollment_submissions_id_number ON public.enrollment_submissions(id_number);
CREATE INDEX IF NOT EXISTS idx_enrollment_submissions_student_id ON public.enrollment_submissions(student_id);

-- Secure unique 6-digit ID generation (retries on collision)
CREATE OR REPLACE FUNCTION public.generate_unique_id_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_id text;
  attempts int := 0;
BEGIN
  LOOP
    attempts := attempts + 1;
    new_id := lpad((floor(random() * 1000000))::int::text, 6, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.enrollment_submissions WHERE id_number = new_id) OR attempts > 50;
  END LOOP;
  IF attempts > 50 THEN
    RAISE EXCEPTION 'Could not generate a unique ID number';
  END IF;
  RETURN new_id;
END;
$function$;

-- Auto-generate the ID on every new enrollment submission
CREATE OR REPLACE FUNCTION public.handle_new_enrollment_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.id_number IS NULL OR NEW.id_number = '' THEN
    NEW.id_number := public.generate_unique_id_number();
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_generate_id_number ON public.enrollment_submissions;
CREATE TRIGGER trg_generate_id_number
BEFORE INSERT ON public.enrollment_submissions
FOR EACH ROW EXECUTE FUNCTION public.handle_new_enrollment_submission();

-- Public enrollment submit: inserts the record server-side and returns the generated
-- ID number without exposing any other student's data.
CREATE OR REPLACE FUNCTION public.submit_enrollment(p_data jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_id uuid;
  v_number text;
BEGIN
  IF p_data->>'level' IS NULL OR p_data->>'first_name' IS NULL OR p_data->>'last_name' IS NULL
     OR p_data->>'parent_name' IS NULL OR p_data->>'parent_contact' IS NULL
     OR p_data->>'address' IS NULL OR p_data->>'emergency_contact' IS NULL OR p_data->>'emergency_phone' IS NULL THEN
    RAISE EXCEPTION 'Missing required enrollment fields';
  END IF;

  INSERT INTO public.enrollment_submissions (
    level, first_name, middle_name, last_name, age, dob, gender, civil_status,
    grade_level, degree_program, high_school, year_graduated, lrn,
    parent_name, parent_contact, parent_email, parent_occupation,
    address, emergency_contact, emergency_phone, requirements
  ) VALUES (
    p_data->>'level', p_data->>'first_name', NULLIF(p_data->>'middle_name',''), p_data->>'last_name',
    NULLIF(p_data->>'age',''), NULLIF(p_data->>'dob',''), NULLIF(p_data->>'gender',''), NULLIF(p_data->>'civil_status',''),
    NULLIF(p_data->>'grade_level',''), NULLIF(p_data->>'degree_program',''), NULLIF(p_data->>'high_school',''),
    NULLIF(p_data->>'year_graduated',''), NULLIF(p_data->>'lrn',''),
    p_data->>'parent_name', p_data->>'parent_contact', NULLIF(p_data->>'parent_email',''), NULLIF(p_data->>'parent_occupation',''),
    p_data->>'address', p_data->>'emergency_contact', p_data->>'emergency_phone',
    COALESCE(p_data->'requirements', '{}'::jsonb)
  )
  RETURNING id, id_number INTO v_id, v_number;

  RETURN v_number;
END;
$function$;

-- ID number status check (no PII exposed): not_found | unclaimed | claimed | invalid
CREATE OR REPLACE FUNCTION public.check_id_number_status(p_id_number text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT CASE
    WHEN p_id_number IS NULL OR p_id_number !~ '^[0-9]{6}$' THEN 'invalid'
    WHEN NOT EXISTS (SELECT 1 FROM public.enrollment_submissions WHERE id_number = p_id_number) THEN 'not_found'
    WHEN EXISTS (SELECT 1 FROM public.enrollment_submissions WHERE id_number = p_id_number AND student_id IS NOT NULL) THEN 'claimed'
    ELSE 'unclaimed'
  END;
$function$;

-- Resolve a claimed ID number to its linked login email (for ID + password login)
CREATE OR REPLACE FUNCTION public.get_login_email_for_id(p_id_number text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT p.email
  FROM public.enrollment_submissions e
  JOIN public.profiles p ON p.id = e.student_id
  WHERE e.id_number = p_id_number AND e.student_id IS NOT NULL
  LIMIT 1;
$function$;

-- Link the currently authenticated user to an unclaimed enrollment record
CREATE OR REPLACE FUNCTION public.claim_enrollment_record(p_id_number text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  updated int;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  IF p_id_number IS NULL OR p_id_number !~ '^[0-9]{6}$' THEN
    RETURN false;
  END IF;
  UPDATE public.enrollment_submissions
     SET student_id = auth.uid(),
         claimed_at = now(),
         updated_at = now()
   WHERE id_number = p_id_number
     AND student_id IS NULL;
  GET DIAGNOSTICS updated = ROW_COUNT;
  RETURN updated = 1;
END;
$function$;

-- Sync the student's profile name from their linked enrollment record (after claim)
CREATE OR REPLACE FUNCTION public.sync_student_profile_name()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_name text;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;
  SELECT NULLIF(TRIM(BOTH FROM CONCAT(e.first_name, ' ', COALESCE(e.middle_name, ''), ' ', e.last_name)), '')
    INTO v_name
  FROM public.enrollment_submissions e
  WHERE e.student_id = auth.uid()
  ORDER BY e.claimed_at DESC NULLS LAST
  LIMIT 1;
  IF v_name IS NOT NULL THEN
    UPDATE public.profiles SET full_name = v_name, updated_at = now() WHERE id = auth.uid();
  END IF;
END;
$function$;

-- Admin: regenerate an unclaimed record's ID number
CREATE OR REPLACE FUNCTION public.regenerate_student_id_number(p_submission_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_id text;
BEGIN
  IF NOT public.has_permission('manage_id_numbers') THEN
    RAISE EXCEPTION 'Not authorized to manage ID numbers';
  END IF;
  IF EXISTS (SELECT 1 FROM public.enrollment_submissions WHERE id = p_submission_id AND student_id IS NOT NULL) THEN
    RAISE EXCEPTION 'Cannot regenerate: record already claimed';
  END IF;
  UPDATE public.enrollment_submissions
     SET id_number = public.generate_unique_id_number(),
         updated_at = now()
   WHERE id = p_submission_id
   RETURNING id_number INTO new_id;
  IF new_id IS NULL THEN
    RAISE EXCEPTION 'Enrollment record not found';
  END IF;
  RETURN new_id;
END;
$function$;

-- ---------- 2. RBAC TABLES ----------
-- Widen the profiles.role check constraint to cover all roles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role = ANY (ARRAY['super_admin','registrar','edp','accounting','faculty','other_admin','admin','student','user']));

CREATE TABLE IF NOT EXISTS public.roles (
  id text PRIMARY KEY,
  label text NOT NULL,
  description text DEFAULT ''::text,
  is_system boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id text PRIMARY KEY,
  label text NOT NULL,
  description text DEFAULT ''::text
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id text NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id text NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id text NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- ---------- 3. DEPARTMENT TABLES ----------
CREATE TABLE IF NOT EXISTS public.academic_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  enrollment_id uuid REFERENCES public.enrollment_submissions(id) ON DELETE SET NULL,
  level text DEFAULT ''::text,
  subject text NOT NULL,
  grade text DEFAULT ''::text,
  semester text DEFAULT ''::text,
  school_year text DEFAULT ''::text,
  remarks text DEFAULT ''::text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.document_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  enrollment_id uuid REFERENCES public.enrollment_submissions(id) ON DELETE SET NULL,
  student_name text DEFAULT ''::text,
  doc_type text NOT NULL,
  status text DEFAULT 'pending'::text,
  notes text DEFAULT ''::text,
  requested_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  processed_by uuid REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.billing_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  enrollment_id uuid REFERENCES public.enrollment_submissions(id) ON DELETE SET NULL,
  student_name text DEFAULT ''::text,
  level text DEFAULT ''::text,
  school_year text DEFAULT ''::text,
  semester text DEFAULT ''::text,
  tuition_fee numeric(12,2) DEFAULT 0,
  misc_fees numeric(12,2) DEFAULT 0,
  discount numeric(12,2) DEFAULT 0,
  total_due numeric(12,2) DEFAULT 0,
  balance numeric(12,2) DEFAULT 0,
  status text DEFAULT 'pending'::text,
  notes text DEFAULT ''::text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_id uuid NOT NULL REFERENCES public.billing_accounts(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  method text DEFAULT 'cash'::text,
  reference_no text DEFAULT ''::text,
  paid_at timestamptz DEFAULT now(),
  verified boolean DEFAULT false,
  verified_by uuid REFERENCES auth.users(id),
  verified_at timestamptz,
  notes text DEFAULT ''::text,
  created_by uuid REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text DEFAULT ''::text,
  section text DEFAULT ''::text,
  adviser_id uuid REFERENCES auth.users(id),
  room text DEFAULT ''::text,
  schedule_day text DEFAULT ''::text,
  schedule_time text DEFAULT ''::text,
  school_year text DEFAULT ''::text,
  semester text DEFAULT ''::text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.class_rosters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text DEFAULT ''::text,
  status text DEFAULT 'enrolled'::text,
  enrolled_at timestamptz DEFAULT now(),
  UNIQUE (class_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  grade numeric(5,2),
  remarks text DEFAULT ''::text,
  encoded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (class_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  att_date date NOT NULL,
  status text DEFAULT 'present'::text,
  recorded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE (class_id, student_id, att_date)
);

-- ---------- 4. SECURE RBAC FUNCTIONS ----------
CREATE OR REPLACE FUNCTION public.has_role(p_role text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = p_role)
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role_id = p_role
    )
  );
$function$;

CREATE OR REPLACE FUNCTION public.has_permission(p_permission text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin')
    OR EXISTS (
      SELECT 1
      FROM public.profiles pr
      JOIN public.user_roles ur ON ur.user_id = pr.id
      JOIN public.role_permissions rp ON rp.role_id = ur.role_id
      WHERE pr.id = auth.uid() AND rp.permission_id = p_permission
    )
    OR EXISTS (
      SELECT 1
      FROM public.profiles pr
      JOIN public.role_permissions rp ON rp.role_id = pr.role
      WHERE pr.id = auth.uid() AND rp.permission_id = p_permission
    )
  );
$function$;

CREATE OR REPLACE FUNCTION public.current_role_value()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role FROM public.profiles WHERE profiles.id = auth.uid();
$function$;

-- Extend is_admin() to all administrative roles (keeps legacy 'admin')
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin','registrar','edp','accounting','faculty','other_admin','admin')
  );
$function$;

-- Prevent role escalation: only a Super Admin may change roles on profiles
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.has_role('super_admin') THEN
      RAISE EXCEPTION 'Only a Super Admin can change roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- ---------- 5. SEED ROLES / PERMISSIONS ----------
INSERT INTO public.roles (id, label, description, sort_order) VALUES
  ('super_admin', 'Super Admin', 'Owner - full access to all departments and settings', 0),
  ('registrar', 'Registrar Admin', 'Student records, enrollment, ID numbers, academic records, document requests', 1),
  ('edp', 'EDP / IT Admin', 'User accounts, system settings, technical administration, activity logs', 2),
  ('accounting', 'Accounting Admin', 'Student billing, tuition, payments, financial reports', 3),
  ('faculty', 'Faculty Admin', 'Classes, student lists, grades, attendance, schedules', 4),
  ('other_admin', 'Other Admin', 'News, events, announcements, assigned functions', 5),
  ('student', 'Student', 'Enrolled student - portal access only', 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.permissions (id, label, description) VALUES
  ('view_students', 'View Students', 'View student records and lists'),
  ('manage_enrollment', 'Manage Enrollment', 'Manage enrollment records and status'),
  ('manage_id_numbers', 'Manage ID Numbers', 'Generate and regenerate student ID numbers'),
  ('manage_academic_records', 'Manage Academic Records', 'Manage academic records'),
  ('manage_documents', 'Manage Document Requests', 'Manage student document requests'),
  ('manage_grades', 'Manage Grades', 'Encode and manage grades'),
  ('manage_attendance', 'Manage Attendance', 'Record and manage attendance'),
  ('manage_classes', 'Manage Classes', 'Manage classes, schedules and rosters'),
  ('manage_payments', 'Manage Payments', 'Manage billing and verify payments'),
  ('manage_news', 'Manage News', 'Create and manage news'),
  ('manage_events', 'Manage Events', 'Create and manage events'),
  ('manage_announcements', 'Manage Announcements', 'Create and manage announcements'),
  ('manage_users', 'Manage Users', 'View and manage user accounts'),
  ('manage_system_settings', 'Manage System Settings', 'Manage system and website settings'),
  ('manage_maintenance_mode', 'Manage Maintenance Mode', 'Toggle maintenance mode'),
  ('view_activity_logs', 'View Activity Logs', 'View admin and student activity logs'),
  ('view_website_content', 'View Website Content', 'View website content management')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  ('registrar', 'view_students'),
  ('registrar', 'manage_enrollment'),
  ('registrar', 'manage_id_numbers'),
  ('registrar', 'manage_academic_records'),
  ('registrar', 'manage_documents'),
  ('edp', 'manage_users'),
  ('edp', 'manage_system_settings'),
  ('edp', 'manage_maintenance_mode'),
  ('edp', 'view_activity_logs'),
  ('edp', 'view_website_content'),
  ('accounting', 'view_students'),
  ('accounting', 'manage_payments'),
  ('faculty', 'view_students'),
  ('faculty', 'manage_classes'),
  ('faculty', 'manage_grades'),
  ('faculty', 'manage_attendance'),
  ('other_admin', 'manage_news'),
  ('other_admin', 'manage_events'),
  ('other_admin', 'manage_announcements')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Backfill existing roles into the new architecture (before the escalation trigger exists)
UPDATE public.profiles SET role = 'super_admin' WHERE role = 'admin';
UPDATE public.profiles SET role = 'student' WHERE role = 'user';

-- New signups get the 'student' role (non-admin) in the same architecture
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    'student'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;

-- Now activate the escalation guard
DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- ---------- 6. RLS ----------
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- roles / permissions: authenticated can read; only super_admin writes
CREATE POLICY "roles_select" ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "roles_insert" ON public.roles FOR INSERT TO authenticated WITH CHECK (public.has_role('super_admin'));
CREATE POLICY "roles_update" ON public.roles FOR UPDATE TO authenticated USING (public.has_role('super_admin')) WITH CHECK (public.has_role('super_admin'));
CREATE POLICY "roles_delete" ON public.roles FOR DELETE TO authenticated USING (public.has_role('super_admin'));

CREATE POLICY "permissions_select" ON public.permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "permissions_insert" ON public.permissions FOR INSERT TO authenticated WITH CHECK (public.has_role('super_admin'));
CREATE POLICY "permissions_update" ON public.permissions FOR UPDATE TO authenticated USING (public.has_role('super_admin')) WITH CHECK (public.has_role('super_admin'));
CREATE POLICY "permissions_delete" ON public.permissions FOR DELETE TO authenticated USING (public.has_role('super_admin'));

CREATE POLICY "role_permissions_select" ON public.role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "role_permissions_write" ON public.role_permissions FOR ALL TO authenticated USING (public.has_role('super_admin')) WITH CHECK (public.has_role('super_admin'));

CREATE POLICY "user_roles_select" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_permission('manage_users'));
CREATE POLICY "user_roles_write" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role('super_admin')) WITH CHECK (public.has_role('super_admin'));

-- enrollment_submissions: registrar/super manage; students read own; claim via secure function
CREATE POLICY "enrollment_select_registrar" ON public.enrollment_submissions FOR SELECT TO authenticated
  USING (public.has_permission('manage_enrollment') OR public.has_permission('manage_id_numbers') OR student_id = auth.uid());
DROP POLICY IF EXISTS "enrollment_update_admin" ON public.enrollment_submissions;
CREATE POLICY "enrollment_update_admin" ON public.enrollment_submissions FOR UPDATE TO authenticated
  USING (public.has_permission('manage_enrollment')) WITH CHECK (public.has_permission('manage_enrollment'));
DROP POLICY IF EXISTS "enrollment_delete_admin" ON public.enrollment_submissions;
CREATE POLICY "enrollment_delete_admin" ON public.enrollment_submissions FOR DELETE TO authenticated
  USING (public.has_permission('manage_enrollment'));

-- academic records
CREATE POLICY "academic_records_select" ON public.academic_records FOR SELECT TO authenticated
  USING (public.has_permission('manage_academic_records') OR public.has_permission('manage_grades') OR student_id = auth.uid());
CREATE POLICY "academic_records_write" ON public.academic_records FOR ALL TO authenticated
  USING (public.has_permission('manage_academic_records')) WITH CHECK (public.has_permission('manage_academic_records'));

-- document requests
CREATE POLICY "document_requests_select" ON public.document_requests FOR SELECT TO authenticated
  USING (public.has_permission('manage_documents') OR student_id = auth.uid());
CREATE POLICY "document_requests_insert" ON public.document_requests FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid() OR public.has_permission('manage_documents'));
CREATE POLICY "document_requests_update" ON public.document_requests FOR UPDATE TO authenticated
  USING (public.has_permission('manage_documents')) WITH CHECK (public.has_permission('manage_documents'));
CREATE POLICY "document_requests_delete" ON public.document_requests FOR DELETE TO authenticated
  USING (public.has_permission('manage_documents'));

-- billing (students can view own billing only)
CREATE POLICY "billing_select" ON public.billing_accounts FOR SELECT TO authenticated
  USING (public.has_permission('manage_payments') OR student_id = auth.uid());
CREATE POLICY "billing_write" ON public.billing_accounts FOR ALL TO authenticated
  USING (public.has_permission('manage_payments')) WITH CHECK (public.has_permission('manage_payments'));

-- payments (students see/record own; accounting verifies)
CREATE POLICY "payments_select" ON public.payments FOR SELECT TO authenticated
  USING (public.has_permission('manage_payments') OR EXISTS (
    SELECT 1 FROM public.billing_accounts b WHERE b.id = payments.billing_id AND b.student_id = auth.uid()));
CREATE POLICY "payments_insert" ON public.payments FOR INSERT TO authenticated
  WITH CHECK (public.has_permission('manage_payments') OR EXISTS (
    SELECT 1 FROM public.billing_accounts b WHERE b.id = payments.billing_id AND b.student_id = auth.uid()));
CREATE POLICY "payments_update" ON public.payments FOR UPDATE TO authenticated
  USING (public.has_permission('manage_payments')) WITH CHECK (public.has_permission('manage_payments'));
CREATE POLICY "payments_delete" ON public.payments FOR DELETE TO authenticated
  USING (public.has_permission('manage_payments'));

-- classes / rosters / grades / attendance
CREATE POLICY "classes_select" ON public.classes FOR SELECT TO authenticated
  USING (public.has_permission('manage_classes') OR public.has_permission('manage_grades')
    OR public.has_permission('view_students') OR adviser_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.class_rosters cr WHERE cr.class_id = classes.id AND cr.student_id = auth.uid()));
CREATE POLICY "classes_write" ON public.classes FOR ALL TO authenticated
  USING (public.has_permission('manage_classes')) WITH CHECK (public.has_permission('manage_classes'));

CREATE POLICY "rosters_select" ON public.class_rosters FOR SELECT TO authenticated
  USING (public.has_permission('manage_classes') OR public.has_permission('view_students') OR student_id = auth.uid());
CREATE POLICY "rosters_write" ON public.class_rosters FOR ALL TO authenticated
  USING (public.has_permission('manage_classes')) WITH CHECK (public.has_permission('manage_classes'));

CREATE POLICY "grades_select" ON public.grades FOR SELECT TO authenticated
  USING (public.has_permission('manage_grades') OR public.has_permission('manage_classes') OR student_id = auth.uid());
CREATE POLICY "grades_write" ON public.grades FOR ALL TO authenticated
  USING (public.has_permission('manage_grades')) WITH CHECK (public.has_permission('manage_grades'));

CREATE POLICY "attendance_select" ON public.attendance FOR SELECT TO authenticated
  USING (public.has_permission('manage_attendance') OR public.has_permission('manage_classes') OR student_id = auth.uid());
CREATE POLICY "attendance_write" ON public.attendance FOR ALL TO authenticated
  USING (public.has_permission('manage_attendance')) WITH CHECK (public.has_permission('manage_attendance'));

-- profiles: EDP (manage_users) can read all; role changes only via super_admin (trigger enforces)
CREATE POLICY "profiles_read_managers" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_permission('manage_users'));

-- admin_activity_logs: EDP can view all logs
CREATE POLICY "admin_logs_view" ON public.admin_activity_logs FOR SELECT TO authenticated
  USING (public.has_permission('view_activity_logs'));

-- activity_logs: EDP can view student login activity
CREATE POLICY "activity_logs_admin_view" ON public.activity_logs FOR SELECT TO authenticated
  USING (public.has_permission('view_activity_logs'));

-- website / school / enrollment settings: EDP can manage
CREATE POLICY "website_settings_edp_update" ON public.website_settings FOR UPDATE TO authenticated
  USING (public.has_permission('manage_system_settings')) WITH CHECK (public.has_permission('manage_system_settings'));
CREATE POLICY "website_settings_edp_insert" ON public.website_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_permission('manage_system_settings'));
CREATE POLICY "school_settings_edp_update" ON public.school_settings FOR UPDATE TO authenticated
  USING (public.has_permission('manage_system_settings')) WITH CHECK (public.has_permission('manage_system_settings'));
CREATE POLICY "school_settings_edp_insert" ON public.school_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_permission('manage_system_settings'));
CREATE POLICY "enrollment_settings_edp_update" ON public.enrollment_settings FOR UPDATE TO authenticated
  USING (public.has_permission('manage_system_settings')) WITH CHECK (public.has_permission('manage_system_settings'));
CREATE POLICY "enrollment_settings_edp_insert" ON public.enrollment_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_permission('manage_system_settings'));

-- news / events / announcements: Other Admin can manage (public read policies unchanged)
CREATE POLICY "news_other_admin" ON public.news FOR ALL TO authenticated
  USING (public.has_permission('manage_news')) WITH CHECK (public.has_permission('manage_news'));
CREATE POLICY "events_other_admin" ON public.events FOR ALL TO authenticated
  USING (public.has_permission('manage_events')) WITH CHECK (public.has_permission('manage_events'));
CREATE POLICY "announcements_other_admin" ON public.announcements FOR ALL TO authenticated
  USING (public.has_permission('manage_announcements')) WITH CHECK (public.has_permission('manage_announcements'));

-- ---------- 7. FUNCTION GRANTS ----------
GRANT EXECUTE ON FUNCTION public.generate_unique_id_number() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_enrollment(jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_id_number_status(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_login_email_for_id(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_enrollment_record(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.sync_student_profile_name() TO authenticated;
GRANT EXECUTE ON FUNCTION public.regenerate_student_id_number(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_role_value() TO authenticated;

-- ---------- 8. Realtime publication for new tables ----------
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['enrollment_submissions','roles','permissions','role_permissions','user_roles']
  LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = t) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;
