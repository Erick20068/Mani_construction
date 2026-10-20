// opencode enciende el taller
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronDown,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"

/**
 * Maquetacion comun de las paginas de contenido institucional.
 */

export interface InfoSection {
  title: string
  body: string
  icon?: LucideIcon
}

export interface FaqItem {
  question: string
  answer: string
}

export function InfoPage({
  eyebrow,
  title,
  intro,
  sections = [],
  faq = [],
  cta,
  children,
}: {
  eyebrow?: string
  title: string
  intro?: string
  sections?: InfoSection[]
  faq?: FaqItem[]
  cta?: { title: string; text: string; href: string; label: string }
  children?: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-transparent py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            {eyebrow && (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                {eyebrow}
              </span>
            )}
            <h1 className="mt-4 text-4xl font-bold tracking-tight">{title}</h1>
            {intro && (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {intro}
              </p>
            )}
          </div>
        </div>
      </section>

      {children}

      {sections.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sections.map((s) => (
                <Card key={s.title} className="h-full">
                  <CardContent className="p-6">
                    {s.icon && (
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <s.icon className="h-5 w-5" />
                      </div>
                    )}
                    <h2 className="text-lg font-semibold">{s.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {s.body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {faq.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-center">
                Preguntas frecuentes
              </h2>
              <div className="mt-8 space-y-3">
                {faq.map((f) => (
                  <details
                    key={f.question}
                    className="group rounded-xl border border-border bg-background"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-medium">
                      {f.question}
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                      {f.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {cta && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="p-10 text-center">
                <h2 className="text-2xl font-bold">{cta.title}</h2>
                <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                  {cta.text}
                </p>
                <Button asChild variant="premium" className="mt-6 gap-2">
                  <Link href={cta.href}>
                    {cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  )
}
