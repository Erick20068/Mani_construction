// opencode enciende el taller
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { requireAdmin } from "@/lib/auth"
import { ProformaList, type ProformaRow } from "@/components/admin/ProformaList"
import { FileText } from "lucide-react"

export const instant = false

export default async function AdminProformasPage() {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from("proformas")
    .select("*, proforma_items(id, description, quantity, total_price)")
    .order("number", { ascending: false })

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Proformas
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Presupuestos generados por los clientes y su estado de seguimiento
        </p>
      </header>

      <ProformaList proformas={(data ?? []) as unknown as ProformaRow[]} />
    </div>
  )
}
