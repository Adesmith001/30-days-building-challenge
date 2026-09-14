import type { VercelRequest, VercelResponse } from '@vercel/node'

export function prepare(response: VercelResponse): void { response.setHeader('Cache-Control', 'no-store'); response.setHeader('Content-Type', 'application/json') }
export function only(request: VercelRequest, response: VercelResponse, method: string): boolean {
  if (request.method === method) return true
  response.setHeader('Allow', method); response.status(405).json({ error: 'Method not allowed.' }); return false
}
export function body(request: VercelRequest): unknown {
  const value = request.body
  if (Buffer.byteLength(JSON.stringify(value ?? {})) > 24_000) throw new Error('Request body is too large.')
  return value
}
export function fail(response: VercelResponse, reason: unknown, status = 400): void {
  response.status(status).json({ error: reason instanceof Error ? reason.message : 'Request failed.' })
}
