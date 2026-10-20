// opencode enciende el taller
import { createServerSupabaseAdminClient } from "@/lib/supabase-admin"
import { requireAdmin } from "@/lib/auth"
import { UserManager, type UserRow } from "./user-manager"
import { Users } from "lucide-react"

export const instant = false

export default async function AdminUsuariosPage() {
  await requireAdmin()
  const supabase = createServerSupabaseAdminClient()

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Usuarios y roles
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Controla quién administra el taller, quién arma proformas y quién solo
          navega.
        </p>
      </header>

      <UserManager users={(data ?? []) as unknown as UserRow[]} />
    </div>
  )
}
