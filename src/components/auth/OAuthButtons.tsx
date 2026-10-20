// opencode enciende el taller
"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase"

export type OAuthProvider = "google" | "github"

/**
 * Consulta que proveedores OAuth estan habilitados en el proyecto de
 * Supabase (endpoint publico /auth/v1/settings).
 * Si no se puede consultar, se asumen los dos por defecto.
 */
export function useOAuthProviders(): {
  providers: OAuthProvider[]
  loading: boolean
} {
  const [providers, setProviders] = useState<OAuthProvider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function check() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        )

        if (!res.ok) throw new Error("no se pudo consultar")

        const data = await res.json()
        const external = data?.external ?? {}
        const enabled: OAuthProvider[] = []
        if (external.google) enabled.push("google")
        if (external.github) enabled.push("github")

        if (!cancelled) setProviders(enabled)
      } catch {
        // Si no se puede consultar, se ocultan los botones para no fallar
        if (!cancelled) setProviders([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    check()
    return () => {
      cancelled = true
    }
  }, [])

  return { providers, loading }
}

/** Boton de acceso con un proveedor OAuth. */
export function OAuthButtons({
  redirectTo,
  onError,
}: {
  redirectTo: string
  onError?: (message: string) => void
}) {
  const { providers, loading } = useOAuthProviders()
  const supabase = createClient()

  if (loading || providers.length === 0) return null

  const handle = async (provider: OAuthProvider) => {
    const label = provider === "google" ? "Google" : "GitHub"
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
      },
    })
    if (error) {
      const msg = `No se pudo conectar con ${label}. Intenta de nuevo.`
      if (onError) onError(msg)
      else toast.error(msg)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {providers.includes("google") && (
        <button
          type="button"
          onClick={() => handle("google")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-input bg-background text-sm font-medium transition-colors hover:bg-accent"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.28-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>
      )}

      {providers.includes("github") && (
        <button
          type="button"
          onClick={() => handle("github")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-input bg-background text-sm font-medium transition-colors hover:bg-accent"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0C6.477 0 2 4.477 2 10c0 4.419 2.865 8.167 6.839 9.489.5.092.659-.217.659-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.157-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85 0 1.71.117 2.512.345 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.594 1.028 2.686 0 3.848-2.339 4.695-4.566 4.944.359.309.678.919.678 1.854 0 1.338-.012 2.419-.012 2.748 0 .267.178.578.688.402A10.004 10.004 0 0 0 22 10c0-5.523-4.477-10-10-10z" />
          </svg>
          GitHub
        </button>
      )}
    </div>
  )
}
