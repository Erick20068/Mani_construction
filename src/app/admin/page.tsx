import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Box, 
  FileText, 
  Video, 
  TreePine, 
  TrendingUp, 
  Users,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { formatCurrency } from "@/lib/utils"
import { AgentAvatarGrid } from "@/components/agent-avatars"

const statCards = [
  {
    name: "Productos Publicados",
    icon: Box,
    color: "bg-blue-500",
    href: "/admin/catalogo",
  },
  {
    name: "Proformas Pendientes",
    icon: FileText,
    color: "bg-yellow-500",
    href: "/admin/proformas?status=draft",
  },
  {
    name: "Videos 3D Activos",
    icon: Video,
    color: "bg-purple-500",
    href: "/admin/videos-3d",
  },
  {
    name: "Tipos de Madera",
    icon: TreePine,
    color: "bg-green-500",
    href: "/admin/materiales",
  },
]

const quickActions = [
  {
    name: "Nuevo Producto",
    description: "Agregar mueble al catálogo",
    icon: Plus,
    href: "/admin/catalogo/nuevo",
    variant: "premium" as const,
  },
  {
    name: "Nueva Proforma",
    description: "Crear presupuesto para cliente",
    icon: FileText,
    href: "/admin/proformas/nueva",
    variant: "default" as const,
  },
  {
    name: "Subir Video 3D",
    description: "Agregar a la galería",
    icon: Video,
    href: "/admin/videos-3d/nuevo",
    variant: "secondary" as const,
  },
  {
    name: "Nuevo Material",
    description: "Registrar madera o insumo",
    icon: TreePine,
    href: "/admin/materiales/nuevo",
    variant: "outline" as const,
  },
]

export default async function AdminDashboardPage() {
  const supabase = createServerSupabaseClient()

  // Get stats
  const [
    { count: totalItems },
    { count: pendingProformas },
    { count: activeVideos },
    { count: woodTypes },
    { count: lowStockMaterials },
    { data: recentProformas },
    { data: recentItems },
  ] = await Promise.all([
    supabase.from("furniture_items").select("*", { count: "exact", head: true }),
    supabase.from("proformas").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("videos_3d").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("wood_types").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("materials").select("*", { count: "exact", head: true }).lte("stock", 10),
    supabase
      .from("proformas")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("furniture_items")
      .select("*, furniture_categories(name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const stats = [
    { label: "Total Productos", value: totalItems || 0, icon: Box, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Proformas Pendientes", value: pendingProformas || 0, icon: FileText, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Videos 3D Activos", value: activeVideos || 0, icon: Video, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Tipos de Madera", value: woodTypes || 0, icon: TreePine, color: "text-green-500", bg: "bg-green-500/10" },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Bienvenido al panel de administración de Maderas & Diseño</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="premium">
            <Link href="/admin/catalogo/nuevo">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/proformas/nueva">
              <FileText className="h-4 w-4 mr-2" />
              Nueva Proforma
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <Link 
                href={statCards.find(s => s.name === stat.label)?.href || "#"} 
                className="text-sm text-primary hover:underline mt-2 inline-block"
              >
                Ver detalles →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Recent Activity & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Acciones Rápidas
                <span className="text-sm text-muted-foreground">Accesos directos frecuentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    href={action.href}
                    className={cn(
                      "p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 flex items-center gap-4 group"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform",
                      action.variant === "premium" && "bg-gradient-to-br from-primary to-secondary text-white",
                      action.variant === "default" && "bg-primary/10 text-primary",
                      action.variant === "secondary" && "bg-secondary/10 text-secondary",
                      action.variant === "outline" && "border border-border"
                    )}>
                      <action.icon className={cn("h-6 w-6", 
                        action.variant === "premium" ? "text-white" : 
                        action.variant === "default" ? "text-primary" :
                        action.variant === "secondary" ? "text-secondary" :
                        "text-foreground"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{action.name}</p>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Proformas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Proformas Recientes</CardTitle>
              <Link href="/admin/proformas" className="text-sm text-primary hover:underline">
                Ver todas →
              </Link>
            </CardHeader>
            <CardContent>
              {recentProformas && recentProformas.length > 0 ? (
                <div className="space-y-4">
                  {recentProformas.map((proforma) => (
                    <div 
                      key={proforma.id} 
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors",
                        proforma.status === "draft" && "border-l-4 border-l-yellow-500",
                        proforma.status === "sent" && "border-l-4 border-l-blue-500",
                        proforma.status === "accepted" && "border-l-4 border-l-green-500",
                        proforma.status === "rejected" && "border-l-4 border-l-red-500",
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Proforma #{proforma.number}</p>
                          <p className="text-sm text-muted-foreground">{proforma.client_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-foreground">{formatCurrency(Number(proforma.total))}</span>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          proforma.status === "draft" && "bg-yellow-100 text-yellow-800",
                          proforma.status === "sent" && "bg-blue-100 text-blue-800",
                          proforma.status === "accepted" && "bg-green-100 text-green-800",
                          proforma.status === "rejected" && "bg-red-100 text-red-800",
                          proforma.status === "expired" && "bg-gray-100 text-gray-800",
                        )}>
                          {proforma.status}
                        </span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/proformas/${proforma.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No hay proformas recientes</p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/admin/proformas/nueva">Crear Primera Proforma</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Productos Recientes</CardTitle>
              <Link href="/admin/catalogo" className="text-sm text-primary hover:underline">
                Ver todas →
              </Link>
            </CardHeader>
            <CardContent>
              {recentItems && recentItems.length > 0 ? (
                <div className="space-y-4">
                  {recentItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {item.images && item.images.length > 0 ? (
                          <img 
                            src={item.images[0]} 
                            alt={item.name} 
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                            <Box className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.furniture_categories?.name || "Sin categoría"} · {formatCurrency(Number(item.base_price))}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {item.published && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {!item.published && (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {item.published ? "Publicado" : "Borrador"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/catalogo/${item.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Box className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No hay productos recientes</p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/admin/catalogo/nuevo">Crear Primer Producto</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Alerts & Agent Activity */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(lowStockMaterials && lowStockMaterials > 0) && (
                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-orange-800">Stock Bajo</p>
                      <p className="text-sm text-orange-700">{lowStockMaterials} materiales por debajo del mínimo</p>
                      <Button asChild variant="ghost" size="sm" className="mt-2">
                        <Link href="/admin/materiales?filter=low-stock">Ver materiales</Link>
                      </Button>
                    </div>
                  </div>
                )}
                {(pendingProformas && pendingProformas > 0) && (
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-800">Proformas Pendientes</p>
                      <p className="text-sm text-blue-700">{pendingProformas} proformas en borrador</p>
                      <Button asChild variant="ghost" size="sm" className="mt-2">
                        <Link href="/admin/proformas?status=draft">Revisar</Link>
                      </Button>
                    </div>
                  </div>
                )}
                {!lowStockMaterials && !pendingProformas && (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <p className="text-green-800">Todo en orden. Sin alertas pendientes.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Agent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Equipo de Desarrollo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AgentAvatarGrid 
                agents={[
                  { agentType: "senior-developer", status: "working" },
                  { agentType: "frontend-developer", status: "thinking" },
                  { agentType: "designer", status: "presenting" },
                  { agentType: "devops-engineer", status: "monitoring" },
                  { agentType: "qa-engineer", status: "reviewing" },
                  { agentType: "tech-lead", status: "leading" },
                ]} 
                size={80}
              />
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  3 trabajando activamente
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  2 en revisión
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  1 monitoreando
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Resumen del Mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-green-50">
                  <p className="text-sm text-green-700">Ingresos Estimados</p>
                  <p className="text-2xl font-bold text-green-900">$127,450</p>
                  <p className="text-xs text-green-600 mt-1">+12% vs mes anterior</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50">
                  <p className="text-sm text-blue-700">Proformas Aceptadas</p>
                  <p className="text-2xl font-bold text-blue-900">23</p>
                  <p className="text-xs text-blue-600 mt-1">85% tasa de conversión</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50">
                  <p className="text-sm text-purple-700">Productos Vendidos</p>
                  <p className="text-2xl font-bold text-purple-900">47</p>
                  <p className="text-xs text-purple-600 mt-1">Promedio $2,711 c/u</p>
                </div>
                <div className="p-4 rounded-lg bg-orange-50">
                  <p className="text-sm text-orange-700">Tiempo Promedio</p>
                  <p className="text-2xl font-bold text-orange-900">14 días</p>
                  <p className="text-xs text-orange-600 mt-1">Desde proforma a entrega</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}