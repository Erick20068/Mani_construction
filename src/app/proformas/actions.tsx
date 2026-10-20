// opencode enciende el taller
"use server"

import { renderToBuffer } from "@react-pdf/renderer"
import { createServerSupabaseAdminClient } from "@/lib/supabase-admin"
import { ProformaDocument, type PdfCompany } from "@/components/proformas/ProformaPdf"

export interface CreateProformaInput {
  client_name: string
  client_ruc?: string | null
  client_phone?: string | null
  client_address?: string | null
  client_email?: string | null
  material_label: string
  deposit: number
  notes?: string | null
  valid_until: string
  client_id?: string | null
  items: Array<{
    furniture_id?: string | null
    custom_name?: string | null
    description: string
    quantity: number
    unit_price: number
    total_price: number
    customizations?: Record<string, unknown>
  }>
}

export interface ActionResult {
  ok: boolean
  message: string
  id?: string
  number?: number
  pdfUrl?: string
}

const PDF_BUCKET = "proforma-pdfs"

async function ensureBucket(supabase: ReturnType<typeof createServerSupabaseAdminClient>) {
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some((b) => b.id === PDF_BUCKET)
  if (!exists) {
    await supabase.storage.createBucket(PDF_BUCKET, {
      public: false,
      fileSizeLimit: 10 * 1024 * 1024,
    })
  }
}

/** Numero secuencial de proforma (campo NOT NULL UNIQUE). */
async function nextProformaNumber(
  supabase: ReturnType<typeof createServerSupabaseAdminClient>
): Promise<number> {
  const { data: company } = await supabase
    .from("company_settings")
    .select("starting_number")
    .limit(1)
    .single()

  const starting = Number(company?.starting_number ?? 1) || 1

  const { data: last } = await supabase
    .from("proformas")
    .select("number")
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle()

  return Math.max(starting, Number(last?.number ?? 0) + 1)
}

async function getCompany(
  supabase: ReturnType<typeof createServerSupabaseAdminClient>
): Promise<PdfCompany> {
  const { data } = await supabase
    .from("company_settings")
    .select("*")
    .limit(1)
    .single()

  return {
    name: data?.name ?? "Maderas & Diseño",
    tagline: data?.tagline ?? "",
    ruc: data?.ruc ?? "",
    city: data?.city ?? "Lima",
    manager_name: data?.manager_name ?? "",
    manager_title: data?.manager_title ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
    services: data?.services ?? "",
    guarantee: data?.guarantee ?? "",
    material_label: data?.material_label ?? "MATERIAL",
    default_notes: data?.default_notes ?? "Precios no incluyen IVA",
    logo_url: data?.logo_url ?? null,
  }
}

/**
 * Genera el PDF de una proforma ya guardada y devuelve el buffer.
 * Se usa tanto al crear como al volver a descargar.
 */
export async function buildProformaPdf(proformaId: string): Promise<{
  ok: boolean
  message: string
  buffer?: Buffer
  filename?: string
}> {
  try {
    const supabase = createServerSupabaseAdminClient()

    const { data: proforma, error } = await supabase
      .from("proformas")
      .select("*, proforma_items(*)")
      .eq("id", proformaId)
      .single()

    if (error || !proforma) {
      return { ok: false, message: "No se encontró la proforma" }
    }

    const company = await getCompany(supabase)

    const items = (proforma.proforma_items ?? [])
      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((i: any) => ({
        quantity: Number(i.quantity),
        description: i.description,
        unit_price: Number(i.unit_price),
        total_price: Number(i.total_price),
      }))

    const total = items.reduce((s: number, i: any) => s + i.total_price, 0)
    const deposit = Number(proforma.deposit ?? 0)

    const buffer = await renderToBuffer(
      <ProformaDocument
        company={company}
        proforma={{
          number: Number(proforma.number),
          date: String(proforma.date).slice(0, 10),
          client_name: proforma.client_name,
          client_ruc: proforma.client_ruc ?? "",
          client_phone: proforma.client_phone ?? "",
          client_address: proforma.client_address ?? "",
          client_email: proforma.client_email ?? "",
          material_label: proforma.material_label ?? company.material_label,
          deposit,
          notes: proforma.notes ?? company.default_notes,
          items,
        }}
        totals={{
          total,
          deposit,
          saldo: total - deposit,
        }}
      />
    )

    return {
      ok: true,
      message: "PDF generado",
      buffer,
      filename: `Proforma-${String(proforma.number).padStart(5, "0")}-${(proforma.client_name || "cliente")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 24)}.pdf`,
    }
  } catch (err) {
    console.error("Error generando PDF:", err)
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Error al generar el PDF",
    }
  }
}

/** Crea la proforma en la base de datos y genera su PDF. */
export async function createProforma(
  input: CreateProformaInput
): Promise<ActionResult> {
  try {
    const supabase = createServerSupabaseAdminClient()
    await ensureBucket(supabase)

    const number = await nextProformaNumber(supabase)

    const subtotal = input.items.reduce((s, i) => s + i.total_price, 0)
    const tax = Math.round(subtotal * 0.18 * 100) / 100
    const total = Math.round((subtotal + tax) * 100) / 100

    const { data: proforma, error } = await supabase
      .from("proformas")
      .insert({
        number,
        date: new Date().toISOString().slice(0, 10),
        client_id: input.client_id ?? null,
        client_name: input.client_name,
        client_ruc: input.client_ruc || null,
        client_phone: input.client_phone || null,
        client_address: input.client_address || null,
        client_email: input.client_email || null,
        material_label: input.material_label || "MATERIAL",
        deposit: input.deposit || 0,
        notes: input.notes || null,
        valid_until: input.valid_until,
        status: "draft",
        subtotal,
        tax,
        total,
      })
      .select()
      .single()

    if (error) throw error

    const { error: itemsError } = await supabase
      .from("proforma_items")
      .insert(
        input.items.map((item, index) => ({
          proforma_id: proforma.id,
          furniture_id: item.furniture_id ?? null,
          custom_name: item.custom_name ?? null,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          customizations: item.customizations ?? {},
          sort_order: index,
        }))
      )

    if (itemsError) throw itemsError

    // PDF
    let pdfUrl: string | undefined
    const pdf = await buildProformaPdf(proforma.id)

    if (pdf.ok && pdf.buffer) {
      const path = `${proforma.id}.pdf`
      const { error: uploadError } = await supabase.storage
        .from(PDF_BUCKET)
        .upload(path, pdf.buffer, {
          contentType: "application/pdf",
          upsert: true,
        })

      if (!uploadError) {
        const { data: signed } = await supabase.storage
          .from(PDF_BUCKET)
          .createSignedUrl(path, 60 * 60 * 24 * 365)

        if (signed?.signedUrl) {
          pdfUrl = signed.signedUrl
          await supabase
            .from("proformas")
            .update({ pdf_url: signed.signedUrl })
            .eq("id", proforma.id)
        }
      } else {
        console.error("Error subiendo PDF:", uploadError)
      }
    }

    return {
      ok: true,
      message: "Proforma creada",
      id: proforma.id,
      number,
      pdfUrl,
    }
  } catch (err) {
    console.error("Error creando proforma:", err)
    return {
      ok: false,
      message:
        err instanceof Error ? err.message : "Error al crear la proforma",
    }
  }
}

/** Vuelve a generar el PDF (por ejemplo tras editar datos de la empresa). */
export async function regenerateProformaPdf(
  proformaId: string
): Promise<ActionResult> {
  try {
    const supabase = createServerSupabaseAdminClient()
    await ensureBucket(supabase)

    const pdf = await buildProformaPdf(proformaId)
    if (!pdf.ok || !pdf.buffer) {
      return { ok: false, message: pdf.message }
    }

    const path = `${proformaId}.pdf`
    const { error: uploadError } = await supabase.storage
      .from(PDF_BUCKET)
      .upload(path, pdf.buffer, {
        contentType: "application/pdf",
        upsert: true,
      })

    if (uploadError) throw uploadError

    const { data: signed } = await supabase.storage
      .from(PDF_BUCKET)
      .createSignedUrl(path, 60 * 60 * 24 * 365)

    if (signed?.signedUrl) {
      await supabase
        .from("proformas")
        .update({ pdf_url: signed.signedUrl })
        .eq("id", proformaId)
    }

    return { ok: true, message: "PDF regenerado", pdfUrl: signed?.signedUrl }
  } catch (err) {
    console.error("Error regenerando PDF:", err)
    return {
      ok: false,
      message:
        err instanceof Error ? err.message : "Error al regenerar el PDF",
    }
  }
}
