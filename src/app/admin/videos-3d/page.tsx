// opencode enciende el taller
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { requireAdmin } from "@/lib/auth"
import { VideoManager, type VideoRow } from "@/components/admin/VideoManager"
import { Video } from "lucide-react"

export const instant = false

export default async function AdminVideosPage() {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const [{ data: videos }, { data: furniture }] = await Promise.all([
    supabase
      .from("videos_3d")
      .select("*, furniture(name)")
      .order("display_order", { ascending: true }),
    supabase
      .from("furniture_items")
      .select("id, name")
      .order("name", { ascending: true }),
  ])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Video className="h-6 w-6 text-primary" />
          Galería 3D
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {videos?.length ?? 0} videos · realizados, posibles y de proceso
        </p>
      </header>

      <VideoManager
        videos={(videos ?? []) as unknown as VideoRow[]}
        furniture={furniture ?? []}
      />
    </div>
  )
}
