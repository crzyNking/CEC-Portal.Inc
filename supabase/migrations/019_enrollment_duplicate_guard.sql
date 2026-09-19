-- Prevent duplicate unclaimed enrollment submissions:
-- if an unclaimed record with the same first/last name + parent contact already
-- exists, reject with a clear message (registrar can archive the old one first).
CREATE OR REPLACE FUNCTION public.submit_enrollment(p_data jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_id uuid;
  v_number text;
  v_existing uuid;
BEGIN
  IF p_data->>'level' IS NULL OR p_data->>'first_name' IS NULL OR p_data->>'last_name' IS NULL
     OR p_data->>'parent_name' IS NULL OR p_data->>'parent_contact' IS NULL
     OR p_data->>'address' IS NULL OR p_data->>'emergency_contact' IS NULL OR p_data->>'emergency_phone' IS NULL THEN
    RAISE EXCEPTION 'Missing required enrollment fields';
  END IF;

  -- Duplicate guard: same student name + parent contact, still unclaimed or claimed by the same user
  SELECT id INTO v_existing
    FROM public.enrollment_submissions
   WHERE lower(first_name) = lower(p_data->>'first_name')
     AND lower(last_name) = lower(p_data->>'last_name')
     AND parent_contact = p_data->>'parent_contact'
     AND (student_id IS NULL OR student_id = auth.uid())
   ORDER BY created_at DESC
   LIMIT 1;
  IF v_existing IS NOT NULL THEN
    RAISE EXCEPTION 'An enrollment application for this student already exists. Please contact the Registrar Office if you need to re-enroll.';
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

GRANT EXECUTE ON FUNCTION public.submit_enrollment(jsonb) TO anon, authenticated;
