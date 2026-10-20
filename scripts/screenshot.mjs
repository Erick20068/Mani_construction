// opencode enciende el taller
/**
 * Captura de pantallas del diseno actual.
 *   node scripts/screenshot.mjs
 * Salida: public/design-preview/*.png
 */
import { chromium } from "playwright"
import fs from "node:fs"
import path from "node:path"

const BASE = process.env.BASE_URL || "http://localhost:3000"
const OUT = path.join(process.cwd(), "public", "design-preview")
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
})

const errors = []

async function shot(pathname, name, { full = false, before } = {}) {
  const page = await context.newPage()
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`[${name}] ${m.text().slice(0, 200)}`)
  })
  page.on("pageerror", (e) => errors.push(`[${name}] PAGEERROR ${e.message.slice(0, 200)}`))

  await page.goto(BASE + pathname, { waitUntil: "networkidle", timeout: 45000 })
  if (before) await before(page)
  await page.waitForTimeout(1200)
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: full })
  console.log(`  ${name}.png`)
  await page.close()
}

console.log("Capturando diseño...")

await shot("/", "01-home")
await shot("/catalogo", "02-catalogo")
await shot("/galeria-3d", "03-galeria-3d")
await shot("/proformas", "04-proformas")
await shot("/login", "05-login")
await shot("/register", "06-register")
await shot("/demo-3d", "07-demo-3d")
await shot("/privacidad", "10-privacidad")
await shot("/terminos", "11-terminos")
await shot("/nosotros", "14-nosotros")
await shot("/proyectos", "15-proyectos")
await shot("/materiales", "16-materiales")
await shot("/configurador", "17-configurador")
await shot("/faq", "18-faq")
await shot("/contacto", "19-contacto")
await shot("/catalogo/sofa-modular-roble", "12-ficha-producto")

// Galeria con el reproductor abierto
await shot("/galeria-3d", "20-galeria-player", {
  before: async (page) => {
    const play = page.locator('button[aria-label^="Reproducir"]').first()
    if (await play.count()) {
      await play.click({ force: true })
      await page.waitForTimeout(3000)
    }
  },
})

// El taller: antes y despues de encender
await shot("/taller", "08-taller-apagado")
await shot("/taller", "09-taller-encendido", {
  before: async (page) => {
    const btn = page.getByRole("button", { name: /Encender el taller/i })
    await btn.click()
    await page.waitForTimeout(3500)
  },
})

await browser.close()

console.log(`\nGuardadas en: ${OUT}`)
if (errors.length) {
  console.log("\nErrores de consola detectados:")
  for (const e of [...new Set(errors)]) console.log("  -", e)
} else {
  console.log("\nSin errores de consola.")
}
