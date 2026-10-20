// opencode enciende el taller
"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
  Eye,
  Loader2,
  RefreshCw,
  ShieldCheck,
  User,
  Users as UsersIcon,
} from "lucide-react"
import { changeUserRole, syncProfiles, type ActionResult } from "./actions"

export interface UserRow {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
}

const ROLE_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; className: string; desc: string }> = {
  admin: {
    label: "Administrador",
    icon: ShieldCheck,
    className: "bg-primary/10 text-primary",
    desc: "Acceso total: catálogo, materiales, proformas, galería y configuración.",
  },
  client: {
    label: "Cliente",
    icon: User,
    className: "bg-blue-500/10 text-blue-600",
    desc: "Portal de cliente: ve sus proformas y puede crear presupuestos.",
  },
  viewer: {
    label: "Visitante",
    icon: Eye,
    className: "bg-slate-500/10 text-slate-600",
    desc: "Solo navegación: puede ver el catálogo y la galería, sin editar nada.",
  },
}

export function UserManager({ users }: { users: UserRow[] }) {
  const [pending, startTransition] = useTransition()
  const [syncing, setSyncing] = useState(false)

  const run = (action: () => Promise<ActionResult>) => {
    startTransition(async () => {
      const result = await action()
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
    })
  }

  const handleSync = () => {
    setSyncing(true)
    startTransition(async () => {
      const result = await syncProfiles()
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
      setSyncing(false)
    })
  }

  return (
    <div className="space-y-6">
      {/* Explicacion de roles */}
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(ROLE_META).map(([key, meta]) => (
          <Card key={key}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={cn2("flex h-10 w-10 items-center justify-center rounded-xl", meta.className)}>
                  <meta.icon className="h-5 w-5" />
                </div>
                <p className="font-semibold">{meta.label}</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {meta.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {users.length} usuario{users.length === 1 ? "" : "s"}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSync}
          disabled={syncing || pending}
          className="gap-2"
        >
          {syncing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Sincronizar perfiles
        </Button>
      </div>

      {/* Listado */}
      {users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <UsersIcon className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="font-medium">Todavía no hay usuarios</p>
            <p className="text-sm text-muted-foreground mt-1">
              Cuando alguien se registre en /register, aparecerá aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="p-4 font-medium">Usuario</th>
                  <th className="p-4 font-medium">Registro</th>
                  <th className="p-4 font-medium">Rol</th>
                  <th className="p-4 font-medium text-right">Cambiar rol</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const meta = ROLE_META[u.role] ?? ROLE_META.viewer
                  return (
                    <tr
                      key={u.id}
                      className="border-b border-border/50 last:border-0 hover:bg-accent/30"
                    >
                      <td className="p-4">
                        <p className="font-medium">
                          {u.full_name || "Sin nombre"}
                        </p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">
                        {new Date(u.created_at).toLocaleDateString("es-PE")}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={cn2("gap-1 border-0", meta.className)}
                        >
                          <meta.icon className="h-3 w-3" />
                          {meta.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end">
                          <Select
                            value={u.role}
                            onValueChange={(v) => run(() => changeUserRole(u.id, v))}
                            disabled={pending}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(ROLE_META).map(([k, m]) => (
                                <SelectItem key={k} value={k}>
                                  {m.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function cn2(...inputs: string[]) {
  return inputs.filter(Boolean).join(" ")
}
