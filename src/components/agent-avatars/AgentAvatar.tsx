"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import type { AgentType } from "@/types"
import { AGENT_AVATARS, AGENT_STATUS_ANIMATIONS } from "@/types"

// Avatar definition structure from Bible Strong Avatar Lab
interface AvatarDefinition {
  schema: string
  schemaVersion: number
  name?: string
  body: {
    primary: {
      type: string
      width: number
      height: number
      depth: number
      roundness: number
      morphRoundness?: number
      tipRoundness?: number
      baseRoundness?: number
    }
    nodes: Array<{
      surface: any
      position: [number, number, number]
      rotation: [number, number, number]
    }>
  }
  colors: {
    body: string
    eyes: string
  }
  expressions: Record<string, any>
  expressionOrder: string[]
  animations: Record<string, any>
  animationOrder: string[]
}

export interface AgentAvatarProps {
  agentType: AgentType
  /** Estado generico (working/thinking...) o nombre directo de animacion */
  status?: string
  size?: number
  className?: string
  showName?: boolean
  showTitle?: boolean
  onClick?: () => void
}

/**
 * Resuelve el estado (working/thinking/...) a una animación concreta que
 * exista en el avatar. Cada avatar tiene sus propios nombres de animación
 * (coding, architecting, training...), asi que se busca la primera coincidencia.
 */
function resolveAnimation(avatarDef: AvatarDefinition, status: string): string {
  // 1. El estado es directamente una animacion de este avatar
  if (avatarDef.animations[status]) return status

  // 2. Buscar en el mapeo generico de estados
  const candidates = AGENT_STATUS_ANIMATIONS[status] || []
  for (const candidate of candidates) {
    if (avatarDef.animations[candidate]) return candidate
  }

  // 3. Primera animacion del ciclo
  return avatarDef.animationOrder?.[0] || "idle"
}

export function AgentAvatar({
  agentType,
  status = "idle",
  size = 120,
  className,
  showName = true,
  showTitle = true,
  onClick,
}: AgentAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [avatarDef, setAvatarDef] = useState<AvatarDefinition | null>(null)
  const [currentAnimation, setCurrentAnimation] = useState<string>("idle")
  const animationRef = useRef<number | undefined>(undefined)
  const avatarData = AGENT_AVATARS[agentType]

  // Load avatar definition
  useEffect(() => {
    let cancelled = false

    async function loadAvatar() {
      try {
        const response = await fetch(`/avatars/${avatarData.file}`)
        if (response.ok) {
          const def = await response.json()
          if (cancelled) return
          setAvatarDef(def)
          setCurrentAnimation(status)
        }
      } catch (error) {
        console.warn(`Failed to load avatar for ${agentType}:`, error)
      }
    }

    loadAvatar()
    return () => {
      cancelled = true
    }
  }, [agentType, avatarData.file, status])

  // Update animation when status changes
  useEffect(() => {
    if (avatarDef && avatarDef.animations[status]) {
      setCurrentAnimation(status)
    }
  }, [status, avatarDef])

  // Animation loop:，表情 + parpadeo
  useEffect(() => {
    if (!avatarDef || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    // Referencia local para mantener el narrowing de tipos dentro del closure
    const def = avatarDef
    const animationName = resolveAnimation(def, currentAnimation)

    const animation =
      def.animations[animationName] ||
      def.animations[def.animationOrder?.[0]] ||
      def.animations.idle

    if (!animation) return

    const steps: any[] = animation.steps || []
    if (steps.length === 0) return

    const blink = animation.blink || {}
    const blinkEnabled = blink.enabled !== false

    let stepIndex = 0
    let holdTime = 0
    let stepProgress = 0

    // Estado del parpadeo
    let nextBlinkAt = blinkEnabled ? (blink.initialDelayMs ?? 2000) / 1000 : Infinity
    let blinkStartedAt = -1
    let blinkDuration = (blink.durationMs ?? 250) / 1000

    const now = () => performance.now() / 1000

    function animate() {
      if (!ctx) return

      ctx.clearRect(0, 0, size, size)

      const currentStep = steps[stepIndex]
      const nextStep = steps[(stepIndex + 1) % steps.length]
      const currentExpr = def.expressions[currentStep.expression] || def.expressions.neutral
      const nextExpr = def.expressions[nextStep.expression] || currentExpr

      // Factor de parpadeo (0 = cerrado, 1 = abierto)
      let blinkScale = 1
      const t = now()
      if (blinkEnabled) {
        if (blinkStartedAt >= 0) {
          const elapsed = t - blinkStartedAt
          blinkScale = Math.max(0, 1 - elapsed / blinkDuration)
          if (elapsed >= blinkDuration) {
            blinkStartedAt = -1
            blinkScale = 1
            const min = (blink.minIntervalMs ?? 3000) / 1000
            const max = (blink.maxIntervalMs ?? 6000) / 1000
            nextBlinkAt = t + min + Math.random() * (max - min)
          }
        } else if (t >= nextBlinkAt) {
          blinkStartedAt = t
          blinkScale = 0.05
        }
      }

      // Interpolar entre la expresión actual y la siguiente durante la transición
      const expression =
        stepProgress > 0
          ? lerpExpression(currentExpr, nextExpr, stepProgress)
          : currentExpr

      renderAvatar(ctx, def, expression, size, blinkScale)

      // Lógica de pasos
      holdTime += 1 / 60
      const holdSeconds = (currentStep.holdMs ?? 3000) / 1000
      const transitionSeconds = (currentStep.transitionMs ?? 600) / 1000

      if (holdTime < holdSeconds) {
        stepProgress = 0
      } else if (holdTime < holdSeconds + transitionSeconds) {
        stepProgress = (holdTime - holdSeconds) / transitionSeconds
      } else {
        stepIndex = (stepIndex + 1) % steps.length
        holdTime = 0
        stepProgress = 0
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [avatarDef, currentAnimation, size, status])

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <div
        className={cn("relative", onClick && "cursor-pointer")}
        onClick={onClick}
        style={{ width: size, height: size }}
      >
        <canvas ref={canvasRef} width={size} height={size} className="block" />
      </div>
      {showName && (
        <span className="mt-2 text-xs font-medium text-center text-foreground">
          {avatarData.name}
        </span>
      )}
      {showTitle && (
        <span className="text-[10px] text-center text-muted-foreground">
          {avatarData.title}
        </span>
      )}
      <AgentStatusIndicator status={status} />
    </div>
  )
}

/**
 * Dibuja el avatar en el canvas usando la definición y la expresión dada.
 */
function renderAvatar(
  ctx: CanvasRenderingContext2D,
  avatarDef: AvatarDefinition,
  expression: any,
  size: number,
  blinkScale = 1
) {
  const centerX = size / 2
  const centerY = size / 2
  const radius = Math.min(size, size) * 0.4

  ctx.save()
  ctx.translate(centerX, centerY)

  // Desplazamiento de la cabeza según la expresión
  const head = expression?.head || { x: 0, y: 0, z: 0 }
  const scale = radius / 120
  ctx.translate((head.x || 0) * scale, (head.y || 0) * scale)

  // Cuerpo
  drawBody(ctx, avatarDef.body.primary.type, radius, avatarDef.colors.body, avatarDef.body.primary)

  // Ojos
  drawEyes(ctx, radius, avatarDef.colors.eyes, expression, blinkScale)

  ctx.restore()
}

function drawBody(
  ctx: CanvasRenderingContext2D,
  surfaceType: string,
  radius: number,
  color: string,
  primary: any
) {
  ctx.fillStyle = color
  ctx.strokeStyle = shadeColor(color, -20)
  ctx.lineWidth = 2

  switch (surfaceType) {
    case "sphere":
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      break
    case "cube": {
      const half = radius * 0.8
      ctx.beginPath()
      ctx.roundRect(-half, -half, half * 2, half * 2, radius * 0.1)
      ctx.fill()
      ctx.stroke()
      break
    }
    case "capsule": {
      const capRadius = radius * 0.6
      const capHeight = radius * 1.2
      ctx.beginPath()
      ctx.moveTo(-capRadius, -capHeight)
      ctx.lineTo(capRadius, -capHeight)
      ctx.arc(capRadius, 0, capRadius, -Math.PI / 2, Math.PI / 2)
      ctx.lineTo(-capRadius, capHeight)
      ctx.arc(-capRadius, 0, capRadius, Math.PI / 2, -Math.PI / 2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      break
    }
    case "cylinder":
      ctx.beginPath()
      ctx.ellipse(0, -radius * 0.8, radius * 0.7, radius * 0.15, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(-radius * 0.7, -radius * 0.8)
      ctx.lineTo(-radius * 0.7, radius * 0.8)
      ctx.ellipse(0, radius * 0.8, radius * 0.7, radius * 0.15, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(0, -radius * 0.8, radius * 0.7, 0, Math.PI * 2)
      ctx.stroke()
      break
    case "cone":
      ctx.beginPath()
      ctx.moveTo(0, -radius)
      ctx.lineTo(-radius * 0.8, radius * 0.8)
      ctx.lineTo(radius * 0.8, radius * 0.8)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      break
    case "diamond":
      ctx.beginPath()
      ctx.moveTo(0, -radius)
      ctx.lineTo(radius * 0.8, 0)
      ctx.lineTo(0, radius)
      ctx.lineTo(-radius * 0.8, 0)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      break
    case "mickey":
      // Cabeza
      ctx.beginPath()
      ctx.arc(0, -radius * 0.3, radius * 0.7, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      // Orejas
      ctx.beginPath()
      ctx.arc(-radius * 0.85, -radius * 0.9, radius * 0.4, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(radius * 0.85, -radius * 0.9, radius * 0.4, 0, Math.PI * 2)
      ctx.fill()
      break
    default:
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
  }
}

function drawEyes(
  ctx: CanvasRenderingContext2D,
  radius: number,
  eyeColor: string,
  expression: any,
  blinkScale = 1
) {
  const eyeData = expression?.eyes
  if (!eyeData) return

  const scale = radius / 120
  const spacing = (eyeData.spacing ?? 35) * scale

  ctx.fillStyle = eyeColor

  const drawEye = (eye: any, offsetX: number) => {
    if (!eye) return
    const width = (eye.width ?? 20) * scale
    const height = Math.max(0.6, (eye.height ?? 50) * scale * blinkScale)
    const x = offsetX + (eye.x ?? 0) * scale
    const y = (eye.y ?? -7) * scale
    const angle = ((eye.angle ?? 0) * Math.PI) / 180

    ctx.beginPath()
    ctx.ellipse(x, y, Math.max(0.5, width / 2), Math.max(0.5, height / 2), angle, 0, Math.PI * 2)
    ctx.fill()
  }

  drawEye(eyeData.left, -spacing / 2)
  drawEye(eyeData.right, spacing / 2)
}

/**
 * Interpola dos expresiones (datos numéricos) para transiciones suaves.
 */
function lerpExpression(a: any, b: any, t: number): any {
  if (!a) return b
  if (!b) return a
  if (t <= 0) return a
  if (t >= 1) return b

  const lerpNum = (x?: number, y?: number) =>
    (x ?? 0) + ((y ?? 0) - (x ?? 0)) * t

  const lerpEye = (eyeA: any, eyeB: any) => ({
    width: lerpNum(eyeA?.width, eyeB?.width),
    height: lerpNum(eyeA?.height, eyeB?.height),
    x: lerpNum(eyeA?.x, eyeB?.x),
    y: lerpNum(eyeA?.y, eyeB?.y),
    angle: lerpNum(eyeA?.angle, eyeB?.angle),
  })

  return {
    head: {
      x: lerpNum(a.head?.x, b.head?.x),
      y: lerpNum(a.head?.y, b.head?.y),
      z: lerpNum(a.head?.z, b.head?.z),
    },
    eyes: {
      left: lerpEye(a.eyes?.left, b.eyes?.left),
      right: lerpEye(a.eyes?.right, b.eyes?.right),
      spacing: lerpNum(a.eyes?.spacing, b.eyes?.spacing),
    },
    perspective: lerpNum(a.perspective, b.perspective),
    motion: b.motion ?? a.motion,
  }
}

function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max(0, Math.min(255, (num >> 16) + amt))
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt))
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt))
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
}

function AgentStatusIndicator({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    idle: { label: "Disponible", color: "bg-green-500" },
    working: { label: "Trabajando", color: "bg-blue-500 animate-pulse" },
    thinking: { label: "Pensando", color: "bg-yellow-500" },
    reviewing: { label: "Revisando", color: "bg-purple-500" },
    debugging: { label: "Depurando", color: "bg-orange-500 animate-bounce" },
    incident: { label: "Incidente", color: "bg-red-500 animate-pulse" },
    presenting: { label: "Presentando", color: "bg-indigo-500" },
    learning: { label: "Aprendiendo", color: "bg-teal-500" },
  }

  const config = statusConfig[status] || statusConfig.idle

  return (
    <div className="mt-2 flex items-center justify-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className="text-[10px] font-medium text-muted-foreground">{config.label}</span>
    </div>
  )
}

export function AgentAvatarGrid({
  agents,
  size = 100,
}: {
  agents: Array<{ agentType: AgentType; status?: keyof typeof AGENT_STATUS_ANIMATIONS }>
  size?: number
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {agents.map(({ agentType, status }) => (
        <AgentAvatar key={agentType} agentType={agentType} status={status} size={size} />
      ))}
    </div>
  )
}
