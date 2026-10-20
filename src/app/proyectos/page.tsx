// opencode enciende el taller
import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InfoPage } from "@/components/content/InfoPage"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Obras y mobiliario entregado: casas, oficinas, restaurantes y hoteles.",
}

const PROJECTS = [
  {
    name: "Casa en Los Olivos — mobiliario completo",
    type: "Residencial",
    year: "2025",
    place: "Lima",
    pieces: "32 piezas",
    image: "/furniture/comedor-completo-8.svg",
    text: "Mobiliario completo para una casa de 280 m²: cocina a medida,closets, escritorio y comedor de nogal para ocho personas.",
  },
  {
    name: "Oficina de arquitectura — mobiliario corporativo",
    type: "Oficina",
    year: "2025",
    place: "San Isidro",
    pieces: "46 piezas",
    image: "/furniture/escritorio-cerezo.svg",
    text: "Cuarenta y seis escritorios de cerezo con cajonera de latón, mas salas de reunión con mesa de nogal para doce.",
  },
  {
    name: "Restaurante Panorama — sala ybarra",
    type: "Comercial",
    year: "2024",
    place: "Barranco",
    pieces: "28 piezas",
    image: "/furniture/mesa-comedor-nogal.svg",
    text: "Mesas de comedor, barra y bancos en teka y caoba para un restaurante de 120 couverts con vista al mar.",
  },
  {
    name: "Hotel Casa del Puerto — habitaciones",
    type: "Hotelería",
    year: "2024",
    place: "Pisco",
    pieces: "54 piezas",
    image: "/furniture/cama-cabecero-cedro.svg",
    text: "Camas con cabecero de listones de cedro, escritorios de fresno y armarios con espejo para 28 habitaciones.",
  },
  {
    name: "Cafetería La Tabla — sala y barra",
    type: "Comercial",
    year: "2024",
    place: "Magdalena",
    pieces: "18 piezas",
    image: "/furniture/banco-perchero-caoba.svg",
    text: "Banco perchero, mesas de centro y sillas de fresno con rejilla para una cafetería de noventa couverts.",
  },
  {
    name: "Casa de campo en Ica — cocina y parrillero",
    type: "Residencial",
    year: "2023",
    place: "Ica",
    pieces: "22 piezas",
    image: "/furniture/estanteria-pino-modular.svg",
    text: "Cocina de pino y teka para casa de campo, con área de parrillero y un espacio abierto al jardín.",
  },
]

export default function ProyectosPage() {
  return (
    <InfoPage
      eyebrow="Portafolio"
      title="Proyectos entregados"
      intro="Cada proyecto es una combinación de obra y mobiliario. Esta es una muestra del tipo de encargos que hacemos."
    >
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((p) => (
              <Card
                key={p.name}
                className="group overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 flex gap-2">
                    <Badge className="bg-primary text-primary-foreground">
                      {p.type}
                    </Badge>
                    <Badge variant="outline" className="bg-white/90">
                      {p.year}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold leading-snug">{p.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.place} · {p.pieces}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="premium" className="gap-2">
              <Link href="/contacto">
                Cuéntanos tu proyecto
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </InfoPage>
  )
}
