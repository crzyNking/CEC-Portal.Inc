-- Seed manage_appointments permission and grant to registrar
INSERT INTO public.permissions (id, label, description) VALUES
  ('manage_appointments', 'Manage Appointments', 'Manage student appointment requests')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  ('registrar', 'manage_appointments')
ON CONFLICT (role_id, permission_id) DO NOTHING;
