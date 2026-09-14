import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireUser } from '../../_lib/auth.js'
import { fail, only, prepare } from '../../_lib/http.js'
import { adminClient } from '../../_lib/supabase.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  prepare(response); if (!only(request, response, 'POST')) return
  try {
    const client = adminClient(); const user = await requireUser(client, request); const historyId = String(request.query.id ?? '')
    const { data: history } = await client.from('history').select('secret_id').eq('id', historyId).eq('owner_id', user.id).maybeSingle()
    if (!history) return response.status(404).json({ error: 'History not found.' })
    const consumedAt = new Date().toISOString(); await client.from('secrets').update({ status: 'destroyed', ciphertext: null, iv: null, consumed_at: consumedAt }).eq('id', history.secret_id).eq('owner_id', user.id)
    await client.from('history').update({ status: 'destroyed', consumed_at: consumedAt }).eq('id', historyId).eq('owner_id', user.id)
    response.status(200).json({ ok: true })
  } catch (reason) { fail(response, reason, reason instanceof Error && reason.message === 'Authentication required.' ? 401 : 400) }
}
