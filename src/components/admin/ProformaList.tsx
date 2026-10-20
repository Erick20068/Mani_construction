// opencode enciende el taller
"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
  FileText,
  Loader2,
  Trash2,
  User,
  Phone,
  Mail,
  Calendar,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { deleteProforma, updateProformaStatus } from "@/app/admin/actions"

export interface ProformaRow {
  id: string
  number: number
  client_name: string
  client_ruc: string | null
  client_email: string | null
  client_phone: string | null
  status: string
  subtotal: number
  tax: number
  total: number
  deposit: number
  valid_until: string | null
  created_at: string
  items?: Array<{ id: string; description: string; quantity: number; total_price: number }>
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  draft: { label: "Borrador", color: "bg-slate-500" },
  sent: { label: "Enviada", color: "bg-blue-500" },
  accepted: { label: "Aceptada", color: "bg-green-500" },
  rejected: { label: "Rechazada", color: "bg-red-500" },
  expired: { label: "Expirada", color: "bg-amber-500" },
}

const STATUSES = ["draft", "sent", "accepted", "rejected", "expired"]

export function ProformaList({ proformas }: { proformas: ProformaRow[] }) {
  const [pending, startTransition] = useTransition()
  const [filter, setFilter] = useState("all")

  const filtered =
    filter === "all"
      ? proformas
      : proformas.filter((p) => p.status === filter)

  const run = (action: () => Promise<{ ok: boolean; message: string }>) => {
    startTransition(async () => {
      const result = await action()
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
    })
  }

  const totals = proformas.reduce(
    (acc, p) => ({
      total: acc.total + Number(p.total ?? 0),
      pending: acc.pending + (p.status === "draft" ? 1 : 0),
    }),
    { total: 0, pending: 0 }
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Proformas</p>
            <p className="text-2xl font-bold mt-1">{proformas.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Borradores</p>
            <p className="text-2xl font-bold mt-1 text-amber-600">
              {totals.pending}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Valor total</p>
            <p className="text-2xl font-bold mt-1 text-primary">
              {formatCurrency(totals.total)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Filtrar:</span>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_META[s]?.label ?? s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="font-medium">No hay proformas</p>
            <p className="text-sm text-muted-foreground mt-1">
              Las proformas que creen los clientes aparecerán aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((p) => {
            const meta = STATUS_META[p.status] ?? STATUS_META.draft
            return (
              <Card key={p.id}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-bold text-primary">
                          #{String(p.number).padStart(6, "0")}
                        </span>
                        <Badge variant="outline">
                          <span
                            className={`h-1.5 w-1.5 rounded-full mr-1.5 ${meta.color}`}
                          />
                          {meta.label}
                        </Badge>
                      </div>

                      <p className="mt-1.5 flex items-center gap-1.5 font-medium text-sm">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {p.client_name}
                        {p.client_ruc && (
                          <span className="font-mono text-xs text-muted-foreground">
                            RUC {p.client_ruc}
                          </span>
                        )}
                      </p>

                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {p.client_phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {p.client_phone}
                          </span>
                        )}
                        {p.client_email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {p.client_email}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(p.created_at).toLocaleDateString("es-PE")}
                          {p.valid_until &&
                            ` · válida hasta ${new Date(p.valid_until).toLocaleDateString("es-PE")}`}
                        </span>
                      </div>

                      {p.items && p.items.length > 0 && (
                        <ul className="mt-2 space-y-0.5">
                          {p.items.map((it) => (
                            <li
                              key={it.id}
                              className="text-xs text-muted-foreground flex justify-between gap-4"
                            >
                              <span className="truncate">
                                {it.quantity} × {it.description}
                              </span>
                              <span className="shrink-0">
                                {formatCurrency(Number(it.total_price))}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="text-right shrink-0 space-y-2">
                      <div>
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(Number(p.total))}
                        </p>
                        {Number(p.deposit) > 0 && (
                          <p className="text-xs text-muted-foreground">
                            abono {formatCurrency(Number(p.deposit))}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={p.status}
                          onValueChange={(v) =>
                            run(() => updateProformaStatus(p.id, v))
                          }
                          disabled={pending}
                        >
                          <SelectTrigger className="w-36 h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {STATUS_META[s]?.label ?? s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={pending}
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (
                              window.confirm(
                                `¿Eliminar la proforma #${p.number}?`
                              )
                            ) {
                              run(() => deleteProforma(p.id))
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
