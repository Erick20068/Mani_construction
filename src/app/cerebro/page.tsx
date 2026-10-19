"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { AgentAvatar } from "@/components/agent-avatars/AgentAvatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Circle,
  Clock,
  Code2,
  Database,
  FileCode2,
  Loader2,
  Package,
  Radio,
  Search,
  Server,
  Sparkles,
  Terminal,
  Users,
  Wrench,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SKILLS, SKILL_CATEGORIES } from "@/data/skills-data"
import {
  CEREBRO_AGENTS,
  MEMORY_REPOS,
  MEMORY_RULES,
  PLAN_PHASES,
  STACK,
  type AgentStatus,
} from "@/data/cerebro-data"

const STATUS_META: Record<
  AgentStatus,
  { label: string; color: string; dot: string }
> = {
  idle: { label: "Disponible", color: "text-green-600", dot: "bg-green-500" },
  coding: { label: "Programando", color: "text-blue-600", dot: "bg-blue-500" },
  reviewing: { label: "Revisando", color: "text-purple-600", dot: "bg-purple-500" },
  debugging: { label: "Depurando", color: "text-orange-600", dot: "bg-orange-500" },
  architecting: { label: "Arquitecturando", color: "text-sky-600", dot: "bg-sky-500" },
  optimizing: { label: "Optimizando", color: "text-emerald-600", dot: "bg-emerald-500" },
  piping: { label: "Modelando datos", color: "text-cyan-600", dot: "bg-cyan-500" },
  modeling: { label: "Modelando", color: "text-cyan-600", dot: "bg-cyan-500" },
  designing: { label: "Disenando", color: "text-pink-600", dot: "bg-pink-500" },
  presenting: { label: "Presentando", color: "text-indigo-600", dot: "bg-indigo-500" },
  critiquing: { label: "Criticando", color: "text-rose-600", dot: "bg-rose-500" },
  deploying: { label: "Desplegando", color: "text-lime-600", dot: "bg-lime-500" },
  monitoring: { label: "Monitoreando", color: "text-teal-600", dot: "bg-teal-500" },
  incident: { label: "Incidente", color: "text-red-600", dot: "bg-red-500" },
  animating: { label: "Animando", color: "text-violet-600", dot: "bg-violet-500" },
  training: { label: "Entrenando", color: "text-fuchsia-600", dot: "bg-fuchsia-500" },
  experimenting: { label: "Experimentando", color: "text-purple-600", dot: "bg-purple-500" },
  building: { label: "Construyendo", color: "text-blue-600", dot: "bg-blue-500" },
  testing: { label: "Probando", color: "text-green-600", dot: "bg-green-500" },
  planning: { label: "Planificando", color: "text-amber-600", dot: "bg-amber-500" },
  discovering: { label: "Descubriendo", color: "text-yellow-600", dot: "bg-yellow-500" },
  hunting: { label: "Rastreando", color: "text-orange-600", dot: "bg-orange-500" },
  verifying: { label: "Verificando", color: "text-emerald-600", dot: "bg-emerald-500" },
  auditing: { label: "Auditando", color: "text-red-600", dot: "bg-red-500" },
  leading: { label: "Liderando", color: "text-indigo-600", dot: "bg-indigo-500" },
  mentoring: { label: "Mentoreando", color: "text-sky-600", dot: "bg-sky-500" },
}

const CATEGORY_META: Record<string, { label: string; icon: string; color: string }> = {
  motion: { label: "Motion", icon: "M", color: "bg-violet-500" },
  design: { label: "Diseno", icon: "D", color: "bg-pink-500" },
  review: { label: "Review", icon: "R", color: "bg-amber-500" },
  architecture: { label: "Arquitectura", icon: "A", color: "bg-sky-500" },
  memory: { label: "Memoria", icon: "S", color: "bg-teal-500" },
  commerce: { label: "Comercio", icon: "$", color: "bg-emerald-500" },
  documents: { label: "Documentos", icon: "W", color: "bg-blue-500" },
  workflow: { label: "Workflow", icon: "F", color: "bg-indigo-500" },
  art: { label: "Arte", icon: "C", color: "bg-fuchsia-500" },
  tooling: { label: "Tooling", icon: "T", color: "bg-slate-500" },
  general: { label: "General", icon: "G", color: "bg-slate-500" },
}

export default function CerebroPage() {
  return (
    <Suspense fallback={<CerebroSkeleton />}>
      <CerebroContent />
    </Suspense>
  )
}

function CerebroSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando Cerebro...</p>
        </div>
      </div>
    </div>
  )
}

function CerebroContent() {
  const [tick, setTick] = useState(0)
  const [skillQuery, setSkillQuery] = useState("")
  const [skillCategory, setSkillCategory] = useState<string>("todas")
  const [clock, setClock] = useState<string>("--:--:--")
  const [routeHealth, setRouteHealth] = useState<
    Array<{ route: string; status: number; ms: number }>
  >([])

  // Reloj: solo en cliente (new Date() en render rompe el prerender)
  useEffect(() => {
    const update = () =>
      setClock(
        new Date().toLocaleTimeString("es-PE", { hour12: false })
      )
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  // Reloj / ciclo de los agentes
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 4000)
    return () => clearInterval(id)
  }, [])

  // Health check de rutas
  useEffect(() => {
    let cancelled = false
    const routes = ["/", "/catalogo", "/galeria-3d", "/proformas", "/demo-3d", "/login", "/register"]
    async function check() {
      const results = await Promise.all(
        routes.map(async (route) => {
          const start = performance.now()
          try {
            const res = await fetch(route, { cache: "no-store" })
            return { route, status: res.status, ms: Math.round(performance.now() - start) }
          } catch {
            return { route, status: 0, ms: 0 }
          }
        })
      )
      if (!cancelled) setRouteHealth(results)
    }
    check()
    const id = setInterval(check, 20000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  const filteredSkills = useMemo(() => {
    const q = skillQuery.trim().toLowerCase()
    return SKILLS.filter((skill) => {
      const byCategory = skillCategory === "todas" || skill.category === skillCategory
      const byQuery =
        !q ||
        skill.name.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q)
      return byCategory && byQuery
    })
  }, [skillQuery, skillCategory])

  const usedCount = SKILLS.filter((s) => s.usedInProject).length
  const doneTasks = PLAN_PHASES.reduce(
    (acc, phase) => acc + phase.tasks.filter((t) => t.done).length,
    0
  )
  const totalTasks = PLAN_PHASES.reduce((acc, phase) => acc + phase.tasks.length, 0)
  const healthyRoutes = routeHealth.filter((r) => r.status === 200).length

  return (
    <div className="min-h-screen bg-background">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Cerebro</h1>
                <p className="text-xs text-muted-foreground">
                  Memoria, skills y estado en vivo del equipo de agentes
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Users className="h-3 w-3" />
                {CEREBRO_AGENTS.length} agentes
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Wrench className="h-3 w-3" />
                {SKILLS.length} skills
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {doneTasks}/{totalTasks} tareas
              </Badge>
              {routeHealth.length > 0 && (
                <Badge
                  variant={healthyRoutes === routeHealth.length ? "default" : "destructive"}
                  className="gap-1"
                >
                  <Radio className="h-3 w-3" />
                  {healthyRoutes}/{routeHealth.length} rutas
                </Badge>
              )}
              <Badge variant="outline" className="gap-1 font-mono">
                <Clock className="h-3 w-3" />
                {clock}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="agentes">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="agentes" className="gap-2">
              <Users className="h-4 w-4" />
              Agentes
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-2">
              <Wrench className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="memoria" className="gap-2">
              <Brain className="h-4 w-4" />
              Memoria
            </TabsTrigger>
            <TabsTrigger value="progreso" className="gap-2">
              <Activity className="h-4 w-4" />
              Progreso
            </TabsTrigger>
          </TabsList>

          {/* ===== AGENTES ===== */}
          <TabsContent value="agentes">
            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {CEREBRO_AGENTS.map((agent, index) => {
                  const status = agent.cycle[tick % agent.cycle.length]
                  const meta = STATUS_META[status]
                  return (
                    <Card
                      key={agent.agentType}
                      className="group relative overflow-hidden transition-shadow hover:shadow-lg"
                    >
                      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-transparent" />
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="shrink-0">
                            <AgentAvatar
                              agentType={agent.agentType}
                              status={status}
                              size={96}
                              showName={false}
                              showTitle={false}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-sm leading-tight">
                                {agent.agentType
                                  .split("-")
                                  .map((w) => w[0].toUpperCase() + w.slice(1))
                                  .join(" ")}
                              </h3>
                              <span
                                className={cn(
                                  "mt-1 h-2 w-2 shrink-0 rounded-full",
                                  meta.dot,
                                  "animate-pulse"
                                )}
                              />
                            </div>
                            <p className={cn("text-xs font-medium", meta.color)}>
                              {meta.label}
                            </p>
                            <p className="mt-1.5 text-xs text-muted-foreground leading-snug line-clamp-3">
                              {agent.task}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2 border-t border-border pt-3">
                          <div className="flex items-start gap-2 text-xs">
                            <FileCode2 className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                            <span className="text-muted-foreground">{agent.area}</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                            <span className="text-muted-foreground">{agent.deliverable}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1">
                          {agent.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] text-primary"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Panel lateral: feed en vivo */}
              <aside className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4 text-primary" />
                      Feed de actividad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 max-h-[420px] overflow-y-auto custom-scrollbar">
                      {CEREBRO_AGENTS.map((agent, index) => {
                        const status = agent.cycle[(tick + index) % agent.cycle.length]
                        const meta = STATUS_META[status]
                        return (
                          <div
                            key={agent.agentType}
                            className="flex gap-2 rounded-lg p-2 text-xs transition-colors hover:bg-accent/40"
                          >
                            <span
                              className={cn(
                                "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                                meta.dot
                              )}
                            />
                            <div className="min-w-0">
                              <span className="font-medium">
                                {agent.agentType.split("-")[0]}
                              </span>{" "}
                              <span className="text-muted-foreground">
                                {meta.label.toLowerCase()}
                              </span>
                              <p className="text-muted-foreground/80 line-clamp-2">
                                {agent.task}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Server className="h-4 w-4 text-primary" />
                      Salud de rutas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-1.5">
                    {routeHealth.length === 0 ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Comprobando...
                      </div>
                    ) : (
                      routeHealth.map((r) => (
                        <div
                          key={r.route}
                          className="flex items-center justify-between rounded-md px-2 py-1 text-xs font-mono hover:bg-accent/40"
                        >
                          <span className="flex items-center gap-2">
                            {r.status === 200 ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                            )}
                            {r.route}
                          </span>
                          <span className="text-muted-foreground">
                            {r.status} · {r.ms}ms
                          </span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </aside>
            </div>
          </TabsContent>

          {/* ===== SKILLS ===== */}
          <TabsContent value="skills">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-primary" />
                      Catalogo de skills instaladas
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {SKILLS.length} skills globales · {usedCount} usadas en este
                      proyecto · instaladas en <code className="text-xs">~/.config/opencode/skills</code> y{" "}
                      <code className="text-xs">~/.agents/skills</code>
                    </p>
                  </div>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={skillQuery}
                      onChange={(e) => setSkillQuery(e.target.value)}
                      placeholder="Buscar skill..."
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  <button
                    onClick={() => setSkillCategory("todas")}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      skillCategory === "todas"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    )}
                  >
                    Todas ({SKILLS.length})
                  </button>
                  {SKILL_CATEGORIES.map((cat) => {
                    const meta = CATEGORY_META[cat] || CATEGORY_META.general
                    const count = SKILLS.filter((s) => s.category === cat).length
                    return (
                      <button
                        key={cat}
                        onClick={() => setSkillCategory(cat)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                          skillCategory === cat
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-accent"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded text-[9px] font-bold text-white",
                            meta.color
                          )}
                        >
                          {meta.icon}
                        </span>
                        {meta.label} ({count})
                      </button>
                    )
                  })}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid gap-2 lg:grid-cols-2">
                  {filteredSkills.map((skill) => (
                    <div
                      key={skill.name}
                      className={cn(
                        "rounded-lg border border-border p-3 transition-colors hover:bg-accent/30",
                        skill.usedInProject && "border-primary/40 bg-primary/5"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 font-mono text-sm font-semibold">
                            {skill.name}
                            {skill.usedInProject && (
                              <Badge className="bg-primary/15 text-[10px] text-primary hover:bg-primary/15">
                                en uso
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground leading-snug line-clamp-3">
                            {skill.description}
                          </p>
                          {skill.usedInProject && (
                            <p className="mt-2 flex items-start gap-1.5 text-[11px] text-primary">
                              <Code2 className="mt-0.5 h-3 w-3 shrink-0" />
                              {skill.usedInProject}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 text-[10px] font-medium text-white",
                              (CATEGORY_META[skill.category] || CATEGORY_META.general).color
                            )}
                          >
                            {(CATEGORY_META[skill.category] || CATEGORY_META.general).label}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {skill.source}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredSkills.length === 0 && (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    Ninguna skill coincide con “{skillQuery}”
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== MEMORIA ===== */}
          <TabsContent value="memoria">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Repositorios de origen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {MEMORY_REPOS.map((repo) => (
                    <div
                      key={repo.name}
                      className="rounded-lg border border-border p-3"
                    >
                      <p className="font-mono text-sm font-semibold">{repo.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{repo.note}</p>
                      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Terminal className="h-3 w-3" />
                        {repo.localPath}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Reglas y comandos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {MEMORY_RULES.map((rule, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={rule.kind === "comando" ? "secondary" : "outline"}
                          className="text-[10px] uppercase"
                        >
                          {rule.kind}
                        </Badge>
                        <p className="text-sm font-semibold">{rule.title}</p>
                      </div>
                      {rule.detail && (
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                          {rule.detail}
                        </p>
                      )}
                      {rule.code && (
                        <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-2.5 text-[11px] leading-relaxed">
                          {rule.code}
                        </pre>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Stack tecnologico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {STACK.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg border border-border px-3 py-2"
                      >
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-sm font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===== PROGRESO ===== */}
          <TabsContent value="progreso">
            <div className="space-y-4">
              <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent border-primary/20">
                <CardContent className="py-5">
                  <div className="grid gap-4 sm:grid-cols-4 text-center">
                    <Metric
                      value={`${doneTasks}/${totalTasks}`}
                      label="Tareas completadas"
                      icon={CheckCircle2}
                    />
                    <Metric
                      value={`${PLAN_PHASES.filter((p) => p.status === "done").length}/${PLAN_PHASES.length}`}
                      label="Fases terminadas"
                      icon={Sparkles}
                    />
                    <Metric
                      value={`${CEREBRO_AGENTS.length}`}
                      label="Agentes activos"
                      icon={Users}
                    />
                    <Metric
                      value={`${SKILLS.length}`}
                      label="Skills disponibles"
                      icon={Wrench}
                    />
                  </div>
                </CardContent>
              </Card>

              {PLAN_PHASES.map((phase) => (
                <Card key={phase.phase}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Badge
                          variant={
                            phase.status === "done"
                              ? "default"
                              : phase.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {phase.phase}
                        </Badge>
                        {phase.title}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground">
                        {phase.tasks.filter((t) => t.done).length}/{phase.tasks.length}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1.5">
                      {phase.tasks.map((task, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm"
                        >
                          {task.done ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                          ) : (
                            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                          )}
                          <span
                            className={cn(
                              task.done
                                ? "text-muted-foreground line-through decoration-muted-foreground/40"
                                : "text-foreground"
                            )}
                          >
                            {task.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function Metric({
  value,
  label,
  icon: Icon,
}: {
  value: string | number
  label: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="p-3">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
