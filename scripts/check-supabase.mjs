import { createClient } from '@supabase/supabase-js'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(URL, KEY, {
  auth: { persistSession: false },
})

// 1. ¿Existe alguna funcion exec_sql para ejecutar DDL?
const { data: rpc, error: rpcErr } = await supabase.rpc('exec_sql', {
  sql: 'select 1',
})
console.log('exec_sql:', rpcErr ? 'NO ->' + rpcErr.message : 'SI -> ' + JSON.stringify(rpc))

// 2. ¿Que tablas existen?
const { data: tables, error: tErr } = await supabase.rpc('exec_sql', {
  sql: `select table_name from information_schema.tables where table_schema='public' order by 1`,
})
if (tErr) {
  console.log('tablas via rpc: no disponible')
} else {
  console.log('tablas:', tables?.map((t) => t.table_name).join(', '))
}

// 3. Listado de politicas RLS sobre profiles
const { data: policies, error: pErr } = await supabase.rpc('exec_sql', {
  sql: `select policyname, cmd, qual from pg_policies where tablename='profiles'`,
})
if (!pErr && policies) {
  console.log('\npoliticas profiles:')
  for (const p of policies) console.log(' -', p.policyname, '|', p.cmd, '|', p.qual)
}
