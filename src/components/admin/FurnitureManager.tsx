// opencode enciende el taller
"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
  Box,
  Check,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Search,
  Trash2,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import {
  deleteFurnitureItem,
  saveFurnitureItem,
  toggleFurniturePublished,
} from "@/app/admin/actions"

export interface FurnitureRow {
  id: string
  name: string
  slug: string
  description: string | null
  base_price: number
  images: string[]
  published: boolean
  featured: boolean
  is_customizable: boolean
  lead_time_days: number
  wood_type_id: string | null
  category_id: string
  dimensions: { width: number; height: number; depth: number; unit: string }
  furniture_categories?: { name: string } | null
  wood_types?: { name: string; color_hex: string } | null
}

export function FurnitureManager({
  items,
  categories,
  woodTypes,
}: {
  items: FurnitureRow[]
  categories: Array<{ id: string; name: string }>
  woodTypes: Array<{ id: string; name: string }>
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<FurnitureRow | null>(null)
  const [query, setQuery] = useState("")
  const [pending, startTransition] = useTransition()

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(query.toLowerCase()) ||
      (i.description ?? "").toLowerCase().includes(query.toLowerCase())
  )

  const openNew = () => {
    setEditing(null)
    setOpen(true)
  }

  const openEdit = (item: FurnitureRow) => {
    setEditing(item)
    setOpen(true)
  }

  const runAction = (
    action: () => Promise<{ ok: boolean; message: string }>,
    successMsg?: string
  ) => {
    startTransition(async () => {
      const result = await action()
      if (result.ok) {
        toast.success(successMsg || result.message)
        setOpen(false)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar mueble..."
            className="pl-9"
          />
        </div>
        <Button onClick={openNew} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nuevo mueble
        </Button>
      </div>

      {/* Listado */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Box className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="font-medium">No hay muebles</p>
            <p className="text-sm text-muted-foreground mt-1">
              {query
                ? "Ninguno coincide con la búsqueda"
                : "Crea el primer mueble del catálogo"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Miniatura */}
                  <div className="h-16 w-20 shrink-0 rounded-lg overflow-hidden bg-muted border border-border">
                    {item.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Box className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <Badge variant={item.published ? "default" : "outline"}>
                        {item.published ? "Publicado" : "Borrador"}
                      </Badge>
                      {item.featured && <Badge variant="secondary">★</Badge>}
                      {item.is_customizable && (
                        <Badge variant="outline">Personalizable</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {item.description || "Sin descripción"}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {formatCurrency(Number(item.base_price))}
                      </span>
                      {item.furniture_categories && (
                        <span>{item.furniture_categories.name}</span>
                      )}
                      {item.wood_types && (
                        <span className="flex items-center gap-1">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: item.wood_types.color_hex || "#8B6914",
                            }}
                          />
                          {item.wood_types.name}
                        </span>
                      )}
                      <span>{item.lead_time_days} días</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      title={item.published ? "Despublicar" : "Publicar"}
                      disabled={pending}
                      onClick={() =>
                        runAction(() => toggleFurniturePublished(item.id))
                      }
                    >
                      {item.published ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Editar"
                      onClick={() => openEdit(item)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Eliminar"
                      disabled={pending}
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (
                          window.confirm(
                            `¿Eliminar "${item.name}"? Esta acción no se puede deshacer.`
                          )
                        ) {
                          runAction(() => deleteFurnitureItem(item.id))
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de alta / edicion */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Editar: ${editing.name}` : "Nuevo mueble"}
            </DialogTitle>
            <DialogDescription>
              Completa la informacion del mueble. Las imagenes van una por
              linea (URLs).
            </DialogDescription>
          </DialogHeader>

          <FurnitureForm
            key={editing?.id ?? "new"}
            item={editing}
            categories={categories}
            woodTypes={woodTypes}
            pending={pending}
            onCancel={() => setOpen(false)}
            onSave={(formData) =>
              runAction(() => saveFurnitureItem(formData))
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function FurnitureForm({
  item,
  categories,
  woodTypes,
  pending,
  onCancel,
  onSave,
}: {
  item: FurnitureRow | null
  categories: Array<{ id: string; name: string }>
  woodTypes: Array<{ id: string; name: string }>
  pending: boolean
  onCancel: () => void
  onSave: (formData: FormData) => void
}) {
  const [form, setForm] = useState({
    name: item?.name ?? "",
    slug: item?.slug ?? "",
    description: item?.description ?? "",
    category_id: item?.category_id ?? categories[0]?.id ?? "",
    wood_type_id: item?.wood_type_id ?? "",
    base_price: String(item?.base_price ?? ""),
    images: (item?.images ?? []).join("\n"),
    videos_3d: "",
    width: String(item?.dimensions?.width ?? ""),
    height: String(item?.dimensions?.height ?? ""),
    depth: String(item?.dimensions?.depth ?? ""),
    unit: item?.dimensions?.unit ?? "cm",
    weight_kg: String((item as any)?.weight_kg ?? ""),
    lead_time_days: String(item?.lead_time_days ?? 14),
    is_customizable: item?.is_customizable ?? true,
    featured: item?.featured ?? false,
    published: item?.published ?? false,
    meta_title: "",
    meta_description: "",
  })

  const set = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    if (item?.id) fd.set("id", item.id)
    Object.entries(form).forEach(([key, value]) => {
      fd.set(key, String(value))
    })
    onSave(fd)
  }

  const inputClass = "mt-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nombre y slug */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="se-genera-del-nombre"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Categoria, madera, precio */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label>Categoría *</Label>
          <Select
            value={form.category_id}
            onValueChange={(v) => set("category_id", v)}
          >
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Tipo de madera</Label>
          <Select
            value={form.wood_type_id || "none"}
            onValueChange={(v) => set("wood_type_id", v === "none" ? "" : v)}
          >
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Sin asignar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin asignar</SelectItem>
              {woodTypes.map((w) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="base_price">Precio base (S/) *</Label>
          <Input
            id="base_price"
            type="number"
            step="0.01"
            min="0"
            required
            value={form.base_price}
            onChange={(e) => set("base_price", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Imagenes */}
      <div>
        <Label htmlFor="images">Imágenes (una URL por línea)</Label>
        <Textarea
          id="images"
          rows={3}
          value={form.images}
          onChange={(e) => set("images", e.target.value)}
          placeholder={"https://.../mueble-1.jpg\nhttps://.../mueble-2.jpg"}
          className={inputClass}
        />
      </div>

      {/* Dimensiones */}
      <div className="grid gap-4 sm:grid-cols-5">
        <div>
          <Label htmlFor="width">Ancho</Label>
          <Input
            id="width"
            type="number"
            value={form.width}
            onChange={(e) => set("width", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <Label htmlFor="height">Alto</Label>
          <Input
            id="height"
            type="number"
            value={form.height}
            onChange={(e) => set("height", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <Label htmlFor="depth">Fondo</Label>
          <Input
            id="depth"
            type="number"
            value={form.depth}
            onChange={(e) => set("depth", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <Label htmlFor="unit">Unidad</Label>
          <Select value={form.unit} onValueChange={(v) => set("unit", v)}>
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cm">cm</SelectItem>
              <SelectItem value="mm">mm</SelectItem>
              <SelectItem value="in">in</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="weight_kg">Peso (kg)</Label>
          <Input
            id="weight_kg"
            type="number"
            step="0.1"
            value={form.weight_kg}
            onChange={(e) => set("weight_kg", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="videos_3d">Videos 3D (una URL por línea)</Label>
          <Textarea
            id="videos_3d"
            rows={2}
            value={form.videos_3d}
            onChange={(e) => set("videos_3d", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <Label htmlFor="lead_time_days">Plazo de entrega (días)</Label>
          <Input
            id="lead_time_days"
            type="number"
            min="1"
            value={form.lead_time_days}
            onChange={(e) => set("lead_time_days", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* SEO */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="meta_title">Título SEO</Label>
          <Input
            id="meta_title"
            value={form.meta_title}
            onChange={(e) => set("meta_title", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <Label htmlFor="meta_description">Descripción SEO</Label>
          <Input
            id="meta_description"
            value={form.meta_description}
            onChange={(e) => set("meta_description", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Switches */}
      <div className="flex flex-wrap gap-5 rounded-lg border border-border p-4">
        {(
          [
            ["is_customizable", "Personalizable"],
            ["featured", "Destacado"],
            ["published", "Publicado"],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            <input
              type="checkbox"
              checked={Boolean(form[key])}
              onChange={(e) => set(key, e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            {label}
          </label>
        ))}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending} className="gap-2">
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {item ? "Guardar cambios" : "Crear mueble"}
        </Button>
      </DialogFooter>
    </form>
  )
}
