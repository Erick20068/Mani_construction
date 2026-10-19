/**
 * Genera src/data/skills-data.ts leyendo el frontmatter de cada SKILL.md
 * instalado globalmente (OpenCode + Agents) y clasificando por categoría.
 *
 *   node scripts/generate-skills-data.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const home = os.homedir()
const sources = [
  { dir: path.join(home, '.config', 'opencode', 'skills'), source: 'opencode' },
  { dir: path.join(home, '.agents', 'skills'), source: 'agents' },
]

// Categorías por prefijo / palabra clave del nombre
const CATEGORY_RULES = [
  [/^animate|^animation|^motion|^spring|^scroll-world|^title-sequence|^launch-video|^vox-explainer|^milestone|^newsletter-promo|^loop-cover|^model-showdown|^reel-export|^apple-launch-film|^reference-to-motion|^motion-/, 'motion'],
  [/^design|^ui-|^frontend-design|^canvas-design|^brand|^theme|^slide|^pptx|^wowerpoint|^banner|^emil|^break-ui|^apple-design|^stitch|^gpt-taste|^minimalist|^industrial|^high-end|^design-taste/, 'design'],
  [/^web-design|^writing-guidelines|^webapp-testing|^playwright|^code-review|^break-ui/, 'review'],
  [/^graphify|^pathfinder|^smart-explore|^learn-codebase|^standup|^handoff|^make-plan|^do$|^plan/, 'architecture'],
  [/^mem-search|^claude-mem|^knowledge-agent|^timeline-report|^weekly-digests|^how-it-works|^ccs-align|^mode-creator|^cloud-sync|^agent-cost-report/, 'memory'],
  [/^payment|^subscription|^tax-advisor|^webhook|^integration-builder|^doctor$|^project-analyzer/, 'commerce'],
  [/^docx|^pdf$|^xlsx|^internal-comms|^doc-coauthoring|^discord/, 'documents'],
  [/^make-plan|^do$|^babysit|^version-bump|^report$|^easyship/, 'workflow'],
  [/^algorithmic-art|^slack-gif|^stitch/, 'art'],
  [/^mcp-builder|^opencode$/, 'tooling'],
]

const usedInProject = {
  'vercel-react-best-practices': 'Optimización y patrones de rendimiento en React/Next',
  'frontend-design': 'Dirección visual de la landing y del panel admin',
  'ui-styling': 'Componentes shadcn/ui del design system',
  'web-design-guidelines': 'Auditoría de UI y accesibilidad',
  'animate': 'Animaciones de entrada y micro-interacciones',
  'animation-performance': 'Rendimiento de las animaciones de canvas/3D',
  'motion-effects': 'Efectos de movimiento premium del reproductor 3D',
  'apple-design': 'Transiciones y gestos del reproductor de video',
  'design-system': 'Tokens de color, tipografía y espaciado',
  'brand-guidelines': 'Paleta de marca del constructor',
  'brand': 'Tono de voz y coherencia de marca',
  'graphify': 'Mapa de conocimiento del proyecto',
  'pathfinder': 'Auditoría de arquitectura y flujos',
  'smart-explore': 'Búsqueda estructural en el código',
  'learn-codebase': 'Lectura completa del codebase al iniciar',
  'make-plan': 'Plan de 5 fases del proyecto',
  'do': 'Ejecución por fases del plan',
  'standup': 'Consolidación de trabajo entre sesiones',
  'handoff': 'Documento de traspaso de sesión',
  'mem-search': 'Memoria persistente entre proyectos',
  'knowledge-agent': 'Bases de conocimiento del proyecto',
  'timeline-report': 'Historial de desarrollo del proyecto',
  'project-analyzer': 'Detección de stack para integraciones',
  'webapp-testing': 'Pruebas de las rutas con Playwright',
  'playwright-cli': 'Automatización del navegador para QA',
  'code-review': 'Revisión de calidad del código',
  'docx': 'Documentos de entrega',
  'pdf': 'Generación de proformas en PDF',
  'wowerpoint': 'Presentación del proyecto',
  'slides': 'DECK de presentación comercial',
  'ui-ux-pro-max': 'Biblioteca de estilos y paletas',
  'emil-design-eng': 'Filosofía de detalle fino en la UI',
  'find-animation-opportunities': 'Auditoría de animaciones del reproductor',
  'improve-animations': 'Plan de mejoras de movimiento',
  'review-animations': 'Critica de animaciones existentes',
  'learning': 'Curva de aprendizaje',
}

function readFrontmatter(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8')
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!m) return null
    const body = m[1]
    const name = (body.match(/^name:\s*(.+)$/m) || [])[1]?.trim() || ''
    const description = (body.match(/^description:\s*([\s\S]+?)(?=\n[a-z-]+:|$)/m) || [])[1]?.trim() || ''
    return { name, description: description.replace(/\s+/g, ' ').replace(/["']/g, '') }
  } catch {
    return null
  }
}

function categorize(name) {
  for (const [re, cat] of CATEGORY_RULES) {
    if (re.test(name)) return cat
  }
  return 'general'
}

const skills = []
const seen = new Set()

for (const { dir, source } of sources) {
  if (!fs.existsSync(dir)) continue
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const name = entry.name
    if (seen.has(name)) continue

    const skillFile = path.join(dir, name, 'SKILL.md')
    if (!fs.existsSync(skillFile)) continue

    const fm = readFrontmatter(skillFile)
    if (!fm) continue

    seen.add(name)
    skills.push({
      name: fm.name || name,
      description: fm.description,
      category: categorize(name),
      source: source === 'opencode' ? 'OpenCode' : 'Agents',
      usedInProject: usedInProject[name] || null,
    })
  }
}

skills.sort((a, b) => a.name.localeCompare(b.name))

const out = `// Generado por scripts/generate-skills-data.mjs — no editar a mano.
// Reejecuta: node scripts/generate-skills-data.mjs

export interface SkillInfo {
  name: string
  description: string
  category: string
  source: "OpenCode" | "Agents"
  usedInProject: string | null
}

export const SKILLS: SkillInfo[] = ${JSON.stringify(skills, null, 2)}

export const SKILL_CATEGORIES = ${JSON.stringify(
  [...new Set(skills.map((s) => s.category))].sort()
)}
`

const target = path.join(process.cwd(), 'src', 'data', 'skills-data.ts')
fs.mkdirSync(path.dirname(target), { recursive: true })
fs.writeFileSync(target, out, 'utf8')

console.log(`OK -> ${target}`)
console.log(`${skills.length} skills exportadas`)
console.log(
  'Categorias:',
  [...new Set(skills.map((s) => s.category))].sort().join(', ')
)
