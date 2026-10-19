// Supabase Database Types
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'client' | 'viewer'
          avatar_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'client' | 'viewer'
          avatar_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'client' | 'viewer'
          avatar_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      company_settings: {
        Row: {
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
        Insert: {
          id?: string
          name: string
          tagline?: string | null
          ruc?: string | null
          city?: string | null
          manager_name?: string | null
          manager_title?: string | null
          email?: string | null
          phone?: string | null
          services?: string | null
          guarantee?: string | null
          material_label?: string
          default_notes?: string
          starting_number?: number
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          tagline?: string | null
          ruc?: string | null
          city?: string | null
          manager_name?: string | null
          manager_title?: string | null
          email?: string | null
          phone?: string | null
          services?: string | null
          guarantee?: string | null
          material_label?: string
          default_notes?: string
          starting_number?: number
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          created_at?: string
          updated_at?: string
        }
      }
      furniture_categories: {
        Row: {
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
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      wood_types: {
        Row: {
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
        Insert: {
          id?: string
          name: string
          scientific_name?: string | null
          price_per_m3: number
          hardness_janka?: number | null
          color_hex?: string | null
          description?: string | null
          image_url?: string | null
          sustainability_cert?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          scientific_name?: string | null
          price_per_m3?: number
          hardness_janka?: number | null
          color_hex?: string | null
          description?: string | null
          image_url?: string | null
          sustainability_cert?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      materials: {
        Row: {
          id: string
          name: string
          type: 'wood' | 'hardware' | 'finish' | 'fabric' | 'other'
          unit: 'm' | 'm2' | 'm3' | 'kg' | 'pcs' | 'ml'
          price_per_unit: number
          stock: number
          min_stock_alert: number
          supplier: string | null
          specs: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'wood' | 'hardware' | 'finish' | 'fabric' | 'other'
          unit: 'm' | 'm2' | 'm3' | 'kg' | 'pcs' | 'ml'
          price_per_unit: number
          stock?: number
          min_stock_alert?: number
          supplier?: string | null
          specs?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'wood' | 'hardware' | 'finish' | 'fabric' | 'other'
          unit?: 'm' | 'm2' | 'm3' | 'kg' | 'pcs' | 'ml'
          price_per_unit?: number
          stock?: number
          min_stock_alert?: number
          supplier?: string | null
          specs?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      furniture_items: {
        Row: {
          id: string
          category_id: string
          name: string
          slug: string
          description: string | null
          base_price: number
          images: string[]
          videos_3d: string[]
          materials: Json
          wood_type_id: string | null
          dimensions: Json
          weight_kg: number | null
          is_customizable: boolean
          lead_time_days: number
          featured: boolean
          published: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          slug: string
          description?: string | null
          base_price: number
          images?: string[]
          videos_3d?: string[]
          materials?: Json
          wood_type_id?: string | null
          dimensions?: Json
          weight_kg?: number | null
          is_customizable?: boolean
          lead_time_days?: number
          featured?: boolean
          published?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          slug?: string
          description?: string | null
          base_price?: number
          images?: string[]
          videos_3d?: string[]
          materials?: Json
          wood_type_id?: string | null
          dimensions?: Json
          weight_kg?: number | null
          is_customizable?: boolean
          lead_time_days?: number
          featured?: boolean
          published?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      proformas: {
        Row: {
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          number: number
          date: string
          client_id?: string | null
          client_name: string
          client_ruc?: string | null
          client_phone?: string | null
          client_address?: string | null
          client_email?: string | null
          material_label?: string
          deposit?: number
          notes?: string
          status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
          subtotal: number
          tax: number
          total: number
          valid_until: string
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          number?: number
          date?: string
          client_id?: string | null
          client_name?: string
          client_ruc?: string | null
          client_phone?: string | null
          client_address?: string | null
          client_email?: string | null
          material_label?: string
          deposit?: number
          notes?: string
          status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
          subtotal?: number
          tax?: number
          total?: number
          valid_until?: string
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      proforma_items: {
        Row: {
          id: string
          proforma_id: string
          furniture_id: string | null
          custom_name: string | null
          description: string
          quantity: number
          unit_price: number
          total_price: number
          customizations: Json
          sort_order: number
        }
        Insert: {
          id?: string
          proforma_id: string
          furniture_id?: string | null
          custom_name?: string | null
          description: string
          quantity: number
          unit_price: number
          total_price: number
          customizations?: Json
          sort_order?: number
        }
        Update: {
          id?: string
          proforma_id?: string
          furniture_id?: string | null
          custom_name?: string | null
          description?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          customizations?: Json
          sort_order?: number
        }
      }
      videos_3d: {
        Row: {
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
        }
        Insert: {
          id?: string
          furniture_id?: string | null
          title: string
          description?: string | null
          video_url: string
          thumbnail_url?: string | null
          duration_seconds?: number | null
          type: 'showcase' | 'possible' | 'process'
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          furniture_id?: string | null
          title?: string
          description?: string | null
          video_url?: string
          thumbnail_url?: string | null
          duration_seconds?: number | null
          type?: 'showcase' | 'possible' | 'process'
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      agent_activities: {
        Row: {
          id: string
          agent_type: string
          action: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          agent_type: string
          action: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          agent_type?: string
          action?: string
          metadata?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'client' | 'viewer'
      proforma_status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
      video_3d_type: 'showcase' | 'possible' | 'process'
      material_type: 'wood' | 'hardware' | 'finish' | 'fabric' | 'other'
      material_unit: 'm' | 'm2' | 'm3' | 'kg' | 'pcs' | 'ml'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}