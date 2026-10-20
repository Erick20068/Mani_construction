// opencode enciende el taller
import { Metadata } from "next"
import { InfoPage } from "@/components/content/InfoPage"
import { Truck, MapPin, Package, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Envíos e Instalación",
  description: "Entrega en Lima Metropolitana e interior del Perú.",
}

export default function enviosPage() {
  return (
    <InfoPage
      eyebrow="Logística"
      title="Envíos e instalación"
      intro="Entregamos e instalamos nosotros en Lima Metropolitana. Al interior del país, coordinamos el flete y el montaje con el destino."
      sections={[
        {
          icon: MapPin,
          title: "Lima Metropolitana",
          body: "Entrega e instalación sin costo adicional dentro de Lima, Callao y Lima Provincias. Incluemos el montaje en obra y la retiro de embalajes.",
        },
        {
          icon: Truck,
          title: "Interior del Perú",
          body: "Envío por flete terrestre con seguro a todo el país. El montaje se coordina con un instalador de la zona o te enviamos las indicaciones de montaje.",
        },
        {
          icon: Package,
          title: "Embalaje",
          body: "Cada pieza viaja con protección de esquina, film y dos capas de cartón. Los herrajes van en una caja aparte identificada para evitar pérdidas.",
        },
        {
          icon: Phone,
          title: "Coordinación",
          body: "Confirmamos la fecha por WhatsApp el día anterior. Si necesitas una fecha específica, la fijamos en la proforma.",
        },
      ]}
      faq={[
        {
          question: "¿Cuánto cuesta el envío?",
          answer:
            "En Lima Metropolitana no tiene costo. Al interior del país se cotiza según volumen, destino y si incluye instalación. Te lo informamos en la proforma antes de confirmar.",
        },
        {
          question: "¿Puedo recoger el mueble en el taller?",
          answer:
            "Sí. Indícalo al confirmar el pedido y coordinamos la hora. El pago debe completarse antes de la entrega.",
        },
        {
          question: "¿Qué pasa si se daña en el transporte?",
          answer:
            "Va asegurado. Reporta el daño con fotos dentro de las 48 horas posteriores a la recepción y gestionamos el reclamo o la reposición.",
        },
        {
          question: "¿El montaje incluye obras menores?",
          answer:
            "Incluye el montaje del mueble y la fijación a pared cuando corresponde. No incluye instalación eléctrica ni obra de albañilería; si el cliente las requiere, las cotizamos aparte.",
        },
      ]}
      cta={{
        title: "¿Calculamos el flete a tu ciudad?",
        text: "Pídenos la dirección de entrega y te confirmamos el costo y el tiempo.",
        href: "/contacto",
        label: "Consultar envío",
      }}
    />
  )
}
