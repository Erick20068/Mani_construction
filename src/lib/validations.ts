import { z } from 'zod'

export const companySettingsSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  tagline: z.string().max(200).optional().nullable(),
  ruc: z.string().regex(/^\d{11}$/, 'RUC debe tener 11 dígitos').optional().nullable().or(z.literal('')),
  city: z.string().max(100).optional().nullable(),
  manager_name: z.string().max(100).optional().nullable(),
  manager_title: z.string().max(100).optional().nullable(),
  email: z.string().email('Email inválido').optional().nullable().or(z.literal('')),
  phone: z.string().max(20).optional().nullable(),
  services: z.string().max(1000).optional().nullable(),
  guarantee: z.string().max(500).optional().nullable(),
  material_label: z.string().min(1).default('MATERIAL'),
  default_notes: z.string().max(1000).optional().nullable(),
  starting_number: z.number().int().positive().default(1),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#1a3a5c'),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#2a8fb5'),
})

export const furnitureCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
})

export const woodTypeSchema = z.object({
  name: z.string().min(2).max(100),
  scientific_name: z.string().max(100).optional().nullable(),
  price_per_m3: z.number().positive(),
  hardness_janka: z.number().int().positive().optional().nullable(),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  sustainability_cert: z.string().max(100).optional().nullable(),
  is_active: z.boolean().default(true),
})

export const materialSchema = z.object({
  name: z.string().min(2).max(100),
  type: z.enum(['wood', 'hardware', 'finish', 'fabric', 'other']),
  unit: z.enum(['m', 'm2', 'm3', 'kg', 'pcs', 'ml']),
  price_per_unit: z.number().positive(),
  stock: z.number().int().min(0).default(0),
  min_stock_alert: z.number().int().min(0).default(10),
  supplier: z.string().max(200).optional().nullable(),
  specs: z.record(z.unknown()).default({}),
  is_active: z.boolean().default(true),
})

export const dimensionsSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  depth: z.number().positive(),
  unit: z.enum(['cm', 'mm', 'in']).default('cm'),
})

export const furnitureMaterialSchema = z.object({
  material_id: z.string().uuid(),
  quantity: z.number().positive(),
  unit: z.string().min(1),
})

export const furnitureItemSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional().nullable(),
  base_price: z.number().positive(),
  images: z.array(z.string().url()).default([]),
  videos_3d: z.array(z.string().url()).default([]),
  materials: z.array(furnitureMaterialSchema).default([]),
  wood_type_id: z.string().uuid().optional().nullable(),
  dimensions: dimensionsSchema,
  weight_kg: z.number().positive().optional().nullable(),
  is_customizable: z.boolean().default(true),
  lead_time_days: z.number().int().positive().default(14),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  meta_title: z.string().max(100).optional().nullable(),
  meta_description: z.string().max(300).optional().nullable(),
})

export const proformaItemSchema = z.object({
  furniture_id: z.string().uuid().optional().nullable(),
  custom_name: z.string().max(200).optional().nullable(),
  description: z.string().min(1, 'La descripción es requerida').max(500),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
  customizations: z.record(z.unknown()).default({}),
})

export const proformaSchema = z.object({
  client_id: z.string().uuid().optional().nullable(),
  client_name: z.string().min(2, 'Nombre del cliente requerido').max(200),
  client_ruc: z.string().regex(/^\d{11}$/, 'RUC debe tener 11 dígitos').optional().nullable().or(z.literal('')),
  client_phone: z.string().max(20).optional().nullable(),
  client_address: z.string().max(500).optional().nullable(),
  client_email: z.string().email('Email inválido').optional().nullable().or(z.literal('')),
  material_label: z.string().min(1).default('MATERIAL'),
  deposit: z.number().min(0).default(0),
  notes: z.string().max(2000).optional().nullable(),
  valid_until: z.string().refine((date) => !isNaN(Date.parse(date)), 'Fecha inválida'),
  items: z.array(proformaItemSchema).min(1, 'Al menos un ítem es requerido'),
})

export const video3dSchema = z.object({
  furniture_id: z.string().uuid().optional().nullable(),
  title: z.string().min(2).max(200),
  description: z.string().max(1000).optional().nullable(),
  video_url: z.string().url(),
  thumbnail_url: z.string().url().optional().nullable(),
  duration_seconds: z.number().int().positive().optional().nullable(),
  type: z.enum(['showcase', 'possible', 'process']),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
})

export const authSchema = {
  login: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
  }),
  register: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    full_name: z.string().min(2, 'Nombre requerido').max(100),
  }),
  resetPassword: z.object({
    email: z.string().email('Email inválido'),
  }),
  updatePassword: z.object({
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  }),
}

export type CompanySettingsForm = z.infer<typeof companySettingsSchema>
export type FurnitureCategoryForm = z.infer<typeof furnitureCategorySchema>
export type WoodTypeForm = z.infer<typeof woodTypeSchema>
export type MaterialForm = z.infer<typeof materialSchema>
export type FurnitureItemForm = z.infer<typeof furnitureItemSchema>
export type ProformaForm = z.infer<typeof proformaSchema>
export type ProformaItemForm = z.infer<typeof proformaItemSchema>
export type Video3DForm = z.infer<typeof video3dSchema>