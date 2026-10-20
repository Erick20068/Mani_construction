// opencode enciende el taller
import type { AgentType } from "@/types"

/**
 * Los 13 agentes del equipo de OpenCode y lo que hacen dentro del taller.
 * Cada uno tiene su escritorio, su animacion propia y su estado vivo.
 */
export interface WorkshopAgent {
  agentType: AgentType
  /** Nombre visible */
  name: string
  /** Rol / titulo */
  role: string
  /** Tarea concreta que ejecuta ahora mismo */
  task: string
  /** Area del proyecto que toca */
  area: string
  /** Skills que usa */
  skills: string[]
  /** Animacion por defecto (nombre real del avatar) */
  animation: string
  /** Estados que va rotando en vivo */
  cycle: string[]
  /** Color de neon del escritorio */
  neon: string
  /** Posicion en la sala (x, z) y rotacion */
  position: [number, number, number]
}

const NEON = {
  cyan: "#22d3ee",
  magenta: "#e879f9",
  lime: "#a3e635",
  amber: "#fbbf24",
  violet: "#a78bfa",
  rose: "#fb7185",
  emerald: "#34d399",
  orange: "#fb923c",
  sky: "#38bdf8",
  teal: "#2dd4bf",
  indigo: "#818cf8",
  pink: "#f472b6",
}

export const WORKSHOP_AGENTS: WorkshopAgent[] = [
  {
    agentType: "tech-lead",
    name: "Tech Lead",
    role: "Lider Tecnico",
    task: "Coordinando las fases y revisando los merges",
    area: "Arquitectura global",
    skills: ["make-plan", "do", "standup"],
    animation: "leading",
    cycle: ["leading", "reviewing", "mentoring"],
    neon: NEON.violet,
    position: [0, 0, -7.5],
  },
  {
    agentType: "senior-developer",
    name: "Senior Developer",
    role: "Arquitecto de Codigo",
    task: "Programando el motor de la oficina 3D",
    area: "src/components/office",
    skills: ["vercel-react-best-practices", "code-review"],
    animation: "coding",
    cycle: ["coding", "reviewing", "debugging"],
    neon: NEON.cyan,
    position: [-6.2, 0, -7.5],
  },
  {
    agentType: "backend-developer",
    name: "Backend Developer",
    role: "Ingeniero de Sistemas",
    task: "Arquitectando las politicas RLS de Supabase",
    area: "src/lib/supabase-server.ts",
    skills: ["project-analyzer", "smart-explore"],
    animation: "architecting",
    cycle: ["architecting", "optimizing", "debugging"],
    neon: NEON.emerald,
    position: [6.2, 0, -7.5],
  },
  {
    agentType: "frontend-developer",
    name: "Frontend Developer",
    role: "Especialista UI/UX",
    task: "Animando el reproductor hibrido Video + 3D",
    area: "src/components/gallery-3d",
    skills: ["frontend-design", "animate", "ui-styling"],
    animation: "animating",
    cycle: ["animating", "designing", "reviewing"],
    neon: NEON.magenta,
    position: [-12.4, 0, -7.5],
  },
  {
    agentType: "devops-engineer",
    name: "DevOps Engineer",
    role: "Automatizador de Infraestructura",
    task: "Desplegando el build en el pipeline",
    area: "next.config.ts / Vercel",
    skills: ["project-analyzer", "version-bump"],
    animation: "deploying",
    cycle: ["deploying", "monitoring", "incident"],
    neon: NEON.amber,
    position: [12.4, 0, -7.5],
  },
  {
    agentType: "designer",
    name: "Product Designer",
    role: "Disenador de Experiencia",
    task: "Disenando el neon de la sala y los iconos",
    area: "src/app/globals.css",
    skills: ["design-system", "ui-ux-pro-max", "emil-design-eng"],
    animation: "designing",
    cycle: ["designing", "presenting", "critiquing"],
    neon: NEON.pink,
    position: [-6.2, 0, -1.5],
  },
  {
    agentType: "product-manager",
    name: "Product Manager",
    role: "Estratega de Producto",
    task: "Planificando el sprint del cliente",
    area: "src/app/proformas",
    skills: ["doc-coauthoring", "make-plan", "what-the"],
    animation: "planning",
    cycle: ["planning", "presenting", "discovering"],
    neon: NEON.lime,
    position: [6.2, 0, -1.5],
  },
  {
    agentType: "qa-engineer",
    name: "QA Engineer",
    role: "Guardian de Calidad",
    task: "Probando las 9 rutas del build",
    area: "scripts / e2e",
    skills: ["webapp-testing", "playwright-cli", "code-review"],
    animation: "testing",
    cycle: ["testing", "hunting", "verifying"],
    neon: NEON.sky,
    position: [-12.4, 0, -1.5],
  },
  {
    agentType: "data-engineer",
    name: "Data Engineer",
    role: "Arquitecto de Datos",
    task: "Modelando el esquema de materiales y stock",
    area: "supabase-schema.sql",
    skills: ["project-analyzer", "make-plan"],
    animation: "modeling",
    cycle: ["modeling", "piping", "debugging"],
    neon: NEON.teal,
    position: [12.4, 0, -1.5],
  },
  {
    agentType: "security-engineer",
    name: "Security Engineer",
    role: "Guardian de Seguridad",
    task: "Auditando permisos y exposicion de claves",
    area: "RLS / Storage / .env",
    skills: ["webhook-verifier", "code-review"],
    animation: "auditing",
    cycle: ["auditing", "hunting", "monitoring"],
    neon: NEON.rose,
    position: [-6.2, 0, 4.5],
  },
  {
    agentType: "mobile-developer",
    name: "Mobile Developer",
    role: "Desarrollador Movil",
    task: "Construyendo la vista AR con WebXR",
    area: "src/components/gallery-3d",
    skills: ["animate-expo", "apple-design", "animation-performance"],
    animation: "building",
    cycle: ["building", "debugging", "testing"],
    neon: NEON.orange,
    position: [6.2, 0, 4.5],
  },
  {
    agentType: "ml-engineer",
    name: "ML Engineer",
    role: "Ingeniero de Machine Learning",
    task: "Entrenando el calculador de precios por material",
    area: "src/app/catalogo",
    skills: ["project-analyzer", "smart-explore"],
    animation: "training",
    cycle: ["training", "experimenting", "optimizing"],
    neon: NEON.indigo,
    position: [-12.4, 0, 4.5],
  },
  {
    agentType: "sre",
    name: "Site Reliability Engineer",
    role: "Ingeniero de Confiabilidad",
    task: "Monitoreando la salud de las rutas en vivo",
    area: "health checks / logs",
    skills: ["improve-animations", "standup", "review-animations"],
    animation: "monitoring",
    cycle: ["monitoring", "incident", "planning"],
    neon: "#c084fc",
    position: [12.4, 0, 4.5],
  },
]

/** Etiquetas y colores de cada estado vivo */
export const STATE_META: Record<
  string,
  { label: string; color: string; glow: string }
> = {
  idle: { label: "Disponible", color: "#22c55e", glow: "#4ade80" },
  coding: { label: "Programando", color: "#3b82f6", glow: "#60a5fa" },
  reviewing: { label: "Revisando", color: "#a855f7", glow: "#c084fc" },
  debugging: { label: "Depurando", color: "#f97316", glow: "#fb923c" },
  architecting: { label: "Arquitecturando", color: "#0ea5e9", glow: "#38bdf8" },
  optimizing: { label: "Optimizando", color: "#10b981", glow: "#34d399" },
  piping: { label: "Modelando datos", color: "#06b6d4", glow: "#22d3ee" },
  modeling: { label: "Modelando", color: "#06b6d4", glow: "#22d3ee" },
  designing: { label: "Disenando", color: "#ec4899", glow: "#f472b6" },
  presenting: { label: "Presentando", color: "#6366f1", glow: "#818cf8" },
  critiquing: { label: "Criticando", color: "#f43f5e", glow: "#fb7185" },
  deploying: { label: "Desplegando", color: "#84cc16", glow: "#a3e635" },
  monitoring: { label: "Monitoreando", color: "#14b8a6", glow: "#2dd4bf" },
  incident: { label: "Incidente", color: "#ef4444", glow: "#f87171" },
  animating: { label: "Animando", color: "#8b5cf6", glow: "#a78bfa" },
  training: { label: "Entrenando", color: "#d946ef", glow: "#e879f9" },
  experimenting: { label: "Experimentando", color: "#c026d3", glow: "#e879f9" },
  building: { label: "Construyendo", color: "#3b82f6", glow: "#60a5fa" },
  testing: { label: "Probando", color: "#22c55e", glow: "#4ade80" },
  planning: { label: "Planificando", color: "#f59e0b", glow: "#fbbf24" },
  discovering: { label: "Descubriendo", color: "#eab308", glow: "#facc15" },
  hunting: { label: "Rastreando", color: "#ea580c", glow: "#fb923c" },
  verifying: { label: "Verificando", color: "#059669", glow: "#34d399" },
  auditing: { label: "Auditando", color: "#dc2626", glow: "#f87171" },
  leading: { label: "Liderando", color: "#7c3aed", glow: "#a78bfa" },
  mentoring: { label: "Mentoreando", color: "#0284c7", glow: "#38bdf8" },
}
