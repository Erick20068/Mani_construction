"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import type { AgentType, AGENT_AVATARS, AGENT_STATUS_ANIMATIONS } from "@/types"

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

interface AgentAvatarProps {
  agentType: AgentType
  status?: keyof typeof AGENT_STATUS_ANIMATIONS
  size?: number
  className?: string
  showName?: boolean
  showTitle?: boolean
  onClick?: () => void
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
  const [frame, setFrame] = useState(0)
  const animationRef = useRef<number>()
  const avatarData = AGENT_AVATARS[agentType]

  // Load avatar definition
  useEffect(() => {
    async function loadAvatar() {
      try {
        const response = await fetch(`/avatars/${avatarData.file}`)
        if (response.ok) {
          const def = await response.json()
          setAvatarDef(def)
          setCurrentAnimation(status)
        }
      } catch (error) {
        console.warn(`Failed to load avatar for ${agentType}:`, error)
      }
    }
    loadAvatar()
  }, [agentType])

  // Update animation when status changes
  useEffect(() => {
    if (avatarDef && avatarDef.animations[status]) {
      setCurrentAnimation(status)
      setFrame(0)
    }
  }, [status, avatarDef])

  // Animation loop
  useEffect(() => {
    if (!avatarDef || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    const animation = avatarDef.animations[currentAnimation]
    if (!animation) return

    let currentFrame = 0
    const steps = animation.steps
    let stepIndex = 0
    let stepProgress = 0
    let holdTime = 0

    function animate() {
      if (!ctx) return
      
      ctx.clearRect(0, 0, size, size)
      
      // Render current expression
      const currentStep = steps[stepIndex]
      const expression = avatarDef.expressions[currentStep.expression]
      
      if (expression) {
        renderAvatar(ctx, avatarDef, expression, size)
      }

      // Animation logic
      holdTime++
      const holdFrames = (currentStep.holdMs / 1000) * 60 // Convert ms to frames at 60fps
      const transitionFrames = (currentStep.transitionMs / 1000) * 60

      if (holdTime < holdFrames) {
        // Holding
      } else if (holdTime < holdFrames + transitionFrames) {
        // Transitioning
        stepProgress = (holdTime - holdFrames) / transitionFrames
      } else {
        // Next step
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

  // Simple SVG-based avatar rendering (fallback when canvas is complex)
  const renderSimpleAvatar = () => {
    if (!avatarDef) return null

    const primaryColor = avatarDef.colors.body
    const eyeColor = avatarDef.colors.eyes
    const surfaceType = avatarDef.body.primary.type

    const surfaceShapes: Record<string, string> = {
      sphere: "circle",
      cube: "square",
      capsule: "rounded-rect",
      cylinder: "cylinder",
      cone: "triangle",
      diamond: "diamond",
      mickey: "mickey",
    }

    return (
      <div className={cn("relative inline-flex flex-col items-center", className)}>
        <div
          className={cn("relative", onClick && "cursor-pointer")}
          onClick={onClick}
          style={{ width: size, height: size }}
        >
          <AgentAvatarCanvas
            avatarDef={avatarDef}
            currentAnimation={currentAnimation}
            frame={frame}
            size={size}
            ref={canvasRef}
          />
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

  return renderSimpleAvatar()
}

// Canvas-based avatar renderer
function AgentAvatarCanvas({
  avatarDef,
  currentAnimation,
  frame,
  size,
  ref,
}: {
  avatarDef: AvatarDefinition
  currentAnimation: string
  frame: number
  size: number
  ref: React.RefObject<HTMLCanvasElement>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const effectiveRef = ref || canvasRef

  useEffect(() => {
    const canvas = effectiveRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    function drawAvatar() {
      if (!ctx) return
      
      ctx.clearRect(0, 0, size, size)
      
      const centerX = size / 2
      const centerY = size / 2
      const radius = Math.min(size, size) * 0.4

      // Draw body based on surface type
      const surfaceType = avatarDef.body.primary.type
      const bodyColor = avatarDef.colors.body
      const eyeColor = avatarDef.colors.eyes

      ctx.save()
      ctx.translate(centerX, centerY)

      // Body
      drawBody(ctx, surfaceType, radius, bodyColor, avatarDef.body.primary)

      // Eyes
      drawEyes(ctx, radius, eyeColor, avatarDef.expressions.neutral)

      ctx.restore()
    }

    drawAvatar()
  }, [avatarDef, currentAnimation, frame, size])

  return <canvas ref={effectiveRef} className="block" />
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
    case "cube":
      const half = radius * 0.8
      ctx.beginPath()
      ctx.roundRect(-half, -half, half * 2, half * 2, radius * 0.1)
      ctx.fill()
      ctx.stroke()
      break
    case "capsule":
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
      // Head
      ctx.beginPath()
      ctx.arc(0, -radius * 0.3, radius * 0.7, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      // Ears
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
  expression: any
) {
  const eyeData = expression?.eyes
  if (!eyeData) return

  const spacing = (eyeData.spacing || 35) * (radius / 120)
  const eyeWidth = (eyeData.left?.width || 20) * (radius / 120)
  const eyeHeight = (eyeData.left?.height || 50) * (radius / 120)
  const eyeY = (eyeData.left?.y || -7) * (radius / 120)

  ctx.fillStyle = eyeColor

  // Left eye
  ctx.beginPath()
  ctx.ellipse(-spacing / 2, eyeY, eyeWidth / 2, eyeHeight / 2, 0, 0, Math.PI * 2)
  ctx.fill()

  // Right eye
  ctx.beginPath()
  ctx.ellipse(spacing / 2, eyeY, eyeWidth / 2, eyeHeight / 2, 0, 0, Math.PI * 2)
  ctx.fill()
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
  const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    idle: { label: "Disponible", color: "bg-green-500", icon: "●" },
    working: { label: "Trabajando", color: "bg-blue-500 animate-pulse", icon: "⚡" },
    thinking: { label: "Pensando", color: "bg-yellow-500", icon: "💭" },
    reviewing: { label: "Revisando", color: "bg-purple-500", icon: "👁" },
    debugging: { label: "Depurando", color: "bg-orange-500 animate-bounce", icon: "🐛" },
    incident: { label: "Incidente", color: "bg-red-500 animate-pulse", icon: "🚨" },
    presenting: { label: "Presentando", color: "bg-indigo-500", icon: "📊" },
    learning: { label: "Aprendiendo", color: "bg-teal-500", icon: "📚" },
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