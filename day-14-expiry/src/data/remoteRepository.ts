import type { SecretRepository } from './repository'
import { unavailable } from './repository'
import type { HistoryRecord } from '../domain/types'

export function createRemoteRepository(getAccessToken: () => Promise<string | null>): SecretRepository {
  async function request<T>(url: string, init: RequestInit = {}, authenticated = true): Promise<T> {
    const token = authenticated ? await getAccessToken() : null
    const response = await fetch(url, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
    })
    if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Unexpected response from the server.')
    const body = await response.json().catch(() => { throw new Error('Unexpected response from the server.') }) as { error?: string }
    if (response.status === 404) throw unavailable()
    if (!response.ok) throw new Error(body.error ?? (response.status === 429 ? 'Too many requests. Try again shortly.' : 'Request failed.'))
    return body as T
  }
  return {
    create: (input) => request('/api/secrets', { method: 'POST', body: JSON.stringify(input) }),
    reveal: (id) => request(`/api/secrets/${encodeURIComponent(id)}/reveal`, { method: 'POST' }, false),
    listHistory: async () => {
      const records = await request<unknown>('/api/history')
      if (!Array.isArray(records)) throw new Error('Unexpected response from the server.')
      return records as HistoryRecord[]
    },
    getHistory: (id) => request(`/api/history/${encodeURIComponent(id)}`),
    destroy: (id) => request(`/api/secrets/${encodeURIComponent(id)}/destroy`, { method: 'POST' }),
    deleteHistory: (id) => request(`/api/history/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  }
}
