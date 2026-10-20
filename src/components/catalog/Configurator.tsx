// opencode enciende el taller
"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Check,
  Minus,
  Plus,
  Ruler,
  ShoppingCart,
  Sparkles,
  TreePine,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"

export interface ConfigItem {
  id: string
  name: string
  slug: string
  base_price: number
  images: string[]
  dimensions: { width: number; height: number; depth: number; unit: string }
  wood_types?: { name: string; color_hex: string } | null
}

export interface ConfigMaterial {
  id: string
  name: string
  type: string
  unit: string
  price_per_unit: number
}

export function Configurator({
  items,
  materials,
}: {
  items: ConfigItem[]
  materials: ConfigMaterial[]
}) {
  const [itemId, setItemId] = useState(items[0]?.id ?? "")
  const [selected, setSelected] = useState<string[]>([])
  const [scale, setScale] = useState(1)
  const [qty, setQty] = useState(1)

  const item = useMemo(
    () => items.find((i) => i.id === itemId) ?? items[0],
    [items, itemId]
  )

  const swatches = useMemo(
    () => materials.filter((m) => m.type === "wood" || m.type === "finish" || m.type === "fabric"),
    [materials]
  )

  const unitPrice = useMemo(() => {
    if (!item) return 0
    let total = Number(item.base_price)
    for (const id of selected) {
      const m = materials.find((x) => x.id === id)
      if (m) total += Number(m.price_per_unit)
    }
    return total * (1 + (scale - 1) * 0.6)
  }, [item, selected, materials, scale])

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  if (!item) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-muted-foreground">
            Todavía no hay muebles en el catálogo.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      {/* Vista + selector de mueble */}
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="aspect-4/3 bg-muted">
            {item.images?.[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.images[0]}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              {item.wood_types && (
                <Badge variant="secondary">
                  <span
                    className="mr-1.5 h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: item.wood_types.color_hex || "#8B6914",
                    }}
                  />
                  {item.wood_types.name}
                </Badge>
              )}
              <Badge variant="outline">
                <Sparkles className="h-3 w-3" />
                Personalizable
              </Badge>
            </div>
            <h2 className="mt-2 text-xl font-bold">{item.name}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold mb-3">1. Elige el mueble</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {items.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setItemId(i.id)}
                  className={cn(
                    "rounded-xl border p-2 text-left text-xs transition-all",
                    i.id === item.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                    {i.images?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={i.images[0]} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <p className="mt-1.5 truncate font-medium">{i.name}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel de configuracion */}
      <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
        <Card>
          <CardContent className="p-5 space-y-5">
            <h3 className="font-semibold flex items-center gap-2">
              <TreePine className="h-4 w-4 text-primary" />
              2. Materiales y acabados
            </h3>
            <div className="space-y-2">
              {swatches.map((m) => {
                const isOn = selected.includes(m.id)
                return (
                  <button
                    key={m.id}
                    onClick={() => toggle(m.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all",
                      isOn
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">
                        + {formatCurrency(Number(m.price_per_unit))} / {m.unit}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] text-white",
                        isOn ? "border-primary bg-primary" : "border-border"
                      )}
                    >
                      {isOn && <Check className="h-3 w-3" />}
                    </span>
                  </button>
                )
              })}
              {swatches.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Este mueble se ofrece en configuración estándar.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-5">
            <h3 className="font-semibold flex items-center gap-2">
              <Ruler className="h-4 w-4 text-primary" />
              3. Medidas
            </h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale((s) => Math.max(0.7, +(s - 0.1).toFixed(2)))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <input
                  type="range"
                  min="0.7"
                  max="1.4"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale((s) => Math.min(1.4, +(s + 0.1).toFixed(2)))}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-right font-mono text-sm">
                {Math.round(scale * 100)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(item.dimensions.width * scale)} ×{" "}
              {Math.round(item.dimensions.height * scale)} ×{" "}
              {Math.round(item.dimensions.depth * scale)} {item.dimensions.unit}
            </p>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cantidad</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-mono">{qty}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQty((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <p className="text-xs text-muted-foreground">
                Precio unitario estimado
              </p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(unitPrice)}
              </p>
              {qty > 1 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {qty} × {formatCurrency(unitPrice)} ={" "}
                  {formatCurrency(unitPrice * qty)}
                </p>
              )}
              <p className="mt-2 text-[11px] text-muted-foreground">
                No incluye IVA. El precio final se confirma en la proforma.
              </p>
            </div>

            <Button asChild variant="premium" size="lg" className="w-full gap-2">
              <Link href={`/proformas?product=${item.slug}&qty=${qty}`}>
                <ShoppingCart className="h-5 w-5" />
                Agregar a mi proforma
              </Link>
            </Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
