// opencode enciende el taller
/**
 * Siembra la base de datos con datos de demostracion:
 * muebles, materiales y videos de la galeria 3D.
 *
 *   node --env-file=.env.local scripts/seed-demo-data.mjs
 *
 * Usa la service role (bypasea RLS), por eso funciona aunque las
 * politicas publicas de `profiles` sigan having la recursion pendiente.
 */
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

const IMG = "/furniture"

const FURNITURE = [
  {
    name: "Sofá Modular Roble 3 plazas",
    slug: "sofa-modular-roble",
    category: "sala",
    wood: "roble",
    price: 3480,
    images: [`${IMG}/sofa-modular-roble.svg`],
    description:
      "Sofá modular de tres plazas en roble macizo con cojines de lino natural y tapering de madera vista. Estructura reforzada, patas de metal negro mate y sistema modular de tres elementos que permite recomponer el sal�n. Fabricado a medida, con espuma de alta densidad de alta densidad.",
    dims: { width: 220, height: 85, depth: 95, unit: "cm" },
    weight: 78,
    lead: 21,
    featured: true,
  },
  {
    name: "Mesa de Comedor Extensible Nogal",
    slug: "mesa-comedor-nogal",
    category: "comedor",
    wood: "nogal",
    price: 4250,
    images: [`${IMG}/mesa-comedor-nogal.svg`],
    description:
      "Mesa de comedor extensible en nogal con sistema de apertura sincronizado de 160 a 240 cm. Tablero de 4 cm con canto macizo, base en cruz y herrajes ocultos de acero. Acompaña con ocho sillas de fresno con rejilla de cordón trenzado a mano.",
    dims: { width: 240, height: 76, depth: 100, unit: "cm" },
    weight: 95,
    lead: 28,
    featured: true,
  },
  {
    name: "Cama con Cabecero de Cedro",
    slug: "cama-cabecero-cedro",
    category: "dormitorio",
    wood: "cedro",
    price: 2890,
    images: [`${IMG}/cama-cabecero-cedro.svg`],
    description:
      "Cama matrimonial con cabecero de listones de cedro aromático, acolchado de lino crudo y base de madera maciza. Listones curvados con encastre invisible, acabado al aceite y somier de resortes pocket.",
    dims: { width: 170, height: 110, depth: 210, unit: "cm" },
    weight: 62,
    lead: 24,
    featured: true,
  },
  {
    name: "Escritorio de Trabajo Cerezo",
    slug: "escritorio-cerezo",
    category: "oficina",
    wood: "cerezo",
    price: 1980,
    images: [`${IMG}/escritorio-cerezo.svg`],
    description:
      "Escritorio de trabajo en cerezo con cajonera de tres cajones y herrajes de latón cepillado. Tablero de 30 mm, base de acero powder-coated y pasacables integrado. Ideal para home office o estudio profesional.",
    dims: { width: 140, height: 75, depth: 70, unit: "cm" },
    weight: 48,
    lead: 18,
    featured: false,
  },
  {
    name: "Silla Ergonómica de Comedor",
    slug: "silla-fresno-rejilla",
    category: "comedor",
    wood: "fresno",
    price: 420,
    images: [`${IMG}/silla-fresno-rejilla.svg`],
    description:
      "Silla de comedor en fresno con asiento de rejilla de cordón trenzado a mano y respaldo curvado. Ergonía probada durante años, tratamiento de madera con aceite natural yEnsamblaje de espiga y clavado.",
    dims: { width: 48, height: 88, depth: 52, unit: "cm" },
    weight: 6,
    lead: 14,
    featured: false,
  },
  {
    name: "Armario de 3 Puertas con Espejo",
    slug: "armario-teka-espejo",
    category: "dormitorio",
    wood: "teka",
    price: 3650,
    images: [`${IMG}/armario-teka-espejo.svg`],
    description:
      "Armario de tres puertas en teka con tiradores de bronce y espejo en la puerta central. Interior con estantes regulables, cajones con guía Blumsoft yPerfilería de aluminio anodizado.",
    dims: { width: 180, height: 210, depth: 60, unit: "cm" },
    weight: 110,
    lead: 32,
    featured: true,
  },
  {
    name: "Estantería Modular de Pino",
    slug: "estanteria-pino-modular",
    category: "sala",
    wood: "pino",
    price: 1240,
    images: [`${IMG}/estanteria-pino-modular.svg`],
    description:
      "Estantería modular de pino con cinco baldas y respaldo de contrachapado. Diseño minimalista cálido, ensamblajehidden de ranuras y herrajes, capacidad de 30 kg por balda. Se entrega en dos módulos de 90 cm.",
    dims: { width: 180, height: 200, depth: 35, unit: "cm" },
    weight: 42,
    lead: 16,
    featured: false,
  },
  {
    name: "Mesa de Centro Redonda Caoba",
    slug: "mesa-centro-caoba",
    category: "sala",
    wood: "caoba",
    price: 890,
    images: [`${IMG}/mesa-centro-caoba.svg`],
    description:
      "Mesa de centro redonda en caoba con base trípode torneada. Tablero de 60 cm confilo de canto y barniz poliuretano de alta resistencia. Acompaña con dos Chairs de lazuli y una lámpara de latón.",
    dims: { width: 60, height: 45, depth: 60, unit: "cm" },
    weight: 12,
    lead: 15,
    featured: false,
  },
  {
    name: "Banco Perchero en Caoba",
    slug: "banco-perchero-caoba",
    category: "personalizado",
    wood: "caoba",
    price: 760,
    images: [`${IMG}/banco-perchero-caoba.svg`],
    description:
      "Banco perchero en caoba con respaldo de listones y balda inferior para calzado. Pieza versatile para recibidor o dormitorio, con ganchos de latónIntegrated y acabado encerado.",
    dims: { width: 120, height: 175, depth: 38, unit: "cm" },
    weight: 18,
    lead: 17,
    featured: false,
  },
  {
    name: "Comedor Completo 8 Personas",
    slug: "comedor-completo-8",
    category: "comedor",
    wood: "nogal",
    price: 6890,
    images: [`${IMG}/comedor-completo-8.svg`],
    description:
      "Conjunto de comedor para ocho personas en nogal: mesa de 240 cm y ocho sillas de fresno con rejilla. Precio del conjunto completo con descuento aplicado respecto a la compra por separado. Incluye montaje en obra.",
    dims: { width: 240, height: 76, depth: 100, unit: "cm" },
    weight: 160,
    lead: 35,
    featured: true,
  },
]

const MATERIALS = [
  { name: "Roble macizo", type: "wood", unit: "m3", price: 850, stock: 42, min: 10, supplier: "Maderas del Norte" },
  { name: "Nogal", type: "wood", unit: "m3", price: 1200, stock: 18, min: 8, supplier: "Maderas del Norte" },
  { name: "Cedro aromático", type: "wood", unit: "m3", price: 650, stock: 30, min: 10, supplier: "Aserradero El Cedro" },
  { name: "Pino finger-jointed", type: "wood", unit: "m3", price: 350, stock: 65, min: 15, supplier: "Aserradero El Cedro" },
  { name: "Caoba nacional", type: "wood", unit: "m3", price: 1500, stock: 6, min: 8, supplier: "Maderas del Norte" },
  { name: "Teka", type: "wood", unit: "m3", price: 1800, stock: 12, min: 6, supplier: "Importaciones Andinas" },
  { name: "Fresno", type: "wood", unit: "m3", price: 750, stock: 24, min: 10, supplier: "Aserradero El Cedro" },
  { name: "Cerezo", type: "wood", unit: "m3", price: 950, stock: 14, min: 6, supplier: "Importaciones Andinas" },
  { name: "Lino natural", type: "fabric", unit: "m2", price: 85, stock: 55, min: 15, supplier: "Telas del Perú" },
  { name: "Tapizado bouclé", type: "fabric", unit: "m2", price: 120, stock: 22, min: 10, supplier: "Telas del Perú" },
  { name: "Aceite natural para madera", type: "finish", unit: "ml", price: 45, stock: 120, min: 30, supplier: "Acabados Eco" },
  { name: "Barniz poliuretano mate", type: "finish", unit: "ml", price: 38, stock: 8, min: 20, supplier: "Acabados Eco" },
  { name: "Herrajes de latón cepillado", type: "hardware", unit: "pcs", price: 28, stock: 340, min: 80, supplier: "Ferretería Industrial" },
  { name: "Tornillos de rosca fina", type: "hardware", unit: "pcs", price: 0.35, stock: 4200, min: 500, supplier: "Ferretería Industrial" },
  { name: "Bisagra concealed 110°", type: "hardware", unit: "pcs", price: 16, stock: 96, min: 40, supplier: "Ferretería Industrial" },
]

const VIDEOS = [
  {
    title: "Sofá Modular Roble — pieza terminada",
    description:
      "El sofá modular de roble macizo terminado en el taller, con cojines de lino natural y tapizado a medida.",
    type: "showcase",
    art: "sofa-modular-roble",
    duration: 42,
    order: 1,
    furniture: "sofa-modular-roble",
  },
  {
    title: "Mesa de Comedor Nogal — apertura sincronizada",
    description:
      "Prueba del sistema de apertura sincronizada de la mesa extensible de nogal.",
    type: "showcase",
    art: "mesa-comedor-nogal",
    duration: 38,
    order: 2,
    furniture: "mesa-comedor-nogal",
  },
  {
    title: "Cama de Cabecero de Cedro — lista para entrega",
    description:
      "La cama de cabecera de listones de cedro, encerada y lista para despacho.",
    type: "showcase",
    art: "cama-cabecero-cedro",
    duration: 35,
    order: 3,
    furniture: "cama-cabecero-cedro",
  },
  {
    title: "Del corte al terminado: la madera trabajando",
    description:
      "Cómo nace una pieza: corte, canteado, elección de veta y montaje de la estructura.",
    type: "process",
    art: "proceso-taller",
    duration: 58,
    order: 4,
  },
  {
    title: "Ensamble a caja y espiga",
    description:
      "El proceso de ensamble de la caja de la mesa, con espigas y clavado a mano.",
    type: "process",
    art: "proceso-ensamble",
    duration: 47,
    order: 5,
  },
  {
    title: "El último lijado y el aceite natural",
    description:
      "Cierre de superficie: lijado progresivo y aplicación del aceite natural en tres manos.",
    type: "process",
    art: "proceso-acabado",
    duration: 41,
    order: 6,
  },
  {
    title: "Router CNC: canteado y clones a medida",
    description:
      "Máquina de control numérico para canteados perfectos y piezas a medida con alta precisión.",
    type: "possible",
    art: "proceso-cnc",
    duration: 51,
    order: 7,
  },
]

const DEMO_VIDEOS = {
  "sofa-modular-roble":
    "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  "mesa-comedor-nogal":
    "https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4",
  "cama-cabecero-cedro":
    "https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4",
}

console.log("Sembrando datos de demostracion...\n")

/* ---------- materiales ---------- */
const { data: existingMaterials } = await supabase.from("materials").select("id, name")
const existingMaterialNames = new Set((existingMaterials ?? []).map((m) => m.name))

const newMaterials = MATERIALS.filter((m) => !existingMaterialNames.has(m.name))
if (newMaterials.length) {
  const { error } = await supabase.from("materials").insert(
    newMaterials.map((m) => ({
      name: m.name,
      type: m.type,
      unit: m.unit,
      price_per_unit: m.price,
      stock: m.stock,
      min_stock_alert: m.min,
      supplier: m.supplier,
      specs: {},
      is_active: true,
    }))
  )
  console.log(`  materiales: ${newMaterials.length} insertados${error ? " (error: " + error.message + ")" : ""}`)
} else {
  console.log("  materiales: ya estaban todos")
}

/* ---------- muebles ---------- */
const { data: categories } = await supabase.from("furniture_categories").select("id, slug")
const { data: woods } = await supabase.from("wood_types").select("id, name")
const catBySlug = Object.fromEntries((categories ?? []).map((c) => [c.slug, c.id]))
const woodByName = Object.fromEntries((woods ?? []).map((w) => [w.name.toLowerCase(), w.id]))

const { data: existingFurniture } = await supabase
  .from("furniture_items")
  .select("id, slug")
const existingSlugs = new Set((existingFurniture ?? []).map((f) => f.slug))

let inserted = 0
let updated = 0
for (const f of FURNITURE) {
  const category_id = catBySlug[f.category] ?? Object.values(catBySlug)[0]
  const wood_type_id = woodByName[f.wood] ?? null

  // Si ya existe, solo se sincronizan los textos (idempotente)
  if (existingSlugs.has(f.slug)) {
    const { error } = await supabase
      .from("furniture_items")
      .update({
        name: f.name,
        description: f.description,
        base_price: f.price,
        images: f.images,
        dimensions: f.dims,
        weight_kg: f.weight,
        lead_time_days: f.lead,
        featured: f.featured,
        published: true,
        wood_type_id,
        category_id,
      })
      .eq("slug", f.slug)
    if (error) console.log(`  ! ${f.slug}: ${error.message}`)
    else updated++
    continue
  }

  const { error } = await supabase.from("furniture_items").insert({
    category_id,
    name: f.name,
    slug: f.slug,
    description: f.description,
    base_price: f.price,
    images: f.images,
    videos_3d: [],
    wood_type_id,
    dimensions: f.dims,
    weight_kg: f.weight,
    is_customizable: true,
    lead_time_days: f.lead,
    featured: f.featured,
    published: true,
    materials: [],
  })

  if (error) console.log(`  ! ${f.slug}: ${error.message}`)
  else inserted++
}
console.log(`  muebles: ${inserted} insertados, ${updated} actualizados`)

/* ---------- videos 3D ---------- */
const { data: furnitureRows } = await supabase
  .from("furniture_items")
  .select("id, slug")
const furnBySlug = Object.fromEntries((furnitureRows ?? []).map((f) => [f.slug, f.id]))

const { data: existingVideos } = await supabase.from("videos_3d").select("id, title")
const existingVideoTitles = new Set((existingVideos ?? []).map((v) => v.title))

let vIns = 0
for (const v of VIDEOS) {
  if (existingVideoTitles.has(v.title)) continue
  const { error } = await supabase.from("videos_3d").insert({
    title: v.title,
    description: v.description,
    video_url: DEMO_VIDEOS[v.art] ?? DEMO_VIDEOS["sofa-modular-roble"],
    thumbnail_url: `${IMG}/${v.art}.svg`,
    duration_seconds: v.duration,
    type: v.type,
    display_order: v.order,
    is_active: true,
    furniture_id: v.furniture ? (furnBySlug[v.furniture] ?? null) : null,
  })
  if (error) console.log(`  ! ${v.title}: ${error.message}`)
  else vIns++
}
console.log(`  videos: ${vIns} insertados`)

/* ---------- empresa ---------- */
const { data: company } = await supabase.from("company_settings").select("id, name, tagline").limit(1).single()
if (company) {
  await supabase
    .from("company_settings")
    .update({
      name: company.name || "Maderas & Diseño",
      tagline: company.tagline || "Muebles a medida, hechos para durar",
      ruc: company.ruc || "20123456789",
      city: company.city || "Lima",
      manager_name: company.manager_name || "Erick Santiago",
      manager_title: company.manager_title || "Gerente General",
      email: company.email || "contacto@maderasydiseno.com",
      phone: company.phone || "+51 999 888 777",
      services: company.services || "Diseño, fabricación y instalación de muebles a medida",
      guarantee: company.guarantee || "5 años de garantía en fabricación",
      material_label: "MATERIAL",
      default_notes: "Precios no incluyen IVA. Validez de la proforma: 30 días.",
      starting_number: company.starting_number || 1,
    })
    .eq("id", company.id)
  console.log("  empresa: configurada")
}

console.log("\nListo. Arranca la app y veras el catalogo y la galeria con datos.")
