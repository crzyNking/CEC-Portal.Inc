-- Units per class (used by student Schedule page + faculty management)
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS units numeric(4,1) DEFAULT 3.0;
