"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Hammer, 
  Box, 
  Sparkles,
  Shield,
  Truck,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase"
import { OAuthButtons } from "@/components/auth/OAuthButtons"

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LoginForm />
    </Suspense>
  )
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
    </div>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/client"
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const supabase = createClient()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    
    if (!email) {
      newErrors.email = "El email es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido"
    }
    
    if (!password) {
      newErrors.password = "La contraseña es requerida"
    } else if (password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        toast.error(error.message)
        return
      }
      
      toast.success("Bienvenido")
      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      toast.error("Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
        },
      })
      if (error) {
        // El proveedor no habilitado en Supabase devuelve 400
        const label = provider === "google" ? "Google" : "GitHub"
        if (/400|not enabled|not found/i.test(error.message)) {
          toast.error(
            `El acceso con ${label} todavía no está habilitado. Usa tu correo y contraseña.`
          )
        } else {
          toast.error(error.message)
        }
      }
    } catch {
      toast.error("Error al iniciar sesión con " + provider)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 via-background to-secondary/5 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Hammer className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">Maderas & Diseño</span>
          </Link>
          <p className="text-muted-foreground mt-2 text-sm">Inicia sesión para continuar</p>
        </div>

        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>Accede a tu panel de cliente o administrador</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({...errors, email: undefined}) }}
                    className="pl-10"
                    error={errors.email}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link href="/reset-password" className="text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({...errors, password: undefined}) }}
                    className="pl-10 pr-10"
                    error={errors.password}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                loading={isLoading}
                variant="premium"
              >
                <Box className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                O continuar con
              </span>
            </div>

            {/* OAuth Buttons (solo si el proveedor esta habilitado) */}
            <OAuthButtons redirectTo={redirectTo} />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link href="/register?redirect=" className="text-primary font-medium hover:underline">
                Regístrate
              </Link>
            </p>
            
            <Link 
              href="/" 
              className="text-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Volver al inicio
            </Link>
          </CardFooter>
        </Card>

        {/* Features preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Sparkles, text: "Diseño Personalizado" },
            { icon: Shield, text: "Garantía 5 Años" },
            { icon: Truck, text: "Envío Nacional" },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <item.icon className="h-6 w-6 mx-auto text-primary mb-2" />
              <span className="text-sm font-medium text-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
