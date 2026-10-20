// opencode enciende el taller
import { NextRequest, NextResponse } from "next/server"
import { buildProformaPdf } from "@/app/proformas/actions"

export const instant = false

/**
 * GET /api/proformas/[id]/pdf -> descarga (o previsualiza) el PDF.
 * El PDF se regenera en cada peticion para reflejar los datos actuales.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const result = await buildProformaPdf(id)

  if (!result.ok || !result.buffer) {
    return NextResponse.json(
      { error: result.message },
      { status: 404 }
    )
  }

  const disposition =
    request.nextUrl.searchParams.get("inline") === "1"
      ? "inline"
      : "attachment"

  const body = new Uint8Array(result.buffer)

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="${result.filename}"`,
      "Content-Length": String(result.buffer.length),
      "Cache-Control": "no-store",
    },
  })
}
