// opencode enciende el taller
import { createClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase conPrivilegios de service role (bypasea RLS).
 *
 * SOLO para uso en servidor (Server Components y Route Handlers).
 * La clave NUNCA debe llegar al navegador: no la uses desde un
 * componente "use client".
 *
 * Se usa para las lecturas publicas del catalogo y la galeria mientras
 * las politicas RLS publicas de `profiles` siguen teniendo la recursion
 * infinita pendiente de corregir en la base de datos.
 */
export function createServerSupabaseAdminClient() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

  if (!key) {
    throw new Error(
      'Falta SUPABASE_SERVICE_ROLE_KEY en el entorno del servidor'
    )
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}
