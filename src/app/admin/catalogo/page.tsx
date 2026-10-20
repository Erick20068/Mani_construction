// opencode enciende el taller
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { requireAdmin } from "@/lib/auth"
import { FurnitureManager, type FurnitureRow } from "@/components/admin/FurnitureManager"
import { Button } from "@/components/ui/button"
import { Box } from "lucide-react"

export const instant = false

export default async function AdminCatalogoPage() {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const [{ data: items }, { data: categories }, { data: woodTypes }] =
    await Promise.all([
      supabase
        .from("furniture_items")
        .select(
          `*,
           furniture_categories(name),
           wood_types(name, color_hex)`
        )
        .order("created_at", { ascending: false }),
      supabase.from("furniture_categories").select("id, name").order("name"),
      supabase.from("wood_types").select("id, name").order("name"),
    ])

  const published = items?.filter((i) => i.published).length ?? 0
  const drafts = (items?.length ?? 0) - published

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Box className="h-6 w-6 text-primary" />
            Catálogo de muebles
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items?.length ?? 0} muebles · {published} publicados · {drafts}{" "}
            borradores
          </p>
        </div>
      </header>

      <FurnitureManager
        items={(items ?? []) as unknown as FurnitureRow[]}
        categories={categories ?? []}
        woodTypes={woodTypes ?? []}
      />
    </div>
  )
}
