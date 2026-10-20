// opencode enciende el taller
import { Metadata } from "next"
import { InfoPage } from "@/components/content/InfoPage"
import { HelpCircle, Truck, Package, Ruler, CreditCard, Wrench } from "lucide-react"

export const metadata: Metadata = {
  title: "Preguntas Frecuentes",
  description: "Respuestas sobre materiales, precios, plazos, garantía y pedidos.",
}

export default function FaqPage() {
  return (
    <InfoPage
      eyebrow="Ayuda"
      title="Preguntas frecuentes"
      intro="Lo que más nos preguntan antes de encargar un mueble. Si no está aquí, escríbenos y lo respondemos al instante."
      sections={[
        {
          icon: Package,
          title: "¿Qué materiales ofrecen?",
          body: "Ocho especies de madera en stock permanente: roble, nogal, cedro, pino, caoba, teka, fresno y cerezo. Además tapicería lino, herrajes de latón y acabados con aceite natural o barniz mate.",
        },
        {
          icon: Ruler,
          title: "¿Cada mueble es distinto?",
          body: "Sí. Ninguna pieza sale de un catálogo cerrado: ajustamos medidas, herrajes y acabados a tu espacio y a tu uso.",
        },
        {
          icon: CreditCard,
          title: "¿Cómo se paga?",
          body: "Con un anticipo para reservar la fecha de fabricación y el saldo contra la entrega, una vez revisado el acabado. Aceptamos transferencia, Yape y tarjeta.",
        },
        {
          icon: Wrench,
          title: "¿Puedo ver el proceso?",
          body: "Sí. En la galería 3D muestramos el taller, el ensamble y el acabado. Si quieres verlo en persona, coordinamos una visita al taller.",
        },
      ]}
      faq={[
        {
          question: "¿Cuánto tarda un mueble a medida?",
          answer:
            "Entre 14 y 35 días según la pieza y la disponibilidad de la madera. Cada producto del catálogo indica su plazo estimado, y te lo confirmamos por escrito en la proforma.",
        },
        {
          question: "¿Los precios del catálogo incluyen IVA?",
          answer:
            "No. Los precios son netos; el IVA se aplica al momento de facturar. La proforma lo deja indicado para que no haya sorpresas.",
        },
        {
          question: "¿La madera es maciza o laminada?",
          answer:
            "Maciza en toda la estructura. Solo usamos contrachapado en respaldos y en la caja de los muebles cuando eso aporta rigidez sin sacrificio de estabilidad.",
        },
        {
          question: "¿Puedo cambiar el material después de confirmar?",
          answer:
            "Sí, siempre que el mueble no haya entrado a producción. Después de ese punto ya no, porque la pieza está cortada a medida.",
        },
        {
          question: "¿Hacen envío a todo el Perú?",
          answer:
            "Sí. En Lima Metropolitana la entrega e instalación las hacemos nosotros sin costo adicional. Al interior del país, coordinamos el flete con el destino.",
        },
        {
          question: "¿Qué cubre la garantía?",
          answer:
            "Cinco años sobre defectos de fabricación de la madera y de los herrajes. No cubre desgaste por uso, humedad excesiva ni daños por montaje de terceros.",
        },
        {
          question: "¿Puedo ver el mueble antes de pagar el saldo?",
          answer:
            "Por supuesto. La forma habitual es revisarlo en el taller antes de la entrega. Si prefieres, te enviamos fotos y video del acabado terminado.",
        },
      ]}
      cta={{
        title: "¿No encontramos tu respuesta?",
        text: "Escríbenos por WhatsApp y te respondemos el mismo día. También podemos pasar a tomar medidas.",
        href: "/contacto",
        label: "Ir a contacto",
      }}
    />
  )
}
