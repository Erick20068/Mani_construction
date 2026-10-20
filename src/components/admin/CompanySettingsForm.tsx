// opencode enciende el taller
"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Building2, Check, Loader2, Palette } from "lucide-react"
import { saveCompanySettings } from "@/app/admin/actions"

export interface CompanySettings {
  name: string
  tagline: string | null
  ruc: string | null
  city: string | null
  manager_name: string | null
  manager_title: string | null
  email: string | null
  phone: string | null
  services: string | null
  guarantee: string | null
  material_label: string
  default_notes: string | null
  starting_number: number
  logo_url: string | null
  primary_color: string
  secondary_color: string
}

export function CompanySettingsForm({ settings }: { settings: CompanySettings }) {
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState({
    name: settings.name ?? "",
    tagline: settings.tagline ?? "",
    ruc: settings.ruc ?? "",
    city: settings.city ?? "",
    manager_name: settings.manager_name ?? "",
    manager_title: settings.manager_title ?? "",
    email: settings.email ?? "",
    phone: settings.phone ?? "",
    services: settings.services ?? "",
    guarantee: settings.guarantee ?? "",
    material_label: settings.material_label ?? "MATERIAL",
    default_notes: settings.default_notes ?? "",
    starting_number: String(settings.starting_number ?? 1),
    logo_url: settings.logo_url ?? "",
    primary_color: settings.primary_color ?? "#1a3a5c",
    secondary_color: settings.secondary_color ?? "#2a8fb5",
  })

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.set(k, v))

    startTransition(async () => {
      const result = await saveCompanySettings(fd)
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
    })
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-5 w-5 text-primary" />
            Datos de la empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="c-name">Nombre o razón social *</Label>
            <Input
              id="c-name"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="c-tagline">Eslogan / tagline</Label>
            <Input
              id="c-tagline"
              value={form.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="c-ruc">RUC (11 dígitos)</Label>
            <Input
              id="c-ruc"
              value={form.ruc}
              onChange={(e) => set("ruc", e.target.value)}
              maxLength={11}
              placeholder="20123456789"
              className="mt-1.5 font-mono"
            />
          </div>
          <div>
            <Label htmlFor="c-city">Ciudad</Label>
            <Input
              id="c-city"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="c-mname">Gerente</Label>
            <Input
              id="c-mname"
              value={form.manager_name}
              onChange={(e) => set("manager_name", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="c-mtitle">Cargo del gerente</Label>
            <Input
              id="c-mtitle"
              value={form.manager_title}
              onChange={(e) => set("manager_title", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="c-email">Email</Label>
            <Input
              id="c-email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="c-phone">Teléfono / WhatsApp</Label>
            <Input
              id="c-phone"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="c-services">Servicios</Label>
            <Input
              id="c-services"
              value={form.services}
              onChange={(e) => set("services", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="c-guarantee">Garantía</Label>
            <Input
              id="c-guarantee"
              value={form.guarantee}
              onChange={(e) => set("guarantee", e.target.value)}
              placeholder="5 años"
              className="mt-1.5"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="c-logo">URL del logo</Label>
            <Input
              id="c-logo"
              type="url"
              value={form.logo_url}
              onChange={(e) => set("logo_url", e.target.value)}
              placeholder="https://.../logo.png"
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Coloca también el archivo en <code>public/logo.png</code> para
              que funcione en el PDF.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="h-5 w-5 text-primary" />
            Proformas
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="c-label">Título de la columna de material</Label>
            <Input
              id="c-label"
              value={form.material_label}
              onChange={(e) => set("material_label", e.target.value)}
              className="mt-1.5 font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              En el PDF aparece como "MATERIAL".
            </p>
          </div>
          <div>
            <Label htmlFor="c-start">Número inicial de proforma</Label>
            <Input
              id="c-start"
              type="number"
              min="1"
              value={form.starting_number}
              onChange={(e) => set("starting_number", e.target.value)}
              className="mt-1.5 font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="c-notes">Notas por defecto</Label>
            <Textarea
              id="c-notes"
              rows={2}
              value={form.default_notes}
              onChange={(e) => set("default_notes", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="c-pc">Color primario</Label>
            <div className="flex gap-2 mt-1.5">
              <input
                type="color"
                value={form.primary_color}
                onChange={(e) => set("primary_color", e.target.value)}
                className="h-10 w-14 rounded cursor-pointer border border-border bg-transparent"
              />
              <Input
                value={form.primary_color}
                onChange={(e) => set("primary_color", e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="c-sc">Color secundario</Label>
            <div className="flex gap-2 mt-1.5">
              <input
                type="color"
                value={form.secondary_color}
                onChange={(e) => set("secondary_color", e.target.value)}
                className="h-10 w-14 rounded cursor-pointer border border-border bg-transparent"
              />
              <Input
                value={form.secondary_color}
                onChange={(e) => set("secondary_color", e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending} className="gap-2">
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Guardar configuración
        </Button>
      </div>
    </form>
  )
}
