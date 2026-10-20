// opencode enciende el taller
"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseAdminClient } from "@/lib/supabase-admin"
import { requireAdmin } from "@/lib/auth"

const ROLES = ["admin", "client", "viewer"] as const
export type Role = (typeof ROLES)[number]

export interface ActionResult {
  ok: boolean
  message: string
}

/**
 * Cambia el rol de un usuario. Solo un admin puede hacerlo y no puede
 * degradarse a si mismo (para no quedarse fuera del panel).
 */
export async function changeUserRole(
  userId: string,
  role: string
): Promise<ActionResult> {
  const admin = await requireAdmin()
  const supabase = createServerSupabaseAdminClient()

  if (!ROLES.includes(role as Role)) {
    return { ok: false, message: "Rol no válido" }
  }

  if (userId === admin.user.id) {
    return {
      ok: false,
      message: "No puedes cambiar tu propio rol desde aquí",
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId)

  if (error) return { ok: false, message: error.message }

  revalidatePath("/admin/usuarios")
  return { ok: true, message: "Rol actualizado" }
}

/** Crea un perfil para un usuario de auth que aún no lo tiene. */
export async function syncProfiles(): Promise<ActionResult> {
  await requireAdmin()
  const supabase = createServerSupabaseAdminClient()

  const { data: authUsers } = await supabase.auth.admin.listUsers()
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id")

  const existing = new Set((profiles ?? []).map((p) => p.id))
  const missing = (authUsers?.users ?? []).filter((u) => !existing.has(u.id))

  if (missing.length === 0) {
    return { ok: true, message: "Todos los usuarios tienen perfil" }
  }

  const { error } = await supabase.from("profiles").insert(
    missing.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      full_name:
        (u.user_metadata?.full_name as string) ||
        (u.user_metadata?.name as string) ||
        null,
      role: "client",
    }))
  )

  if (error) return { ok: false, message: error.message }

  revalidatePath("/admin/usuarios")
  return {
    ok: true,
    message: `${missing.length} perfil(es) sincronizado(s)`,
  }
}
