import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Crea un cliente Supabase para Server Components / Route Handlers.
 *
 * Nota (Next.js 15+): `cookies()` devuelve una Promise, por lo que esta función
 * es asíncrona y hay que hacer `await cookies()`.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // `set` no se puede llamar desde un Server Component.
            // El middleware refresca la sesión por nosotros.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // `delete` no se puede llamar desde un Server Component.
          }
        },
      },
    }
  )
}
