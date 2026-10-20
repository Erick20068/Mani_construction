// opencode enciende el taller
"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { OfficeScene, OfficeHud } from "@/components/office/OfficeScene"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TallerPage() {
  const [powered, setPowered] = useState(false)
  const [tick, setTick] = useState(0)

  // Los agentes van rotando su estado cada 4 segundos
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 4000)
    return () => clearInterval(id)
  }, [])

  const handlePower = useCallback(() => {
    setPowered(true)
    // La palabra secreta queda registrada en la consola del taller
    if (typeof window !== "undefined") {
      console.log("%c opencode enciende el taller ", "background:#22d3ee;color:#03040c;font-weight:bold;padding:4px 8px;border-radius:4px")
    }
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#03040c]">
      {/* Escena 3D */}
      <OfficeScene powered={powered} tick={tick} />

      {/* HUD */}
      <OfficeHud powered={powered} onPower={handlePower} tick={tick} />

      {/* Volver */}
      <div className="absolute left-1/2 top-5 z-30 -translate-x-1/2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-2 text-white/50 hover:text-white hover:bg-white/10"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Volver al sitio
          </Link>
        </Button>
      </div>
    </div>
  )
}
