import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

const tables = [
  'profiles', 'company_settings', 'furniture_categories', 'wood_types',
  'materials', 'furniture_items', 'proformas', 'proforma_items',
  'videos_3d', 'agent_activities',
]

console.log('=== Tablas y filas ===')
for (const t of tables) {
  const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true })
  console.log(
    error
      ? `  ${t.padEnd(22)} ERROR: ${error.message}`
      : `  ${t.padEnd(22)} ${count} filas`
  )
}

console.log('\n=== Datos iniciales ===')
const { data: cats } = await supabase.from('furniture_categories').select('name, slug')
console.log('  categorías:', cats?.map(c => c.name).join(', ') || 'ninguna')

const { data: woods } = await supabase.from('wood_types').select('name')
console.log('  maderas    :', woods?.map(w => w.name).join(', ') || 'ninguna')

const { data: items } = await supabase.from('furniture_items').select('name, published')
console.log('  muebles    :', items?.length ? items.map(i => `${i.name}${i.published ? '' : ' (borrador)'}`).join(', ') : 'ninguno')

const { data: company } = await supabase.from('company_settings').select('*').limit(1)
console.log('  empresa    :', company?.length ? company[0].nombre : 'sin configurar')

console.log('\n=== Auth (usuarios registrados) ===')
const { data: users } = await supabase.auth.admin.listUsers()
console.log('  total:', users?.users?.length ?? 0)
for (const u of users?.users ?? []) {
  console.log(`   - ${u.email} (${u.id.slice(0, 8)}...)`)
}
