// opencode enciende el taller
import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  CheckCircle2,
  FileText,
  MessageCircle,
  Send,
  Clock,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Hablemos de tu mueble: visita, medidas y propuesta en 48 horas.",
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-transparent py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight">
              Cuéntanos qué tienes en mente
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Respondemos en menos de 24 horas hábiles. Si ya tienes medidas,
              adjúntalas y te Mandamos proforma el mismo día.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* Formulario */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Solicitar cotización
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Los campos marcados son obligatorios.
                </p>

                <ContactForm />
              </CardContent>
            </Card>

            {/* Datos */}
            <aside className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-5">
                  <h3 className="font-semibold">Datos de contacto</h3>

                  <Info
                    icon={Phone}
                    label="Teléfono / WhatsApp"
                    value="+51 999 888 777"
                    href="tel:+51999888777"
                  />
                  <Info
                    icon={Mail}
                    label="Email"
                    value="contacto@maderasydiseno.com"
                    href="mailto:contacto@maderasydiseno.com"
                  />
                  <Info
                    icon={MapPin}
                    label="Taller y showroom"
                    value="Av. Los Frutales 1420, Los Olivos, Lima"
                  />
                  <Info
                    icon={Clock}
                    label="Horario"
                    value="Lun a Vie 9:00–19:00 · Sáb 10:00–14:00"
                  />
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    ¿Prefieres WhatsApp?
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Escríbenos y te mandamos el catálogo digital con
                    precios actualizados y las últimas piezas del taller.
                  </p>
                  <Button asChild variant="premium" className="mt-4 w-full">
                    <a
                      href="https://wa.me/51999888777"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Empresas y constructoras
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Trabajamos como proveedor de carpintería para estudios y
                    constructoras. Pedidos recurrentes, factura y entrega
                    programa.
                  </p>
                  <Button asChild variant="outline" className="mt-4 w-full">
                    <Link href="/proformas">Pedir proforma</Link>
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}

function Info({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  href?: string
}) {
  const body = (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  )

  return href ? (
    <a href={href} className="block transition-opacity hover:opacity-70">
      {body}
    </a>
  ) : (
    body
  )
}

function ContactForm() {
  return (
    <form
      action="mailto:contacto@maderasydiseno.com"
      method="post"
      encType="text/plain"
      className="mt-6 space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre *" name="nombre" placeholder="Tu nombre" required />
        <Field label="Empresa" name="empresa" placeholder="Opcional" />
        <Field label="Email *" name="email" type="email" placeholder="tu@email.com" required />
        <Field label="Teléfono *" name="telefono" placeholder="+51 999 888 777" required />
      </div>

      <div>
        <label htmlFor="tipo" className="text-sm font-medium">
          ¿Qué necesitas?
        </label>
        <select
          id="tipo"
          name="tipo"
          className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          defaultValue="Mueble a medida"
        >
          <option>Mueble a medida</option>
          <option>Reforma de cocina</option>
          <option>Mobiliario de oficina</option>
          <option>Proyecto de construcción</option>
          <option>Proveedor para constructora</option>
          <option>Otro</option>
        </select>
      </div>

      <div>
        <label htmlFor="mensaje" className="text-sm font-medium">
          Cuéntanos *
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          required
          placeholder="Medidas aproximadas, tipo de mueble, plazos…"
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
        <p>
          Al enviar se abre tu gestor de correo con el mensaje ya redactado.
          Si prefieres, escríbenos directo por WhatsApp.
        </p>
      </div>

      <Button type="submit" variant="premium" size="lg" className="w-full gap-2">
        <Send className="h-4 w-4" />
        Enviar solicitud
      </Button>
    </form>
  )
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  )
}
