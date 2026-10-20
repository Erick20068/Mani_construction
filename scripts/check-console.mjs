// opencode enciende el taller
/** Comprueba errores de consola contra un servidor ya arrancado. */
import { chromium } from "playwright"

const BASE = process.argv[2] || "http://localhost:3100"
const routes = [
  "/",
  "/catalogo",
  "/galeria-3d",
  "/proformas",
  "/taller",
  "/login",
  "/register",
  "/demo-3d",
]

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const errors = new Set()

for (const route of routes) {
  const page = await context.newPage()
  page.on("console", (m) => {
    if (m.type() === "error") errors.add(`[${route}] ${m.text().slice(0, 160)}`)
  })
  page.on("pageerror", (e) => errors.add(`[${route}] PAGEERROR ${e.message.slice(0, 160)}`))
  try {
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 40000 })
    await page.waitForTimeout(800)
  } catch (e) {
    errors.add(`[${route}] NAV ${e.message.slice(0, 100)}`)
  }
  await page.close()
}

await browser.close()

if (errors.size === 0) {
  console.log("SIN ERRORES DE CONSOLA en " + BASE)
} else {
  console.log("Errores en " + BASE + ":")
  for (const e of errors) console.log("  -", e)
}
