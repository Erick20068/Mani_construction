// opencode enciende el taller
"use client"

import { Badge } from "@/components/ui/badge"
import { Eye, ShieldCheck, User } from "lucide-react"
import { cn } from "@/lib/utils"

const ROLE_META: Record<
  string,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    className: string
  }
> = {
  admin: {
    label: "Administrador",
    icon: ShieldCheck,
    className: "bg-primary/10 text-primary",
  },
  client: {
    label: "Cliente",
    icon: User,
    className: "bg-blue-500/10 text-blue-600",
  },
  viewer: {
    label: "Visitante",
    icon: Eye,
    className: "bg-slate-500/10 text-slate-600",
  },
}

/** Muestra el rol del usuario actual. */
export function RoleBadge({
  role,
  className,
}: {
  role?: string | null
  className?: string
}) {
  const meta = ROLE_META[role ?? ""] ?? ROLE_META.viewer
  const Icon = meta.icon

  return (
    <Badge
      variant="outline"
      className={cn("gap-1 border-0", meta.className, className)}
    >
      <Icon className="h-3 w-3" />
      {meta.label}
    </Badge>
  )
}

export { ROLE_META }
