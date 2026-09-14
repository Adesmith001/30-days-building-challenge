import { randomBytes } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireUser } from '../_lib/auth.js'
import { body, fail, only, prepare } from '../_lib/http.js'
import { consumeLimit } from '../_lib/rateLimit.js'
import { adminClient } from '../_lib/supabase.js'
import { validateEncryptedInput } from '../_lib/validation.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  prepare(response); if (!only(request, response, 'POST')) return
  try {
    const client = adminClient(); const user = await requireUser(client, request)
    if (!await consumeLimit(client, response, `create:${user.id}`, 20, 3600)) return
    const input = validateEncryptedInput(body(request)); const id = randomBytes(18).toString('base64url')
    const secret = { id, owner_id: user.id, ciphertext: input.ciphertext, iv: input.iv, expires_at: input.expiresAt, expiry_type: input.expiryType, max_views: input.maxViews }
    const { error: secretError } = await client.from('secrets').insert(secret); if (secretError) throw secretError
    const { data: history, error: historyError } = await client.from('history').insert({ secret_id: id, owner_id: user.id, title: input.title, expiry_type: input.expiryType, expires_at: input.expiresAt, max_views: input.maxViews }).select('id').single()
    if (historyError) { await client.from('secrets').delete().eq('id', id); throw historyError }
    response.status(201).json({ secretId: id, historyId: history.id })
  } catch (reason) { fail(response, reason, reason instanceof Error && reason.message === 'Authentication required.' ? 401 : 400) }
}
