// opencode enciende el taller
import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseAdminClient } from "@/lib/supabase-admin"

export const instant = false

/**
 * API publica de la galeria 3D.
 * GET /api/videos?type=showcase|possible|process
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  const supabase = createServerSupabaseAdminClient()

  let query = supabase
    .from("videos_3d")
    .select(
      `*,
       furniture:furniture_items(id, name, slug, images)`
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (type && type !== "all") {
    query = query.eq("type", type)
  }

  const { data, error } = await query

  if (error) {
    console.error("API videos:", error)
    return NextResponse.json({ videos: [], error: error.message }, { status: 200 })
  }

  return NextResponse.json({ videos: data ?? [] })
}
