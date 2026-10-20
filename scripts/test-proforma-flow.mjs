// opencode enciende el taller
/**
 * Prueba de flujo: crear una proforma desde la interfaz y comprobar
 * que se genera el PDF y se guarda en Storage.
 *
 *   node scripts/test-proforma-flow.mjs [urlBase]
 */
import { chromium } from "playwright"
import { createClient } from "@supabase/supabase-js"

const BASE = process.argv[2] || "http://localhost:3100"

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()

const errors = []
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text().slice(0, 160))
})
page.on("pageerror", (e) => errors.push("EXCEPCION: " + e.message.slice(0, 160)))

console.log("1. Abriendo el constructor con un mueble preseleccionado...")
await page.goto(`${BASE}/proformas?product=sofa-modular-roble`, {
  waitUntil: "networkidle",
  timeout: 40000,
})
await page.waitForTimeout(2500)

// El item deberia haberse agregado solo
const cartText = await page.locator("body").innerText()
const inCart = cartText.includes("Sofá Modular Roble")
console.log(`   mueble en el carrito: ${inCart ? "SI" : "NO"}`)

console.log("2. Abriendo el formulario de cliente...")
const genBtn = page.getByRole("button", { name: /Generar Proforma/i }).first()
await genBtn.click()
await page.waitForTimeout(1500)

console.log("3. Rellenando datos...")
await page.fill("#client_name", "Cliente de Prueba Automatica S.A.C.")
await page.fill("#client_ruc", "20987654321")
await page.fill("#client_phone", "+51 911 222 333")
await page.fill("#client_email", "prueba@automatica.pe")
await page.fill("#client_address", "Av. Siempre Viva 742, Lima")

console.log("4. Enviando...")
await page.getByRole("button", { name: /Generar Proforma/i }).last().click()
await page.waitForTimeout(6000)

const url = page.url()
console.log(`   url resultante: ${url.replace(BASE, "")}`)

const ok = /\/proformas\/[0-9a-f-]{36}$/.test(url)
console.log(`   redireccion a la proforma: ${ok ? "OK" : "FALLO"}`)

// Verificar el PDF (con fetch: el navegador lo descargaria)
if (ok) {
  const id = url.split("/").pop()
  const pdfRes = await fetch(`${BASE}/api/proformas/${id}/pdf`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  console.log(
    `   PDF: HTTP ${pdfRes.status} · ${(buf.length / 1024).toFixed(1)} KB · cabecera ${buf.subarray(0, 5).toString()}`
  )
}

// Verificar en la base de datos
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)
const { data: proformas } = await supabase
  .from("proformas")
  .select("id, number, client_name, total, pdf_url, status")
  .eq("client_name", "Cliente de Prueba Automatica S.A.C.")
  .order("created_at", { ascending: false })
  .limit(1)

if (proformas?.length) {
  const p = proformas[0]
  console.log(`   en BD: #${p.number} · ${p.client_name} · total ${p.total} · status ${p.status}`)
  console.log(`   pdf_url: ${p.pdf_url ? "SI (" + p.pdf_url.slice(0, 60) + "...)" : "NO"}`)
} else {
  console.log("   en BD: NO ENCONTRADA")
}

if (errors.length) {
  console.log("\nErrores de consola:")
  for (const e of [...new Set(errors)]) console.log("  -", e)
}

await browser.close()
console.log(ok ? "\nFLUJO OK" : "\nFLUJO CON FALLOS")
