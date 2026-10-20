// opencode enciende el taller
"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import type { AgentType } from "@/types"
import { AGENT_AVATARS, AGENT_STATUS_ANIMATIONS } from "@/types"
import {
  loadAvatarDefinition,
  renderAvatar,
  lerpExpression,
  type AvatarDefinition,
} from "@/lib/avatar-renderer"

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
  const animationRef = useRef<number | undefined>(undefined)
  const avatarData = AGENT_AVATARS[agentType]

  // Cargar la definicion del avatar
  useEffect(() => {
    let cancelled = false

    loadAvatarDefinition(avatarData.file)
      .then((def) => {
        if (!cancelled) setAvatarDef(def)
      })
      .catch((error) => {
        console.warn(`No se pudo cargar el avatar de ${agentType}:`, error)
      })

    return () => {
      cancelled = true
    }
  }, [agentType, avatarData.file])

  // Loop de animacion: expresiones + parpadeo
  useEffect(() => {
    if (!avatarDef || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    const def = avatarDef
    const animationName = resolveAnimation(def, status)
    const animation =
      def.animations[animationName] ||
      def.animations[def.animationOrder?.[0]] ||
      def.animations.idle

    if (!animation) return

    const steps: any[] = animation.steps || []
    if (steps.length === 0) return

    const blink = animation.blink || {}
    const blinkEnabled = blink.enabled !== false
    const blinkDuration = (blink.durationMs ?? 250) / 1000
    const minBlink = (blink.minIntervalMs ?? 3000) / 1000
    const maxBlink = (blink.maxIntervalMs ?? 6000) / 1000

    let stepIndex = 0
    let holdTime = 0
    let stepProgress = 0
    let clock = 0
    let nextBlinkAt = blinkEnabled ? (blink.initialDelayMs ?? 2000) / 1000 : Infinity
    let blinkStartedAt = -1

    function animate() {
      if (!ctx) return

      ctx.clearRect(0, 0, size, size)

      const currentStep = steps[stepIndex]
      const nextStep = steps[(stepIndex + 1) % steps.length]
      const currentExpr = def.expressions[currentStep.expression] || def.expressions.neutral
      const nextExpr = def.expressions[nextStep.expression] || currentExpr

      // Factor de parpadeo
      let blinkScale = 1
      if (blinkEnabled) {
        if (blinkStartedAt >= 0) {
          const elapsed = clock - blinkStartedAt
          if (elapsed >= blinkDuration) {
            blinkStartedAt = -1
            blinkScale = 1
            nextBlinkAt = clock + minBlink + Math.random() * (maxBlink - minBlink)
          } else {
            blinkScale = Math.max(0, 1 - elapsed / blinkDuration)
          }
        } else if (clock >= nextBlinkAt) {
          blinkStartedAt = clock
          blinkScale = 0.05
        }
      }

      const expression =
        stepProgress > 0
          ? lerpExpression(currentExpr, nextExpr, stepProgress)
          : currentExpr

      renderAvatar(ctx, def, expression, size, blinkScale)

      // Logica de pasos
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

      clock += 1 / 60
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [avatarDef, status, size])

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
  agents: Array<{ agentType: AgentType; status?: string }>
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
