-- Construction-to-Furniture Web App Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client', 'viewer')),
  avatar_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Company Settings
CREATE TABLE company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tagline TEXT,
  ruc TEXT,
  city TEXT,
  manager_name TEXT,
  manager_title TEXT,
  email TEXT,
  phone TEXT,
  services TEXT,
  guarantee TEXT,
  material_label TEXT NOT NULL DEFAULT 'MATERIAL',
  default_notes TEXT DEFAULT 'Precios no incluyen IVA',
  starting_number INTEGER NOT NULL DEFAULT 1,
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#1a3a5c',
  secondary_color TEXT NOT NULL DEFAULT '#2a8fb5',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Furniture Categories
CREATE TABLE furniture_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Wood Types
CREATE TABLE wood_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  scientific_name TEXT,
  price_per_m3 DECIMAL(12,2) NOT NULL,
  hardness_janka INTEGER,
  color_hex TEXT,
  description TEXT,
  image_url TEXT,
  sustainability_cert TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Materials
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('wood', 'hardware', 'finish', 'fabric', 'other')),
  unit TEXT NOT NULL CHECK (unit IN ('m', 'm2', 'm3', 'kg', 'pcs', 'ml')),
  price_per_unit DECIMAL(12,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  min_stock_alert INTEGER NOT NULL DEFAULT 10,
  supplier TEXT,
  specs JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Furniture Items
CREATE TABLE furniture_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES furniture_categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  base_price DECIMAL(12,2) NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  videos_3d TEXT[] NOT NULL DEFAULT '{}',
  materials JSONB NOT NULL DEFAULT '[]',
  wood_type_id UUID REFERENCES wood_types(id) ON DELETE SET NULL,
  dimensions JSONB NOT NULL DEFAULT '{"width": 0, "height": 0, "depth": 0, "unit": "cm"}',
  weight_kg DECIMAL(8,2),
  is_customizable BOOLEAN NOT NULL DEFAULT TRUE,
  lead_time_days INTEGER NOT NULL DEFAULT 14,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Proformas
CREATE TABLE proformas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER NOT NULL UNIQUE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_ruc TEXT,
  client_phone TEXT,
  client_address TEXT,
  client_email TEXT,
  material_label TEXT NOT NULL DEFAULT 'MATERIAL',
  deposit DECIMAL(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  subtotal DECIMAL(12,2) NOT NULL,
  tax DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  valid_until DATE NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Proforma Items
CREATE TABLE proforma_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proforma_id UUID NOT NULL REFERENCES proformas(id) ON DELETE CASCADE,
  furniture_id UUID REFERENCES furniture_items(id) ON DELETE SET NULL,
  custom_name TEXT,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  customizations JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 9. 3D Videos
CREATE TABLE videos_3d (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  furniture_id UUID REFERENCES furniture_items(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  type TEXT NOT NULL DEFAULT 'showcase' CHECK (type IN ('showcase', 'possible', 'process')),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Agent Activities (for visualization)
CREATE TABLE agent_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_type TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_furniture_items_category ON furniture_items(category_id);
CREATE INDEX idx_furniture_items_published ON furniture_items(published) WHERE published = TRUE;
CREATE INDEX idx_furniture_items_featured ON furniture_items(featured) WHERE featured = TRUE;
CREATE INDEX idx_furniture_items_slug ON furniture_items(slug);
CREATE INDEX idx_proformas_client ON proformas(client_id);
CREATE INDEX idx_proformas_status ON proformas(status);
CREATE INDEX idx_proformas_date ON proformas(date DESC);
CREATE INDEX idx_proforma_items_proforma ON proforma_items(proforma_id);
CREATE INDEX idx_videos_3d_type ON videos_3d(type) WHERE is_active = TRUE;
CREATE INDEX idx_videos_3d_furniture ON videos_3d(furniture_id);
CREATE INDEX idx_agent_activities_created ON agent_activities(created_at DESC);
CREATE INDEX idx_materials_type ON materials(type) WHERE is_active = TRUE;
CREATE INDEX idx_materials_stock ON materials(stock) WHERE stock <= min_stock_alert;

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE furniture_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE wood_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE furniture_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE proformas ENABLE ROW LEVEL SECURITY;
ALTER TABLE proforma_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos_3d ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activities ENABLE ROW LEVEL SECURITY;

-- Profiles policies
--
-- IMPORTANTE: las políticas de `profiles` NO pueden consultar `profiles`
-- directamente (recursión infinita en RLS -> error 42P17).
-- Se usa la función `public.is_admin()` (SECURITY DEFINER) que salta el RLS.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (public.is_admin());

-- Company settings - only admins
CREATE POLICY "Admins full access to company_settings" ON company_settings
  FOR ALL USING (
    public.is_admin()
  );

-- Furniture categories - public read published, admin write
CREATE POLICY "Public read active categories" ON furniture_categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins full access to categories" ON furniture_categories
  FOR ALL USING (
    public.is_admin()
  );

-- Wood types - public read active, admin write
CREATE POLICY "Public read active wood types" ON wood_types
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins full access to wood types" ON wood_types
  FOR ALL USING (
    public.is_admin()
  );

-- Materials - public read active, admin write
CREATE POLICY "Public read active materials" ON materials
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins full access to materials" ON materials
  FOR ALL USING (
    public.is_admin()
  );

-- Furniture items - public read published, admin full
CREATE POLICY "Public read published furniture" ON furniture_items
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Admins full access to furniture" ON furniture_items
  FOR ALL USING (
    public.is_admin()
  );

-- Proformas - users see own, admins see all
CREATE POLICY "Users read own proformas" ON proformas
  FOR SELECT USING (auth.uid() = client_id OR client_id IS NULL);

CREATE POLICY "Clients create proformas" ON proformas
  FOR INSERT WITH CHECK (auth.uid() = client_id OR client_id IS NULL);

CREATE POLICY "Users update own draft proformas" ON proformas
  FOR UPDATE USING (
    (auth.uid() = client_id OR client_id IS NULL) AND status = 'draft'
  );

CREATE POLICY "Admins full access to proformas" ON proformas
  FOR ALL USING (
    public.is_admin()
  );

-- Proforma items
CREATE POLICY "Users access items of own proformas" ON proforma_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM proformas p
      WHERE p.id = proforma_id
      AND (p.client_id = auth.uid() OR p.client_id IS NULL)
    )
  );

CREATE POLICY "Admins full access to proforma items" ON proforma_items
  FOR ALL USING (
    public.is_admin()
  );

-- 3D Videos - public read active, admin write
CREATE POLICY "Public read active videos" ON videos_3d
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins full access to videos" ON videos_3d
  FOR ALL USING (
    public.is_admin()
  );

-- Agent activities - admin only
CREATE POLICY "Admins read agent activities" ON agent_activities
  FOR SELECT USING (
    public.is_admin()
  );

CREATE POLICY "System inserts agent activities" ON agent_activities
  FOR INSERT WITH CHECK (TRUE);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON company_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_furniture_categories_updated_at BEFORE UPDATE ON furniture_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wood_types_updated_at BEFORE UPDATE ON wood_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_furniture_items_updated_at BEFORE UPDATE ON furniture_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proformas_updated_at BEFORE UPDATE ON proformas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_3d_updated_at BEFORE UPDATE ON videos_3d
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get next proforma number
CREATE OR REPLACE FUNCTION get_next_proforma_number()
RETURNS INTEGER AS $$
DECLARE
  v_starting INTEGER;
  v_max_existing INTEGER;
BEGIN
  SELECT starting_number INTO v_starting FROM company_settings LIMIT 1;
  SELECT COALESCE(MAX(number), 0) INTO v_max_existing FROM proformas;
  RETURN GREATEST(v_starting, v_max_existing + 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate proforma totals
CREATE OR REPLACE FUNCTION calculate_proforma_totals(p_proforma_id UUID)
RETURNS TABLE(subtotal NUMERIC, tax NUMERIC, total NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    SUM(pi.total_price) as subtotal,
    ROUND(SUM(pi.total_price) * 0.18, 2) as tax,
    ROUND(SUM(pi.total_price) * 1.18, 2) as total
  FROM proforma_items pi
  WHERE pi.proforma_id = p_proforma_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- Auto-crear perfil al registrarse + primer usuario = admin
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_first_user BOOLEAN;
  v_role TEXT := 'client';
BEGIN
  -- El primer usuario registrado en el sistema es admin
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles) INTO v_is_first_user;
  IF v_is_first_user THEN
    v_role := 'admin';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    v_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default company settings
INSERT INTO company_settings (name, material_label, default_notes)
VALUES ('Maderas & Diseño', 'MATERIAL', 'Precios no incluyen IVA')
ON CONFLICT DO NOTHING;

-- Insert default categories
INSERT INTO furniture_categories (name, slug, display_order) VALUES
  ('Sala', 'sala', 1),
  ('Comedor', 'comedor', 2),
  ('Dormitorio', 'dormitorio', 3),
  ('Oficina', 'oficina', 4),
  ('Exterior', 'exterior', 5),
  ('Personalizado', 'personalizado', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert common wood types
INSERT INTO wood_types (name, scientific_name, price_per_m3, hardness_janka, color_hex, description) VALUES
  ('Roble', 'Quercus robur', 850, 1360, '#8B6914', 'Madera dura y duradera, ideal para muebles de alto tráfico'),
  ('Nogal', 'Juglans regia', 1200, 1010, '#5C3A21', 'Madera noble de color chocolate, muy valorada en ebanistería'),
  ('Cedro', 'Cedrela odorata', 650, 580, '#C19A6B', 'Madera aromática, resistente a insectos y humedad'),
  ('Pino', 'Pinus sylvestris', 350, 380, '#DEB887', 'Madera blanda económica, fácil de trabajar'),
  ('Caoba', 'Swietenia macrophylla', 1500, 830, '#8B4513', 'Madera tropical premium, color rojizo intenso'),
  ('Teka', 'Tectona grandis', 1800, 1155, '#D2B48C', 'Madera extremadamente duradera, ideal para exterior'),
  ('Fresno', 'Fraxinus excelsior', 750, 1320, '#E8D5B7', 'Madera elástica y resistente, buen acabado'),
  ('Cerezo', 'Prunus avium', 950, 950, '#C17B5A', 'Madera fina de color rosado que oscurece con el tiempo')
ON CONFLICT DO NOTHING;

-- Storage buckets (run in Supabase Dashboard > Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('furniture-images', 'furniture-images', true),
--   ('furniture-videos', 'furniture-videos', true),
--   ('proforma-pdfs', 'proforma-pdfs', false),
--   ('company-logos', 'company-logos', true);