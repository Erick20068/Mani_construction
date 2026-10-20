// opencode enciende el taller
import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Maderas & Diseño - Muebles a Medida",
    short_name: "M&D",
    description:
      "Empresa de construcción expandida a muebles personalizados. Catálogo, proformas y galería 3D.",
    start_url: "/",
    display: "standalone",
    background_color: "#03040c",
    theme_color: "#1a3a5c",
    lang: "es",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  }
}
