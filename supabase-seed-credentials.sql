-- ============================================================================
-- CREDENCIALES DE PRUEBA - ADMIN Y CLIENTE
-- Ejecutar en Supabase SQL Editor DESPUÉS de ejecutar supabase-schema.sql
-- ============================================================================

-- 1. Crear usuario ADMIN (para probar todas las funciones del panel admin)
--    Email: admin@maderasydiseno.com
--    Password: Admin1234!
--    Rol: admin
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@maderasydiseno.com',
  crypt('Admin1234!', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '',
  now(),
  '',
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Administrador Sistema", "role": "admin"}',
  false,
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;

-- 2. Crear usuario CLIENTE (para probar portal de cliente y proformas)
--    Email: cliente@maderasydiseno.com
--    Password: Cliente1234!
--    Rol: client
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'cliente@maderasydiseno.com',
  crypt('Cliente1234!', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '',
  now(),
  '',
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Cliente Demo", "role": "client"}',
  false,
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;

-- 3. Crear perfiles (profiles) para los usuarios creados arriba
--    Nota: si existe un trigger handle_new_user, estos INSERT pueden fallar
--    por duplicado. En ese caso, ignorar el error.
DO $$
DECLARE
  admin_user_id UUID;
  client_user_id UUID;
BEGIN
  -- Obtener IDs de los usuarios creados
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@maderasydiseno.com';
  SELECT id INTO client_user_id FROM auth.users WHERE email = 'cliente@maderasydiseno.com';

  -- Insertar perfil admin
  INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    admin_user_id,
    'admin@maderasydiseno.com',
    'Administrador Sistema',
    'admin',
    now(),
    now()
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = 'admin',
    updated_at = now();

  -- Insertar perfil cliente
  INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    client_user_id,
    'cliente@maderasydiseno.com',
    'Cliente Demo',
    'client',
    now(),
    now()
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = 'client',
    updated_at = now();
END $$;

-- 4. Verificar credenciales creadas
SELECT 'ADMIN' as tipo, id, email, role FROM profiles WHERE email = 'admin@maderasydiseno.com'
UNION ALL
SELECT 'CLIENTE' as tipo, id, email, role FROM profiles WHERE email = 'cliente@maderasydiseno.com';
