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
  Check,
  Edit3,
  Loader2,
  PlayCircle,
  Plus,
  Trash2,
  Video,
} from "lucide-react"
import { deleteVideo3d, saveVideo3d } from "@/app/admin/actions"

export interface VideoRow {
  id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  duration_seconds: number | null
  type: "showcase" | "possible" | "process"
  display_order: number
  is_active: boolean
  furniture_id: string | null
  furniture?: { name: string } | null
}

const TYPE_META: Record<string, { label: string; color: string }> = {
  showcase: { label: "Realizado", color: "bg-green-500" },
  possible: { label: "Posible", color: "bg-purple-500" },
  process: { label: "Proceso", color: "bg-blue-500" },
}

export function VideoManager({
  videos,
  furniture,
}: {
  videos: VideoRow[]
  furniture: Array<{ id: string; name: string }>
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<VideoRow | null>(null)
  const [pending, startTransition] = useTransition()

  const run = (action: () => Promise<{ ok: boolean; message: string }>) => {
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
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Agregar video
        </Button>
      </div>

      {videos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Video className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="font-medium">La galería está vacía</p>
            <p className="text-sm text-muted-foreground mt-1">
              Sube videos 3D de muebles realizados, posibles o del proceso
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => {
            const meta = TYPE_META[v.type] ?? TYPE_META.showcase
            return (
              <Card key={v.id} className="overflow-hidden">
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {v.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={v.thumbnail_url}
                      alt={v.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <PlayCircle className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Badge
                      className={`${meta.color} text-white border-0 text-[10px]`}
                    >
                      {meta.label}
                    </Badge>
                    {!v.is_active && (
                      <Badge variant="outline" className="bg-black/70 text-white">
                        Inactivo
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditing(v)
                        setOpen(true)
                      }}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      disabled={pending}
                      onClick={() => {
                        if (window.confirm(`¿Eliminar "${v.title}"?`)) {
                          run(() => deleteVideo3d(v.id))
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm truncate">{v.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {v.description || "Sin descripción"}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    {v.furniture && <span>{v.furniture.name}</span>}
                    {v.duration_seconds && (
                      <span>· {v.duration_seconds}s</span>
                    )}
                    <span>· orden {v.display_order}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Editar: ${editing.title}` : "Agregar video 3D"}
            </DialogTitle>
            <DialogDescription>
              Pega la URL del video (MP4/WebM) y su miniatura. Para verlo antes
              de subir, usa la vista previa en{" "}
                  <code className="text-xs">/demo-3d</code>.
            </DialogDescription>
          </DialogHeader>

          <VideoForm
            key={editing?.id ?? "new"}
            item={editing}
            furniture={furniture}
            pending={pending}
            onCancel={() => setOpen(false)}
            onSave={(fd) => run(() => saveVideo3d(fd))}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function VideoForm({
  item,
  furniture,
  pending,
  onCancel,
  onSave,
}: {
  item: VideoRow | null
  furniture: Array<{ id: string; name: string }>
  pending: boolean
  onCancel: () => void
  onSave: (fd: FormData) => void
}) {
  const [form, setForm] = useState({
    title: item?.title ?? "",
    description: item?.description ?? "",
    video_url: item?.video_url ?? "",
    thumbnail_url: item?.thumbnail_url ?? "",
    duration_seconds: String(item?.duration_seconds ?? ""),
    type: item?.type ?? "showcase",
    display_order: String(item?.display_order ?? 0),
    furniture_id: item?.furniture_id ?? "",
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
        <Label htmlFor="v-title">Título *</Label>
        <Input
          id="v-title"
          required
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="v-desc">Descripción</Label>
        <Textarea
          id="v-desc"
          rows={2}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="v-url">URL del video *</Label>
        <Input
          id="v-url"
          type="url"
          required
          value={form.video_url}
          onChange={(e) => set("video_url", e.target.value)}
          placeholder="https://.../video.mp4"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="v-thumb">URL de la miniatura</Label>
        <Input
          id="v-thumb"
          type="url"
          value={form.thumbnail_url}
          onChange={(e) => set("thumbnail_url", e.target.value)}
          placeholder="https://.../thumb.jpg"
          className="mt-1.5"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label>Tipo</Label>
          <Select value={form.type} onValueChange={(v) => set("type", v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="showcase">Realizado</SelectItem>
              <SelectItem value="possible">Posible</SelectItem>
              <SelectItem value="process">Proceso</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="v-dur">Duración (s)</Label>
          <Input
            id="v-dur"
            type="number"
            min="1"
            value={form.duration_seconds}
            onChange={(e) => set("duration_seconds", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="v-order">Orden</Label>
          <Input
            id="v-order"
            type="number"
            value={form.display_order}
            onChange={(e) => set("display_order", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label>Mueble relacionado</Label>
        <Select
          value={form.furniture_id || "none"}
          onValueChange={(v) => set("furniture_id", v === "none" ? "" : v)}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Sin relacionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin relacionar</SelectItem>
            {furniture.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => set("is_active", e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        Visible en la galería
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
          {item ? "Guardar" : "Agregar"}
        </Button>
      </DialogFooter>
    </form>
  )
}
