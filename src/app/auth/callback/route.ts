// opencode enciende el taller
import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export const instant = false

/**
 * Callback de autenticacion (OAuth y magic link).
 * Supabase envia el codigo PKCE por query; lo canjeamos por una sesion.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const redirectTo = searchParams.get("redirect") || "/client"
  const error = searchParams.get("error_description") || searchParams.get("error")

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, origin)
    )
  }

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(exchangeError.message)}`,
          origin
        )
      )
    }
  }

  return NextResponse.redirect(new URL(redirectTo, origin))
}
