// opencode enciende el taller
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Cómo tratamos tus datos personales en Maderas & Diseño",
}

const sections = [
  {
    title: "1. Responsable del tratamiento",
    body: "Maderas & Diseño es responsable del tratamiento de los datos personales que recabamos a través de esta plataforma y de los sistemas de gestión interna del taller.",
  },
  {
    title: "2. Datos que recabamos",
    body: "Registramos nombre, correo electrónico y los datos de contacto que nos facilitas para elaborar proformas (RUC, teléfono, dirección de entrega). Si utilizas el área de administración, también se registran las operaciones de gestión de catálogo, materiales y presupuestos.",
  },
  {
    title: "3. Para qué los usamos",
    body: "Usamos tus datos para gestionar tu cuenta, elaborar y seguimiento de proformas, coordinar la fabricación y la entrega de tus pedidos, y contactarte sobre el estado de tu solicitud. También para cumplir obligaciones legales y contables.",
  },
  {
    title: "4. Base legal",
    body: "El tratamiento se basa en tu consentimiento al registrarte, en la ejecución del contrato de venta o fabricación, y en el cumplimiento de obligaciones legales aplicables.",
  },
  {
    title: "5. Almacenamiento y seguridad",
    body: "Los datos se almacenan en servidores de Supabase, con cifrado en tránsito y en reposo, y con políticas de control de acceso por roles (administrador y cliente). El acceso interno se realiza únicamente por personal autorizado.",
  },
  {
    title: "6. Compartir con terceros",
    body: "No vendemos tus datos. Solo los compartimos con proveedores de servicios que nos ayudan a operar el negocio, como la plataforma de hosting, los servicios de correo y la pasarela de pagos, siempre bajo acuerdos de confidencialidad y solo en la medida necesaria.",
  },
  {
    title: "7. Conservación",
    body: "Conservamos los datos mientras tu cuenta esté activa y, tras su cierre, durante los plazos exigidos por la normativa fiscal y contable. Las proformas y sus comprobantes se mantienen por el tiempo necesario para la acreditación de las operaciones.",
  },
  {
    title: "8. Tus derechos",
    body: "Puedes solicitar el acceso, la rectificación, la supresión o la portabilidad de tus datos escribiendo a nuestro correo de contacto. Responderemos dentro de los plazos previstos por la normativa de protección de datos.",
  },
  {
    title: "9. Cookies y tecnologías similares",
    body: "Utilizamos cookies técnicas necesarias para mantener tu sesión iniciada y recordar tus preferencias. No utilizamos cookies publicitarias ni de seguimiento de terceros sin tu consentimiento previo.",
  },
  {
    title: "10. Cambios en esta política",
    body: "Podemos actualizar esta política para reflejar cambios legales o del servicio. Cualquier modificación se publicará en esta página con la fecha de actualización correspondiente.",
  },
]

export default function PrivacidadPage() {
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
          Política de Privacidad
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
            Para cualquier consulta sobre tus datos:{" "}
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
