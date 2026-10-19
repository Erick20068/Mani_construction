-- =====================================================================
-- FIX: políticas RLS recursivas en la tabla `profiles`
-- =====================================================================
-- Error que corrige:
--   "infinite recursion detected in policy for relation profiles" (42P17)
--
-- Causa: las políticas sobre `profiles` consultaban `profiles` dentro de
-- su propio USING/WITH CHECK. Al aplicar RLS a la consulta interna, la
-- política vuelve a evaluarse -> recursión infinita.
--
-- Solución: una función `SECURITY DEFINER` que se ejecuta con los
-- privilegios del dueño de la tabla (por tanto sin RLS) y comprueba si
-- el usuario actual es admin.
--
-- EJECUCIÓN: Supabase Dashboard -> SQL Editor -> New Query -> pegar -> Run
-- Es idempotente: se puede ejecutar varias veces sin romper nada.
-- =====================================================================

-- 1) Función auxiliar (SECURITY DEFINER => salta el RLS)
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

-- 2) Eliminar las políticas recursivas sobre `profiles`
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;

-- 3) Recrearlas usando la función
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (public.is_admin());

-- 4) Sustituir el chequeo inline en el resto de tablas
--    (mismo patrón, sin recursión porque consultan `profiles`, no se evalúan
--     políticas sobre `profiles` para leer su propia fila)

DROP POLICY IF EXISTS "Admins full access to company_settings" ON company_settings;
CREATE POLICY "Admins full access to company_settings" ON company_settings
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to categories" ON furniture_categories;
CREATE POLICY "Admins full access to categories" ON furniture_categories
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to wood types" ON wood_types;
CREATE POLICY "Admins full access to wood types" ON wood_types
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to materials" ON materials;
CREATE POLICY "Admins full access to materials" ON materials
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to furniture" ON furniture_items;
CREATE POLICY "Admins full access to furniture" ON furniture_items
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to proformas" ON proformas;
CREATE POLICY "Admins full access to proformas" ON proformas
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to proforma items" ON proforma_items;
CREATE POLICY "Admins full access to proforma items" ON proforma_items
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to videos" ON videos_3d;
CREATE POLICY "Admins full access to videos" ON videos_3d
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins read agent activities" ON agent_activities;
CREATE POLICY "Admins read agent activities" ON agent_activities
  FOR SELECT USING (public.is_admin());

-- =====================================================================
-- 5) Trigger que crea el perfil al registrarse (además: primer usuario = admin)
--    Sin esto, registrarse en /register NO creaba fila en `profiles`
--    y el usuario nunca podía acceder al panel admin.
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

-- =====================================================================
-- Verificación (opcional): debe devolver 0 filas con recursión
-- =====================================================================
-- SELECT policyname, tablename FROM pg_policies
--  WHERE qual ILIKE '%FROM profiles%' AND tablename = 'profiles';
