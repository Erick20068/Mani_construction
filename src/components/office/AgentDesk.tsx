// opencode enciende el taller
"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import {
  loadAvatarDefinition,
  renderAvatar,
  lerpExpression,
  type AvatarDefinition,
  type AvatarStep,
} from "@/lib/avatar-renderer"
import { AGENT_AVATARS } from "@/types"
import { STATE_META, type WorkshopAgent } from "@/data/workshop-data"

const SCREEN_SIZE = 256

/**
 * Pantalla de un escritorio: dibuja el avatar del agente en un canvas
 * y lo proyecta como textura en el monitor.
 */
function AgentScreen({
  agent,
  state,
  powered,
}: {
  agent: WorkshopAgent
  state: string
  powered: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const defRef = useRef<AvatarDefinition | null>(null)
  const stepIndex = useRef(0)
  const holdTime = useRef(0)
  const stepProgress = useRef(0)
  const clock = useRef(0)
  const nextBlinkAt = useRef(2)
  const blinkStartedAt = useRef(-1)
  const lastDraw = useRef(0)

  useEffect(() => {
    let cancelled = false
    loadAvatarDefinition(AGENT_AVATARS[agent.agentType].file)
      .then((def) => {
        if (!cancelled) defRef.current = def
      })
      .catch(() => {
        // si falla, el monitor se queda en negro
      })
    return () => {
      cancelled = true
    }
  }, [agent.agentType])

  // Textura + material
  const { material, canvas } = useMemo(() => {
    const c = document.createElement("canvas")
    c.width = SCREEN_SIZE
    c.height = SCREEN_SIZE
    const ctx = c.getContext("2d")!
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, SCREEN_SIZE, SCREEN_SIZE)

    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    textureRef.current = tex

    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      toneMapped: false,
      transparent: true,
    })

    return { material: mat, canvas: c }
  }, [])

  useEffect(() => {
    return () => {
      textureRef.current?.dispose()
      material.dispose()
    }
  }, [material])

  useFrame((_, delta) => {
    const def = defRef.current
    if (!def) return

    const dt = Math.min(delta, 0.1)
    clock.current += dt

    // Animacion activa segun el estado del agente
    const animation =
      def.animations[state] || def.animations[agent.animation] || def.animations.idle
    const steps: AvatarStep[] = animation?.steps || []

    if (steps.length > 0) {
      const currentStep = steps[stepIndex.current]
      const holdSeconds = (currentStep.holdMs ?? 3000) / 1000
      const transitionSeconds = (currentStep.transitionMs ?? 600) / 1000

      holdTime.current += dt
      if (holdTime.current < holdSeconds) {
        stepProgress.current = 0
      } else if (holdTime.current < holdSeconds + transitionSeconds) {
        stepProgress.current = (holdTime.current - holdSeconds) / transitionSeconds
      } else {
        stepIndex.current = (stepIndex.current + 1) % steps.length
        holdTime.current = 0
        stepProgress.current = 0
      }
    }

    // Parpadeo
    let blinkScale = 1
    if (clock.current >= nextBlinkAt.current) {
      blinkStartedAt.current = clock.current
      nextBlinkAt.current = clock.current + 3 + Math.random() * 3
    }
    if (blinkStartedAt.current >= 0) {
      const elapsed = clock.current - blinkStartedAt.current
      if (elapsed > 0.25) {
        blinkStartedAt.current = -1
      } else {
        blinkScale = Math.max(0, 1 - elapsed / 0.25)
      }
    }

    // Redibujado throttleado (~20fps) para no castigar la GPU
    if (clock.current - lastDraw.current < 0.05) return
    lastDraw.current = clock.current

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#03040c"
    ctx.fillRect(0, 0, SCREEN_SIZE, SCREEN_SIZE)

    if (!powered) {
      // Monitor apagado: solo un leve reflejo
      ctx.fillStyle = "#0a1020"
      ctx.fillRect(0, 0, SCREEN_SIZE, SCREEN_SIZE)
      if (textureRef.current) textureRef.current.needsUpdate = true
      return
    }

    const currentStep = steps[stepIndex.current]
    const nextStep = steps.length ? steps[(stepIndex.current + 1) % steps.length] : null
    const currentExpr =
      def.expressions[currentStep?.expression] || def.expressions.neutral
    const nextExpr = nextStep
      ? def.expressions[nextStep.expression] || currentExpr
      : currentExpr

    const expression =
      stepProgress.current > 0
        ? lerpExpression(currentExpr, nextExpr, stepProgress.current)
        : currentExpr

    // Fondo con el color neon del agente
    const glow = ctx.createRadialGradient(
      SCREEN_SIZE / 2,
      SCREEN_SIZE * 0.45,
      10,
      SCREEN_SIZE / 2,
      SCREEN_SIZE * 0.45,
      SCREEN_SIZE * 0.7
    )
    glow.addColorStop(0, "rgba(12,18,40,1)")
    glow.addColorStop(1, "rgba(2,4,12,1)")
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, SCREEN_SIZE, SCREEN_SIZE)

    renderAvatar(ctx, def, expression, SCREEN_SIZE, blinkScale)

    // Lineas de barrido (efecto CRT)
    ctx.fillStyle = "rgba(0,0,0,0.22)"
    for (let y = 0; y < SCREEN_SIZE; y += 4) {
      ctx.fillRect(0, y, SCREEN_SIZE, 1)
    }

    // Vigneta
    const vig = ctx.createRadialGradient(
      SCREEN_SIZE / 2,
      SCREEN_SIZE / 2,
      SCREEN_SIZE * 0.3,
      SCREEN_SIZE / 2,
      SCREEN_SIZE / 2,
      SCREEN_SIZE * 0.72
    )
    vig.addColorStop(0, "rgba(0,0,0,0)")
    vig.addColorStop(1, "rgba(0,0,0,0.65)")
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, SCREEN_SIZE, SCREEN_SIZE)

    if (textureRef.current) textureRef.current.needsUpdate = true
  })

  return (
    <mesh position={[0, 1.62, -0.28]} material={material}>
      <planeGeometry args={[1.28, 0.86]} />
    </mesh>
  )
}

/**
 * Escritorio completo de un agente: mesa, monitor con su avatar,
 * teclado, silla, tira de neon y placa identificativa.
 */
export function AgentDesk({
  agent,
  state,
  powered,
}: {
  agent: WorkshopAgent
  state: string
  powered: boolean
}) {
  const chairRef = useRef<THREE.Group>(null)
  const keysRef = useRef<THREE.Group>(null)
  const ledRef = useRef<THREE.Mesh>(null)
  const meta = STATE_META[state] || STATE_META.idle

  useFrame((state3d, delta) => {
    const t = state3d.clock.elapsedTime
    const working = powered && state !== "idle"

    // Silla: leve balanceo cuando trabaja
    if (chairRef.current) {
      const target = working ? Math.sin(t * 2.2 + agent.position[0]) * 0.035 : 0
      chairRef.current.rotation.y = THREE.MathUtils.damp(
        chairRef.current.rotation.y,
        target,
        4,
        delta
      )
    }

    // Teclado: tecleo
    if (keysRef.current) {
      const target = working ? Math.sin(t * 26 + agent.position[2]) * 0.012 : 0
      keysRef.current.position.y = THREE.MathUtils.damp(
        keysRef.current.position.y,
        target,
        20,
        delta
      )
    }

    // LED de estado
    if (ledRef.current) {
      const mat = ledRef.current.material as THREE.MeshBasicMaterial
      const pulse = working ? 0.6 + Math.abs(Math.sin(t * 3.4)) * 0.4 : 0.35
      mat.opacity = powered ? pulse : 0.08
    }
  })

  return (
    <group position={agent.position}>
      {/* Mesa */}
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.1, 1.35]} />
        <meshStandardMaterial color="#12162e" roughness={0.45} metalness={0.6} />
      </mesh>
      {/* Tira de neon bajo el borde de la mesa */}
      <mesh position={[0, 0.67, 0.66]}>
        <boxGeometry args={[2.5, 0.045, 0.045]} />
        <meshBasicMaterial
          color={agent.neon}
          transparent
          opacity={powered ? 0.95 : 0.08}
          toneMapped={false}
        />
      </mesh>

      {/* Patas */}
      {[-1.15, 1.15].map((x) => (
        <mesh key={x} position={[x, 0.36, 0]} castShadow>
          <boxGeometry args={[0.09, 0.72, 1.15]} />
          <meshStandardMaterial color="#0b0e1e" roughness={0.6} metalness={0.5} />
        </mesh>
      ))}

      {/* Monitor: base, brazo y marco */}
      <mesh position={[0, 0.83, -0.3]} castShadow>
        <boxGeometry args={[0.9, 0.06, 0.5]} />
        <meshStandardMaterial color="#0e1226" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, 1.1, -0.3]} castShadow>
        <boxGeometry args={[0.12, 0.52, 0.1]} />
        <meshStandardMaterial color="#0e1226" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, 1.62, -0.34]} castShadow>
        <boxGeometry args={[1.46, 1.0, 0.1]} />
        <meshStandardMaterial color="#0a0d1c" roughness={0.35} metalness={0.8} />
      </mesh>
      {/* Halo del monitor */}
      <pointLight
        position={[0, 1.62, 0.35]}
        intensity={powered ? 3.2 : 0}
        distance={3.4}
        decay={2}
        color={agent.neon}
      />

      {/* Pantalla con el avatar */}
      <AgentScreen agent={agent} state={state} powered={powered} />

      {/* Teclado */}
      <group ref={keysRef} position={[0, 0.8, 0.28]}>
        <mesh castShadow>
          <boxGeometry args={[1.0, 0.035, 0.32]} />
          <meshStandardMaterial color="#0c1024" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.022, 0]}>
          <boxGeometry args={[0.9, 0.008, 0.24]} />
          <meshBasicMaterial
            color={agent.neon}
            transparent
            opacity={powered ? 0.3 : 0.05}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Raton */}
      <mesh position={[0.75, 0.805, 0.3]} castShadow>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#0c1024" roughness={0.4} />
      </mesh>

      {/* Silla */}
      <group ref={chairRef} position={[0, 0, 0.95]}>
        <mesh position={[0, 0.48, 0]} castShadow>
          <boxGeometry args={[0.62, 0.09, 0.6]} />
          <meshStandardMaterial color="#141933" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.86, -0.26]} castShadow>
          <boxGeometry args={[0.62, 0.72, 0.08]} />
          <meshStandardMaterial color="#141933" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.24, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.48, 10]} />
          <meshStandardMaterial color="#0b0e1e" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.36, 0.4, 0.06, 16]} />
          <meshStandardMaterial color="#0b0e1e" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* LED de estado sobre el monitor */}
      <mesh ref={ledRef} position={[0.62, 2.16, -0.34]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial
          color={meta.glow}
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* Planta de escritorio */}
      <group position={[1.05, 0.79, -0.42]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.11, 0.09, 0.18, 10]} />
          <meshStandardMaterial color="#1b1030" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <coneGeometry args={[0.17, 0.42, 8]} />
          <meshStandardMaterial
            color="#14532d"
            emissive={agent.neon}
            emissiveIntensity={powered ? 0.55 : 0}
            roughness={0.8}
          />
        </mesh>
      </group>

      {/* Placa con el nombre */}
      <Html
        position={[0, 2.55, -0.3]}
        center
        distanceFactor={14}
        style={{ pointerEvents: "none" }}
      >
        <div className="whitespace-nowrap rounded-lg border border-white/10 bg-black/75 px-3 py-1.5 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: meta.glow,
                boxShadow: `0 0 8px ${meta.glow}`,
              }}
            />
            <span className="text-[11px] font-semibold text-white">{agent.name}</span>
            <span className="text-[10px] text-white/50">{agent.role}</span>
          </div>
          <div className="mt-0.5 max-w-[190px] truncate text-[10px] text-white/60">
            {agent.task}
          </div>
        </div>
      </Html>
    </group>
  )
}
