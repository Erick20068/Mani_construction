"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Box, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Tag,
  DollarSign,
  TreePine,
  Truck,
  Heart,
  Share2,
  ExternalLink,
  Loader2,
  Video,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"

interface FurnitureItem {
  id: string
  name: string
  slug: string
  description: string | null
  base_price: number
  images: string[]
  videos_3d: string[]
  materials: any[]
  wood_type_id: string | null
  dimensions: { width: number; height: number; depth: number; unit: string }
  weight_kg: number | null
  is_customizable: boolean
  lead_time_days: number
  featured: boolean
  published: boolean
  furniture_categories?: { name: string; slug: string }
  wood_types?: { name: string; color_hex: string }
}

interface CatalogoClientProps {
  initialItems: FurnitureItem[]
  initialCount: number
  initialTotalPages: number
  initialParams: {
    category: string
    wood: string
    minPrice: number | undefined
    maxPrice: number | undefined
    sort: string
    page: number
  }
  categories: { id: string; name: string; icon: React.ComponentType<{ className?: string }> }[]
  woodTypes: { id: string; name: string }[]
}

export function CatalogoClient({
  initialItems,
  initialCount,
  initialTotalPages,
  initialParams,
  categories,
  woodTypes,
}: CatalogoClientProps) {
  const [items, setItems] = useState<FurnitureItem[]>(initialItems)
  const [count, setCount] = useState(initialCount)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [category, setCategory] = useState(initialParams.category)
  const [wood, setWood] = useState(initialParams.wood)
  const [minPrice, setMinPrice] = useState<number | undefined>(initialParams.minPrice)
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialParams.maxPrice)
  const [sort, setSort] = useState(initialParams.sort)
  const [page, setPage] = useState(initialParams.page)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const pageSize = 12

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.furniture_categories?.slug === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleFilterChange = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== "all") params.set("category", category)
      if (wood !== "all") params.set("wood", wood)
      if (minPrice !== undefined) params.set("minPrice", minPrice.toString())
      if (maxPrice !== undefined) params.set("maxPrice", maxPrice.toString())
      params.set("sort", sort)
      params.set("page", "1")
      
      const response = await fetch(`/api/catalogo?${params.toString()}`)
      const data = await response.json()
      setItems(data.items || [])
      setCount(data.count || 0)
      setTotalPages(data.totalPages || 1)
      setPage(1)
    } catch (err) {
      console.error("Error fetching catalog:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-primary/5 via-background to-transparent">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Catálogo de
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Muebles a Medida
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Descubre nuestra colección de muebles personalizables. Selecciona la madera, 
              las dimensiones y los acabados que mejor se adapten a tu espacio.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Box className="h-4 w-4" />
                {count || 0} diseños disponibles
              </span>
              <span className="flex items-center gap-2">
                <TreePine className="h-4 w-4" />
                8+ tipos de madera
              </span>
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Envío a todo el país
              </span>
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Hecho con pasión
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Catalog */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Categorías
                  </h3>
                  <nav className="space-y-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/catalogo?category=${cat.id}&wood=${wood}&sort=${sort}`}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                          category === cat.id 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                      >
                        <cat.icon className="h-4 w-4" />
                        {cat.name}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Wood Type Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TreePine className="h-4 w-4" />
                    Tipo de Madera
                  </h3>
                  <Select 
                    value={wood} 
                    onValueChange={(value) => {
                      setWood(value)
                      handleFilterChange()
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todas las maderas" />
                    </SelectTrigger>
                    <SelectContent>
                      {woodTypes.map((w) => (
                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Rango de Precio
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Mín"
                        value={minPrice || ""}
                        onChange={(e) => {
                          const val = e.target.value
                          setMinPrice(val ? Number(val) : undefined)
                        }}
                        className="text-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Máx"
                        value={maxPrice || ""}
                        onChange={(e) => {
                          const val = e.target.value
                          setMaxPrice(val ? Number(val) : undefined)
                        }}
                        className="text-sm"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        setMinPrice(undefined)
                        setMaxPrice(undefined)
                        handleFilterChange()
                      }}
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Ordenar por
                  </h3>
                  <Select 
                    value={sort} 
                    onValueChange={(value) => {
                      setSort(value)
                      handleFilterChange()
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Más nuevos</SelectItem>
                      <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                      <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                      <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
                      <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {count || 0} {count === 1 ? "producto" : "productos"} encontrado{count !== 1 ? "s" : ""}
                    {category !== "all" && ` en ${categories.find(c => c.id === category)?.name}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    <Filter className="h-4 w-4 mr-1" />
                    Filtros
                  </Button>
                </div>
              </div>

              {/* Product Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1,2,3,4,5,6].map(i => <CatalogItemSkeleton key={i} />)}
                </div>
              ) : filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map(item => (
                    <CatalogItemCard 
                      key={item.id} 
                      item={item} 
                      inCart={false}
                      onAdd={() => {}}
                    />
                  ))}
                </div>

                <>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                  <div className="flex items-center justify-center gap-2 mt-8">
                    {page > 1 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => { setPage(page - 1); handleFilterChange() }}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                      </Button>
                    )}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (page <= 3) {
                          pageNum = i + 1
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = page - 2 + i
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            className="h-9 w-9"
                            onClick={() => { setPage(pageNum); handleFilterChange() }}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    {page < totalPages && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => { setPage(page + 1); handleFilterChange() }}
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
                /* Empty State */
                <div className="text-center py-16">
                  <Box className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No se encontraron productos</h3>
                  <p className="text-muted-foreground mb-6">
                    Intenta ajustar tus filtros o explora todas las categorías
                  </p>
                  <Button variant="outline" onClick={() => { setCategory("all"); setWood("all"); setMinPrice(undefined); setMaxPrice(undefined); handleFilterChange() }}>
                    Ver todo el catálogo
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Product Card Component
function CatalogItemCard({ item, inCart, onAdd }: { item: any; inCart: boolean; onAdd: (item: any) => void }) {
  const [imageIndex, setImageIndex] = useState(0)
  const images = item.images && item.images.length > 0 ? item.images : ["/placeholder-furniture.jpg"]

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={images[imageIndex] || images[0]}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setImageIndex(i) }}
                className={cn("w-1.5 h-1.5 rounded-full transition-all", i === imageIndex ? "bg-white" : "bg-white/50")}
              />
            ))}
          </div>
        )}
        <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1">
          {item.featured && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500 text-yellow-950">★ Destacado</span>}
          {item.is_customizable && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-border bg-white/90">Personalizable</span>}
          {item.wood_types && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.wood_types.color_hex || "#8B6914" }} />
              {item.wood_types.name}
            </span>
          )}
        </div>
      </div>
      <CardContent className="flex-1 p-4 space-y-3">
        <div className="flex items-center gap-2">
          {item.furniture_categories && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-border bg-background">{item.furniture_categories.name}</span>}
          {item.videos_3d?.length && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"><Video className="h-3 w-3" />3D</span>}
        </div>
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
        {item.description && <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {item.dimensions && <span className="flex items-center gap-1"><Box className="h-3 w-3" />{item.dimensions.width}x{item.dimensions.height}x{item.dimensions.depth}{item.dimensions.unit}</span>}
          {item.lead_time_days && <span className="flex items-center gap-1"><Truck className="h-3 w-3" />{item.lead_time_days} días</span>}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xl font-bold text-foreground">{formatCurrency(Number(item.base_price))}</span>
          <Button 
            size="sm" 
            variant="premium" 
            className="gap-1"
            onClick={() => onAdd(item)}
            disabled={false}
          >
            <Box className="h-3 w-3" />
            Agregar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Product Card Skeleton
function CatalogItemSkeleton() {
  return (
    <Card className="h-full">
      <div className="aspect-[4/3] bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
        <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="flex justify-between">
          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
          <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

import { Video, Truck } from "lucide-react"