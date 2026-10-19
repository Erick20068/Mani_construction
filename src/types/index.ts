import type { User } from '@supabase/supabase-js'

export type UserRole = 'admin' | 'client' | 'viewer'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  avatar_id: string | null
  created_at: string
  updated_at: string
}

export interface CompanySettings {
  id: string
  name: string
  tagline: string | null
  ruc: string | null
  city: string | null
  manager_name: string | null
  manager_title: string | null
  email: string | null
  phone: string | null
  services: string | null
  guarantee: string | null
  material_label: string
  default_notes: string
  starting_number: number
  logo_url: string | null
  primary_color: string
  secondary_color: string
  created_at: string
  updated_at: string
}

export interface FurnitureCategory {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WoodType {
  id: string
  name: string
  scientific_name: string | null
  price_per_m3: number
  hardness_janka: number | null
  color_hex: string | null
  description: string | null
  image_url: string | null
  sustainability_cert: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Material {
  id: string
  name: string
  type: 'wood' | 'hardware' | 'finish' | 'fabric' | 'other'
  unit: 'm' | 'm2' | 'm3' | 'kg' | 'pcs' | 'ml'
  price_per_unit: number
  stock: number
  min_stock_alert: number
  supplier: string | null
  specs: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FurnitureItem {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  base_price: number
  images: string[]
  videos_3d: string[]
  materials: FurnitureMaterial[]
  wood_type_id: string | null
  dimensions: Dimensions
  weight_kg: number | null
  is_customizable: boolean
  lead_time_days: number
  featured: boolean
  published: boolean
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  
  // Relations
  category?: FurnitureCategory
  wood_type?: WoodType
}

export interface FurnitureMaterial {
  material_id: string
  quantity: number
  unit: string
  material?: Material
}

export interface Dimensions {
  width: number
  height: number
  depth: number
  unit: 'cm' | 'mm' | 'in'
}

export interface Proforma {
  id: string
  number: number
  date: string
  client_id: string | null
  client_name: string
  client_ruc: string | null
  client_phone: string | null
  client_address: string | null
  client_email: string | null
  material_label: string
  deposit: number
  notes: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  subtotal: number
  tax: number
  total: number
  valid_until: string
  pdf_url: string | null
  items: ProformaItem[]
  created_at: string
  updated_at: string
}

export interface ProformaItem {
  id: string
  proforma_id: string
  furniture_id: string | null
  custom_name: string | null
  description: string
  quantity: number
  unit_price: number
  total_price: number
  customizations: Record<string, unknown>
  sort_order: number
  furniture?: FurnitureItem
}

export interface Video3D {
  id: string
  furniture_id: string | null
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  duration_seconds: number | null
  type: 'showcase' | 'possible' | 'process'
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  
  furniture?: FurnitureItem
}

export interface AgentActivity {
  id: string
  agent_type: string
  action: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface CartItem {
  furniture_id: string
  furniture: FurnitureItem
  quantity: number
  customizations: {
    wood_type_id?: string
    dimensions?: Dimensions
    finish?: string
    fabric?: string
    hardware?: string
    [key: string]: unknown
  }
  calculated_price: number
}

// Agent types for avatar visualization
export type AgentType = 
  | 'senior-developer'
  | 'frontend-developer'
  | 'backend-developer'
  | 'devops-engineer'
  | 'designer'
  | 'product-manager'
  | 'qa-engineer'
  | 'tech-lead'
  | 'data-engineer'
  | 'security-engineer'
  | 'mobile-developer'
  | 'ml-engineer'
  | 'sre'

export const AGENT_AVATARS: Record<AgentType, { name: string; title: string; file: string }> = {
  'senior-developer': { name: 'Senior Developer', title: 'Arquitecto de Código', file: 'senior-developer-senior-developer.avatar.json' },
  'frontend-developer': { name: 'Frontend Developer', title: 'Especialista UI/UX', file: 'frontend-developer-frontend-developer.avatar.json' },
  'backend-developer': { name: 'Backend Developer', title: 'Ingeniero de Sistemas', file: 'backend-developer-backend-developer.avatar.json' },
  'devops-engineer': { name: 'DevOps Engineer', title: 'Automatizador de Infraestructura', file: 'devops-engineer-devops-engineer.avatar.json' },
  'designer': { name: 'Product Designer', title: 'Diseñador de Experiencia', file: 'designer-product-designer.avatar.json' },
  'product-manager': { name: 'Product Manager', title: 'Estratega de Producto', file: 'product-manager-product-manager.avatar.json' },
  'qa-engineer': { name: 'QA Engineer', title: 'Guardián de Calidad', file: 'qa-engineer-qa-engineer.avatar.json' },
  'tech-lead': { name: 'Tech Lead', title: 'Líder Técnico', file: 'tech-lead-tech-lead.avatar.json' },
  'data-engineer': { name: 'Data Engineer', title: 'Arquitecto de Datos', file: 'data-engineer-data-engineer.avatar.json' },
  'security-engineer': { name: 'Security Engineer', title: 'Guardián de Seguridad', file: 'security-engineer-security-engineer.avatar.json' },
  'mobile-developer': { name: 'Mobile Developer', title: 'Desarrollador Móvil', file: 'mobile-developer-mobile-developer.avatar.json' },
  'ml-engineer': { name: 'ML Engineer', title: 'Ingeniero de Machine Learning', file: 'ml-engineer-ml-engineer.avatar.json' },
  'sre': { name: 'Site Reliability Engineer', title: 'Ingeniero de Confiabilidad', file: 'sre-site-reliability-engineer.avatar.json' },
}

export const AGENT_STATUS_ANIMATIONS: Record<string, string[]> = {
  idle: ['idle'],
  working: ['working', 'coding', 'building', 'architecting'],
  thinking: ['thinking', 'architecting', 'modeling', 'planning'],
  reviewing: ['reviewing', 'auditing', 'monitoring'],
  debugging: ['debugging', 'hunting', 'incident'],
  incident: ['incident'],
  presenting: ['presenting', 'discovering'],
  learning: ['discovering', 'modeling', 'experimenting'],
}