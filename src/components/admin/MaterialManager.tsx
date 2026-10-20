// opencode enciende el taller
"use client"

import { useMemo, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  AlertTriangle,
  Check,
  Edit3,
  Loader2,
  Package,
  Plus,
  Search,
  Trash2,
  TreePine,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { deleteMaterial, saveMaterial } from "@/app/admin/actions"

export interface MaterialRow {
  id: string
  name: string
  type: string
  unit: string
  price_per_unit: number
  stock: number
  min_stock_alert: number
  supplier: string | null
  is_active: boolean
}

const TYPE_LABEL: Record<string, string> = {
  wood: "Madera",
  hardware: "Herraje",
  finish: "Acabado",
  fabric: "Tapizado",
  other: "Otro",
}

export function MaterialManager({ materials }: { materials: MaterialRow[] }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<MaterialRow | null>(null)
  const [query, setQuery] = useState("")
  const [pending, startTransition] = useTransition()

  const filtered = useMemo(
    () =>
      materials.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          (m.supplier ?? "").toLowerCase().includes(query.toLowerCase())
      ),
    [materials, query]
  )

  const lowStock = materials.filter(
    (m) => m.is_active && m.stock <= m.min_stock_alert
  ).length

  const runAction = (action: () => Promise<{ ok: boolean; message: string }>) => {
    startTransition(async () => {
      const result = await action()
      if (result.ok) {
        toast.success(result.message)
        setOpen(false)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar material..."
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nuevo material
        </Button>
      </div>

      {lowStock > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            <strong>{lowStock}</strong> material(es) con stock bajo o igual al
            mínimo de alerta.
          </span>
        </div>
      )}

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="font-medium">No hay materiales</p>
            <p className="text-sm text-muted-foreground mt-1">
              Registra maderas, herrajes y acabados con su precio y stock
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="p-3 font-medium">Material</th>
                  <th className="p-3 font-medium">Tipo</th>
                  <th className="p-3 font-medium">Precio</th>
                  <th className="p-3 font-medium">Stock</th>
                  <th className="p-3 font-medium">Proveedor</th>
                  <th className="p-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const low = m.is_active && m.stock <= m.min_stock_alert
                  return (
                    <tr
                      key={m.id}
                      className="border-b border-border/50 last:border-0 hover:bg-accent/30"
                    >
                      <td className="p-3 font-medium">
                        <div className="flex items-center gap-2">
                          {m.type === "wood" ? (
                            <TreePine className="h-4 w-4 text-primary" />
                          ) : (
                            <Package className="h-4 w-4 text-muted-foreground" />
                          )}
                          {m.name}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">
                          {TYPE_LABEL[m.type] ?? m.type}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {formatCurrency(Number(m.price_per_unit))}
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          / {m.unit}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={
                            low
                              ? "font-semibold text-amber-600"
                              : "text-muted-foreground"
                          }
                        >
                          {m.stock} {m.unit}
                        </span>
                        {low && (
                          <Badge
                            variant="outline"
                            className="ml-2 border-amber-500/40 text-amber-600"
                          >
                            mínimo {m.min_stock_alert}
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {m.supplier || "—"}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditing(m)
                              setOpen(true)
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={pending}
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `¿Eliminar "${m.name}"?`
                                )
                              ) {
                                runAction(() => deleteMaterial(m.id))
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Editar: ${editing.name}` : "Nuevo material"}
            </DialogTitle>
            <DialogDescription>
              Precio y stock por unidad (m, m², m³, kg, piezas, ml)
            </DialogDescription>
          </DialogHeader>

          <MaterialForm
            key={editing?.id ?? "new"}
            item={editing}
            pending={pending}
            onCancel={() => setOpen(false)}
            onSave={(fd) => runAction(() => saveMaterial(fd))}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MaterialForm({
  item,
  pending,
  onCancel,
  onSave,
}: {
  item: MaterialRow | null
  pending: boolean
  onCancel: () => void
  onSave: (fd: FormData) => void
}) {
  const [form, setForm] = useState({
    name: item?.name ?? "",
    type: item?.type ?? "wood",
    unit: item?.unit ?? "m",
    price_per_unit: String(item?.price_per_unit ?? ""),
    stock: String(item?.stock ?? 0),
    min_stock_alert: String(item?.min_stock_alert ?? 10),
    supplier: item?.supplier ?? "",
    is_active: item?.is_active ?? true,
  })

  const set = (k: string, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    if (item?.id) fd.set("id", item.id)
    Object.entries(form).forEach(([k, v]) => fd.set(k, String(v)))
    onSave(fd)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="m-name">Nombre *</Label>
        <Input
          id="m-name"
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Tipo</Label>
          <Select value={form.type} onValueChange={(v) => set("type", v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TYPE_LABEL).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Unidad</Label>
          <Select value={form.unit} onValueChange={(v) => set("unit", v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["m", "m2", "m3", "kg", "pcs", "ml"].map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="m-price">Precio / unidad *</Label>
          <Input
            id="m-price"
            type="number"
            step="0.01"
            min="0"
            required
            value={form.price_per_unit}
            onChange={(e) => set("price_per_unit", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="m-stock">Stock</Label>
          <Input
            id="m-stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => set("stock", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="m-min">Alerta mínima</Label>
          <Input
            id="m-min"
            type="number"
            min="0"
            value={form.min_stock_alert}
            onChange={(e) => set("min_stock_alert", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="m-supplier">Proveedor</Label>
        <Input
          id="m-supplier"
          value={form.supplier}
          onChange={(e) => set("supplier", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => set("is_active", e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        Activo
      </label>

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
          {item ? "Guardar" : "Crear"}
        </Button>
      </DialogFooter>
    </form>
  )
}
