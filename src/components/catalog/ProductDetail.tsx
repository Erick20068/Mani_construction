// opencode enciende el taller
"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows, Html } from "@react-three/drei"
import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Box,
  ChevronLeft,
  ChevronRight,
  Cuboid,
  Image as ImageIcon,
  Layers,
  Minus,
  Plus,
  Ruler,
  ShoppingCart,
  Sparkles,
  Truck,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"

export interface ProductMaterial {
  id: string
  name: string
  type: string
  unit: string
  price_per_unit: number
  specs: Record<string, unknown> | null
}

export interface ProductData {
  id: string
  name: string
  slug: string
  description: string | null
  base_price: number
  images: string[]
  videos_3d: string[]
  dimensions: { width: number; height: number; depth: number; unit: string }
  weight_kg: number | null
  is_customizable: boolean
  lead_time_days: number
  wood_type_id: string | null
  wood_types?: { name: string; color_hex: string } | null
  furniture_categories?: { name: string; slug: string } | null
}

/** Visor 3D del mueble (si tiene modelo GLB/GLTF) */
function ModelViewer({ url }: { url: string }) {
  function Model() {
    const { scene } = useGLTF(url)
    const cloned = useMemo(() => scene.clone(), [scene])

    return (
      <primitive
        object={cloned}
        onUpdate={(self: any) => {
          const box = new THREE.Box3().setFromObject(self)
          const size = box.getSize(new THREE.Vector3())
          const center = box.getCenter(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)
          self.scale.setScalar(2.4 / maxDim)
          self.position.sub(center)
        }}
      />
    )
  }

  return (
    <Canvas
      camera={{ position: [2.6, 1.8, 3.2], fov: 45 }}
      gl={{ antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#0b0f1c"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} />
      <Environment preset="warehouse" />
      <Model />
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.45}
        scale={8}
        blur={2.4}
        far={4}
      />
      <OrbitControls
        enablePan={false}
        minDistance={1.6}
        maxDistance={9}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}

export function ProductDetail({
  product,
  materials,
}: {
  product: ProductData
  materials: ProductMaterial[]
}) {
  const [imageIndex, setImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [scaleFactor, setScaleFactor] = useState(1)
  const [view, setView] = useState<"fotos" | "3d" | "video">("fotos")

  const images = product.images?.length ? product.images : []

  // Materiales disponibles paraUZupuesto (maderas y acabados)
  const swatches = useMemo(
    () => materials.filter((m) => m.type === "wood" || m.type === "finish" || m.type === "fabric"),
    [materials]
  )

  // Calculo de precio en vivo
  const price = useMemo(() => {
    let total = Number(product.base_price)
    for (const id of selectedMaterials) {
      const m = materials.find((x) => x.id === id)
      if (m) total += Number(m.price_per_unit)
    }
    // Escalado por dimensiones
    total *= 1 + (scaleFactor - 1) * 0.6
    return total * quantity
  }, [product.base_price, selectedMaterials, materials, scaleFactor, quantity])

  const toggleMaterial = (id: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const unitPrice = price / quantity

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ============ GALERIA ============ */}
      <div className="space-y-4">
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border bg-muted">
          {view === "3d" && product.videos_3d?.[0] ? (
            <ModelViewer url={product.videos_3d[0]} />
          ) : view === "video" && product.videos_3d?.[0] ? (
            <video
              src={product.videos_3d[0]}
              controls
              className="h-full w-full object-cover"
              playsInline
            />
          ) : images[imageIndex] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[imageIndex]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
              <ImageIcon className="h-12 w-12 opacity-40" />
              <p className="text-sm">Sin imágenes</p>
            </div>
          )}

          {images.length > 1 && view === "fotos" && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full"
                onClick={() =>
                  setImageIndex((i) => (i - 1 + images.length) % images.length)
                }
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full"
                onClick={() => setImageIndex((i) => (i + 1) % images.length)}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        {/* Selector de vista */}
        <div className="flex gap-2">
          {(
            [
              ["fotos", ImageIcon, "Fotos"],
              ["3d", Cuboid, "Vista 3D"],
              ["video", Video, "Video"],
            ] as const
          ).map(([key, Icon, label]) => {
            const disabled =
              key === "3d" && !product.videos_3d?.[0]
            return (
              <button
                key={key}
                disabled={disabled}
                onClick={() => setView(key)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
                  view === key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent",
                  disabled && "cursor-not-allowed opacity-40"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            )
          })}
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  setImageIndex(i)
                  setView("fotos")
                }}
                className={cn(
                  "aspect-square overflow-hidden rounded-lg border-2 transition-colors",
                  imageIndex === i && view === "fotos"
                    ? "border-primary"
                    : "border-border hover:border-primary/50"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ============ DETALLE ============ */}
      <div className="space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.furniture_categories && (
              <Badge variant="outline">{product.furniture_categories.name}</Badge>
            )}
            {product.wood_types && (
              <Badge variant="secondary">
                <span
                  className="mr-1.5 h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: product.wood_types.color_hex || "#8B6914",
                  }}
                />
                {product.wood_types.name}
              </Badge>
            )}
            {product.is_customizable && (
              <Badge variant="default">
                <Sparkles className="h-3 w-3" />
                Personalizable
              </Badge>
            )}
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            {product.name}
          </h1>

          {product.description && (
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Medidas */}
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4 text-primary" />
            {product.dimensions?.width} × {product.dimensions?.height} ×{" "}
            {product.dimensions?.depth} {product.dimensions?.unit}
          </span>
          {product.weight_kg && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Box className="h-4 w-4" />
              {product.weight_kg} kg
            </span>
          )}
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Truck className="h-4 w-4" />
            {product.lead_time_days} días de entrega
          </span>
        </div>

        <Separator />

        {/* Selector de materiales */}
        <div>
          <h2 className="flex items-center gap-2 font-semibold">
            <Layers className="h-4 w-4 text-primary" />
            Materiales y acabados
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            El precio se recalcula al instante con cada elección.
          </p>

          {swatches.length > 0 ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {swatches.map((m) => {
                const selected = selectedMaterials.includes(m.id)
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleMaterial(m.id)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all",
                      selected
                        ? "border-primary bg-primary/5 shadow-sm"
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
                        selected
                          ? "border-primary bg-primary"
                          : "border-border"
                      )}
                    >
                      {selected ? "✓" : ""}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Este mueble se ofrece en la configuración estándar.
            </p>
          )}
        </div>

        {/* Escala */}
        {product.is_customizable && (
          <div>
            <h3 className="text-sm font-semibold">Escala de dimensiones</h3>
            <div className="mt-2 flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setScaleFactor((s) => Math.max(0.7, +(s - 0.1).toFixed(2)))
                }
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <input
                  type="range"
                  min="0.7"
                  max="1.4"
                  step="0.05"
                  value={scaleFactor}
                  onChange={(e) => setScaleFactor(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setScaleFactor((s) => Math.min(1.4, +(s + 0.1).toFixed(2)))
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="w-14 text-right font-mono text-sm">
                {Math.round(scaleFactor * 100)}%
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {Math.round(product.dimensions?.width * scaleFactor)} ×{" "}
              {Math.round(product.dimensions?.height * scaleFactor)} ×{" "}
              {Math.round(product.dimensions?.depth * scaleFactor)}{" "}
              {product.dimensions?.unit} finales
            </p>
          </div>
        )}

        <Separator />

        {/* Precio */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Precio {quantity > 1 ? "total" : "unitario"}
                </p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(unitPrice)}
                </p>
                {quantity > 1 && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {quantity} × {formatCurrency(unitPrice)} ={" "}
                    {formatCurrency(price)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-mono text-lg">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              variant="premium"
              className="mt-4 w-full gap-2"
            >
              <Link
                href={`/proformas?product=${product.slug}&qty=${quantity}`}
              >
                <ShoppingCart className="h-5 w-5" />
                Agregar a mi proforma
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
