import type { CreatedSecret, EncryptedSecretInput, HistoryRecord, RevealPayload } from '../domain/types'

export interface SecretRepository {
  create(input: EncryptedSecretInput): Promise<CreatedSecret>
  reveal(secretId: string): Promise<RevealPayload>
  listHistory(): Promise<HistoryRecord[]>
  getHistory(historyId: string): Promise<HistoryRecord | null>
  destroy(historyId: string): Promise<void>
  deleteHistory(historyId: string): Promise<void>
}

export const unavailable = () => new Error('This message is unavailable')
