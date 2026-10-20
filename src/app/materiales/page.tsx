// opencode enciende el taller
import { Metadata } from "next"
import Link from "next/link"
import { createServerSupabaseAdminClient } from "@/lib/supabase-admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InfoPage } from "@/components/content/InfoPage"
import { TreePine, Layers, Wrench, Paintbrush, Ruler } from "lucide-react"

export const instant = false

export const metadata: Metadata = {
  title: "Materiales",
  description: "Maderas, tapicería, herrajes y acabados con su precio por unidad.",
}

const TYPE_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  wood: { label: "Maderas", icon: TreePine },
  fabric: { label: "Tapicería", icon: Layers },
  hardware: { label: "Herrajes", icon: Wrench },
  finish: { label: "Acabados", icon: Paintbrush },
  other: { label: "Otros", icon: Ruler },
}

export default async function MaterialesPage() {
  const supabase = createServerSupabaseAdminClient()

  const { data: materials } = await supabase
    .from("materials")
    .select("*")
    .eq("is_active", true)
    .order("type", { ascending: true })
    .order("name", { ascending: true })

  const grouped = (materials ?? []).reduce<Record<string, NonNullable<typeof materials>>>(
    (acc, m) => {
      acc[m.type] = acc[m.type] || []
      acc[m.type]!.push(m)
      return acc
    },
    {}
  )

  const money = (v: number) =>
    Number(v).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <InfoPage
      eyebrow="Inventario"
      title="Materiales y precios"
      intro="Todo lo que usamos, con el precio por unidad y el stock real de taller. Los precios que ves aquí son los que se aplican en tu proforma."
    >
      <section className="py-16">
        <div className="container mx-auto px-6 space-y-12">
          {Object.entries(grouped).map(([type, list]) => {
            const meta = TYPE_META[type] ?? TYPE_META.other
            return (
              <div key={type}>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <meta.icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold">{meta.label}</h2>
                  <Badge variant="outline">{list.length}</Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {list?.map((m) => {
                    const low = m.stock <= m.min_stock_alert
                    return (
                      <Card key={m.id}>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-semibold">{m.name}</h3>
                            {low && (
                              <Badge
                                variant="outline"
                                className="border-amber-500/40 text-amber-600"
                              >
                                stock bajo
                              </Badge>
                            )}
                          </div>
                          <p className="mt-3 text-2xl font-bold text-primary">
                            {money(Number(m.price_per_unit))}
                            <span className="text-sm font-normal text-muted-foreground">
                              {" "}
                              / {m.unit}
                            </span>
                          </p>
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            Stock: {m.stock} {m.unit} · mínimo{" "}
                            {m.min_stock_alert}
                          </p>
                          {m.supplier && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Proveedor: {m.supplier}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}

          <div className="text-center">
            <Button asChild variant="premium" className="gap-2">
              <Link href="/configurador">Configurar mi mueble</Link>
            </Button>
          </div>
        </div>
      </section>
    </InfoPage>
  )
}
