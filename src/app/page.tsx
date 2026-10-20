import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Home, 
  Hammer, 
  Box, 
  Sparkles, 
  Video, 
  FileText,
  ArrowRight,
  CheckCircle,
  Shield,
  Truck,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Box,
    title: "Catálogo de Muebles",
    description: "Explora nuestra colección de muebles personalizables: salas, comedores, dormitorios, oficinas y exteriores.",
    href: "/catalogo",
  },
  {
    icon: Hammer,
    title: "Materiales y Maderas",
    description: "Selecciona entre 8+ tipos de madera (Roble, Nogal, Cedro, Teka, etc.) y materiales con precios en tiempo real.",
    href: "/catalogo?view=materials",
  },
  {
    icon: Video,
    title: "Galería 3D Interactiva",
    description: "Visualiza muebles en 3D con rotación, zoom, vista explotada y modo AR para verlos en tu espacio.",
    href: "/galeria-3d",
  },
  {
    icon: FileText,
    title: "Generador de Proformas",
    description: "Crea presupuestos profesionales al instante. Configura materiales, dimensiones y descarga PDF listo para enviar.",
    href: "/proformas",
  },
  {
    icon: Sparkles,
    title: "Diseño a Medida",
    description: "¿No encuentras lo que buscas? Nuestro equipo diseña y fabrica muebles únicos según tus especificaciones.",
    href: "/contacto",
  },
  {
    icon: Shield,
    title: "Garantía y Calidad",
    description: "Madera certificada, acabados premium y garantía en todos nuestros productos. Construcción que perdura.",
    href: "/nosotros",
  },
]

const stats = [
  { value: "15+", label: "Años en Construcción" },
  { value: "500+", label: "Proyectos Entregados" },
  { value: "8+", label: "Tipos de Madera" },
  { value: "50+", label: "Diseños en Catálogo" },
]

const benefits = [
  { icon: CheckCircle, text: "Madera certificada FSC" },
  { icon: CheckCircle, text: "Precios directos de fábrica" },
  { icon: CheckCircle, text: "Envío a todo el país" },
  { icon: CheckCircle, text: "Asesoría técnica gratis" },
  { icon: CheckCircle, text: "Financiamiento disponible" },
  { icon: CheckCircle, text: "Garantía 5 años" },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5" />
        
        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-in stagger-1">
              <Sparkles className="h-4 w-4" />
              <span>Nueva línea de muebles premium · Construcción que inspira</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6 animate-in stagger-2 text-balance">
              Muebles que
              <br />
              <span className="gradient-text">cuentan historias</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in stagger-3 text-balance">
              De la construcción a la ebanistería fina. Diseñamos y fabricamos muebles 
              personalizados con maderas nobles, precisión milimétrica y pasión por el detalle.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in stagger-4">
              <Button size="xl" className="gap-2" asChild>
                <Link href="/catalogo">
                  Explorar Catálogo
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" className="gap-2" asChild>
                <Link href="/galeria-3d">
                  <Video className="h-5 w-5" />
                  Ver Galería 3D
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 animate-in stagger-5">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="h-8 w-8 text-primary/50 rotate-90" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Todo lo que necesitas para tu proyecto
            </h2>
            <p className="text-lg text-muted-foreground">
              Desde la selección de materiales hasta la entrega final, nuestra plataforma 
              te acompaña en cada paso.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card 
                key={feature.title} 
                className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20 animate-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-1" asChild>
                    <Link href={feature.href}>
                      Ver más <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Por qué elegir Maderas & Diseño
            </h2>
            <p className="text-lg text-muted-foreground">
              La experiencia de una constructora, la precisión de un ebanista.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-4 p-6 bg-background rounded-xl border border-border/50 hover:border-primary/20 transition-colors animate-in">
                <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <span className="text-foreground font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <Card className="bg-gradient-to-r from-primary via-primary/80 to-secondary max-w-4xl mx-auto text-center p-12 md:p-16">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¿Listo para tu próximo proyecto?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Solicita tu proforma sin compromiso. Nuestro equipo te asesora en la 
                elección de maderas, acabados y diseño.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="xl" variant="secondary" className="gap-2" asChild>
                  <Link href="/proformas/nueva">
                    Crear Proforma
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 gap-2" asChild>
                  <Link href="/contacto">
                    <Users className="h-5 w-5" />
                    Hablar con Asesor
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer Preview */}
      <footer className="bg-muted/30 py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Maderas & Diseño</h3>
              <p className="text-muted-foreground text-sm">
                De la construcción a la ebanistería fina. Muebles que perduran generaciones.
              </p>
            </div>
            <nav>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/catalogo" className="hover:text-primary transition-colors">Catálogo</Link></li>
                <li><Link href="/galeria-3d" className="hover:text-primary transition-colors">Galería 3D</Link></li>
                <li><Link href="/proformas" className="hover:text-primary transition-colors">Proformas</Link></li>
                <li><Link href="/materiales" className="hover:text-primary transition-colors">Materiales</Link></li>
                <li><Link href="/taller" className="hover:text-primary transition-colors">El Taller (agentes)</Link></li>
              </ul>
            </nav>
            <nav>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/nosotros" className="hover:text-primary transition-colors">Nosotros</Link></li>
                <li><Link href="/proyectos" className="hover:text-primary transition-colors">Proyectos</Link></li>
                <li><Link href="/certificaciones" className="hover:text-primary transition-colors">Certificaciones</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </nav>
            <nav>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/faq" className="hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
                <li><Link href="/garantia" className="hover:text-primary transition-colors">Garantía</Link></li>
                <li><Link href="/envios" className="hover:text-primary transition-colors">Envíos</Link></li>
                <li><Link href="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
              </ul>
            </nav>
          </div>
          <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 Maderas & Diseño. Todos los derechos reservados.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
              <a href="#" className="hover:text-primary transition-colors">Términos</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}