// opencode enciende el taller
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, KeyRound, Loader2, Mail } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [mode, setMode] = useState<"request" | "update">("request")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const supabase = createClient()

  // Si Supabase ya abrió una sesión de recuperación,，允许 cambiar la clave
  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes("type=recovery") || hash.includes("access_token")) {
      setMode("update")
    }
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setMode("update")
      }
    })
    return () => data.subscription.unsubscribe()
  }, [supabase])

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
      toast.success("Revisa tu correo para restablecer la contraseña")
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }
    if (password.length < 6) {
      toast.error("Mínimo 6 caracteres")
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Contraseña actualizada")
      router.push("/client")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 via-background to-secondary/5 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary mb-3">
            <KeyRound className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">
            {mode === "request" ? "Recuperar contraseña" : "Nueva contraseña"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {mode === "request"
              ? "Te enviaremos un enlace para restablecer tu contraseña"
              : "Elige la nueva contraseña de tu cuenta"}
          </p>
        </div>

        <Card className="shadow-xl">
          <CardContent className="pt-6">
            {mode === "request" ? (
              sent ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
                  <p className="font-medium">Correo enviado</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Si {email} está registrado, recibirás el enlace en unos
                    minutos.
                  </p>
                  <Button asChild variant="outline" className="mt-5">
                    <Link href="/login">Volver al inicio de sesión</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleRequest} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full gap-2"
                    variant="premium"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    Enviar enlace
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/login">← Volver</Link>
                  </Button>
                </form>
              )
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input
                    id="new-password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full gap-2"
                  variant="premium"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Guardar contraseña
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Si no tienes cuenta,{" "}
            <Link href="/register" className="text-primary hover:underline">
              regístrate aquí
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
