type EncryptedInput = { title: string; ciphertext: string; iv: string; expiryType: 'after_opening' | 'time'; expiresAt: string | null; maxViews: number | null }
const allowed = new Set(['title', 'ciphertext', 'iv', 'expiryType', 'expiresAt', 'maxViews'])
const base64url = /^[A-Za-z0-9_-]+$/u

export function validateEncryptedInput(value: unknown): EncryptedInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid request body.')
  const record = value as Record<string, unknown>
  for (const key of Object.keys(record)) if (!allowed.has(key)) throw new Error(`Unexpected field: ${key}`)
  if (typeof record.title !== 'string' || !record.title.trim() || record.title.trim().length > 120) throw new Error('Invalid title.')
  if (typeof record.ciphertext !== 'string' || !base64url.test(record.ciphertext) || record.ciphertext.length > 20_000) throw new Error('Invalid ciphertext.')
  if (typeof record.iv !== 'string' || !base64url.test(record.iv) || record.iv.length > 64) throw new Error('Invalid IV.')
  if (record.expiryType !== 'after_opening' && record.expiryType !== 'time') throw new Error('Invalid expiry type.')
  const expiresAt = typeof record.expiresAt === 'string' ? record.expiresAt : null
  if (record.expiryType === 'time' && (!expiresAt || Number.isNaN(Date.parse(expiresAt)) || Date.parse(expiresAt) <= Date.now())) throw new Error('Invalid expiration.')
  return { title: record.title.trim(), ciphertext: record.ciphertext, iv: record.iv, expiryType: record.expiryType, expiresAt, maxViews: record.expiryType === 'after_opening' ? 1 : null }
}
