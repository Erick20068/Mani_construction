// opencode enciende el taller
import { Metadata } from "next"
import { createServerSupabaseAdminClient } from "@/lib/supabase-admin"
import {
  Configurator,
  type ConfigItem,
  type ConfigMaterial,
} from "@/components/catalog/Configurator"

export const instant = false

export const metadata: Metadata = {
  title: "Configurador",
  description:
    "Elige mueble, materiales y medidas, y mira el precio actualizarse al instante.",
}

export default async function ConfiguradorPage() {
  const supabase = createServerSupabaseAdminClient()

  const [{ data: items }, { data: materials }] = await Promise.all([
    supabase
      .from("furniture_items")
      .select("id, name, slug, base_price, images, dimensions, wood_types(name, color_hex)")
      .eq("published", true)
      .order("name", { ascending: true }),
    supabase
      .from("materials")
      .select("id, name, type, unit, price_per_unit")
      .eq("is_active", true)
      .order("name", { ascending: true }),
  ])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Configurador</h1>
          <p className="mt-2 text-muted-foreground">
            Elige el mueble, los materiales y las medidas. El precio se
            recalcula al instante y después lo añades a tu proforma.
          </p>
        </header>

        <Configurator
          items={(items ?? []) as unknown as ConfigItem[]}
          materials={(materials ?? []) as unknown as ConfigMaterial[]}
        />
      </div>
    </div>
  )
}
