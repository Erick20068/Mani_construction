// opencode enciende el taller
/**
 * Convierte las ilustraciones SVG de muebles a PNG (1200x1200)
 * y genera un contact sheet para revisarlas de un vistazo.
 *
 *   node scripts/svg-to-png.mjs
 */
import { chromium } from "playwright"
import fs from "node:fs"
import path from "node:path"

const DIR = path.join(process.cwd(), "public", "furniture")
const PNG_DIR = path.join(DIR, "png")
fs.mkdirSync(PNG_DIR, { recursive: true })

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".svg"))

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } })

for (const file of files) {
  const svg = fs.readFileSync(path.join(DIR, file), "utf8")
  await page.setContent(
    `<body style="margin:0;width:1200px;height:1200px;overflow:hidden">${svg}</body>`
  )
  await page.waitForTimeout(120)
  const out = path.join(PNG_DIR, file.replace(/\.svg$/, ".png"))
  await page.screenshot({ path: out })
  console.log("  " + path.basename(out))
}

// Contact sheet: todas las piezas en una imagen
const tiles = files
  .map((f) => {
    const b64 = fs.readFileSync(path.join(DIR, f)).toString("base64")
    return `<figure style="margin:0;position:relative">
      <img src="data:image/svg+xml;base64,${b64}" style="width:100%;display:block;border-radius:14px"/>
      <figcaption style="position:absolute;left:14px;bottom:14px;background:rgba(0,0,0,.72);color:#fff;
        font:600 20px/1.3 system-ui,sans-serif;padding:8px 14px;border-radius:10px">${f.replace(/\.svg$/, "")}</figcaption>
    </figure>`
  })
  .join("")

const sheet = await browser.newPage({ viewport: { width: 1600, height: 1200 } })
await sheet.setContent(`<!doctype html><html><body style="margin:0;background:#0B0F1A;font-family:system-ui">
  <h1 style="color:#E8EEF7;font:700 34px/1.2 system-ui;padding:34px 34px 6px;margin:0">Maderas &amp; Diseño — piezas del catálogo</h1>
  <p style="color:#7C8BA1;font:400 19px/1.4 system-ui;padding:0 34px 26px;margin:0">14 ilustraciones vectoriales generadas · catálogo y galería 3D</p>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:22px;padding:0 34px 40px">${tiles}</div>
</body></html>`)
await sheet.waitForTimeout(900)
await sheet.screenshot({ path: path.join(process.cwd(), "public", "design-preview", "00-piezas-catalogo.png"), fullPage: true })
console.log("\n  contact sheet -> public/design-preview/00-piezas-catalogo.png")

await browser.close()
console.log(`\n${files.length} PNG en ${PNG_DIR}`)
