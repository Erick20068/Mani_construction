"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Video, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  PlayCircle,
  Expand,
  RotateCcw,
  Box,
  Sparkles,
  Eye,
  Share2,
  Download,
  Grid,
  List,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"

interface Video3D {
  id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  duration_seconds: number | null
  type: 'showcase' | 'possible' | 'process'
  display_order: number
  furniture_id: string | null
  furniture?: {
    id: string
    name: string
    slug: string
    images: string[]
  }
}

const typeLabels = {
  showcase: { label: "Muebles Realizados", icon: CheckCircle, color: "bg-green-500" },
  possible: { label: "Lo que Podemos Hacer", icon: Sparkles, color: "bg-purple-500" },
  process: { label: "Proceso de Fabricación", icon: RotateCcw, color: "bg-blue-500" },
}

export default function Galeria3DPage() {
  const [videos, setVideos] = useState<Video3D[]>([])
  const [activeType, setActiveType] = useState<'showcase' | 'possible' | 'process'>('showcase')
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedVideo, setSelectedVideo] = useState<Video3D | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchVideos()
  }, [activeType])

  const fetchVideos = async () => {
    setIsLoading(true)
    try {
      // Se lee por la API del servidor: la clave de servicio nunca llega al navegador
      const res = await fetch(`/api/videos?type=${activeType}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setVideos(data.videos || [])
    } catch (err) {
      console.error("Error fetching videos:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.furniture?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Duración variable"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-primary/5 via-background to-transparent">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 gap-2">
              <Video className="h-3 w-3" />
              Galería 3D Interactiva
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Explora en
              <br />
              <span className="gradient-text">3D Inmersivo</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Visualiza nuestros muebles desde todos los ángulos. Rotación, zoom, vista explotada 
              y modo AR para verlos en tu propio espacio.
            </p>

            {/* Type Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {Object.entries(typeLabels).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type as 'showcase' | 'possible' | 'process')}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    activeType === type
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-muted-foreground hover:bg-accent/50"
                  )}
                >
                  <config.icon className="h-4 w-4 mr-1" />
                  {config.label}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                {videos.length} videos en esta categoría
              </span>
              <span className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                360° interactivo
              </span>
              <span className="flex items-center gap-2">
                <Expand className="h-4 w-4" />
                Modo pantalla completa
              </span>
              <span className="flex items-center gap-2">
                <Box className="h-4 w-4" />
                Modelo 3D real
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Gallery */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 sm:w-80 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="p-2"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="p-2"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
              </span>
            </div>
          </div>

          {/* Video Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map(i => (
                <VideoCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredVideos.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredVideos.map((video) => (
                    <Video3DCard key={video.id} video={video} onSelect={setSelectedVideo} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredVideos.map((video) => (
                    <Video3DListItem key={video.id} video={video} onSelect={setSelectedVideo} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Video className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No se encontraron videos</h3>
              <p className="text-muted-foreground mb-6">
                Intenta con otra búsqueda o categoría
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Experiencia 3D Completa</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: RotateCcw,
                title: "Rotación 360°",
                description: "Gira el mueble en cualquier eje. Examina cada detalle, unión y acabado desde todos los ángulos.",
              },
              {
                icon: Expand,
                title: "Zoom y Vista Explotada",
                description: "Acércate para ver la textura de la madera, los herrajes y las uniones. Vista explotada para entender la construcción.",
              },
              {
                icon: Eye,
                title: "Realidad Aumentada (AR)",
                description: "Proyecta el mueble en tu espacio real usando la cámara de tu móvil. Verifica medidas y estilo antes de comprar.",
              },
              {
                icon: Box,
                title: "Selector de Materiales",
                description: "Cambia el tipo de madera, acabado, tela y herrajes en tiempo real. Ve cómo afecta al precio final.",
              },
              {
                icon: Sparkles,
                title: "Configurador Integrado",
                description: "Personaliza dimensiones, añade módulos, elige herrajes. Genera tu proforma al instante.",
              },
              {
                icon: Download,
                title: "Descarga y Comparte",
                description: "Descarga el modelo 3D, comparte el link con tu familia o envía la configuración a nuestro equipo.",
              },
            ].map((feature, i) => (
              <Card key={i} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <Card className="bg-gradient-to-r from-primary via-primary/80 to-secondary max-w-3xl mx-auto text-center p-8 md:p-12">
            <div className="max-w-xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¿Quieres ver tu mueble en 3D?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Sube una foto de tu espacio o elige un modelo base. 
                Nuestro configurador te muestra el resultado final en minutos.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="xl" variant="secondary" className="gap-2" asChild>
                  <Link href="/configurador">
                    Probar Configurador
                    <Expand className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 gap-2" asChild>
                  <Link href="/proformas/nueva">
                    <Download className="h-5 w-5" />
                    Pedir Proforma
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

// Video 3D Card Component
function Video3DCard({ video, onSelect }: { video: Video3D; onSelect: (v: Video3D) => void }) {
  const [isHovered, setIsHovered] = useState(false)
  const typeConfig = typeLabels[video.type]
  const TypeIcon = typeConfig.icon

  return (
    <Card 
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <Video className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}

        {/* Play Button Overlay */}
        <button
          onClick={(e) => { e.preventDefault(); onSelect(video) }}
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            isHovered && "opacity-100"
          )}
        >
          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <PlayCircle className="h-8 w-8 text-primary ml-1" />
          </div>
        </button>

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="default" className={cn("gap-1", typeConfig.color)}>
            <TypeIcon className="h-3 w-3" />
            {typeConfig.label}
          </Badge>
        </div>

        {/* Duration */}
        {video.duration_seconds && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="outline" className="bg-black/70 text-white border-0">
              {formatDuration(video.duration_seconds)}
            </Badge>
          </div>
        )}

        {/* Furniture Link */}
        {video.furniture && (
          <Link
            href={`/catalogo/${video.furniture.slug}`}
            className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Badge variant="secondary" className="w-full justify-center gap-1">
              <Box className="h-3 w-3" />
              Ver producto: {video.furniture.name}
            </Badge>
          </Link>
        )}
      </div>

      {/* Content */}
      <CardContent className="flex-1 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {video.type === 'showcase' && 'Realizado'}
            {video.type === 'possible' && 'Posible'}
            {video.type === 'process' && 'Proceso'}
          </Badge>
          {video.duration_seconds && (
            <span className="text-xs text-muted-foreground">{formatDuration(video.duration_seconds)}</span>
          )}
        </div>

        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {video.title}
        </h3>

        {video.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {video.description}
          </p>
        )}

        {video.furniture && (
          <Link href={`/catalogo/${video.furniture.slug}`} className="text-sm text-primary hover:underline flex items-center gap-1">
            <Box className="h-3 w-3" />
            Mueble relacionado: {video.furniture.name}
          </Link>
        )}
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className="flex items-center gap-2 p-4 pt-0 border-t border-border/50">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 gap-1"
          onClick={(e) => { e.preventDefault(); onSelect(video) }}
        >
          <PlayCircle className="h-3 w-3" />
          Ver 3D
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
          onClick={(e) => { e.preventDefault(); onSelect(video) }}
        >
          <Expand className="h-3 w-3" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
        >
          <Share2 className="h-3 w-3" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
        >
          <Download className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}

// Video List Item for List View
function Video3DListItem({ video, onSelect }: { video: Video3D; onSelect: (v: Video3D) => void }) {
  const typeConfig = typeLabels[video.type]
  const TypeIcon = typeConfig.icon

  return (
    <Card className="flex flex-row gap-4 hover:shadow-md transition-shadow">
      <div className="relative w-48 h-27 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
        {video.thumbnail_url ? (
          <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="h-10 w-10 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.preventDefault(); onSelect(video) }} className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
            <PlayCircle className="h-6 w-6 text-primary ml-1" />
          </button>
        </div>
        <Badge variant="default" className={cn("absolute top-2 left-2", typeConfig.color)}>
          <TypeIcon className="h-3 w-3" />
        </Badge>
      </div>
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {video.type === 'showcase' && 'Realizado'}
              {video.type === 'possible' && 'Posible'}
              {video.type === 'process' && 'Proceso'}
            </Badge>
            {video.duration_seconds && (
              <span className="text-xs text-muted-foreground">{formatDuration(video.duration_seconds)}</span>
            )}
          </div>
          <h3 className="font-semibold text-foreground mb-1">{video.title}</h3>
          {video.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{video.description}</p>
          )}
          {video.furniture && (
            <Link href={`/catalogo/${video.furniture.slug}`} className="text-sm text-primary hover:underline flex items-center gap-1">
              <Box className="h-3 w-3" />
              Ver: {video.furniture.name}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" className="flex-1 gap-1" onClick={(e) => { e.preventDefault(); onSelect(video) }}>
            <PlayCircle className="h-3 w-3" />
            Ver 3D
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); onSelect(video) }}>
            <Expand className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm"><Share2 className="h-3 w-3" /></Button>
          <Button variant="ghost" size="sm"><Download className="h-3 w-3" /></Button>
        </div>
      </div>
    </Card>
  )
}

// Skeleton for loading state
function VideoCardSkeleton() {
  return (
    <Card className="h-full">
      <div className="aspect-video bg-muted animate-pulse rounded-t-2xl" />
      <CardContent className="p-4 space-y-3">
        <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
        <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-muted animate-pulse rounded flex-1" />
          <div className="h-8 w-10 bg-muted animate-pulse rounded" />
          <div className="h-8 w-10 bg-muted animate-pulse rounded" />
          <div className="h-8 w-10 bg-muted animate-pulse rounded" />
          <div className="h-8 w-10 bg-muted animate-pulse rounded" />
        </div>
      </CardFooter>
    </Card>
  )
}

function formatDuration(seconds: number | null) {
  if (!seconds) return "Duración variable"
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}