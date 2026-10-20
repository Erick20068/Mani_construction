"use client"

import { Video3DPlayer, Video3DPreview } from "@/components/gallery-3d/Video3DPlayer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Video, 
  Box, 
  Upload, 
  Eye, 
  Settings, 
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Sparkles
} from "lucide-react"
import { useState } from "react"

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}

function StatItem({ value, label, icon: Icon }: { value: string | number; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="p-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

const sampleVideos = [
  {
    id: "1",
    title: "Sofá Modular en Roble",
    description: "Sofá modular de 3 plazas con chaise longue, tapizado en lino natural, estructura en roble macizo.",
    type: "showcase" as const,
    duration: 45,
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
    thumbnailUrl: "https://picsum.photos/seed/sofa-roble/800/450",
    modelUrl: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/models/gltf/LittlestTokyo.glb",
    furnitureName: "Sofá Modular Roble",
  },
  {
    id: "2",
    title: "Mesa de Comedor Extensible",
    description: "Mesa de comedor extensible en nogal, sistema de apertura sincronizado, para 8-12 personas.",
    type: "possible" as const,
    duration: 60,
    videoUrl: "https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4",
    thumbnailUrl: "https://picsum.photos/seed/mesa-nogal/800/450",
    modelUrl: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf",
    furnitureName: "Mesa Nogal Extensible",
  },
  {
    id: "3",
    title: "Proceso: Ensamblaje de Silla",
    description: "Vista del proceso de ensamblaje de silla ergonómica: corte, lijado, montaje y acabado.",
    type: "process" as const,
    duration: 120,
    videoUrl: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4",
    thumbnailUrl: "https://picsum.photos/seed/silla-proceso/800/450",
    modelUrl: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb",
    furnitureName: "Silla Ergonómica",
  },
]

const typeConfig = {
  showcase: { label: "Realizado", icon: CheckCircle, color: "bg-green-500" },
  possible: { label: "Posible", icon: Sparkles, color: "bg-purple-500" },
  process: { label: "Proceso", icon: RotateCcw, color: "bg-blue-500" },
}

export default function Demo3DPage() {
  const [selectedVideo, setSelectedVideo] = useState(sampleVideos[0])
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState<'player' | 'preview' | 'gallery'>('player')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Demo 3D Video Player</h1>
                <p className="text-sm text-muted-foreground">Reproductor híbrido Video + Modelo 3D para muebles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-3 w-3" />
                v2.0 Híbrido
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="player">
              <Eye className="h-4 w-4 mr-2" />
              Reproductor
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Upload className="h-4 w-4 mr-2" />
              Pre-subida
            </TabsTrigger>
            <TabsTrigger value="gallery">
              <Box className="h-4 w-4 mr-2" />
              Galería
            </TabsTrigger>
          </TabsList>

          {/* Player Tab */}
          <TabsContent value="player" className="space-y-8">
            {/* Main Player */}
            <Video3DPlayer
              {...selectedVideo}
              autoPlay={false}
              showControls={true}
              showARButton={true}
              onShare={() => alert("Enlace copiado")}
              onDownload={() => alert("Descarga iniciada")}
            />

            {/* Video Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Seleccionar Video de Demostración
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sampleVideos.map((video) => (
                    <button
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={cn(
                        "relative aspect-video rounded-xl overflow-hidden border-2 transition-all",
                        selectedVideo.id === video.id
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                            typeConfig[video.type].color
                          )}>
                            {typeConfig[video.type].label}
                          </span>
                          <span className="text-white/70 text-xs">{formatDuration(video.duration)}</span>
                        </div>
                        <h4 className="text-white font-medium truncate">{video.title}</h4>
                        <p className="text-white/70 text-xs truncate">{video.furnitureName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: RotateCcw, title: "Híbrido Video + 3D", desc: "Cambia entre video y modelo 3D en tiempo real sin recargar" },
                { icon: Sparkles, title: "Realidad Aumentada", desc: "Proyecta el mueble en tu espacio con WebXR" },
                { icon: Settings, title: "Controles Avanzados", desc: "Velocidad, calidad, modo cine, atajos de teclado" },
              ].map((feature, i) => (
                <Card key={i} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Vista Previa Antes de Subir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Arrastra o selecciona tus archivos para ver cómo se verán en el reproductor antes de subirlos al servidor.
                  Soporta videos (MP4, WebM, MOV) y modelos 3D (GLTF, GLB, OBJ, FBX, DAE).
                </p>
                <Video3DPreview
                  videoFile={null}
                  modelFile={null}
                  onVideoSelect={() => {}}
                  onModelSelect={() => {}}
                  onRemoveVideo={() => {}}
                  onRemoveModel={() => {}}
                />
              </CardContent>
            </Card>

            {/* Upload Instructions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-blue-500" />
                    Especificaciones de Video
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SpecRow label="Formatos" value="MP4 (H.264), WebM (VP9), MOV" />
                  <SpecRow label="Resolución máx." value="1920x1080 (Full HD)" />
                  <SpecRow label="Duración máx." value="10 minutos" />
                  <SpecRow label="Tamaño máx." value="500 MB" />
                  <SpecRow label="Codec recomendado" value="H.264 High Profile, AAC Audio" />
                  <SpecRow label="Bitrate" value="5-8 Mbps para 1080p" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-purple-500" />
                    Especificaciones de Modelo 3D
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SpecRow label="Formatos" value="GLTF/GLB (recomendado), OBJ, FBX, DAE" />
                  <SpecRow label="Tamaño máx." value="100 MB" />
                  <SpecRow label="Polígonos máx." value="~50,000 triángulos" />
                  <SpecRow label="Texturas" value="PBR (albedo, normal, roughness, metalness)" />
                  <SpecRow label="Animaciones" value="Soportadas (GLTF)" />
                  <SpecRow label="Optimización" value="Draco compression recomendada" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                            typeConfig[video.type].color
                          )}>
                            {typeConfig[video.type].label}
                          </span>
                          <span className="text-white/70 text-xs">{formatDuration(video.duration)}</span>
                        </div>
                        <h4 className="text-white font-semibold">{video.title}</h4>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="absolute inset-0"
                      aria-label={`Ver ${video.title}`}
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-semibold text-foreground line-clamp-1">{video.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                        typeConfig[video.type].color
                      )}>
                        <Box className="h-2.5 w-2.5" />
                        {video.furnitureName}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => setSelectedVideo(video)}
                      >
                        <Eye className="h-3 w-3" />
                        Ver en 3D
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
              <StatItem value={sampleVideos.length} label="Videos de Demo" icon={Video} />
              <StatItem value="3" label="Tipos de Contenido" icon={Sparkles} />
              <StatItem value="Híbrido" label="Modo de Reproducción" icon={RotateCcw} />
              <StatItem value="WebXR" label="Realidad Aumentada" icon={Sparkles} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}