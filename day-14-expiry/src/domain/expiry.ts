import type { ExpiryChoice, ExpiryType, SecretStatus } from './types'

export function resolveExpiry(choice: ExpiryChoice, now = new Date()): {
  expiryType: ExpiryType
  expiresAt: string | null
  maxViews: number | null
} {
  if (choice.kind === 'after_opening') return { expiryType: 'after_opening', expiresAt: null, maxViews: 1 }
  const expiresAt = choice.kind === 'custom'
    ? new Date(choice.at)
    : new Date(now.getTime() + choice.minutes * 60_000)
  return { expiryType: 'time', expiresAt: expiresAt.toISOString(), maxViews: null }
}

export function effectiveStatus(record: { status: SecretStatus; expiresAt: string | null }, now = new Date()): SecretStatus {
  return record.status === 'active' && record.expiresAt && new Date(record.expiresAt) <= now ? 'expired' : record.status
}

export function expiryLabel(record: { expiryType: ExpiryType; expiresAt: string | null }): string {
  if (record.expiryType === 'after_opening') return 'After opening'
  if (!record.expiresAt) return 'Time based'
  return `On ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(record.expiresAt))}`
}
