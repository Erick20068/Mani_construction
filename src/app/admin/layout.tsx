import Link from "next/link"
import { redirect } from "next/navigation"
import { getProfile } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Box, 
  TreePine, 
  FileText, 
  Video, 
  Settings,
  LogOut,
  User,
  ChevronLeft,
  Hammer,
  Sparkles,
  Package
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AgentAvatar } from "@/components/agent-avatars"
import { createServerSupabaseClient } from "@/lib/supabase-server"

// El panel admin depende de la sesión (cookies) -> layout bloqueante.
export const instant = false

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getProfile()
  
  if (!profile || profile.role !== "admin") {
    redirect("/client")
  }

  const supabase = await createServerSupabaseClient()
  
  // Get company settings for logo
  const { data: company } = await supabase
    .from("company_settings")
    .select("*")
    .limit(1)
    .single()

  // Get stats
  const { count: itemsCount } = await supabase
    .from("furniture_items")
    .select("*", { count: "exact", head: true })

  const { count: pendingProformas } = await supabase
    .from("proformas")
    .select("*", { count: "exact", head: true })
    .eq("status", "draft")

  const { count: lowStockMaterials } = await supabase
    .from("materials")
    .select("*", { count: "exact", head: true })
    .lte("stock", 10)

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Catálogo", href: "/admin/catalogo", icon: Box, badge: itemsCount },
    { name: "Materiales", href: "/admin/materiales", icon: TreePine, badge: lowStockMaterials },
    { name: "Proformas", href: "/admin/proformas", icon: FileText, badge: pendingProformas },
    { name: "Galería 3D", href: "/admin/videos-3d", icon: Video },
    { name: "Configuración", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 w-64 h-screen bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Hammer className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-foreground">Maderas & Diseño</span>
                <span className="block text-xs text-muted-foreground">Panel Admin</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1 truncate">{item.name}</span>
                {item.badge != null && item.badge > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium px-1.5">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Agent Activity Panel */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Equipo Activo
              </h3>
            </div>
            <div className="space-y-2">
              <AgentAvatar agentType="senior-developer" status="working" size={60} showName={false} showTitle={false} />
              <AgentAvatar agentType="frontend-developer" status="thinking" size={60} showName={false} showTitle={false} />
              <AgentAvatar agentType="designer" status="presenting" size={60} showName={false} showTitle={false} />
              <AgentAvatar agentType="devops-engineer" status="monitoring" size={60} showName={false} showTitle={false} />
              <AgentAvatar agentType="qa-engineer" status="reviewing" size={60} showName={false} showTitle={false} />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              5 agentes activos · 2 en revisión · 1 desplegando
            </p>
          </div>

          {/* User Menu */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{profile.full_name || "Admin"}</p>
                <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
              </div>
            </div>
            <form action="/api/auth/signout" method="POST">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                type="submit"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-foreground">Panel de Administración</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Package className="h-4 w-4" />
                <span>{itemsCount || 0} productos</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}