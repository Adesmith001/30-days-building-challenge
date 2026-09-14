export type ExpiryChoice =
  | { kind: 'after_opening' }
  | { kind: 'duration'; minutes: 10 | 60 | 360 | 1440 | 4320 | 10080 }
  | { kind: 'custom'; at: string }

export type SecretStatus = 'active' | 'consumed' | 'expired' | 'destroyed'
export type ExpiryType = 'after_opening' | 'time'

export type CreateFormInput = {
  title: string
  message: string
  expiry: ExpiryChoice
}

export type EncryptedSecretInput = {
  title: string
  ciphertext: string
  iv: string
  expiryType: ExpiryType
  expiresAt: string | null
  maxViews: number | null
}

export type HistoryRecord = {
  id: string
  secretId: string
  title: string
  expiryType: ExpiryType
  expiresAt: string | null
  status: SecretStatus
  viewCount: number
  maxViews: number | null
  consumedAt: string | null
  createdAt: string
  shareUrl?: string
}

export type RevealPayload = {
  ciphertext: string
  iv: string
  expiresAt: string | null
  expiryType: ExpiryType
}

export type CreatedSecret = { secretId: string; historyId: string }

export type Route =
  | { name: 'create' }
  | { name: 'history' }
  | { name: 'history-detail'; id: string }
  | { name: 'secret'; id: string }
  | { name: 'reset-password' }
  | { name: 'not-found' }
