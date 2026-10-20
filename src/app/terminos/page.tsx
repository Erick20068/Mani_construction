// opencode enciende el taller
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Condiciones de uso y venta de Maderas & Diseño",
}

const sections = [
  {
    title: "1. Objeto del servicio",
    body: "Maderas & Diseño (en adelante, la Empresa) ofrece el diseño, fabricación y venta de muebles a medida de madera, así como servicios de construcción y productos relacionados. Al registrarte y utilizar esta plataforma, aceptas las presentes condiciones.",
  },
  {
    title: "2. Proformas y precios",
    body: "Las proformas generadas en esta plataforma son presupuestos referenciales y tienen la vigencia indicada en el documento (por defecto 30 días). Los precios se expresan en soles (S/) e incluyen el IVA vigente salvo que se indique lo contrario. El precio final se confirma con la cotización revisada por un asesor comercial.",
  },
  {
    title: "3. Personalización",
    body: "El cliente puede elegir tipo de madera, dimensiones, herrajes y acabados. Los ajustes de precio mostrados en pantalla son estimados; la disponibilidad de cada material queda sujeta al stock real del taller.",
  },
  {
    title: "4. Plazos de entrega",
    body: "Los plazos indicados en cada mueble son orientativos y se cuentan desde la confirmación del pedido y la recepción del anticipo. Factores climáticos, medidas de largo y disponibilidad de materiales pueden modificar el plazo, en cuyo caso se comunica al cliente.",
  },
  {
    title: "5. Anticipos y pagos",
    body: "La reserva de la fabricación se realiza con un anticipo. El saldo se liquida contra la entrega, una vez que el cliente ha verificado el acabado y las medidas.",
  },
  {
    title: "6. Garantía",
    body: "Los muebles entregados conservan la garantía indicada en la proforma sobre defectos de fabricación de la madera y de los herrajes empleados. La garantía no cubre el desgaste por uso, la exposición a la humedad excesiva, las rayaduras por traslado ni los daños causados por terceros.",
  },
  {
    title: "7. Cambios y devoluciones",
    body: "Los muebles a medida son productos personalizados y, por tanto, no admiten devolución una vez iniciada la fabricación. Cualquier cambio debe solicitarse antes del inicio de la producción y queda sujeto a aprobación.",
  },
  {
    title: "8. Propiedad intelectual",
    body: "Los diseños, planos y modelos presentados son propiedad de la Empresa o de sus respectivos titulares. El cliente cuenta con licencia de uso limitada a la fabricación contratada.",
  },
  {
    title: "9. Responsabilidad",
    body: "La Empresa se responsabiliza por la calidad de los productos entregados y por el cumplimiento de los plazos acordados. No se responde por daños derivados del uso indebido, la falta de mantenimiento o los daños Curious durante el montaje por terceros.",
  },
  {
    title: "10. Ley aplicable y jurisdicción",
    body: "Estas condiciones se rigen por las leyes de la República del Perú. Cualquier controversia se somete a los jueces y tribunales del domicilio de la Empresa.",
  },
]

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-2">
          Términos y Condiciones
        </h1>
        <p className="text-muted-foreground text-sm">
          Última actualización: octubre 2026 · Maderas &amp; Diseño
        </p>

        <div className="mt-8 space-y-6">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-semibold text-primary">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-muted/40 p-5">
          <p className="text-sm">
            ¿Tienes dudas? Escríbenos a{" "}
            <a
              href="mailto:contacto@maderasydiseno.com"
              className="text-primary hover:underline"
            >
              contacto@maderasydiseno.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
