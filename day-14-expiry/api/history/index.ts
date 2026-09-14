import type { VercelRequest, VercelResponse } from '@vercel/node'
import { mapHistory, requireUser } from '../_lib/auth.js'
import { fail, only, prepare } from '../_lib/http.js'
import { adminClient } from '../_lib/supabase.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  prepare(response); if (!only(request, response, 'GET')) return
  try { const client = adminClient(); const user = await requireUser(client, request); await client.rpc('expire_secrets'); const { data, error } = await client.from('history').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }); if (error) throw error; response.status(200).json((data ?? []).map(mapHistory)) }
  catch (reason) { fail(response, reason, reason instanceof Error && reason.message === 'Authentication required.' ? 401 : 400) }
}
