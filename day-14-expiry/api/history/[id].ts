import type { VercelRequest, VercelResponse } from '@vercel/node'
import { mapHistory, requireUser } from '../_lib/auth.js'
import { fail, prepare } from '../_lib/http.js'
import { adminClient } from '../_lib/supabase.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  prepare(response)
  if (request.method !== 'GET' && request.method !== 'DELETE') return response.status(405).json({ error: 'Method not allowed.' })
  try {
    const client = adminClient(); const user = await requireUser(client, request); const id = String(request.query.id ?? '')
    const { data: record, error } = await client.from('history').select('*').eq('id', id).eq('owner_id', user.id).maybeSingle(); if (error) throw error
    if (!record) return response.status(404).json({ error: 'History not found.' })
    if (request.method === 'GET') return response.status(200).json(mapHistory(record))
    await client.from('secrets').update({ status: 'destroyed', ciphertext: null, iv: null }).eq('id', record.secret_id).eq('owner_id', user.id)
    const { error: deleteError } = await client.from('history').delete().eq('id', id).eq('owner_id', user.id); if (deleteError) throw deleteError
    response.status(200).json({ ok: true })
  } catch (reason) { fail(response, reason, reason instanceof Error && reason.message === 'Authentication required.' ? 401 : 400) }
}
