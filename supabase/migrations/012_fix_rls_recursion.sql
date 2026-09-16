-- =====================================================
-- FIX: infinite recursion in RLS policies
-- Policies on `profiles` that query `profiles` themselves
-- (inline EXISTS) cause Postgres "infinite recursion detected
-- in policy for relation profiles" — every SELECT on profiles
-- fails, so fetchProfile errors and the admin button never shows.
--
-- Fix: use the SECURITY DEFINER is_admin() function instead
-- (bypasses RLS on profiles, no recursion).
-- Idempotent: safe to re-run.
-- =====================================================

-- 1. profiles table — replace recursive policies
DROP POLICY IF EXISTS "Admin read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin update profiles" ON profiles;
DROP POLICY IF EXISTS "Admin delete profiles" ON profiles;

CREATE POLICY "Admin read all profiles"
  ON profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin update profiles"
  ON profiles FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete profiles"
  ON profiles FOR DELETE
  USING (public.is_admin());

-- 2. enrollment_submissions — replace inline profiles subqueries
DROP POLICY IF EXISTS "enrollment_select_admin" ON enrollment_submissions;
DROP POLICY IF EXISTS "enrollment_update_admin" ON enrollment_submissions;
DROP POLICY IF EXISTS "enrollment_delete_admin" ON enrollment_submissions;

CREATE POLICY "enrollment_select_admin"
  ON enrollment_submissions FOR SELECT
  USING (public.is_admin());

CREATE POLICY "enrollment_update_admin"
  ON enrollment_submissions FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "enrollment_delete_admin"
  ON enrollment_submissions FOR DELETE
  USING (public.is_admin());
