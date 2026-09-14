-- =====================================================
-- RLS POLICIES FOR CMS TABLES
-- Run this AFTER 005_admin_cms_tables.sql
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ANNOUNCEMENTS: public read active, admin full access
-- =====================================================
CREATE POLICY "announcements_select_public" ON announcements
  FOR SELECT USING (is_active = true);

CREATE POLICY "announcements_select_admin" ON announcements
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "announcements_insert_admin" ON announcements
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "announcements_update_admin" ON announcements
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "announcements_delete_admin" ON announcements
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- =====================================================
-- NEWS: public read published, admin full access
-- =====================================================
CREATE POLICY "news_select_public" ON news
  FOR SELECT USING (is_published = true);

CREATE POLICY "news_select_admin" ON news
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "news_insert_admin" ON news
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "news_update_admin" ON news
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "news_delete_admin" ON news
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- =====================================================
-- EVENTS: public read published, admin full access
-- =====================================================
CREATE POLICY "events_select_public" ON events
  FOR SELECT USING (is_published = true);

CREATE POLICY "events_select_admin" ON events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "events_insert_admin" ON events
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "events_update_admin" ON events
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "events_delete_admin" ON events
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- =====================================================
-- ENROLLMENT_SETTINGS: public read, admin full access
-- =====================================================
CREATE POLICY "enrollment_select_public" ON enrollment_settings
  FOR SELECT USING (true);

CREATE POLICY "enrollment_insert_admin" ON enrollment_settings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "enrollment_update_admin" ON enrollment_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "enrollment_delete_admin" ON enrollment_settings
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- =====================================================
-- PROGRAMS: public read active, admin full access
-- =====================================================
CREATE POLICY "programs_select_public" ON programs
  FOR SELECT USING (is_active = true);

CREATE POLICY "programs_select_admin" ON programs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "programs_insert_admin" ON programs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "programs_update_admin" ON programs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "programs_delete_admin" ON programs
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- =====================================================
-- SERVICES: public read active, admin full access
-- =====================================================
CREATE POLICY "services_select_public" ON services
  FOR SELECT USING (is_active = true);

CREATE POLICY "services_select_admin" ON services
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "services_insert_admin" ON services
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "services_update_admin" ON services
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "services_delete_admin" ON services
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- =====================================================
-- GALLERY: public read published, admin full access
-- =====================================================
CREATE POLICY "gallery_select_public" ON gallery
  FOR SELECT USING (is_published = true);

CREATE POLICY "gallery_select_admin" ON gallery
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "gallery_insert_admin" ON gallery
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "gallery_update_admin" ON gallery
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "gallery_delete_admin" ON gallery
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- =====================================================
-- SCHOOL_SETTINGS: public read, admin full access
-- =====================================================
CREATE POLICY "school_settings_select_public" ON school_settings
  FOR SELECT USING (true);

CREATE POLICY "school_settings_insert_admin" ON school_settings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "school_settings_update_admin" ON school_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "school_settings_delete_admin" ON school_settings
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- =====================================================
-- HOMEPAGE_CONTENT: public read, admin full access
-- =====================================================
CREATE POLICY "homepage_select_public" ON homepage_content
  FOR SELECT USING (true);

CREATE POLICY "homepage_insert_admin" ON homepage_content
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "homepage_update_admin" ON homepage_content
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "homepage_delete_admin" ON homepage_content
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- =====================================================
-- WEBSITE_SETTINGS: public read, admin full access
-- =====================================================
CREATE POLICY "website_settings_select_public" ON website_settings
  FOR SELECT USING (true);

CREATE POLICY "website_settings_insert_admin" ON website_settings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "website_settings_update_admin" ON website_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "website_settings_delete_admin" ON website_settings
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- =====================================================
-- ADMIN_ACTIVITY_LOGS: admin only
-- =====================================================
CREATE POLICY "logs_select_admin" ON admin_activity_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "logs_insert_admin" ON admin_activity_logs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- =====================================================
-- STORAGE BUCKETS (run separately if needed)
-- =====================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-images', 'cms-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for cms-images
CREATE POLICY "cms_images_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-images');

CREATE POLICY "cms_images_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cms-images' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "cms_images_delete_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cms-images' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Storage policies for gallery
CREATE POLICY "gallery_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "gallery_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gallery' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "gallery_delete_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gallery' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );
