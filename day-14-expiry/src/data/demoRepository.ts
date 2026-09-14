import { effectiveStatus } from '../domain/expiry'
import type { CreatedSecret, EncryptedSecretInput, HistoryRecord, RevealPayload, SecretStatus } from '../domain/types'
import type { SecretRepository } from './repository'
import { unavailable } from './repository'

const STORAGE_KEY = 'expiry.demo.v1'

type StoredSecret = Omit<EncryptedSecretInput, 'title'> & {
  id: string
  historyId: string
  status: SecretStatus
  viewCount: number
  consumedAt: string | null
  createdAt: string
}

type DemoState = { secrets: Record<string, StoredSecret>; history: Record<string, HistoryRecord> }

function emptyState(): DemoState { return { secrets: {}, history: {} } }

function id(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function createDemoRepository(storage: Storage, now: () => Date = () => new Date()): SecretRepository {
  const read = (): DemoState => {
    try { return JSON.parse(storage.getItem(STORAGE_KEY) ?? '') as DemoState } catch { return emptyState() }
  }
  const write = (state: DemoState) => storage.setItem(STORAGE_KEY, JSON.stringify(state))
  const expire = (state: DemoState) => {
    for (const secret of Object.values(state.secrets)) {
      const status = effectiveStatus(secret, now())
      if (status === 'expired') {
        secret.status = status
        secret.ciphertext = ''
        secret.iv = ''
        const history = state.history[secret.historyId]
        if (history) history.status = status
      }
    }
  }

  return {
    async create(input): Promise<CreatedSecret> {
      const state = read()
      const secretId = id()
      const historyId = id()
      const createdAt = now().toISOString()
      state.secrets[secretId] = { ...input, id: secretId, historyId, status: 'active', viewCount: 0, consumedAt: null, createdAt }
      state.history[historyId] = {
        id: historyId, secretId, title: input.title, expiryType: input.expiryType,
        expiresAt: input.expiresAt, status: 'active', viewCount: 0, maxViews: input.maxViews,
        consumedAt: null, createdAt,
      }
      write(state)
      return { secretId, historyId }
    },
    async reveal(secretId): Promise<RevealPayload> {
      const state = read()
      expire(state)
      const secret = state.secrets[secretId]
      if (!secret || secret.status !== 'active' || !secret.ciphertext || !secret.iv) {
        write(state)
        throw unavailable()
      }
      const payload = { ciphertext: secret.ciphertext, iv: secret.iv, expiresAt: secret.expiresAt, expiryType: secret.expiryType }
      secret.viewCount += 1
      const history = state.history[secret.historyId]
      if (history) history.viewCount = secret.viewCount
      if (secret.expiryType === 'after_opening') {
        secret.status = 'consumed'
        secret.consumedAt = now().toISOString()
        secret.ciphertext = ''
        secret.iv = ''
        if (history) Object.assign(history, { status: 'consumed', consumedAt: secret.consumedAt })
      }
      write(state)
      return payload
    },
    async listHistory() {
      const state = read()
      expire(state)
      write(state)
      return Object.values(state.history).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },
    async getHistory(historyId) {
      const state = read()
      expire(state)
      write(state)
      return state.history[historyId] ?? null
    },
    async destroy(historyId) {
      const state = read()
      const history = state.history[historyId]
      if (!history) throw unavailable()
      const secret = state.secrets[history.secretId]
      if (secret) Object.assign(secret, { status: 'destroyed', ciphertext: '', iv: '' })
      history.status = 'destroyed'
      write(state)
    },
    async deleteHistory(historyId) {
      const state = read()
      const history = state.history[historyId]
      if (!history) return
      delete state.secrets[history.secretId]
      delete state.history[historyId]
      write(state)
    },
  }
}
