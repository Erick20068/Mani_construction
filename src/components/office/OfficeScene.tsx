// opencode enciende el taller
"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, AdaptiveDpr, Preload } from "@react-three/drei"
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"
import * as THREE from "three"
import { NeonRoom } from "./NeonRoom"
import { AgentDesk } from "./AgentDesk"
import { WORKSHOP_AGENTS, STATE_META } from "@/data/workshop-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Cpu,
  Lightbulb,
  Power,
  Radio,
  Terminal,
  Users,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const SECRET = "opencode enciende el taller"

export function OfficeScene({
  powered,
  tick,
}: {
  powered: boolean
  tick: number
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 15, 24], fov: 42, near: 0.1, far: 200 }}
    >
      <color attach="background" args={["#03040c"]} />
      <fog attach="fog" args={["#03040c", 28, 68]} />

      <ambientLight intensity={powered ? 0.22 : 0.04} color="#5b6fd6" />
      <hemisphereLight
        args={[powered ? "#2a3a8a" : "#0a0e24", powered ? "#0a0618" : "#02030a", powered ? 0.5 : 0.1]}
      />
      <directionalLight
        position={[12, 18, 10]}
        intensity={powered ? 0.9 : 0.05}
        color="#c7d2fe"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={60}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
      <pointLight position={[0, 6, 6]} intensity={powered ? 22 : 0} distance={40} color="#22d3ee" decay={2} />
      <pointLight position={[-14, 5, -6]} intensity={powered ? 16 : 0} distance={30} color="#e879f9" decay={2} />
      <pointLight position={[14, 5, -6]} intensity={powered ? 16 : 0} distance={30} color="#a855f7" decay={2} />

      <Suspense fallback={null}>
        <NeonRoom powered={powered} />

        {WORKSHOP_AGENTS.map((agent, index) => {
          const state = agent.cycle[(tick + index) % agent.cycle.length]
          return (
            <AgentDesk key={agent.agentType} agent={agent} state={state} powered={powered} />
          )
        })}

        <OrbitControls
          enablePan
          enableZoom
          minDistance={9}
          maxDistance={48}
          maxPolarAngle={Math.PI / 2.15}
          target={[0, 1.4, -1]}
          makeDefault
        />

        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={powered ? 1.15 : 0.35}
            luminanceThreshold={0.18}
            luminanceSmoothing={0.32}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.22} darkness={0.72} />
        </EffectComposer>

        <AdaptiveDpr pixelated />
        <Preload all />
      </Suspense>
    </Canvas>
  )
}

/** Capa de HUD: boton de encendido, consola y lista de agentes */
export function OfficeHud({
  powered,
  onPower,
  tick,
}: {
  powered: boolean
  onPower: () => void
  tick: number
}) {
  const [typed, setTyped] = useState("")
  const [consoleLines, setConsoleLines] = useState<string[]>([
    "taller$ esperando orden de encendido...",
  ])

  // Efecto de terminal al escribir la palabra secreta
  useEffect(() => {
    if (!powered) return
    let i = 0
    setTyped("")
    const id = setInterval(() => {
      i += 1
      setTyped(SECRET.slice(0, i))
      if (i >= SECRET.length) clearInterval(id)
    }, 55)
    return () => clearInterval(id)
  }, [powered])

  useEffect(() => {
    if (!powered) {
      setConsoleLines(["taller$ esperando orden de encendido..."])
      return
    }
    setConsoleLines([
      "$ " + SECRET,
      "-> 13 escritorios activados",
      "-> luces del taller encendidas",
      "-> agentes en linea: 13/13",
    ])
  }, [powered])

  const working = useMemo(
    () =>
      WORKSHOP_AGENTS.filter((a) => {
        const state = a.cycle[(tick + WORKSHOP_AGENTS.indexOf(a)) % a.cycle.length]
        return state !== "idle"
      }).length,
    [tick]
  )

  return (
    <>
      {/* Barra superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-start justify-between gap-4 p-5">
        <div className="pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10">
              <Cpu className="h-6 w-6 text-cyan-300" />
              <span
                className={cn(
                  "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full",
                  powered
                    ? "bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse"
                    : "bg-slate-600"
                )}
              />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                El Taller
              </h1>
              <p className="text-xs text-cyan-200/60">
                Espacio de trabajo de OpenCode · 13 agentes
              </p>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1.5 border-white/15 bg-black/60 text-white/80 backdrop-blur"
          >
            <Users className="h-3 w-3" />
            {working} trabajando
          </Badge>
          <Badge
            variant="outline"
            className="gap-1.5 border-white/15 bg-black/60 text-white/80 backdrop-blur"
          >
            <Radio className={cn("h-3 w-3", powered && "text-emerald-400 animate-pulse")} />
            {powered ? "en linea" : "sin corriente"}
          </Badge>
          <Button
            onClick={onPower}
            disabled={powered}
            className={cn(
              "gap-2 font-semibold shadow-lg",
              powered
                ? "bg-emerald-600/80 text-white"
                : "bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-500 text-white hover:from-cyan-400 hover:via-sky-400 hover:to-fuchsia-400"
            )}
          >
            {powered ? (
              <>
                <Lightbulb className="h-4 w-4" />
                Taller encendido
              </>
            ) : (
              <>
                <Power className="h-4 w-4" />
                Encender el taller
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Consola */}
      <div className="pointer-events-none absolute bottom-5 left-5 z-20 w-full max-w-md">
        <div className="rounded-xl border border-white/10 bg-black/75 p-4 font-mono text-xs backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-cyan-300/80">
            <Terminal className="h-3.5 w-3.5" />
            <span className="font-semibold">consola del taller</span>
            {powered && (
              <Zap className="ml-auto h-3.5 w-3.5 animate-pulse text-amber-300" />
            )}
          </div>
          {consoleLines.map((line, i) => (
            <p key={i} className="text-white/70">
              {line}
            </p>
          ))}
          {typed && (
            <p className="text-cyan-300">
              {typed}
              <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-cyan-300 align-middle" />
            </p>
          )}
        </div>
      </div>

      {/* Lista de agentes */}
      <div className="pointer-events-none absolute bottom-5 right-5 z-20 hidden max-h-[60vh] w-64 overflow-y-auto rounded-xl border border-white/10 bg-black/70 p-3 backdrop-blur lg:block">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Equipo en el taller
        </p>
        <div className="space-y-1">
          {WORKSHOP_AGENTS.map((agent, index) => {
            const state = agent.cycle[(tick + index) % agent.cycle.length]
            const meta = STATE_META[state] || STATE_META.idle
            return (
              <div key={agent.agentType} className="flex items-center gap-2 text-[11px]">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: meta.glow,
                    boxShadow: powered ? `0 0 6px ${meta.glow}` : "none",
                  }}
                />
                <span className="truncate text-white/85">{agent.name}</span>
                <span className="ml-auto shrink-0 text-white/40">{meta.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
