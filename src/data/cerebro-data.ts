import type { AgentType } from "@/types"

/**
 * Estados de un agente. Cada avatar de Bible Strong tiene sus propios
 * nombres de animacion (coding, architecting, training...), asi que aqui
 * se listan todos los que usan los 13 agentes.
 */
export type AgentStatus =
  | "idle"
  | "coding"
  | "reviewing"
  | "debugging"
  | "architecting"
  | "optimizing"
  | "piping"
  | "modeling"
  | "designing"
  | "presenting"
  | "critiquing"
  | "deploying"
  | "monitoring"
  | "incident"
  | "animating"
  | "training"
  | "experimenting"
  | "building"
  | "testing"
  | "planning"
  | "discovering"
  | "hunting"
  | "verifying"
  | "auditing"
  | "leading"
  | "mentoring"

export interface CerebroAgent {
  agentType: AgentType
  /** Tarea concreta que esta ejecutando ahora mismo en este proyecto */
  task: string
  /** Ficheros o areas del proyecto que toca */
  area: string
  /** Skills que esta usando */
  skills: string[]
  /** Estados por los que va rotando en vivo */
  cycle: AgentStatus[]
  /** Ultima entrega */
  deliverable: string
}

/**
 * Los 13 agentes del equipo, con lo que estan haciendo realmente en
 * la construccion de la app Maderas & Diseno.
 */
export const CEREBRO_AGENTS: CerebroAgent[] = [
  {
    agentType: "tech-lead",
    task: "Coordinando las 5 fases y cerrando el build de produccion",
    area: "Arquitectura global",
    skills: ["make-plan", "do", "standup", "pathfinder"],
    cycle: ["reviewing", "coding", "presenting"],
    deliverable: "Plan de 5 fases + build verde en Next 16.4.2",
  },
  {
    agentType: "senior-developer",
    task: "Arreglando la recursion RLS y el fix de politicas en profiles",
    area: "src/lib, src/app/*",
    skills: ["vercel-react-best-practices", "code-review", "smart-explore"],
    cycle: ["coding", "reviewing", "debugging"],
    deliverable: "supabase-fix-policies.sql + schema corregido",
  },
  {
    agentType: "backend-developer",
    task: "Migrando el cliente Supabase SSR a la API asincrona de Next 16",
    area: "src/lib/supabase-server.ts, src/lib/auth.ts",
    skills: ["project-analyzer", "vercel-react-best-practices"],
    cycle: ["architecting", "optimizing", "debugging"],
    deliverable: "createServerSupabaseClient() async + await cookies()",
  },
  {
    agentType: "frontend-developer",
    task: "Construyendo catalogo, constructor de proformas y galeria 3D",
    area: "src/app/catalogo, src/app/proformas, src/app/galeria-3d",
    skills: ["frontend-design", "ui-styling", "animate", "web-design-guidelines"],
    cycle: ["designing", "animating", "reviewing"],
    deliverable: "3 paginas publicas con filtros, carrito y reproductor",
  },
  {
    agentType: "devops-engineer",
    task: "Preparando el pipeline de build y las variables para Vercel",
    area: "next.config.ts, .env.local, .env.example",
    skills: ["project-analyzer", "version-bump"],
    cycle: ["deploying", "monitoring", "incident"],
    deliverable: "Build de 9 rutas + .env.example sin secretos en Git",
  },
  {
    agentType: "designer",
    task: "Ajustando el sistema de diseno y los tokens de la marca",
    area: "src/app/globals.css, src/components/ui",
    skills: ["design-system", "ui-ux-pro-max", "brand", "emil-design-eng"],
    cycle: ["designing", "presenting", "critiquing"],
    deliverable: "Azul construccion #1a3a5c + teal #2a8fb5, 13 componentes UI",
  },
  {
    agentType: "product-manager",
    task: "Definiendo el flujo de proforma: seleccion visual, precio y PDF",
    area: "src/app/proformas, tipos de proforma",
    skills: ["doc-coauthoring", "make-plan", "what-the"],
    cycle: ["planning", "presenting", "discovering"],
    deliverable: "Constructor de proforma con personalizacion en vivo",
  },
  {
    agentType: "qa-engineer",
    task: "Verificando las 9 rutas y el type-check del proyecto",
    area: "scripts/check-jsx-balance.mjs, tsc",
    skills: ["webapp-testing", "playwright-cli", "code-review"],
    cycle: ["testing", "hunting", "verifying"],
    deliverable: "7/7 rutas publicas en 200 + tsc sin errores",
  },
  {
    agentType: "security-engineer",
    task: "Auditando RLS, permisos de Storage y exposicion de claves",
    area: "supabase-schema.sql, .gitignore",
    skills: ["webhook-verifier", "code-review"],
    cycle: ["auditing", "hunting", "monitoring"],
    deliverable: "is_admin() SECURITY DEFINER + .env* ignorado por git",
  },
  {
    agentType: "data-engineer",
    task: "Modelando materiales, maderas, precios por unidad y stock",
    area: "supabase-schema.sql, src/lib/validations.ts",
    skills: ["project-analyzer", "make-plan"],
    cycle: ["piping", "modeling", "debugging"],
    deliverable: "10 tablas + 8 maderas + 6 categorias sembradas",
  },
  {
    agentType: "mobile-developer",
    task: "Construyendo el reproductor hibrido Video + 3D + AR",
    area: "src/components/gallery-3d/Video3DPlayer.tsx",
    skills: ["animate-expo", "apple-design", "animation-performance"],
    cycle: ["building", "debugging", "testing"],
    deliverable: "Reproductor con Three.js, WebXR y vista previa pre-subida",
  },
  {
    agentType: "ml-engineer",
    task: "Evaluando busqueda y precios dinamicos por material",
    area: "src/app/catalogo (pendiente)",
    skills: ["project-analyzer", "smart-explore"],
    cycle: ["training", "experimenting", "optimizing"],
    deliverable: "Analizador de precio por material (base + upgrade)",
  },
  {
    agentType: "sre",
    task: "Monitoreando salud de rutas y tiempos de respuesta",
    area: "health checks, logs del dev server",
    skills: ["improve-animations", "review-animations", "standup"],
    cycle: ["monitoring", "incident", "planning"],
    deliverable: "Health check de 8 rutas con codigo y latencia",
  },
]

export interface PlanPhase {
  phase: string
  title: string
  status: "done" | "in-progress" | "pending"
  tasks: Array<{ text: string; done: boolean }>
}

export const PLAN_PHASES: PlanPhase[] = [
  {
    phase: "Fase 0",
    title: "Documentacion y preparacion",
    status: "done",
    tasks: [
      { text: "101 skills instaladas globalmente (OpenCode + Agents)", done: true },
      { text: "13 avatares de agentes generados (Bible Strong Avatar Lab)", done: true },
      { text: "Limora MCP conectado para imagenes de marca", done: true },
      { text: "Plan de 5 fases escrito y versionado", done: true },
    ],
  },
  {
    phase: "Fase 1",
    title: "Fundacion y autenticacion",
    status: "done",
    tasks: [
      { text: "Next.js 16.4.2 + TypeScript + Tailwind v4", done: true },
      { text: "Supabase Auth con @supabase/ssr y middleware", done: true },
      { text: "Esquema de 10 tablas con RLS y datos iniciales", done: true },
      { text: "Fix de recursion RLS con is_admin() SECURITY DEFINER", done: true },
      { text: "Trigger handle_new_user (primer usuario = admin)", done: true },
      { text: "Login y registro con OAuth (Google / GitHub)", done: true },
    ],
  },
  {
    phase: "Fase 2",
    title: "Panel de administracion",
    status: "in-progress",
    tasks: [
      { text: "Dashboard con stats, alertas y feed de agentes", done: true },
      { text: "CRUD de catalogo (listar / crear / editar)", done: false },
      { text: "Gestion de materiales y maderas", done: false },
      { text: "Listado y gestion de proformas", done: false },
      { text: "Subida de videos 3D con vista previa", done: false },
      { text: "Configuracion de empresa y numeracion de proformas", done: false },
    ],
  },
  {
    phase: "Fase 3",
    title: "Portal de cliente y catalogo publico",
    status: "in-progress",
    tasks: [
      { text: "Catalogo con filtros (categoria, madera, precio, orden)", done: true },
      { text: "Galeria 3D con reproductor hibrido y WebXR/AR", done: true },
      { text: "Constructor de proformas visual (carrito + personalizacion)", done: true },
      { text: "Ficha de producto con visor 3D y calculadora de precio", done: false },
      { text: "Dashboard de cliente y perfil", done: false },
      { text: "Subida de imagenes propias por el cliente (Storage)", done: false },
    ],
  },
  {
    phase: "Fase 4",
    title: "Despliegue y acabado",
    status: "pending",
    tasks: [
      { text: "Build de produccion verde (9 rutas)", done: true },
      { text: "Deploy en Vercel con variables de entorno", done: false },
      { text: "Buckets de Storage (furniture-images, videos, pdfs, logos)", done: false },
      { text: "Generacion de PDF con el formato del app Android de referencia", done: false },
      { text: "Logo de marca en public/ (pendiente: archivo manual)", done: false },
    ],
  },
]

export interface MemoryRepo {
  name: string
  url: string
  localPath: string
  note: string
}

export const MEMORY_REPOS: MemoryRepo[] = [
  {
    name: "vercel-labs/skills",
    url: "https://github.com/vercel-labs/skills.git",
    localPath: "C:\\Users\\USER\\vercel-skills",
    note: "CLI de skills del ecosistema open agent-skills",
  },
  {
    name: "anthropics/claude-plugins-official",
    url: "https://github.com/anthropics/claude-plugins-official.git",
    localPath: "C:\\Users\\USER\\anthropic-plugins",
    note: "Marketplace oficial de plugins y skills de Anthropic",
  },
  {
    name: "vercel-labs/agent-skills",
    url: "via npx skills add",
    localPath: "~/.agents/skills",
    note: "Set de skills de Vercel (React, Next, UI review)",
  },
  {
    name: "anthropics/skills",
    url: "via npx skills add",
    localPath: "~/.agents/skills",
    note: "Skills de documentos, diseno y ejemplos",
  },
  {
    name: "Leonxlnx/taste-skill",
    url: "via npx skills add",
    localPath: "~/.agents/skills",
    note: "Estilos de diseno 'taste' (opt-in, elegir uno por proyecto)",
  },
  {
    name: "microsoft/playwright-cli",
    url: "via npx skills add",
    localPath: "~/.agents/skills",
    note: "Automatizacion de navegador para QA",
  },
  {
    name: "smontlouis/bible-strong-avatar-lab",
    url: "https://github.com/smontlouis/bible-strong-avatar-lab",
    localPath: "C:\\Users\\USER\\bible-strong-avatar-lab",
    note: "Generador procedural de avatares SVG para los 13 agentes",
  },
]

export interface MemoryRule {
  title: string
  detail?: string
  kind: "regla" | "comando" | "referencia"
  code?: string
}

export const MEMORY_RULES: MemoryRule[] = [
  {
    kind: "regla",
    title: "Preferir skills instaladas sobre boilerplate generico",
    detail:
      "En cada proyecto: React/Next.js -> vercel-*; docs/office -> docx/pdf/pptx/xlsx; revision de UI -> web-design-guidelines; testing -> playwright-cli.",
  },
  {
    kind: "regla",
    title: "Una sola skill de estilo por proyecto",
    detail:
      "Las skills *-taste / *-ui / high-end-visual-design son opt-in: elegir exactamente una, por nombre.",
  },
  {
    kind: "regla",
    title: "Next.js 16 no es el que conoces",
    detail:
      "Leer node_modules/next/dist/docs/ antes de escribir codigo. cookies() es Promise, searchParams es Promise, el middleware se renombro a proxy.",
  },
  {
    kind: "regla",
    title: "Radix Slot exige un solo hijo",
    detail:
      "En componentes con asChild, usar Slottable o envolver el contenido: un hijo false cuenta como segundo hijo y revienta el render.",
  },
  {
    kind: "comando",
    title: "Reinstalar / actualizar todas las skills",
    code: "npx skills add vercel-labs/agent-skills -g\nnpx skills add anthropics/skills -g\nnpx skills update -y",
  },
  {
    kind: "comando",
    title: "Verificar instalacion",
    code: "npx skills ls -g\nopencode mcp list",
  },
  {
    kind: "comando",
    title: "Regenerar los 13 avatares",
    code: "cd bible-strong-avatar-lab\nnpx pnpm install\nnode generate-agent-avatars.mjs",
  },
  {
    kind: "comando",
    title: "Regenerar el catalogo de skills de esta pagina",
    code: "cd construction-furniture-webapp\nnode scripts/generate-skills-data.mjs",
  },
  {
    kind: "referencia",
    title: "Memoria persistente",
    detail:
      "C:\\Users\\USER\\Cerebro\\skills-installed.md — catalogo completo de skills, avatares, MCP y comandos.",
  },
  {
    kind: "referencia",
    title: "Plan del proyecto",
    detail:
      "C:\\Users\\USER\\plans\\01-construction-furniture-webapp.md — 5 fases, esquema de datos y checklist.",
  },
]

export const STACK = [
  { label: "Framework", value: "Next.js 16.4.2 (App Router, Turbopack)" },
  { label: "Lenguaje", value: "TypeScript 5 + React 19" },
  { label: "Estilos", value: "Tailwind CSS v4 + shadcn/ui (Radix)" },
  { label: "Backend", value: "Supabase (Auth + Postgres + RLS + Storage)" },
  { label: "3D / Video", value: "Three.js + React Three Fiber + drei + WebXR" },
  { label: "Movimiento", value: "GSAP + CSS + canvas 2D para avatares" },
  { label: "Datos cliente", value: "TanStack Query + sonner + next-themes" },
  { label: "MCP", value: "Limora (generacion de imagenes de marca)" },
  { label: "Deploy", value: "Vercel" },
  { label: "Repo", value: "github.com/Erick20068/Mani_construction" },
]
