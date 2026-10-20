// opencode enciende el taller
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { requireAdmin } from "@/lib/auth"
import {
  companySettingsSchema,
  furnitureItemSchema,
  materialSchema,
  video3dSchema,
} from "@/lib/validations"

export interface ActionResult {
  ok: boolean
  message: string
  fieldErrors?: Record<string, string>
}

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "")
const num = (v: FormDataEntryValue | null) => Number(v || 0)
const bool = (v: FormDataEntryValue | null) => v === "on" || v === "true"

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/* ------------------------------------------------------------------ */
/* CATALOGO DE MUEBLES                                                 */
/* ------------------------------------------------------------------ */

export async function saveFurnitureItem(
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const id = str(formData.get("id"))

  const payload = {
    category_id: str(formData.get("category_id")),
    name: str(formData.get("name")),
    slug: str(formData.get("slug")) || slugify(str(formData.get("name"))),
    description: str(formData.get("description")) || null,
    base_price: num(formData.get("base_price")),
    images: str(formData.get("images"))
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    videos_3d: str(formData.get("videos_3d"))
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    wood_type_id: str(formData.get("wood_type_id")) || null,
    dimensions: {
      width: num(formData.get("width")),
      height: num(formData.get("height")),
      depth: num(formData.get("depth")),
      unit: str(formData.get("unit")) || "cm",
    },
    weight_kg: num(formData.get("weight_kg")) || null,
    is_customizable: bool(formData.get("is_customizable")),
    lead_time_days: num(formData.get("lead_time_days")) || 14,
    featured: bool(formData.get("featured")),
    published: bool(formData.get("published")),
    meta_title: str(formData.get("meta_title")) || null,
    meta_description: str(formData.get("meta_description")) || null,
    materials: [],
  }

  const parsed = furnitureItemSchema.safeParse(payload)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form"
      if (!fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { ok: false, message: "Revisa los datos del formulario", fieldErrors }
  }

  const { error } = id
    ? await supabase.from("furniture_items").update(payload).eq("id", id)
    : await supabase.from("furniture_items").insert(payload)

  if (error) return { ok: false, message: error.message }

  revalidatePath("/admin/catalogo")
  revalidatePath("/catalogo")
  return { ok: true, message: id ? "Mueble actualizado" : "Mueble creado" }
}

export async function toggleFurniturePublished(id: string): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from("furniture_items")
    .select("published")
    .eq("id", id)
    .single()

  const { error } = await supabase
    .from("furniture_items")
    .update({ published: !data?.published })
    .eq("id", id)

  if (error) return { ok: false, message: error.message }

  revalidatePath("/admin/catalogo")
  revalidatePath("/catalogo")
  return {
    ok: true,
    message: data?.published ? "Mueble despublicado" : "Mueble publicado",
  }
}

export async function deleteFurnitureItem(id: string): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("furniture_items").delete().eq("id", id)
  if (error) return { ok: false, message: error.message }

  revalidatePath("/admin/catalogo")
  revalidatePath("/catalogo")
  return { ok: true, message: "Mueble eliminado" }
}

/* ------------------------------------------------------------------ */
/* MATERIALES                                                         */
/* ------------------------------------------------------------------ */

export async function saveMaterial(formData: FormData): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const id = str(formData.get("id"))

  const payload = {
    name: str(formData.get("name")),
    type: str(formData.get("type")) || "wood",
    unit: str(formData.get("unit")) || "pcs",
    price_per_unit: num(formData.get("price_per_unit")),
    stock: num(formData.get("stock")),
    min_stock_alert: num(formData.get("min_stock_alert")),
    supplier: str(formData.get("supplier")) || null,
    specs: {},
    is_active: bool(formData.get("is_active")),
  }

  const parsed = materialSchema.safeParse(payload)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form"
      if (!fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { ok: false, message: "Revisa los datos del formulario", fieldErrors }
  }

  const { error } = id
    ? await supabase.from("materials").update(payload).eq("id", id)
    : await supabase.from("materials").insert(payload)

  if (error) return { ok: false, message: error.message }

  revalidatePath("/admin/materiales")
  return { ok: true, message: id ? "Material actualizado" : "Material creado" }
}

export async function deleteMaterial(id: string): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("materials").delete().eq("id", id)
  if (error) return { ok: false, message: error.message }

  revalidatePath("/admin/materiales")
  return { ok: true, message: "Material eliminado" }
}

/* ------------------------------------------------------------------ */
/* VIDEOS 3D                                                          */
/* ------------------------------------------------------------------ */

export async function saveVideo3d(formData: FormData): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const id = str(formData.get("id"))

  const payload = {
    furniture_id: str(formData.get("furniture_id")) || null,
    title: str(formData.get("title")),
    description: str(formData.get("description")) || null,
    video_url: str(formData.get("video_url")),
    thumbnail_url: str(formData.get("thumbnail_url")) || null,
    duration_seconds: num(formData.get("duration_seconds")) || null,
    type: str(formData.get("type")) || "showcase",
    display_order: num(formData.get("display_order")) || 0,
    is_active: bool(formData.get("is_active")),
  }

  const parsed = video3dSchema.safeParse(payload)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form"
      if (!fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { ok: false, message: "Revisa los datos del formulario", fieldErrors }
  }

  const { error } = id
    ? await supabase.from("videos_3d").update(payload).eq("id", id)
    : await supabase.from("videos_3d").insert(payload)

  if (error) return { ok: false, message: error.message }

  revalidatePath("/admin/videos-3d")
  revalidatePath("/galeria-3d")
  return { ok: true, message: id ? "Video actualizado" : "Video agregado" }
}

export async function deleteVideo3d(id: string): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("videos_3d").delete().eq("id", id)
  if (error) return { ok: false, message: error.message }

  revalidatePath("/admin/videos-3d")
  revalidatePath("/galeria-3d")
  return { ok: true, message: "Video eliminado" }
}

/* ------------------------------------------------------------------ */
/* PROFORMAS                                                          */
/* ------------------------------------------------------------------ */

export async function updateProformaStatus(
  id: string,
  status: string
): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from("proformas")
    .update({ status })
    .eq("id", id)

  if (error) return { ok: false, message: error.message }

  revalidatePath("/admin/proformas")
  return { ok: true, message: `Estado actualizado a ${status}` }
}

export async function deleteProforma(id: string): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("proformas").delete().eq("id", id)
  if (error) return { ok: false, message: error.message }

  revalidatePath("/admin/proformas")
  return { ok: true, message: "Proforma eliminada" }
}

/* ------------------------------------------------------------------ */
/* CONFIGURACION DE LA EMPRESA                                        */
/* ------------------------------------------------------------------ */

export async function saveCompanySettings(
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const payload = {
    name: str(formData.get("name")),
    tagline: str(formData.get("tagline")) || null,
    ruc: str(formData.get("ruc")) || null,
    city: str(formData.get("city")) || null,
    manager_name: str(formData.get("manager_name")) || null,
    manager_title: str(formData.get("manager_title")) || null,
    email: str(formData.get("email")) || null,
    phone: str(formData.get("phone")) || null,
    services: str(formData.get("services")) || null,
    guarantee: str(formData.get("guarantee")) || null,
    material_label: str(formData.get("material_label")) || "MATERIAL",
    default_notes: str(formData.get("default_notes")) || null,
    starting_number: num(formData.get("starting_number")) || 1,
    logo_url: str(formData.get("logo_url")) || null,
    primary_color: str(formData.get("primary_color")) || "#1a3a5c",
    secondary_color: str(formData.get("secondary_color")) || "#2a8fb5",
  }

  const parsed = companySettingsSchema.safeParse(payload)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form"
      if (!fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { ok: false, message: "Revisa los datos del formulario", fieldErrors }
  }

  const { data: existing } = await supabase
    .from("company_settings")
    .select("id")
    .limit(1)
    .single()

  const { error } = existing
    ? await supabase.from("company_settings").update(payload).eq("id", existing.id)
    : await supabase.from("company_settings").insert(payload)

  if (error) return { ok: false, message: error.message }

  revalidatePath("/admin/settings")
  return { ok: true, message: "Configuración guardada" }
}

/* ------------------------------------------------------------------ */
/* SESION                                                             */
/* ------------------------------------------------------------------ */

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect("/login")
}
