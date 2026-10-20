// opencode enciende el taller
/**
 * Renderer de avatares reutilizable.
 *
 * Dibuja un avatar de Bible Strong Avatar Lab en cualquier CanvasRenderingContext2D.
 * Se usa en dos sitios:
 *   - src/components/agent-avatars/AgentAvatar.tsx  (avatar 2D en la UI)
 *   - src/components/office/AgentDesk.tsx            (avatar en el monitor 3D)
 */

export interface AvatarDefinition {
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

export interface AvatarStep {
  expression: string
  holdMs: number
  transitionMs: number
  transition?: string
}

/** Carga la definicion de un avatar desde /public/avatars */
export async function loadAvatarDefinition(file: string): Promise<AvatarDefinition> {
  const res = await fetch(`/avatars/${file}`)
  if (!res.ok) throw new Error(`No se pudo cargar el avatar ${file}`)
  return (await res.json()) as AvatarDefinition
}

/**
 * Dibuja el avatar en el canvas con la expresion indicada.
 * @param blinkScale 0 = ojos cerrados, 1 = abiertos
 */
export function renderAvatar(
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

  // Desplazamiento de la cabeza segun la expresion
  const head = expression?.head || { x: 0, y: 0, z: 0 }
  const scale = radius / 120
  ctx.translate((head.x || 0) * scale, (head.y || 0) * scale)

  drawBody(ctx, avatarDef.body.primary.type, radius, avatarDef.colors.body, avatarDef.body.primary)
  drawEyes(ctx, radius, avatarDef.colors.eyes, expression, blinkScale)

  ctx.restore()
}

export function drawBody(
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
      ctx.beginPath()
      ctx.arc(0, -radius * 0.3, radius * 0.7, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
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

export function drawEyes(
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

/** Interpola dos expresiones para transiciones suaves */
export function lerpExpression(a: any, b: any, t: number): any {
  if (!a) return b
  if (!b) return a
  if (t <= 0) return a
  if (t >= 1) return b

  const lerpNum = (x?: number, y?: number) => (x ?? 0) + ((y ?? 0) - (x ?? 0)) * t

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

export function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max(0, Math.min(255, (num >> 16) + amt))
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt))
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt))
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
}

/**
 * Motor de animacion de un avatar: recorre los pasos de una animacion,
 * interpola entre expresiones y gestiona el parpadeo.
 * Se puede-NC renderizar en cualquier canvas en cualquier momento.
 */
export class AvatarAnimator {
  private def: AvatarDefinition
  private animation: any
  private stepIndex = 0
  private holdTime = 0
  private stepProgress = 0
  private clock = 0
  private nextBlinkAt = 0
  private blinkStartedAt = -1
  private blinkDuration = 0.25
  private blinkEnabled = true
  private minBlinkInterval = 3
  private maxBlinkInterval = 6

  constructor(def: AvatarDefinition, animationName: string) {
    this.def = def
    this.animation =
      def.animations[animationName] ||
      def.animations[def.animationOrder?.[0]] ||
      def.animations.idle

    const blink = this.animation?.blink || {}
    this.blinkEnabled = blink.enabled !== false
    this.blinkDuration = (blink.durationMs ?? 250) / 1000
    this.minBlinkInterval = (blink.minIntervalMs ?? 3000) / 1000
    this.maxBlinkInterval = (blink.maxIntervalMs ?? 6000) / 1000
    this.nextBlinkAt = (blink.initialDelayMs ?? 2000) / 1000
  }

  /** Nombre de la animacion actual */
  get animationName(): string {
    return this.animation?.metadata?.label ?? "idle"
  }

  /** Descripcion de la animacion actual */
  get description(): string {
    return this.animation?.metadata?.description ?? ""
  }

  /**
   * Avanza el reloj interno y devuelve el factor de parpadeo (0=cerrado, 1=abierto).
   * @param delta segundos transcurridos
   */
  tick(delta: number): number {
    const steps: AvatarStep[] = this.animation?.steps || []
    this.clock += delta

    if (steps.length > 0) {
      const currentStep = steps[this.stepIndex]
      const holdSeconds = (currentStep.holdMs ?? 3000) / 1000
      const transitionSeconds = (currentStep.transitionMs ?? 600) / 1000

      this.holdTime += delta
      if (this.holdTime < holdSeconds) {
        this.stepProgress = 0
      } else if (this.holdTime < holdSeconds + transitionSeconds) {
        this.stepProgress = (this.holdTime - holdSeconds) / transitionSeconds
      } else {
        this.stepIndex = (this.stepIndex + 1) % steps.length
        this.holdTime = 0
        this.stepProgress = 0
      }
    }

    // Parpadeo
    if (!this.blinkEnabled) return 1

    if (this.blinkStartedAt >= 0) {
      const elapsed = this.clock - this.blinkStartedAt
      if (elapsed >= this.blinkDuration) {
        this.blinkStartedAt = -1
        this.nextBlinkAt =
          this.clock + this.minBlinkInterval + Math.random() * (this.maxBlinkInterval - this.minBlinkInterval)
        return 1
      }
      return Math.max(0, 1 - elapsed / this.blinkDuration)
    }

    if (this.clock >= this.nextBlinkAt) {
      this.blinkStartedAt = this.clock
      return 0.05
    }

    return 1
  }

  /** Expression actual interpolada */
  getExpression(): any {
    const steps: AvatarStep[] = this.animation?.steps || []
    if (steps.length === 0) return this.def.expressions.neutral

    const currentStep = steps[this.stepIndex]
    const nextStep = steps[(this.stepIndex + 1) % steps.length]
    const currentExpr = this.def.expressions[currentStep.expression] || this.def.expressions.neutral
    const nextExpr = this.def.expressions[nextStep.expression] || currentExpr

    return this.stepProgress > 0
      ? lerpExpression(currentExpr, nextExpr, this.stepProgress)
      : currentExpr
  }

  /** Dibuja el avatar en el contexto indicado */
  render(ctx: CanvasRenderingContext2D, size: number, blinkScale = 1) {
    renderAvatar(ctx, this.def, this.getExpression(), size, blinkScale)
  }
}
