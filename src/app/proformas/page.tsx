"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Minus, 
  Trash2, 
  Edit, 
  Eye, 
  Download, 
  FileText, 
  Send, 
  Loader2,
  Box,
  Package,
  Calculator,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Search,
  Filter,
  Grid,
  List,
  Heart,
  Share2,
  ExternalLink,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"

interface FurnitureItem {
  id: string
  name: string
  slug: string
  description: string | null
  base_price: number
  images: string[]
  videos_3d: string[]
  materials: any[]
  wood_type_id: string | null
  dimensions: { width: number; height: number; depth: number; unit: string }
  weight_kg: number | null
  is_customizable: boolean
  lead_time_days: number
  featured: boolean
  published: boolean
  furniture_categories?: { name: string; slug: string }
  wood_types?: { name: string; color_hex: string }
}

interface CartItem {
  id: string
  furniture_id: string
  furniture: FurnitureItem
  quantity: number
  customizations: {
    wood_type_id?: string
    dimensions?: { width: number; height: number; depth: number; unit: string }
    finish?: string
    fabric?: string
    hardware?: string
    [key: string]: any
  }
  calculated_price: number
}

interface ProformaFormData {
  client_name: string
  client_ruc: string
  client_phone: string
  client_address: string
  client_email: string
  material_label: string
  deposit: number
  notes: string
  valid_until: string
}

export default function ProformasPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productParam = searchParams.get("product")

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [availableItems, setAvailableItems] = useState<FurnitureItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'builder' | 'preview'>('builder')
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showCustomizeDialog, setShowCustomizeDialog] = useState<CartItem | null>(null)
  const [showClientForm, setShowClientForm] = useState(false)
  const [clientFormData, setClientFormData] = useState<ProformaFormData>({
    client_name: "",
    client_ruc: "",
    client_phone: "",
    client_address: "",
    client_email: "",
    material_label: "MATERIAL",
    deposit: 0,
    notes: "",
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  })

  const supabase = createClient()

  // Fetch available furniture items
  useEffect(() => {
    fetchAvailableItems()
  }, [])

  const fetchAvailableItems = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("furniture_items")
        .select(`
          *,
          furniture_categories(name, slug),
          wood_types(name, color_hex)
        `)
        .eq("published", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      setAvailableItems(data || [])
    } catch (err) {
      console.error("Error fetching items:", err)
      toast.error("Error al cargar el catálogo")
    } finally {
      setIsLoading(false)
    }
  }

  // Add item from URL param
  useEffect(() => {
    if (productParam && cartItems.length === 0) {
      const item = availableItems.find(i => i.id === productParam)
      if (item) {
        addToCart(item)
        toast.success(`${item.name} agregado a la proforma`)
        // Clean URL
        window.history.replaceState({}, document.title, "/proformas")
      }
    }
  }, [productParam, availableItems, cartItems.length])

  const categories = [...new Set(availableItems.map(i => i.furniture_categories?.slug).filter(Boolean))] as string[]

  const filteredItems = availableItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.furniture_categories?.slug === selectedCategory
    return matchesSearch && matchesCategory
  })

  const subtotal = cartItems.reduce((sum, item) => sum + item.calculated_price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.18 * 100) / 100
  const total = subtotal + tax

  const addToCart = (item: FurnitureItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.furniture_id === item.id && JSON.stringify(i.customizations) === JSON.stringify({}))
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, {
        id: crypto.randomUUID(),
        furniture_id: item.id,
        furniture: item,
        quantity: 1,
        customizations: {},
        calculated_price: item.base_price,
      }]
    })
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const openCustomize = (item: CartItem) => {
    setShowCustomizeDialog(item)
  }

  const handleCustomizationSave = (customizations: any) => {
    if (showCustomizeDialog) {
      setCartItems(prev => prev.map(item => 
        item.id === showCustomizeDialog.id 
          ? { ...item, customizations, calculated_price: calculateCustomPrice(showCustomizeDialog.furniture, customizations) }
          : item
      ))
      setShowCustomizeDialog(null)
      toast.success("Personalización guardada")
    }
  }

  const calculateCustomPrice = (furniture: FurnitureItem, customizations: any): number => {
    let price = furniture.base_price
    // Add logic for wood type, dimensions, finish, etc.
    return price
  }

  const generateProforma = async () => {
    if (cartItems.length === 0) {
      toast.error("Agrega al menos un item a la proforma")
      return
    }

    setShowClientForm(true)
  }

  const submitProforma = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const proformaItems = cartItems.map((item, index) => ({
        furniture_id: item.furniture_id,
        custom_name: item.furniture.name,
        description: `${item.furniture.name}${Object.keys(item.customizations).length ? ` - ${JSON.stringify(item.customizations)}` : ''}`,
        quantity: item.quantity,
        unit_price: item.calculated_price,
        total_price: item.calculated_price * item.quantity,
        customizations: item.customizations,
        sort_order: index,
      }))

      const { data: proforma, error } = await supabase
        .from("proformas")
        .insert({
          client_name: clientFormData.client_name,
          client_ruc: clientFormData.client_ruc || null,
          client_phone: clientFormData.client_phone || null,
          client_address: clientFormData.client_address || null,
          client_email: clientFormData.client_email || null,
          material_label: clientFormData.material_label,
          deposit: clientFormData.deposit,
          notes: clientFormData.notes,
          valid_until: clientFormData.valid_until,
          status: "draft",
          subtotal,
          tax,
          total,
        })
        .select()
        .single()

      if (error) throw error

      // Insert proforma items
      const itemsToInsert = proformaItems.map(item => ({
        ...item,
        proforma_id: proforma.id,
      }))

      const { error: itemsError } = await supabase
        .from("proforma_items")
        .insert(itemsToInsert)

      if (itemsError) throw itemsError

      toast.success("Proforma creada exitosamente")
      setShowClientForm(false)
      router.push(`/admin/proformas/${proforma.id}`)
    } catch (err) {
      console.error("Error generating proforma:", err)
      toast.error("Error al generar la proforma")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Generador de Proformas</h1>
                <p className="text-sm text-muted-foreground">Crea presupuestos profesionales en minutos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Package className="h-4 w-4" />
                <span>{cartItems.length} items</span>
              </div>
              <Button 
                variant="premium" 
                size="lg" 
                className="gap-2"
                onClick={generateProforma}
                disabled={cartItems.length === 0 || isGenerating}
                loading={isGenerating}
              >
                <FileText className="h-4 w-4" />
                Generar Proforma
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Cart Summary Bar */}
        <div className="mb-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-xl bg-background">
                  <p className="text-2xl font-bold text-foreground">{cartItems.length}</p>
                  <p className="text-xs text-muted-foreground">Productos</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-background">
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(subtotal)}</p>
                  <p className="text-xs text-muted-foreground">Subtotal</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-background">
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(tax)}</p>
                  <p className="text-xs text-muted-foreground">IVA (18%)</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-primary text-primary-foreground">
                  <p className="text-2xl font-bold">{formatCurrency(total)}</p>
                  <p className="text-xs text-primary-foreground/80">TOTAL</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Cart */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-20 h-fit">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Tu Proforma
                </CardTitle>
                <Badge variant="secondary">{cartItems.length} items</Badge>
              </CardHeader>
              <CardContent className="pb-0">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground mb-4">Tu proforma está vacía</p>
                    <p className="text-sm text-muted-foreground/70">
                      Agrega productos del catálogo para empezar
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {cartItems.map((cartItem, index) => (
                      <CartItemCard
                        key={cartItem.id}
                        item={cartItem}
                        index={index + 1}
                        onQuantityChange={updateQuantity}
                        onRemove={removeFromCart}
                        onCustomize={openCustomize}
                      />
                    ))}
                  <Separator className="my-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IVA (18%)</span>
                      <span className="font-medium">{formatCurrency(tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    className="w-full gap-2" 
                    variant="premium" 
                    size="lg"
                    onClick={generateProforma}
                    disabled={cartItems.length === 0 || isGenerating}
                    loading={isGenerating}
                  >
                    <FileText className="h-4 w-4" />
                    Generar Proforma
                  </Button>
                </CardFooter>
              </Card>
            </aside>

            {/* Main - Catalog & Builder */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="builder">
                    <Box className="h-4 w-4 mr-2" />
                    Catálogo y Constructor
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <Eye className="h-4 w-4 mr-2" />
                    Vista Previa Proforma
                  </TabsTrigger>
                </TabsList>

                {/* Catalog Tab */}
                <TabsContent value="builder" className="mt-4">
                  {/* Search & Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar muebles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Todas las categorías" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Items Grid */}
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1,2,3,4,5,6].map(i => <CatalogItemSkeleton key={i} />)}
                    </div>
                  ) : filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredItems.map(item => (
                        <CatalogItemCard 
                          key={item.id} 
                          item={item} 
                          inCart={cartItems.some(c => c.furniture_id === item.id)}
                          onAdd={addToCart}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Box className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">No hay productos que coincidan</p>
                    </div>
                  )}
                </TabsContent>

                {/* Preview Tab */}
                <TabsContent value="preview" className="mt-4">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                      <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">No hay items en la proforma</h3>
                      <p className="text-muted-foreground mb-6">Agrega productos desde la pestaña "Catálogo y Constructor"</p>
                      <Button variant="outline" onClick={() => setActiveTab('builder')}>
                        Ir al Catálogo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Proforma Preview */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Vista Previa de la Proforma
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ProformaPreview 
                            items={cartItems} 
                            clientData={clientFormData}
                            subtotal={subtotal}
                            tax={tax}
                            total={total}
                          />
                        </CardContent>
                      </Card>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-4">
                        <Button variant="outline" onClick={() => setShowClientForm(true)} className="flex-1 sm:flex-none gap-2">
                          <FileText className="h-4 w-4" />
                          Editar Datos Cliente
                        </Button>
                        <Button variant="secondary" onClick={() => setActiveTab('builder')} className="flex-1 sm:flex-none gap-2">
                          <ArrowLeft className="h-4 w-4" />
                          Seguir Agregando
                        </Button>
                        <Button 
                          variant="premium" 
                          className="flex-1 sm:flex-none gap-2"
                          onClick={generateProforma}
                          disabled={isGenerating}
                          loading={isGenerating}
                        >
                          <FileText className="h-4 w-4" />
                          Generar Proforma Final
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Customize Dialog */}
        <Dialog open={!!showCustomizeDialog} onOpenChange={open => !open && setShowCustomizeDialog(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Personalizar: {showCustomizeDialog?.furniture.name}</DialogTitle>
              <DialogDescription>
                Configura materiales, dimensiones y acabados. El precio se actualiza en tiempo real.
              </DialogDescription>
            </DialogHeader>
            <DialogContent className="max-h-[60vh] overflow-y-auto">
              {showCustomizeDialog && (
                <CustomizationForm 
                  item={showCustomizeDialog} 
                  onSave={handleCustomizationSave}
                  onCancel={() => setShowCustomizeDialog(null)}
                />
              )}
            </DialogContent>
          </DialogContent>
        </Dialog>

        {/* Client Form Dialog */}
        <Dialog open={showClientForm} onOpenChange={setShowClientForm}>
          <DialogContent className="max-w-lg max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Datos del Cliente y Proforma</DialogTitle>
              <DialogDescription>
                Completa la información para generar la proforma profesional.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submitProforma}>
              <DialogContent className="max-h-[70vh] overflow-y-auto p-6">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="client_name">Nombre del Cliente *</Label>
                      <Input
                        id="client_name"
                        value={clientFormData.client_name}
                        onChange={e => setClientFormData(prev => ({ ...prev, client_name: e.target.value }))}
                        placeholder="Juan Pérez"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="client_ruc">RUC</Label>
                      <Input
                        id="client_ruc"
                        value={clientFormData.client_ruc}
                        onChange={e => setClientFormData(prev => ({ ...prev, client_ruc: e.target.value }))}
                        placeholder="20123456789"
                        type="number"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="client_phone">WhatsApp / Teléfono</Label>
                      <Input
                        id="client_phone"
                        value={clientFormData.client_phone}
                        onChange={e => setClientFormData(prev => ({ ...prev, client_phone: e.target.value }))}
                        placeholder="+51 999 888 777"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="client_email">Email</Label>
                      <Input
                        id="client_email"
                        type="email"
                        value={clientFormData.client_email}
                        onChange={e => setClientFormData(prev => ({ ...prev, client_email: e.target.value }))}
                        placeholder="cliente@email.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="client_address">Dirección de Entrega</Label>
                    <Textarea
                      id="client_address"
                      value={clientFormData.client_address}
                      onChange={e => setClientFormData(prev => ({ ...prev, client_address: e.target.value }))}
                      placeholder="Av. Principal 123, Distrito, Ciudad"
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="material_label">Título de la Tabla</Label>
                      <Input
                        id="material_label"
                        value={clientFormData.material_label}
                        onChange={e => setClientFormData(prev => ({ ...prev, material_label: e.target.value }))}
                        defaultValue="MATERIAL"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="deposit">Abono Inicial</Label>
                      <Input
                        id="deposit"
                        type="number"
                        step="0.01"
                        min="0"
                        value={clientFormData.deposit}
                        onChange={e => setClientFormData(prev => ({ ...prev, deposit: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="valid_until">Válida Hasta *</Label>
                      <Input
                        id="valid_until"
                        type="date"
                        value={clientFormData.valid_until}
                        onChange={e => setClientFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      id="notes"
                      value={clientFormData.notes}
                      onChange={e => setClientFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Condiciones especiales, garantías, tiempos de entrega..."
                      rows={3}
                    />
                  </div>
                </div>
              </DialogContent>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowClientForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="premium" loading={isGenerating}>
                  <FileText className="h-4 w-4" />
                  Generar Proforma
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Cart Item Card
function CartItemCard({ item, index, onQuantityChange, onRemove, onCustomize }: {
  item: CartItem
  index: number
  onQuantityChange: (id: string, delta: number) => void
  onRemove: (id: string) => void
  onCustomize: (item: CartItem) => void
}) {
  const itemTotal = item.calculated_price * item.quantity

  return (
    <div className="flex gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted relative">
        {item.furniture.images?.[0] ? (
          <img src={item.furniture.images[0]} alt={item.furniture.name} className="w-full h-full object-cover" />
        ) : (
          <Box className="w-full h-full text-muted-foreground/50 flex items-center justify-center" />
        )}
        <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
          {index}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{item.furniture.name}</p>
        <p className="text-sm text-muted-foreground">{formatCurrency(item.calculated_price)} c/u</p>
        {Object.keys(item.customizations).length > 0 && (
          <Badge variant="outline" className="mt-1 text-xs gap-1">
            <Edit className="h-2.5 w-2.5" />
            Personalizado
          </Badge>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={() => onQuantityChange(item.id, -1)}>
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <Button variant="outline" size="icon" onClick={() => onQuantityChange(item.id, 1)}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <p className="font-bold text-foreground">{formatCurrency(item.calculated_price * item.quantity)}</p>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onCustomize(item)} title="Personalizar">
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)} title="Eliminar">
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Catalog Item Card
function CatalogItemCard({ item, inCart, onAdd }: { item: FurnitureItem; inCart: boolean; onAdd: (item: FurnitureItem) => void }) {
  const [imageIndex, setImageIndex] = useState(0)
  const images = item.images && item.images.length > 0 ? item.images : ["/placeholder-furniture.jpg"]

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={images[imageIndex] || images[0]}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setImageIndex(i) }}
                className={cn("w-1.5 h-1.5 rounded-full transition-all", i === imageIndex ? "bg-white" : "bg-white/50")}
              />
            ))}
          </div>
        )}
        <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1">
          {item.featured && <Badge className="bg-yellow-500 text-yellow-950" variant="default">★ Destacado</Badge>}
          {item.is_customizable && <Badge variant="outline" className="bg-white/90">Personalizable</Badge>}
          {item.wood_types && (
            <Badge variant="secondary" className="gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.wood_types.color_hex || "#8B6914" }} />
              {item.wood_types.name}
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="flex-1 p-4 space-y-3">
        <div className="flex items-center gap-2">
          {item.furniture_categories && <Badge variant="outline" className="text-xs">{item.furniture_categories.name}</Badge>}
          {item.videos_3d?.length && <Badge variant="secondary" className="text-xs gap-1"><Video className="h-3 w-3" />3D</Badge>}
        </div>
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
        {item.description && <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {item.dimensions && <span><Box className="h-3 w-3 mr-1 inline" />{item.dimensions.width}x{item.dimensions.height}x{item.dimensions.depth}{item.dimensions.unit}</span>}
          {item.lead_time_days && <span><Truck className="h-3 w-3 mr-1 inline" />{item.lead_time_days} días</span>}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xl font-bold text-foreground">{formatCurrency(Number(item.base_price))}</span>
          <Button 
            size="sm" 
            variant={inCart ? "secondary" : "premium"} 
            className="gap-1"
            onClick={() => onAdd(item)}
            disabled={inCart}
          >
            <Box className="h-3 w-3" />
            {inCart ? "Agregado" : "Agregar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Catalog Item Skeleton
function CatalogItemSkeleton() {
  return (
    <Card className="h-full">
      <div className="aspect-[4/3] bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
        <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="flex justify-between">
          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
          <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

// Proforma Preview Component
function ProformaPreview({ items, clientData, subtotal, tax, total }: {
  items: CartItem[]
  clientData: ProformaFormData
  subtotal: number
  tax: number
  total: number
}) {
  return (
    <div className="proforma-print max-w-3xl mx-auto bg-white p-8">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-primary">MADERAS & DISEÑO</h2>
            <p className="text-primary">Muebles a Medida · Ebanistería Fina</p>
          </div>
          <div className="text-right border-2 border-primary p-4 rounded-lg">
            <p className="text-2xl font-bold text-red-600">PROFORMA</p>
            <p className="text-sm">N° 001-2024</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="font-bold">Cliente:</p>
            <p>{clientData.client_name || "Por definir"}</p>
            <p>{clientData.client_ruc ? `RUC: ${clientData.client_ruc}` : ""}</p>
            <p>{clientData.client_phone ? `Tel: ${clientData.client_phone}` : ""}</p>
            <p>{clientData.client_email ? `Email: ${clientData.client_email}` : ""}</p>
          </div>
          <div className="text-right">
            <p className="font-bold">Fecha: {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p>Válida hasta: {clientData.valid_until ? new Date(clientData.valid_until).toLocaleDateString('es-ES') : "Por definir"}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            <th className="px-4 py-3 text-left">N°</th>
            <th className="px-4 py-3 text-left">{clientData.material_label || "MATERIAL"}</th>
            <th className="px-4 py-3 text-right">Cant.</th>
            <th className="px-4 py-3 text-right">Precio Unit.</th>
            <th className="px-4 py-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className="border-b border-border">
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">
                <p className="font-medium">{item.furniture.name}</p>
                {Object.keys(item.customizations).length > 0 && (
                  <p className="text-xs text-muted-foreground">Personalizado</p>
                )}
              </td>
              <td className="px-4 py-3 text-right">{item.quantity}</td>
              <td className="px-4 py-3 text-right">{formatCurrency(item.calculated_price)}</td>
              <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.calculated_price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="w-full max-w-xs ml-auto space-y-2">
        <div className="flex justify-between py-2 border-t border-border">
          <span>Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span>IVA (18%)</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>
        {clientData.deposit > 0 && (
          <div className="flex justify-between py-2 text-green-600">
            <span>Abono</span>
            <span className="font-medium">-{formatCurrency(clientData.deposit)}</span>
          </div>
        )}
        <div className="flex justify-between py-3 border-t-2 border-primary text-lg font-bold text-primary">
          <span>TOTAL</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {clientData.notes && (
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="font-bold mb-2">Notas:</p>
          <p className="text-sm">{clientData.notes}</p>
        </div>
      )}

      <div className="mt-12 grid grid-cols-2 gap-8 text-center text-sm">
        <div className="border-t border-border pt-4">
          <p className="font-bold">Aprobado por Maderas & Diseño</p>
          <p className="text-muted-foreground">Firma y Sello</p>
        </div>
        <div className="border-t border-border pt-4">
          <p className="font-bold">Aceptado por Cliente</p>
          <p className="text-muted-foreground">Firma</p>
        </div>
      </div>
    </div>
  )
}

// Customization Form
function CustomizationForm({ item, onSave, onCancel }: { item: CartItem; onSave: (customizations: any) => void; onCancel: () => void }) {
  const [customizations, setCustomizations] = useState(item.customizations || {})

  const handleChange = (field: string, value: any) => {
    setCustomizations(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Tipo de Madera</Label>
          <Select value={customizations.wood_type_id || ""} onValueChange={v => handleChange("wood_type_id", v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar madera" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="roble">Roble ($850/m³)</SelectItem>
              <SelectItem value="nogal">Nogal ($1,200/m³)</SelectItem>
              <SelectItem value="cedro">Cedro ($650/m³)</SelectItem>
              <SelectItem value="pino">Pino ($350/m³)</SelectItem>
              <SelectItem value="caoba">Caoba ($1,500/m³)</SelectItem>
              <SelectItem value="teka">Teka ($1,800/m³)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Acabado</Label>
          <Select value={customizations.finish || ""} onValueChange={v => handleChange("finish", v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar acabado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="natural">Natural (aceite/cera)</SelectItem>
              <SelectItem value="mate">Laca Mate</SelectItem>
              <SelectItem value="satinado">Laca Satín</SelectItem>
              <SelectItem value="brillante">Laca Brillante</SelectItem>
              <SelectItem value="tintado">Tintado a medida</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Dimensiones Personalizadas (cm)</Label>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1.5">
            <Label>Ancho</Label>
            <Input type="number" value={customizations.dimensions?.width || item.furniture.dimensions.width} onChange={e => handleChange("dimensions", { ...customizations.dimensions, width: parseFloat(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Alto</Label>
            <Input type="number" value={customizations.dimensions?.height || item.furniture.dimensions.height} onChange={e => handleChange("dimensions", { ...customizations.dimensions, height: parseFloat(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Profundo</Label>
            <Input type="number" value={customizations.dimensions?.depth || item.furniture.dimensions.depth} onChange={e => handleChange("dimensions", { ...customizations.dimensions, depth: parseFloat(e.target.value) })} />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Tela / Tapiz (si aplica)</Label>
        <Select value={customizations.fabric || ""} onValueChange={v => handleChange("fabric", v)}>
          <SelectTrigger><SelectValue placeholder="Seleccionar tela" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="lino">Lino Natural</SelectItem>
            <SelectItem value="algodon">Algodón Orgánico</SelectItem>
            <SelectItem value="terciopelo">Terciopelo</SelectItem>
            <SelectItem value="cuero">Cuero Genuino</SelectItem>
            <SelectItem value="ecocuero">Eco-cuero Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Herrajes</Label>
        <Select value={customizations.hardware || ""} onValueChange={v => handleChange("hardware", v)}>
          <SelectTrigger><SelectValue placeholder="Seleccionar herrajes" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="estandar">Estándar (incluido)</SelectItem>
            <SelectItem value="premium">Premium (bisagras suaves, tiradores diseño)</SelectItem>
            <SelectItem value="ocultos">Sistema Push-to-Open</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button variant="premium" onClick={() => onSave(customizations)}>
          Guardar Personalización
        </Button>
      </div>
    </div>
  )
}

import { Video, Truck } from "lucide-react"