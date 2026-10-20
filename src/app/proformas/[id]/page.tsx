// opencode enciende el taller
import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerSupabaseAdminClient } from "@/lib/supabase-admin"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react"

export const instant = false

const STATUS_META: Record<string, { label: string; className: string }> = {
  draft: { label: "Borrador", className: "bg-slate-500" },
  sent: { label: "Enviada", className: "bg-blue-500" },
  accepted: { label: "Aceptada", className: "bg-green-500" },
  rejected: { label: "Rechazada", className: "bg-red-500" },
  expired: { label: "Expirada", className: "bg-amber-500" },
}

export default async function ProformaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServerSupabaseAdminClient()

  const { data: proforma } = await supabase
    .from("proformas")
    .select("*, proforma_items(*)")
    .eq("id", id)
    .maybeSingle()

  if (!proforma) notFound()

  const items = (proforma.proforma_items ?? []).sort(
    (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  )
  const meta = STATUS_META[proforma.status] ?? STATUS_META.draft
  const total = items.reduce((s: number, i: any) => s + Number(i.total_price), 0)
  const subtotal = Number(proforma.subtotal ?? 0)
  const tax = Number(proforma.tax ?? 0)
  const deposit = Number(proforma.deposit ?? 0)
  const saldo = total - deposit

  const money = (v: number) =>
    v.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const pdfUrl = `/api/proformas/${proforma.id}/pdf`

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <Button asChild variant="ghost" size="sm" className="mb-6 gap-2">
          <Link href="/admin/proformas">
            <ArrowLeft className="h-4 w-4" />
            Volver a proformas
          </Link>
        </Button>

        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-mono">
                PROFORMA {String(proforma.number).padStart(5, "0")}
              </h1>
              <Badge variant="outline">
                <span
                  className={`h-1.5 w-1.5 rounded-full mr-1.5 ${meta.className}`}
                />
                {meta.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Emitida el {new Date(proforma.date).toLocaleDateString("es-PE")}
              {proforma.valid_until &&
                ` · válida hasta ${new Date(proforma.valid_until).toLocaleDateString("es-PE")}`}
            </p>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline" className="gap-2">
              <a href={`${pdfUrl}?inline=1`} target="_blank" rel="noreferrer">
                <Eye className="h-4 w-4" />
                Ver PDF
              </a>
            </Button>
            <Button asChild variant="premium" className="gap-2">
              <a href={pdfUrl} download>
                <Download className="h-4 w-4" />
                Descargar PDF
              </a>
            </Button>
          </div>
        </header>

        {/* Vista previa del PDF */}
        <Card className="mt-6 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-primary" />
              Vista previa del documento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <iframe
              src={`${pdfUrl}?inline=1`}
              title={`Proforma ${proforma.number}`}
              className="h-[720px] w-full border-0 bg-white"
            />
          </CardContent>
        </Card>

        {/* Detalle */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-primary" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{proforma.client_name}</p>
              {proforma.client_ruc && (
                <p className="font-mono text-muted-foreground">
                  RUC {proforma.client_ruc}
                </p>
              )}
              {proforma.client_phone && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  {proforma.client_phone}
                </p>
              )}
              {proforma.client_email && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  {proforma.client_email}
                </p>
              )}
              {proforma.client_address && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {proforma.client_address}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-primary" />
                Detalle de la proforma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 border-b border-border/50 py-1.5 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {money(Number(item.unit_price))}
                      </p>
                    </div>
                    <p className="shrink-0 font-medium">
                      {money(Number(item.total_price))}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA (18%)</span>
                  <span>{money(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">{money(total)}</span>
                </div>
                {deposit > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Abono</span>
                      <span>{money(deposit)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Saldo</span>
                      <span>{money(saldo)}</span>
                    </div>
                  </>
                )}
              </div>

              {proforma.notes && (
                <>
                  <Separator className="my-4" />
                  <p className="text-xs font-semibold">NOTA:</p>
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {proforma.notes}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
