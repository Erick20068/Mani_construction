// opencode enciende el taller
import Link from "next/link"
import { requireClient } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getProfile } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RoleBadge } from "@/components/auth/RoleBadge"
import {
  ArrowRight,
  Boxes,
  FileText,
  Package,
  ShoppingCart,
  User,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export const instant = false

export default async function ClientDashboardPage() {
  await requireClient()
  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  const [{ data: proformas }, { count: totalItems }] = await Promise.all([
    supabase
      .from("proformas")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("furniture_items")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
  ])

  const pending = proformas?.filter((p) => p.status === "draft").length ?? 0
  const accepted = proformas?.filter((p) => p.status === "accepted").length ?? 0
  const total = (proformas ?? []).reduce(
    (acc, p) => acc + Number(p.total ?? 0),
    0
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-10">
        <header className="mb-8">
          <p className="text-sm text-muted-foreground">Portal de cliente</p>
          <h1 className="text-3xl font-bold tracking-tight mt-1">
            Hola, {profile?.full_name?.split(" ")[0] || "bienvenido"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus proformas y explora el catálogo.
          </p>
        </header>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <Boxes className="h-5 w-5 text-primary mb-3" />
              <p className="text-2xl font-bold">{totalItems ?? 0}</p>
              <p className="text-xs text-muted-foreground">
                muebles en el catálogo
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <FileText className="h-5 w-5 text-primary mb-3" />
              <p className="text-2xl font-bold">{proformas?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">proformas creadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <Package className="h-5 w-5 text-amber-500 mb-3" />
              <p className="text-2xl font-bold">{pending}</p>
              <p className="text-xs text-muted-foreground">en borrador</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <ShoppingCart className="h-5 w-5 text-green-600 mb-3" />
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(total)}
              </p>
              <p className="text-xs text-muted-foreground">
                valor-total · {accepted} aceptadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="premium" className="gap-2">
            <Link href="/catalogo">
              <Package className="h-4 w-4" />
              Explorar catálogo
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/proformas">
              <ShoppingCart className="h-4 w-4" />
              Nueva proforma
            </Link>
          </Button>
        </div>

        <Separator className="my-8" />

        {/* Proformas */}
        <section>
          <h2 className="text-xl font-bold mb-4">Mis proformas</h2>
          {proformas && proformas.length > 0 ? (
            <div className="grid gap-3">
              {proformas.map((p) => (
                <Card key={p.id}>
                  <CardContent className="p-4 flex flex-wrap items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">
                          #{String(p.number).padStart(6, "0")}
                        </span>
                        <Badge variant="outline">{p.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(p.created_at).toLocaleDateString("es-PE")}
                        {p.valid_until &&
                          ` · válida hasta ${new Date(p.valid_until).toLocaleDateString("es-PE")}`}
                      </p>
                    </div>
                    <p className="font-bold text-lg">
                      {formatCurrency(Number(p.total))}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-14 text-center">
                <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="font-medium">Todavía no tienes proformas</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Elige muebles del catálogo y arma tu presupuesto.
                </p>
                <Button asChild>
                  <Link href="/catalogo" className="gap-2">
                    Ir al catálogo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Perfil */}
        <section className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-primary" />
                Mis datos
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Nombre</p>
                <p className="font-medium">{profile?.full_name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{profile?.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rol</p>
                <RoleBadge role={profile?.role} className="mt-1" />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
