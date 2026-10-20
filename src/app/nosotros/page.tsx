// opencode enciende el taller
import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Award,
  CheckCircle2,
  Hammer,
  Leaf,
  Ruler,
  Shield,
  Users,
  Wrench,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Maderas & Diseño: de la construcción al mobiliario a medida. Más de 15 años haciendo muebles que duran.",
}

const values = [
  {
    icon: Hammer,
    title: "Oficio de carpintería",
    text: "Somos constructores que aprendieron carpintería, no al revés. Cada unión, cada veta y cada acabado se eligen con criterio de obra.",
  },
  {
    icon: Ruler,
    title: "A medida de verdad",
    text: "No vendemos catálogo: cada pieza se mide en tu espacio, se dibuja y se ajusta hasta que encaja. Las medidas mandan.",
  },
  {
    icon: Shield,
    title: "Garantía de 5 años",
    text: "Respaldamos la fabricación de la madera y los herrajes. Si algo falla por nuestra parte, lo reparamos sin discussing.",
  },
  {
    icon: Leaf,
    title: "Madera con origen",
    text: "Compramos en forests con manejo responsable y preferimos especies locales para reducir el transporte y el impacto.",
  },
  {
    icon: Wrench,
    title: "Taller propio",
    text: "Corte, canteado, ensamble y acabado los hacemos nosotros. Eso nos permite corregir cualquier detalle antes de la entrega.",
  },
  {
    icon: Users,
    title: "Trato directo",
    text: "Sin intermediarios. Hablas con quien diseña, con quien corta y con quien instala.",
  },
]

const numbers = [
  { value: "+15", label: "años en el oficio" },
  { value: "+2.400", label: "muebles entregados" },
  { value: "8", label: "especies de madera" },
  { value: "100%", label: "fabricación propia" },
]

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-transparent py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Hammer className="h-3.5 w-3.5" />
              Maderas &amp; Diseño
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
              De la obra al mueble,
              <br />
              <span className="text-primary">con el mismo criterio</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Empezamos como constructores. Seguimos siendo constructores.
              Lo que cambiamos fue que ahora también fabricamos los muebles
              que instalamos: las mesas, las sillas y las camas que moblan
              las casas que construimos.
            </p>
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {numbers.map((n) => (
              <div key={n.label} className="text-center">
                <p className="text-3xl font-bold text-primary md:text-4xl">
                  {n.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{n.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Cómo trabajamos</h2>
            <p className="mt-3 text-muted-foreground">
              Seis principios que no negociamos con nadie.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <Card key={v.title} className="h-full">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {v.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Cómo pasa tu mueble</h2>
            <p className="mt-3 text-muted-foreground">
              Del primer boceto a la instalación en tu casa.
            </p>
          </div>

          <ol className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-4">
            {[
              { n: "01", t: "Visita y medidas", d: "Vamos al espacio, medimos y vemos la luz." },
              { n: "02", t: "Diseño y propuesta", d: "Proforma con medidas, herrajes y precio cerrado." },
              { n: "03", t: "Fabricación", d: "Corte, canteado, ensamble y acabado en taller." },
              { n: "04", t: "Entrega e instalación", d: "Montaje en obra y revisión final contigo." },
            ].map((s) => (
              <li key={s.n} className="relative">
                <span className="font-mono text-4xl font-bold text-primary/15">
                  {s.n}
                </span>
                <h3 className="-mt-3 text-base font-semibold">{s.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-10 text-center">
              <Award className="mx-auto h-10 w-10 text-primary" />
              <h2 className="mt-4 text-2xl font-bold">
                ¿Empezamos por medir tu espacio?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Cuéntanos qué tienes en mente y te mandamos una proforma
                con medidas y precio en 48 horas.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild variant="premium" className="gap-2">
                  <Link href="/contacto">Solicitar cotización</Link>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/catalogo">Ver el catálogo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
