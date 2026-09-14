import type { VercelRequest, VercelResponse } from '@vercel/node'
import { fail, only, prepare } from '../../_lib/http.js'
import { consumeLimit, ipBucket } from '../../_lib/rateLimit.js'
import { adminClient } from '../../_lib/supabase.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  prepare(response); if (!only(request, response, 'POST')) return
  try {
    const client = adminClient(); if (!await consumeLimit(client, response, ipBucket(request, 'reveal'), 60, 600)) return
    const id = String(request.query.id ?? ''); const { data, error } = await client.rpc('reveal_secret', { p_secret_id: id }); if (error) throw error
    const row = Array.isArray(data) ? data[0] : data
    if (!row) return response.status(404).json({ error: 'This message is unavailable' })
    response.status(200).json({ ciphertext: row.ciphertext, iv: row.iv, expiresAt: row.expires_at, expiryType: row.expiry_type })
  } catch (reason) { fail(response, reason, 400) }
}
