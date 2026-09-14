import { createHmac } from 'node:crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export function normalizeIp(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value
  return raw?.split(',')[0]?.trim() || 'unknown'
}

export function hashIdentifier(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('hex')
}

export async function consumeLimit(client: SupabaseClient, response: VercelResponse, bucket: string, limit: number, seconds: number): Promise<boolean> {
  const { data, error } = await client.rpc('consume_rate_limit', { p_bucket_key: bucket, p_limit: limit, p_window_seconds: seconds })
  if (error) throw error
  const result = Array.isArray(data) ? data[0] : data
  if (!result?.allowed) {
    const retry = Math.max(1, Math.ceil((new Date(result?.reset_at ?? Date.now()).getTime() - Date.now()) / 1000))
    response.setHeader('Retry-After', String(retry))
    response.status(429).json({ error: 'Too many requests. Try again shortly.' })
    return false
  }
  return true
}

export function ipBucket(request: VercelRequest, prefix: string): string {
  const secret = process.env.RATE_LIMIT_HASH_SECRET
  if (!secret || secret.length < 16) throw new Error('RATE_LIMIT_HASH_SECRET must contain at least 16 characters.')
  return `${prefix}:${hashIdentifier(normalizeIp(request.headers['x-forwarded-for'] ?? request.socket.remoteAddress), secret)}`
}
