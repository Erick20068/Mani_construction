"use client"

import { useRef, useState, useEffect, useCallback, Suspense } from "react"
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber"
import { 
  OrbitControls, 
  Html, 
  Environment, 
  Stage, 
  ContactShadows,
  useGLTF,
  useTexture,
  Preload,
  CameraShake
} from "@react-three/drei"
import * as THREE from "three"
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js"
import { 
  PlayCircle, 
  PauseCircle, 
  Volume2, 
  VolumeX, 
  Expand, 
  RotateCcw, 
  Box,
  Settings,
  Download,
  Eye,
  Share2,
  Loader2,
  AlertCircle,
  Video,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// Extend Three.js types
extend(THREE as any)

interface Video3DPlayerProps {
  videoUrl: string
  thumbnailUrl?: string
  modelUrl?: string // GLTF/GLB model
  title: string
  description?: string
  duration?: number
  type: 'showcase' | 'possible' | 'process'
  furnitureId?: string
  furnitureName?: string
  onShare?: () => void
  onDownload?: () => void
  className?: string
  autoPlay?: boolean
  showControls?: boolean
  showARButton?: boolean
  poster?: string
}

type VideoMode = 'video' | 'model' | 'hybrid'

const typeConfig = {
  showcase: { label: "Realizado", color: "bg-green-500", icon: "✓" },
  possible: { label: "Posible", color: "bg-purple-500", icon: "✨" },
  process: { label: "Proceso", color: "bg-blue-500", icon: "⚙" },
}

export function Video3DPlayer({
  videoUrl,
  thumbnailUrl,
  modelUrl,
  title,
  description,
  duration,
  type,
  furnitureId,
  furnitureName,
  onShare,
  onDownload,
  className,
  autoPlay = false,
  showControls = true,
  showARButton = true,
  poster,
}: Video3DPlayerProps) {
  const [mode, setMode] = useState<VideoMode>('video')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(duration || 0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [quality, setQuality] = useState('auto')
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showAR, setShowAR] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelError, setModelError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Determine best mode based on available assets
  const availableMode = useCallback(() => {
    if (modelUrl && videoUrl) return 'hybrid'
    if (modelUrl) return 'model'
    return 'video'
  }, [modelUrl, videoUrl])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(() => {
          // Auto-play might be blocked
          setIsPlaying(false)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle video events
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    setVolume(vol)
    if (videoRef.current) {
      videoRef.current.volume = vol
      videoRef.current.muted = vol === 0
    }
    setIsMuted(vol === 0)
  }

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
  }

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {})
      } else {
        document.exitFullscreen().catch(() => {})
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const handleDownload = () => {
    if (onDownload) {
      onDownload()
    } else if (videoUrl) {
      const a = document.createElement('a')
      a.href = videoUrl
      a.download = `${title}.mp4`
      a.click()
    }
    toast.success("Descarga iniciada")
  }

  const handleShare = () => {
    if (onShare) {
      onShare()
    } else if (navigator.share) {
      navigator.share({
        title,
        text: description,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Enlace copiado al portapapeles")
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10)
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          if (videoRef.current) {
            videoRef.current.currentTime = Math.min(videoDuration, videoRef.current.currentTime + 10)
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (videoRef.current) {
            const newVol = Math.min(1, videoRef.current.volume + 0.1)
            videoRef.current.volume = newVol
            setVolume(newVol)
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          if (videoRef.current) {
            const newVol = Math.max(0, videoRef.current.volume - 0.1)
            videoRef.current.volume = newVol
            setVolume(newVol)
          }
          break
        case 'm':
          if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted
            setIsMuted(videoRef.current.muted)
          }
          break
        case 'f':
          handleFullscreen()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, videoDuration])

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Auto-play handling
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play blocked, show play button
        setIsPlaying(false)
      })
    }
  }, [autoPlay])

  const hasModel = !!modelUrl
  const hasVideo = !!videoUrl
  const currentMode = availableMode()
  const showVideoLayer = mode === 'video' || mode === 'hybrid'
  const showModelLayer = mode === 'model' || mode === 'hybrid'

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative bg-black rounded-2xl overflow-hidden",
        isFullscreen && "fixed inset-0 z-50 rounded-none",
        className
      )}
      style={{ aspectRatio: '16/9' }}
    >
      {/* Video Mode */}
      {showVideoLayer && hasVideo && (
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            src={videoUrl}
            poster={poster || thumbnailUrl}
            className="w-full h-full object-cover"
            playsInline
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={(e) => {
              console.error("Video error:", e)
              toast.error("Error al cargar el video")
              if (mode === 'hybrid' && modelUrl) {
                setMode('model')
              }
            }}
            muted={isMuted}
          />
          
          {/* Video Loading Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <Loader2 className="h-12 w-12 text-white animate-spin" />
          </div>
        </div>
      )}

      {/* 3D Model Mode */}
      {showModelLayer && hasModel && (
        <div className="absolute inset-0 z-20">
          <ModelViewer
            modelUrl={modelUrl}
            onLoad={() => setModelLoaded(true)}
            onError={(err) => {
              setModelError(err.message)
              setMode((current) => (current === 'hybrid' ? 'video' : current))
            }}
            autoPlay={autoPlay && !showVideoLayer}
          />
          
          {/* Model Loading Overlay */}
          {!modelLoaded && !modelError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-2" />
                <p className="text-white text-sm">Cargando modelo 3D...</p>
              </div>
            </div>
          )}
          
          {modelError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-30">
              <div className="text-center p-4">
                <Box className="h-12 w-12 text-red-400 mx-auto mb-2" />
                <p className="text-white text-sm">Error al cargar el modelo 3D</p>
                <p className="text-white/70 text-xs mt-1">{modelError}</p>
                {hasVideo && (
                  <Button 
                    variant="secondary" 
                    className="mt-3" 
                    onClick={() => setMode('video')}
                  >
                    Ver video en su lugar
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Thumbnail / Poster when not playing */}
      {(!isPlaying || !hasVideo) && thumbnailUrl && (
        <div className="absolute inset-0 z-5">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition-opacity"
            style={{ opacity: isPlaying && hasVideo ? 0 : 1 }}
          />
          {hasVideo && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors z-10"
              aria-label="Reproducir"
            >
              <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <PlayCircle className="h-10 w-10 text-primary ml-1" />
              </div>
            </button>
          )}
        </div>
      )}

      {/* Controls Overlay */}
      {showControls && (
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-40 transition-all duration-300",
          isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          <div className="flex items-center justify-between gap-4">
            {/* Title & Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate">{title}</h3>
              {description && (
                <p className="text-white/70 text-sm truncate mt-1">{description}</p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="secondary" className={typeConfig[type].color}>
                  {typeConfig[type].label}
                </Badge>
                {furnitureName && (
                  <Badge variant="outline" className="bg-white/20">
                    <Box className="h-3 w-3 mr-1" />
                    {furnitureName}
                  </Badge>
                )}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Mode Switcher (Hybrid) */}
              {currentMode === 'hybrid' && (
                <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                  <Button
                    variant={mode === 'video' ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-1"
                    onClick={() => setMode('video')}
                  >
                    <Video className="h-3 w-3" />
                    Video
                  </Button>
                  <Button
                    variant={mode === 'model' ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-1"
                    onClick={() => setMode('model')}
                  >
                    <Box className="h-3 w-3" />
                    3D
                  </Button>
                </div>
              )}

              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-5 w-5" />
              </Button>

              {/* AR Button */}
              {showARButton && hasModel && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-primary"
                  onClick={() => setShowAR(true)}
                >
                  <Eye className="h-5 w-5" />
                </Button>
              )}

              {/* Share */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>

              {/* Download */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={handleDownload}
              >
                <Download className="h-5 w-5" />
              </Button>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={handleFullscreen}
              >
                {isFullscreen ? (
                  <RotateCcw className="h-5 w-5" />
                ) : (
                  <Expand className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Progress Bar */}
      {hasVideo && showControls && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-40">
          <div 
            className="h-full bg-primary transition-all duration-75"
            style={{ width: `${(currentTime / videoDuration) * 100}%` }}
          />
          <input
            type="range"
            min={0}
            max={videoDuration}
            value={currentTime}
            onChange={handleSeek}
            className="absolute bottom-0 left-0 right-0 h-1 appearance-none bg-transparent cursor-pointer z-50"
            style={{ 
              background: 'linear-gradient(to right, var(--thumb-color) var(--thumb-width), transparent var(--thumb-width))',
            }}
            onInput={(e) => {
              const target = e.target as HTMLInputElement
              const min = Number(target.min) || 0
              const max = Number(target.max) || 0
              const percent = max === min ? 0 : (Number(target.value) - min) / (max - min)
              target.style.setProperty('--thumb-width', `${percent * 100}%`)
              target.style.setProperty('--thumb-color', '#3b82f6')
            }}
          />
          <div className="absolute bottom-full left-4 right-4 mb-1 flex justify-between text-white/70 text-xs px-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(videoDuration)}</span>
          </div>
        </div>
      )}

      {/* Play/Pause Overlay */}
      {hasVideo && showControls && (
        <button
          onClick={togglePlay}
          className={cn(
            "absolute inset-0 flex items-center justify-center z-30 transition-opacity",
            isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xl">
            {isPlaying ? (
              <PauseCircle className="h-10 w-10 text-primary" />
            ) : (
              <PlayCircle className="h-10 w-10 text-primary ml-1" />
            )}
          </div>
        </button>
      )}

      {/* Settings Panel */}
      {showSettings && showControls && (
        <div className="absolute bottom-20 right-4 z-50">
          <Card className="w-64 bg-black/90 backdrop-blur border-white/10">
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-white text-sm">
                  <input
                    type="checkbox"
                    checked={isMuted}
                    onChange={(e) => {
                      if (videoRef.current) {
                        videoRef.current.muted = e.target.checked
                        setIsMuted(e.target.checked)
                      }
                    }}
                    className="rounded border-border"
                  />
                  Silenciar
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 text-white text-sm">
                  <input
                    type="checkbox"
                    checked={playbackRate !== 1}
                    onChange={(e) => handlePlaybackRateChange(e.target.checked ? 1.5 : 1)}
                    className="rounded border-border"
                  />
                  Velocidad 1.5x
                </label>
              </div>
              <div className="pt-2 border-t border-white/10">
                <label className="block text-white/70 text-xs mb-2">Velocidad de reproducción</label>
                <select
                  value={playbackRate}
                  onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                  className="w-full bg-white/10 border-white/20 text-white rounded px-2 py-1 text-sm"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x (Normal)</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </div>
              <div className="pt-2 border-t border-white/10">
                <label className="block text-white/70 text-xs mb-2">Calidad</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full bg-white/10 border-white/20 text-white rounded px-2 py-1 text-sm"
                >
                  <option value="auto">Auto</option>
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AR Viewer Modal */}
      {showAR && hasModel && (
        <ARViewer 
          modelUrl={modelUrl}
          title={title}
          onClose={() => setShowAR(false)}
        />
      )}
    </div>
  )
}

// 3D Model Viewer Component
function ModelViewer({ 
  modelUrl, 
  onLoad, 
  onError, 
  autoPlay = true 
}: { 
  modelUrl: string
  onLoad: () => void
  onError: (err: Error) => void
  autoPlay: boolean
}) {
  const { scene, camera } = useThree()
  const modelRef = useRef<THREE.Group | null>(null)
  const animationMixerRef = useRef<THREE.AnimationMixer | undefined>(undefined)
  const [animations, setAnimations] = useState<THREE.AnimationClip[]>([])

  useEffect(() => {
    let mounted = true

    const loader = new GLTFLoader()
    loader.load(
      modelUrl,
      (gltf: GLTF) => {
        if (!mounted) return
        
        const model = gltf.scene
        modelRef.current = model
        
        // Scale and center model
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2 / maxDim
        model.scale.multiplyScalar(scale)
        
        // Recalculate center after scaling
        box.setFromObject(model)
        box.getCenter(center)
        model.position.sub(center)
        
        // Enable shadows
        model.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
            if (child.material) {
              child.material.metalness = 0.1
              child.material.roughness = 0.8
            }
          }
        })

        scene.add(model)

        // Camera positioning
        camera.position.set(0, 1, 3)
        camera.lookAt(0, 0, 0)

        // Animations
        if (gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model)
          animationMixerRef.current = mixer
          setAnimations(gltf.animations)

          if (autoPlay) {
            gltf.animations.forEach((clip: THREE.AnimationClip) => {
              mixer.clipAction(clip).play()
            })
          }
        }

        onLoad()
      },
      (xhr: ProgressEvent) => {
        // Progress
        if (xhr.total > 0) {
          console.log(`Loading model: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`)
        }
      },
      (error: unknown) => {
        if (mounted) {
          onError(error instanceof Error ? error : new Error("Error al cargar el modelo 3D"))
        }
      }
    )

    return () => {
      mounted = false
      if (modelRef.current) {
        scene.remove(modelRef.current)
        animationMixerRef.current?.uncacheRoot(modelRef.current)
        modelRef.current = null
      }
    }
  }, [modelUrl, scene, camera, onLoad, onError, autoPlay])

  // Animation loop
  useFrame((state, delta) => {
    if (animationMixerRef.current) {
      animationMixerRef.current.update(delta)
    }

    // Auto-rotate when no user interaction
    const pointerDown = (state.pointer as unknown as { isDown?: boolean }).isDown
    if (modelRef.current && !pointerDown) {
      modelRef.current.rotation.y += delta * 0.1
    }
  })

  return null
}

// AR Viewer Modal
function ARViewer({ modelUrl, title, onClose }: { modelUrl: string; title: string; onClose: () => void }) {
  const [arSupported, setARSupported] = useState(false)

  useEffect(() => {
    // Check for WebXR support
    if ('xr' in navigator) {
      (navigator as any).xr.isSessionSupported('immersive-ar').then((supported: boolean) => {
        setARSupported(supported)
      })
    }
  }, [])

  if (!arSupported) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <Card className="max-w-md mx-4 bg-black/90 border-white/10">
          <CardContent className="p-6 text-center">
            <Box className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">AR no disponible</h3>
            <p className="text-white/70 mb-4">
              Tu dispositivo o navegador no soporta Realidad Aumentada inmersiva.
            </p>
            <Button onClick={onClose} className="w-full">
              Cerrar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-full h-full max-w-4xl max-h-[90vh] mx-4 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="w-full h-full">
          <ARCanvas modelUrl={modelUrl} title={title} />
        </div>
      </div>
    </div>
  )
}

// AR Canvas Component
function ARCanvas({ modelUrl, title }: { modelUrl: string; title: string }) {
  const { gl } = useThree()
  
  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }, [gl])

  return (
    <Canvas
      camera={{ position: [0, 1.6, 0], fov: 60 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
    >
      <Environment preset="city" />
      <ARModel modelUrl={modelUrl} />
      <Html fullscreen position={[0, -1.5, -2]} rotation={[-Math.PI / 8, 0, 0]}>
        <div className="text-center text-white p-4 bg-black/50 rounded-xl backdrop-blur max-w-xs">
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-white/70 mt-1">
            Mueve tu dispositivo para detectar superficies planas
          </p>
        </div>
      </Html>
      </Canvas>
    )
}

// AR Model Component
function ARModel({ modelUrl }: { modelUrl: string }) {
  const modelRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(modelUrl, (gltf: GLTF) => {
      const model = gltf.scene
      modelRef.current = model
      
      // Scale for AR (real world units)
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 1 / maxDim // 1 meter max dimension
      model.scale.multiplyScalar(scale)
      
      box.setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      model.position.sub(center)
      model.position.y = 0 // On ground
      
      model.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    })
  }, [modelUrl])

  if (!modelRef.current) return null
  return <primitive object={modelRef.current} dispose={null} />
}

// Video Preview Component (for before upload)
export function Video3DPreview({
  videoFile,
  modelFile,
  onVideoSelect,
  onModelSelect,
  onRemoveVideo,
  onRemoveModel,
}: {
  videoFile?: File | null
  modelFile?: File | null
  onVideoSelect: (file: File) => void
  onModelSelect: (file: File) => void
  onRemoveVideo: () => void
  onRemoveModel: () => void
}) {
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [modelPreview, setModelPreview] = useState<string | null>(null)
  const [modelError, setModelError] = useState<string | null>(null)

  useEffect(() => {
    if (videoFile) {
      setVideoPreview(URL.createObjectURL(videoFile))
    } else {
      setVideoPreview(null)
    }
  }, [videoFile])

  useEffect(() => {
    if (modelFile) {
      setModelPreview(URL.createObjectURL(modelFile))
      // Validate model file
      const validExtensions = ['.gltf', '.glb', '.obj', '.fbx', '.dae']
      const ext = '.' + modelFile.name.split('.').pop()?.toLowerCase()
      if (!validExtensions.includes(ext)) {
        setModelError(`Formato no soportado: ${ext}. Usa .gltf, .glb, .obj, .fbx o .dae`)
      } else {
        setModelError(null)
      }
    } else {
      setModelPreview(null)
      setModelError(null)
    }
  }, [modelFile])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Video Preview */}
      <Card className="relative">
        <CardContent className="p-0">
          {videoPreview ? (
            <div className="relative aspect-video overflow-hidden rounded-t-2xl">
              <video
                src={videoPreview}
                controls
                className="w-full h-full"
                playsInline
              />
              <button
                onClick={onRemoveVideo}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors"
                aria-label="Eliminar video"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="aspect-video flex flex-col items-center justify-center gap-4 p-8 bg-muted/50 rounded-t-2xl">
              <Video className="h-16 w-16 text-muted-foreground/50" />
              <div className="text-center">
                <p className="font-medium text-foreground">Video 3D / Demo</p>
                <p className="text-sm text-muted-foreground">MP4, WebM, MOV · Máx. 500MB</p>
              </div>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => document.getElementById('video-input')?.click()}
              >
                <Video className="h-4 w-4" />
                Seleccionar Video
              </Button>
              <input
                id="video-input"
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={(e) => e.target.files?.[0] && onVideoSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3D Model Preview */}
      <Card className="relative">
        <CardContent className="p-0">
          {modelPreview && !modelError ? (
            <div className="relative aspect-video overflow-hidden rounded-t-2xl">
              <ModelPreview modelUrl={modelPreview} />
              <button
                onClick={onRemoveModel}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors"
                aria-label="Eliminar modelo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : modelError ? (
            <div className="aspect-video flex flex-col items-center justify-center gap-4 p-8 bg-red-50 rounded-t-2xl">
              <AlertCircle className="h-16 w-16 text-red-500" />
              <div className="text-center">
                <p className="font-medium text-red-700">Error en el modelo</p>
                <p className="text-sm text-red-600">{modelError}</p>
              </div>
              <Button variant="outline" onClick={onRemoveModel}>
                Eliminar y volver a intentar
              </Button>
            </div>
          ) : (
            <div className="aspect-video flex flex-col items-center justify-center gap-4 p-8 bg-muted/50 rounded-t-2xl">
              <Box className="h-16 w-16 text-muted-foreground/50" />
              <div className="text-center">
                <p className="font-medium text-foreground">Modelo 3D</p>
                <p className="text-sm text-muted-foreground">GLTF/GLB, OBJ, FBX, DAE · Máx. 100MB</p>
              </div>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => document.getElementById('model-input')?.click()}
              >
                <Box className="h-4 w-4" />
                Seleccionar Modelo 3D
              </Button>
              <input
                id="model-input"
                type="file"
                accept=".gltf,.glb,.obj,.fbx,.dae"
                onChange={(e) => e.target.files?.[0] && onModelSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Model Preview Component
function ModelPreview({ modelUrl }: { modelUrl: string }) {
  return (
    <Canvas
      camera={{ position: [0, 1, 3], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <Environment preset="studio" />
      <Suspense fallback={<LoadingModel />}>
        <ModelComponent modelUrl={modelUrl} />
      </Suspense>
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
    </Canvas>
  )
}

function LoadingModel() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-muted">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
    </div>
  )
}

function ModelComponent({ modelUrl }: { modelUrl: string }) {
  const groupRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(modelUrl, (gltf: GLTF) => {
      const model = gltf.scene
      groupRef.current = model

      // Normalize scale
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 2 / maxDim
      model.scale.setScalar(scale)

      box.setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      model.position.sub(center)
    })
  }, [modelUrl])

  if (!groupRef.current) return null
  return <primitive object={groupRef.current} dispose={null} />
}