// opencode enciende el taller
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { requireAdmin } from "@/lib/auth"
import {
  CompanySettingsForm,
  type CompanySettings,
} from "@/components/admin/CompanySettingsForm"
import { Settings } from "lucide-react"

export const instant = false

export default async function AdminSettingsPage() {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from("company_settings")
    .select("*")
    .limit(1)
    .single()

  const settings: CompanySettings = {
    name: data?.name ?? "Maderas & Diseño",
    tagline: data?.tagline ?? null,
    ruc: data?.ruc ?? null,
    city: data?.city ?? null,
    manager_name: data?.manager_name ?? null,
    manager_title: data?.manager_title ?? null,
    email: data?.email ?? null,
    phone: data?.phone ?? null,
    services: data?.services ?? null,
    guarantee: data?.guarantee ?? null,
    material_label: data?.material_label ?? "MATERIAL",
    default_notes: data?.default_notes ?? null,
    starting_number: data?.starting_number ?? 1,
    logo_url: data?.logo_url ?? null,
    primary_color: data?.primary_color ?? "#1a3a5c",
    secondary_color: data?.secondary_color ?? "#2a8fb5",
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Configuración
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Datos que aparecen en las proformas y en el pie de página
        </p>
      </header>

      <CompanySettingsForm settings={settings} />
    </div>
  )
}
