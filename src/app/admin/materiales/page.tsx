// opencode enciende el taller
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { requireAdmin } from "@/lib/auth"
import { MaterialManager, type MaterialRow } from "@/components/admin/MaterialManager"
import { Package } from "lucide-react"

export const instant = false

export default async function AdminMaterialesPage() {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from("materials")
    .select("*")
    .order("name", { ascending: true })

  const total = data?.length ?? 0
  const lowStock =
    data?.filter((m) => m.is_active && m.stock <= m.min_stock_alert).length ?? 0

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          Materiales e insumos
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {total} materiales registrados · {lowStock} con stock bajo
        </p>
      </header>

      <MaterialManager materials={(data ?? []) as unknown as MaterialRow[]} />
    </div>
  )
}
