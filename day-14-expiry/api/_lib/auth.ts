import type { SupabaseClient } from '@supabase/supabase-js'
import type { VercelRequest } from '@vercel/node'

export async function requireUser(client: SupabaseClient, request: VercelRequest) {
  const header = request.headers.authorization
  if (!header?.startsWith('Bearer ')) throw new Error('Authentication required.')
  const { data, error } = await client.auth.getUser(header.slice(7))
  if (error || !data.user) throw new Error('Authentication required.')
  return data.user
}

export function mapHistory(row: Record<string, unknown>) {
  return { id: row.id, secretId: row.secret_id, title: row.title, expiryType: row.expiry_type, expiresAt: row.expires_at, status: row.status, viewCount: row.view_count, maxViews: row.max_views, consumedAt: row.consumed_at, createdAt: row.created_at }
}
