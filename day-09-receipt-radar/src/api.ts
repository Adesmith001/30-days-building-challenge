import type { Receipt } from './types/receipt'

export async function extractReceipt(image?: string): Promise<Receipt | undefined> {
  if (!image) return undefined

  const endpoint = import.meta.env.VITE_RECEIPT_API_URL || '/api/receipt'
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null
    throw new Error(body?.error || 'Receipt extraction failed')
  }

  return response.json() as Promise<Receipt>
}
