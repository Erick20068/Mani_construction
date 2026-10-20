// opencode enciende el taller
import { notFound } from "next/navigation"
import Link from "next/link"
import { createServerSupabaseAdminClient } from "@/lib/supabase-admin"
import {
  ProductDetail,
  type ProductData,
  type ProductMaterial,
} from "@/components/catalog/ProductDetail"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Box, Package } from "lucide-react"

export const instant = false

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createServerSupabaseAdminClient()

  const { data: item } = await supabase
    .from("furniture_items")
    .select(
      `*,
       furniture_categories(name, slug),
       wood_types(name, color_hex)`
    )
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (!item) notFound()

  const [{ data: materials }, { data: related }] = await Promise.all([
    supabase
      .from("materials")
      .select("id, name, type, unit, price_per_unit, specs")
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("furniture_items")
      .select("id, name, slug, base_price, images")
      .eq("published", true)
      .eq("category_id", item.category_id)
      .neq("id", item.id)
      .limit(4),
  ])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6 gap-2">
          <Link href="/catalogo">
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>
        </Button>

        <ProductDetail
          product={item as unknown as ProductData}
          materials={(materials ?? []) as unknown as ProductMaterial[]}
        />

        {/* Relacionados */}
        {related && related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              También te puede interesar
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <Link key={r.id} href={`/catalogo/${r.slug}`}>
                  <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="aspect-4/3 overflow-hidden bg-muted">
                      {r.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.images[0]}
                          alt={r.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Box className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <p className="font-medium text-sm truncate">{r.name}</p>
                      <p className="text-sm font-bold text-primary mt-1">
                        S/ {Number(r.base_price).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
