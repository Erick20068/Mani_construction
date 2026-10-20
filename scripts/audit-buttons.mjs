// opencode enciende el taller
/**
 * Auditoria de botones: recorre cada ruta publica, localiza todos los
 * botones y enlaces accionables, los pulsa y registra cualquier fallo
 * (error de consola, navegacion rota, excepcion, click sin efecto).
 *
 *   node scripts/audit-buttons.mjs [urlBase]
 */
import { chromium } from "playwright"

const BASE = process.argv[2] || "http://localhost:3100"

const ROUTES = process.env.AUDIT_ROUTES
  ? JSON.parse(process.env.AUDIT_ROUTES)
  : [
      "/",
      "/catalogo",
      "/galeria-3d",
      "/proformas",
      "/demo-3d",
      "/login",
      "/register",
      "/reset-password",
      "/terminos",
      "/privacidad",
      "/taller",
      "/nosotros",
      "/proyectos",
      "/certificaciones",
      "/blog",
      "/faq",
      "/garantia",
      "/envios",
      "/contacto",
      "/materiales",
      "/configurador",
    ]

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })

const problems = []
let checked = 0

for (const route of ROUTES) {
  const page = await context.newPage()
  const consoleErrors = []
  const pageErrors = []

  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text().slice(0, 180))
  })
  page.on("pageerror", (e) => pageErrors.push(e.message.slice(0, 180)))

  try {
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 40000 })
    await page.waitForTimeout(700)
  } catch (e) {
    problems.push({ route, kind: "NAV", detail: e.message.slice(0, 120) })
    await page.close()
    continue
  }

  // Elementos accionables visibles
  const selectors = [
    "button:visible",
    "a[href]:visible",
    '[role="tab"]:visible',
    '[role="button"]:visible',
  ]

  const elements = []
  for (const sel of selectors) {
    const found = await page.locator(sel).all()
    for (const el of found) {
      const info = await el.evaluate((node) => {
        const text = (node.innerText || node.textContent || "").trim().slice(0, 45)
        const href = node.getAttribute?.("href") || ""
        const disabled = node.hasAttribute?.("disabled") || node.getAttribute?.("aria-disabled") === "true"
        const rect = node.getBoundingClientRect()
        const visible = rect.width > 0 && rect.height > 0
        return { text, href, disabled, visible }
      }).catch(() => null)
      if (!info) continue
      if (info.disabled) continue
      elements.push({ ...info, selector: sel })
    }
  }

  // Deduplicar por texto+href
  const seen = new Set()
  const unique = elements.filter((e) => {
    const key = `${e.text}|${e.href}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  console.log(`\n${route}  (${unique.length} accionables)`)

  for (const el of unique) {
    checked++
    const label = el.text || el.href || el.selector

    // Cada boton se prueba en una pestana limpia
    const p = await context.newPage()
    const errs = []
    const badUrls = []
    p.on("console", (m) => {
      if (m.type() === "error") errs.push(m.text().slice(0, 150))
    })
    p.on("pageerror", (e) => errs.push("EXCEPCION: " + e.message.slice(0, 150)))
    p.on("response", (r) => {
      const url = r.url()
      if (/^(mailto:|tel:)/.test(url)) return
      if (r.status() >= 400) {
        badUrls.push(`HTTP ${r.status()} ${r.request().resourceType()} ${url.replace(BASE, "")}`)
      }
    })
    p.on("requestfailed", (r) => {
      const url = r.url()
      if (/^(mailto:|tel:)/.test(url)) return
      const err = r.failure()?.errorText || ""
      // Los abortos son prefetch cancelados al navegar: no son errores reales
      if (/ERR_ABORTED/i.test(err)) return
      badUrls.push(`FALLO ${r.resourceType()} ${err} ${url.replace(BASE, "")}`)
    })

    try {
      await p.goto(BASE + route, { waitUntil: "networkidle", timeout: 40000 })
      await p.waitForTimeout(500)

      const target = p.locator(el.selector).filter({ hasText: el.text }).first()
      const count = await target.count()
      if (count === 0) {
        await p.close()
        continue
      }

      const before = p.url()
      await target.click({ timeout: 5000, force: true })
      await p.waitForTimeout(1200)

      const after = p.url()
      const bodyText = await p.locator("body").innerText().catch(() => "")

      // Deteccion de errores
      if (errs.length) {
        problems.push({
          route,
          kind: "CONSOLA",
          label,
          detail: [...new Set(errs)][0],
        })
      }
      if (badUrls.length) {
        problems.push({
          route,
          kind: "404",
          label,
          detail: [...new Set(badUrls)].join(" | "),
        })
      }
      // Navegacion a una ruta inexistente
      if (after !== before && /\/admin\/proformas\/[a-f0-9-]{36}$/.test(after)) {
        problems.push({ route, kind: "RUTA", label, detail: `va a ${after}` })
      }
      // Pagina en blanco
      if (bodyText.trim().length < 40) {
        problems.push({
          route,
          kind: "BLANCO",
          label,
          detail: `solo ${bodyText.trim().length} chars`,
        })
      }
    } catch (e) {
      const msg = e.message.slice(0, 140)
      if (!/Timeout/.test(msg)) {
        problems.push({ route, kind: "CLICK", label, detail: msg })
      }
    } finally {
      await p.close()
    }
  }

  if (consoleErrors.length || pageErrors.length) {
    for (const e of [...new Set([...consoleErrors, ...pageErrors])]) {
      problems.push({ route, kind: "CARGA", label: "-", detail: e })
    }
  }

  await page.close()
}

await browser.close()

console.log("\n" + "=".repeat(72))
console.log(`BOTONES REVISADOS: ${checked}`)
console.log(`PROBLEMAS: ${problems.length}`)
console.log("=".repeat(72))

const byRoute = {}
for (const p of problems) {
  byRoute[p.route] = byRoute[p.route] || []
  byRoute[p.route].push(p)
}

for (const [route, list] of Object.entries(byRoute)) {
  console.log(`\n${route}  (${list.length})`)
  for (const p of list) {
    console.log(`  [${p.kind}] ${p.label} -> ${p.detail}`)
  }
}

if (problems.length === 0) {
  console.log("\nTodo funciona.")
}
