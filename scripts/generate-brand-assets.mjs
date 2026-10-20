// opencode enciende el taller
/**
 * Genera los assets PNG de marca (apple-touch-icon y og-image)
 * renderizando una plantilla HTML con Playwright.
 *
 *   node scripts/generate-brand-assets.mjs
 */
import { chromium } from "playwright"
import fs from "node:fs"
import path from "node:path"

const OUT = path.join(process.cwd(), "public")
fs.mkdirSync(OUT, { recursive: true })

const mark = (size) => `
  <svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a3a5c"/>
        <stop offset="100%" stop-color="#2a8fb5"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#g)"/>
    <path d="M14 46h36" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M20 44V22" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <path d="M20 22h12" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <path d="M32 26l10 8-8 4 8 6-10 2z" fill="#fff" fill-opacity=".92"/>
  </svg>`

const browser = await chromium.launch()

/* ---------- apple-touch-icon (180x180) ---------- */
{
  const page = await browser.newPage({ viewport: { width: 180, height: 180 } })
  await page.setContent(
    `<body style="margin:0;width:180px;height:180px;display:flex;align-items:center;justify-content:center;background:#1a3a5c">${mark(180)}</body>`
  )
  await page.screenshot({ path: path.join(OUT, "apple-touch-icon.png"), omitBackground: false })
  await page.close()
  console.log("  apple-touch-icon.png")
}

/* ---------- og-image (1200x630) ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await page.setContent(`
    <html>
      <head>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body {
            width:1200px; height:630px;
            font-family: 'Segoe UI', system-ui, sans-serif;
            background:
              radial-gradient(900px 500px at 78% 18%, rgba(42,143,181,.35), transparent 60%),
              radial-gradient(700px 420px at 12% 88%, rgba(26,58,92,.6), transparent 62%),
              #05070f;
            color:#fff; display:flex; flex-direction:column;
            justify-content:center; padding:72px 84px; position:relative; overflow:hidden;
          }
          .grid {
            position:absolute; inset:0;
            background-image:
              linear-gradient(rgba(34,211,238,.09) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,211,238,.09) 1px, transparent 1px);
            background-size: 60px 60px;
            mask-image: radial-gradient(700px 420px at 60% 50%, #000, transparent 78%);
          }
          .row { display:flex; align-items:center; gap:22px; position:relative; }
          h1 { font-size:64px; font-weight:800; letter-spacing:-1.5px; line-height:1.04; margin-top:34px; }
          h1 span { color:#22d3ee; }
          p.sub { margin-top:22px; font-size:27px; color:rgba(255,255,255,.66); max-width:760px; line-height:1.42; }
          .tags { display:flex; gap:12px; margin-top:38px; position:relative; flex-wrap:wrap; }
          .tag {
            border:1px solid rgba(255,255,255,.16); border-radius:999px;
            padding:9px 20px; font-size:17px; color:rgba(255,255,255,.72);
            background:rgba(255,255,255,.04);
          }
          .brand { position:relative; font-size:21px; letter-spacing:.16em;
                   text-transform:uppercase; color:rgba(255,255,255,.5); font-weight:600; }
        </style>
      </head>
      <body>
        <div class="grid"></div>
        <div class="row">
          ${mark(76)}
          <div class="brand">Maderas &amp; Diseño</div>
        </div>
        <h1>Muebles a medida<br/><span>Hechos para durar</span></h1>
        <p class="sub">Catálogo con precios por material, proformas en PDF y galería 3D interactiva de cada mueble.</p>
        <div class="tags">
          <div class="tag">Catálogo 3D</div>
          <div class="tag">Proformas al instante</div>
          <div class="tag">8 tipos de madera</div>
          <div class="tag">Vista AR</div>
        </div>
      </body>
    </html>
  `)
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(OUT, "og-image.png") })
  await page.close()
  console.log("  og-image.png")
}

await browser.close()
console.log("\nAssets generados en public/")
