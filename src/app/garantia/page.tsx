// opencode enciende el taller
import { Metadata } from "next"
import { InfoPage } from "@/components/content/InfoPage"
import { ShieldCheck, Wrench, Droplets, Package, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Garantía",
  description: "Cinco años de garantía en fabricación de madera y herrajes.",
}

export default function garantiaPage() {
  return (
    <InfoPage
      eyebrow="Cobertura"
      title="Garantía de 5 años"
      intro="Respaldamos lo que fabricamos. Si una pieza falla por nuestra causa, la reparamos o la reponemos sin discusión."
      sections={[
        {
          icon: ShieldCheck,
          title: "Qué cubre",
          body: "Defectos de fabricación en la madera: cuñas, grietas de secado, uniones que se abren o se despegaron. También la falla de fábrica de los herrajes que instalamos.",
        },
        {
          icon: Wrench,
          title: "Cómo la aplicamos",
          body: "Nos escribes o llamas, mandas fotos del daño y coordinamos la visita al domicilio. Si el daño es cubierto, reparamos sin costo de deslocamiento, mano de obra ni repuesto.",
        },
        {
          icon: FileText,
          title: "Qué necesitas",
          body: "La proforma o el número de orden de taller, más evidencia fotográfica del problema. Con eso activamos la garantía en el momento.",
        },
        {
          icon: Droplets,
          title: "Qué no cubre",
          body: "Desgaste por uso normal, exposición a humedad excesiva o encharcamiento, deformación por calor directo, rayaduras por traslado y daños provocados por terceros o por montaje ajeno.",
        },
        {
          icon: Package,
          title: "Documentación",
          body: "Cada entrega incluye el certificado de garantía con el número de orden, la fecha y el detalle de acabados y herrajes empleados.",
        },
      ]}
      faq={[
        {
          question: "¿La garantía es transferible?",
          answer:
            "Sí. Si vendes la casa o el mueble, la cobertura sigue vigente durante el período restante.",
        },
        {
          question: "¿Cubre la madera con movimientos de humedad?",
          answer:
            "La madera es un material vivo: se expande y se contrae con la humedad. Eso es comportamiento normal y no es un defecto. Sí lo sería una grieta de secado que se abra con el tiempo.",
        },
        {
          question: "¿Cuánto demora una reparación por garantía?",
          answer:
            "Entre 5 y 15 días hábiles según la disponibilidad de material y taller. La urgencia la evaluamos en la visita.",
        },
      ]}
      cta={{
        title: "Ya tienes tu mueble y notas un problema?",
        text: "Escríbenos con fotos y revisamos la cobertura sin costo.",
        href: "/contacto",
        label: "Reportar un problema",
      }}
    />
  )
}
