// opencode enciende el taller
import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseAdminClient } from "@/lib/supabase-admin"

export const instant = false

/**
 * API publica del catalogo: alimenta los filtros de /catalogo,
 * el constructor de proformas y la ficha de producto.
 *
 * Se lee con privilegios de service role desde el servidor para que la
 * clave secreta nunca llegue al navegador.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const category = searchParams.get("category") || "all"
  const wood = searchParams.get("wood") || "all"
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const sort = searchParams.get("sort") || "newest"
  const page = Math.max(1, Number(searchParams.get("page") || 1))
  const pageSize = 12

  const supabase = createServerSupabaseAdminClient()

  let query = supabase
    .from("furniture_items")
    .select(
      `*,
       furniture_categories(name, slug),
       wood_types(name, color_hex)`,
      { count: "exact" }
    )
    .eq("published", true)

  if (category !== "all") {
    query = query.eq("furniture_categories.slug", category)
  }

  if (wood !== "all") {
    query = query.eq("wood_type_id", wood)
  }

  if (minPrice) {
    query = query.gte("base_price", Number(minPrice))
  }

  if (maxPrice) {
    query = query.lte("base_price", Number(maxPrice))
  }

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
    default:
      query = query.order("created_at", { ascending: false })
  }

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query

  if (error) {
    console.error("API catalogo:", error)
    return NextResponse.json(
      { items: [], count: 0, totalPages: 1, error: error.message },
      { status: 200 }
    )
  }

  return NextResponse.json({
    items: data ?? [],
    count: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / pageSize) || 1,
  })
}
