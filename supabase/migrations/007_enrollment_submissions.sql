-- =====================================================
-- ENROLLMENT SUBMISSIONS TABLE
-- Stores student enrollment form submissions
-- =====================================================

CREATE TABLE IF NOT EXISTS enrollment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('kindergarten', 'elementary', 'junior-high', 'senior-high', 'college')),
  first_name TEXT NOT NULL,
  middle_name TEXT DEFAULT '',
  last_name TEXT NOT NULL,
  age TEXT DEFAULT '',
  dob TEXT DEFAULT '',
  gender TEXT DEFAULT '',
  civil_status TEXT DEFAULT '',
  grade_level TEXT DEFAULT '',
  degree_program TEXT DEFAULT '',
  high_school TEXT DEFAULT '',
  year_graduated TEXT DEFAULT '',
  lrn TEXT DEFAULT '',
  parent_name TEXT NOT NULL,
  parent_contact TEXT NOT NULL,
  parent_email TEXT DEFAULT '',
  parent_occupation TEXT DEFAULT '',
  address TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  emergency_phone TEXT NOT NULL,
  requirements JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE enrollment_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form)
CREATE POLICY "enrollment_insert_public" ON enrollment_submissions
  FOR INSERT WITH CHECK (true);

-- Admins can read all
CREATE POLICY "enrollment_select_admin" ON enrollment_submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Admins can update
CREATE POLICY "enrollment_update_admin" ON enrollment_submissions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Admins can delete
CREATE POLICY "enrollment_delete_admin" ON enrollment_submissions
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Index for admin queries
CREATE INDEX IF NOT EXISTS idx_enrollment_submissions_level ON enrollment_submissions(level);
CREATE INDEX IF NOT EXISTS idx_enrollment_submissions_status ON enrollment_submissions(status);
CREATE INDEX IF NOT EXISTS idx_enrollment_submissions_created ON enrollment_submissions(created_at DESC);
