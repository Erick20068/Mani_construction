// opencode enciende el taller
import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InfoPage } from "@/components/content/InfoPage"
import { ArrowRight, Calendar, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog",
  description: "Notas sobre madera, acabado, carpintería y cómo elegir tu mueble.",
}

const POSTS = [
  {
    slug: "como-elegir-madera",
    title: "Cómo elegir la madera correcta para tu mueble",
    excerpt:
      "Roble, nogal, caoba o teka: no hay una madera mejor que otra, hay una madera mejor para cada uso. Te explicamos cuál.",
    category: "Materiales",
    read: "6 min",
    date: "2026-09-28",
    image: "/furniture/sofa-modular-roble.svg",
  },
  {
    slug: "acabado-al-oil",
    title: "Aceite, barniz o las dos cosas: el acabado que dura",
    excerpt:
      "El acabado define cómo se siente la madera y cómo envejece. Comparamos las opciones reales del taller.",
    category: "Acabados",
    read: "4 min",
    date: "2026-09-14",
    image: "/furniture/proceso-acabado.svg",
  },
  {
    slug: "medir-antes-de-encargar",
    title: "Las cinco medidas que debes tomar antes de encargar",
    excerpt:
      "Un espacio medido bien ahorra semanas de espera. La lista corta que usamos en cada visita.",
    category: "Guías",
    read: "5 min",
    date: "2026-08-30",
    image: "/furniture/escritorio-cerezo.svg",
  },
  {
    slug: "canto-y-ensamble",
    title: "Por qué el canto y el ensamble decides la duración del mueble",
    excerpt:
      "Un mueble no se rompe por la tabla: se rompe por la unión. Cómo trabajamos el canto y el ensamble en taller.",
    category: "Taller",
    read: "7 min",
    date: "2026-08-12",
    image: "/furniture/proceso-ensamble.svg",
  },
]

export default function BlogPage() {
  return (
    <InfoPage
      eyebrow="Ideas"
      title="Notas del taller"
      intro="Escribimos sobre lo que sabemos: madera, acabado, medidas y las decisiones que hay detrás de cada mueble."
    >
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {POSTS.map((p) => (
              <Card
                key={p.slug}
                className="group overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div className="aspect-4/3 overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="secondary">{p.category}</Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(p.date).toLocaleDateString("es-PE", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {p.read}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.excerpt}
                  </p>
                  <Button asChild variant="link" className="mt-3 h-auto p-0 gap-1.5">
                    <Link href="/catalogo">
                      Leer más
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </InfoPage>
  )
}
