import { Metadata } from "next"
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
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { CatalogoClient } from "./catalogo-client"

export const metadata: Metadata = {
  title: "Catálogo de Muebles",
  description: "Explora nuestra colección de muebles personalizados en maderas nobles",
}

const categories = [
  { id: "all", name: "Todos", icon: Box },
  { id: "sala", name: "Sala", icon: Box },
  { id: "comedor", name: "Comedor", icon: Box },
  { id: "dormitorio", name: "Dormitorio", icon: Box },
  { id: "oficina", name: "Oficina", icon: Box },
  { id: "exterior", name: "Exterior", icon: TreePine },
  { id: "personalizado", name: "Personalizado", icon: Sparkles },
]

const woodTypes = [
  { id: "all", name: "Todas" },
  { id: "roble", name: "Roble" },
  { id: "nogal", name: "Nogal" },
  { id: "cedro", name: "Cedro" },
  { id: "pino", name: "Pino" },
  { id: "caoba", name: "Caoba" },
  { id: "teka", name: "Teka" },
  { id: "fresno", name: "Fresno" },
  { id: "cerezo", name: "Cerezo" },
]

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    category?: string
    wood?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
  }>
}) {
  const params = await searchParams
  const category = params.category || "all"
  const wood = params.wood || "all"
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined
  const sort = params.sort || "newest"
  const page = params.page ? Number(params.page) : 1
  const pageSize = 12

  const supabase = createServerSupabaseClient()

  // Build query
  let query = supabase
    .from("furniture_items")
    .select(`
      *,
      furniture_categories(name, slug),
      wood_types(name, color_hex)
    `, { count: "exact" })
    .eq("published", true)

  if (category !== "all") {
    query = query.eq("furniture_categories.slug", category)
  }

  if (wood !== "all") {
    query = query.eq("wood_type_id", wood)
  }

  if (minPrice !== undefined) {
    query = query.gte("base_price", minPrice)
  }

  if (maxPrice !== undefined) {
    query = query.lte("base_price", maxPrice)
  }

  // Sorting
  switch (sort) {
    case "price-asc":
      query = query.order("base_price", { ascending: true })
      break
    case "price-desc":
      query = query.order("base_price", { ascending: false })
      break
    case "name-asc":
      query = query.order("name", { ascending: true })
      break
    case "name-desc":
      query = query.order("name", { ascending: false })
      break
    case "newest":
    default:
      query = query.order("created_at", { ascending: false })
      break
  }

  // Pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data: items, count, error } = await query

  if (error) {
    console.error("Error fetching catalog:", error)
  }

  const totalPages = Math.ceil((count || 0) / pageSize)

  // Pass data to client component
  return (
    <CatalogoClient
      initialItems={items || []}
      initialCount={count || 0}
      initialTotalPages={totalPages}
      initialParams={{
        category,
        wood,
        minPrice,
        maxPrice,
        sort,
        page,
      }}
      categories={categories}
      woodTypes={woodTypes}
    />
  )
}