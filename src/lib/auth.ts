import { createServerSupabaseClient } from './supabase-server'
import { redirect } from 'next/navigation'

export async function getSession() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return profile
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  const { data: profile } = await createServerSupabaseClient()
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()
  
  if (profile?.role !== 'admin') {
    redirect('/client')
  }
  return session
}

export async function requireClient() {
  const session = await requireAuth()
  const { data: profile } = await createServerSupabaseClient()
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()
  
  if (!['client', 'admin'].includes(profile?.role || '')) {
    redirect('/login')
  }
  return session
}