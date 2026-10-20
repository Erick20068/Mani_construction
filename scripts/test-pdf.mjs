// opencode enciende el taller
/**
 * Prueba de generacion de PDF: crea una proforma de prueba en Supabase,
 * genera el PDF y lo guarda en disco para inspeccion.
 *
 *   node --env-file=.env.local scripts/test-pdf.mjs
 */
import { createClient } from "@supabase/supabase-js"
import fs from "node:fs"
import path from "node:path"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

const OUT = path.join(process.cwd(), "public", "design-preview")
fs.mkdirSync(OUT, { recursive: true })

// 1. Empresa
const { data: company } = await supabase
  .from("company_settings")
  .select("*")
  .limit(1)
  .single()

console.log("empresa:", company?.name, "| RUC", company?.ruc)

// 2. Numero siguiente
const { data: last } = await supabase
  .from("proformas")
  .select("number")
  .order("number", { ascending: false })
  .limit(1)
  .maybeSingle()
const number = Math.max(Number(company?.starting_number ?? 1), Number(last?.number ?? 0) + 1)

// 3. Crear proforma de prueba
const { data: proforma, error } = await supabase
  .from("proformas")
  .insert({
    number,
    date: new Date().toISOString().slice(0, 10),
    client_name: "Corporación Andina S.A.C.",
    client_ruc: "20123456789",
    client_phone: "+51 987 654 321",
    client_address: "Av. República de Panamá 2455, Miraflores, Lima",
    client_email: "compras@andina.pe",
    material_label: "MATERIAL",
    deposit: 1500,
    notes: "Precios no incluyen IVA. Validez de la proforma: 30 días.\nEntrega en obra incluida para Lima Metropolitana.",
    valid_until: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    status: "draft",
    subtotal: 8940,
    tax: 1609.2,
    total: 10549.2,
  })
  .select()
  .single()

if (error) {
  console.error("Error creando proforma:", error.message)
  process.exit(1)
}
console.log("proforma creada:", number)

// 4. Items
const items = [
  { furniture_id: null, custom_name: "Sofá Modular Roble 3 plazas", description: "Sofá Modular Roble 3 plazas - madera: Roble, acabado: Aceite natural", quantity: 1, unit_price: 3480, total_price: 3480 },
  { furniture_id: null, custom_name: "Mesa de Comedor Extensible Nogal", description: "Mesa de Comedor Extensible Nogal - madera: Nogal, herrajes: Latón cepillado", quantity: 1, unit_price: 4250, total_price: 4250 },
  { furniture_id: null, custom_name: "Sillas de fresno", description: "Silla Ergonómica de Comedor - rejilla de cordón trenzado a mano", quantity: 6, unit_price: 202, total_price: 1210 },
]

await supabase.from("proforma_items").insert(
  items.map((i, idx) => ({ ...i, proforma_id: proforma.id, sort_order: idx, customizations: {} }))
)

// 5. Generar PDF via la API (servidor ya arrancado)
const BASE = process.env.BASE_URL || "http://localhost:3100"
const res = await fetch(`${BASE}/api/proformas/${proforma.id}/pdf`)
console.log("HTTP", res.status, res.headers.get("content-type"))

if (res.ok) {
  const buf = Buffer.from(await res.arrayBuffer())
  const file = path.join(OUT, "13-proforma-pdf.pdf")
  fs.writeFileSync(file, buf)
  console.log(`PDF guardado: ${file} (${(buf.length / 1024).toFixed(1)} KB)`)
  console.log("cabecera:", buf.subarray(0, 8).toString())
} else {
  console.log("respuesta:", await res.text())
}
