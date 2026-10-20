// opencode enciende el taller
import { Metadata } from "next"
import { InfoPage } from "@/components/content/InfoPage"
import { Award, Leaf, HardHat, CheckCircle2, FileCheck2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Certificaciones",
  description: "Maderas con origen, mano de obra calificada y control de calidad.",
}

export default function certificacionesPage() {
  return (
    <InfoPage
      eyebrow="Confianza"
      title="Certificaciones y compromiso"
      intro="No tenemos sellos de third-party que mostrar, pero sí procesos documentados y proveedores verificados. Esto es lo que sostiene cada mueble que sale de nuestro taller."
      sections={[
        {
          icon: Leaf,
          title: "Madera con trazabilidad",
          body: "Compramos en bosques con manejo responsable y ficha de origen por lote. Cada tabla de nogal o caoba llega con su registro de procedencia.",
        },
        {
          icon: HardHat,
          title: "Maestros con oficio",
          body: "El equipo de taller lleva más de quince años entre corte, canteado, ensamble y acabado. La cuadrilla trabaja con fichas de proceso por pieza.",
        },
        {
          icon: CheckCircle2,
          title: "Control de calidad en tres puntos",
          body: "Revisamos la madera antes de cortar, el ensamble antes de-Acabado y la pieza terminada antes de pintar. Lo que no pasa los tres, no sale del taller.",
        },
        {
          icon: FileCheck2,
          title: "Documentación de entrega",
          body: "Cada entrega incluye certificado de garantía, ficha de materiales con origen y el detalle de herrajes y acabados empleados.",
        },
        {
          icon: Award,
          title: "Garantía respaldada",
          body: "Cinco años de garantía sobre defectos de fabricación. No es una promesa de papel: es un taller con capacidad real de reparar lo que hizo.",
        },
      ]}
      faq={[
        {
          question: "¿Trabajan con madera certificada FSC?",
          answer:
            "Trabajamos con proveedores que manejan bosques de forma responsable y priorizamos especies locales. Podemos facilitar la ficha de origen del lote usado en tu mueble.",
        },
        {
          question: "¿El barniz es de base agua?",
          answer:
            "Sí. Ofrecemos acabado con aceite natural y barniz poliuretano de base agua en versión mate. Ningún acabado contiene solventes pesados.",
        },
      ]}
      cta={{
        title: "¿Quieres ver el taller antes de decidir?",
        text: "Te mostramos el proceso completo, desde la elección de la tabla hasta el acabado.",
        href: "/galeria-3d",
        label: "Ver la galería 3D",
      }}
    />
  )
}
