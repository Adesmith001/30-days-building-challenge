import { createClient } from '@supabase/supabase-js'

export function adminClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) throw new Error('Supabase server environment is incomplete.')
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
