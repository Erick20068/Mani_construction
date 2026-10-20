// opencode enciende el taller
/**
 * Comprueba que los videos realmente se reproducen:
 * carga la pagina, busca los <video>, espera a canplay y verifica
 * que el tiempo avanza (no solo que el elemento existe).
 *
 *   node scripts/check-videos.mjs [urlBase]
 */
import { chromium } from "playwright"

const BASE = process.argv[2] || "http://localhost:3100"
const ROUTES = ["/galeria-3d", "/demo-3d", "/proformas"]

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })

let fails = 0

for (const route of ROUTES) {
  const page = await context.newPage()
  const failedRequests = []
  page.on("requestfailed", (r) =>
    failedRequests.push(`${r.failure()?.errorText} ${r.url().slice(0, 90)}`)
  )
  page.on("response", (r) => {
    if (r.status() >= 400 && r.request().resourceType() === "media") {
      failedRequests.push(`HTTP ${r.status()} ${r.url().slice(0, 90)}`)
    }
  })

  await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 40000 })
  await page.waitForTimeout(1200)

  // En la galeria el reproductor vive en un dialogo: hay que abrirlo
  if (route === "/galeria-3d") {
    const play = page.locator('button[aria-label^="Reproducir"]').first()
    if (await play.count()) {
      await play.click({ force: true })
      await page.waitForTimeout(3000)
    }
  }

  const videos = await page.locator("video").all()
  console.log(`\n${route}  (${videos.length} elementos <video>)`)

  if (videos.length === 0) {
    console.log("  (sin videos en esta ruta)")
  }

  for (let i = 0; i < Math.min(videos.length, 4); i++) {
    const info = await videos[i].evaluate(async (v) => {
      const src = v.currentSrc || v.src || "(sin src)"
      if (!v.src) return { src, state: "sin src" }

      // Forzar carga y esperar
      v.load()
      await new Promise((res) => {
        const done = () => res()
        v.addEventListener("canplay", done, { once: true })
        v.addEventListener("error", done, { once: true })
        setTimeout(done, 8000)
      })

      const before = v.currentTime
      try {
        await v.play()
      } catch (e) {
        /* autoplay bloqueado: se ignora */
      }
      await new Promise((r) => setTimeout(r, 1200))
      const after = v.currentTime

      return {
        src: src.slice(0, 90),
        state: v.readyState >= 3 ? "listo" : `readyState=${v.readyState}`,
        networkState: v.networkState,
        error: v.error ? `${v.error.code}: ${v.error.message}` : null,
        advanced: after > before,
        duration: Number.isFinite(v.duration) ? Math.round(v.duration) : null,
        width: v.videoWidth,
        height: v.videoHeight,
      }
    })

    const ok = info.state === "listo" && !info.error
    if (!ok) fails++
    console.log(
      `  ${ok && info.advanced ? "OK  " : "FALLA"} ${info.src}`
    )
    console.log(
      `        estado=${info.state} dur=${info.duration}s ${info.width}x${info.height}` +
        `${info.error ? ` ERROR ${info.error}` : ""}` +
        `${info.advanced ? " avanza" : " NO avanza"}`
    )
  }

  if (failedRequests.length) {
    fails++
    console.log("  peticiones fallidas:")
    for (const f of [...new Set(failedRequests)]) console.log("   -", f)
  }

  await page.close()
}

await browser.close()

console.log(`\n${fails === 0 ? "TODOS LOS VIDEOS OK" : fails + " PROBLEMAS DE VIDEO"}`)
