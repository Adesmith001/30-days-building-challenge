import type { Receipt } from './types/receipt'

const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function validateReceiptFile(file: Pick<File, 'type' | 'size'>): string | undefined {
  if (!IMAGE_TYPES.has(file.type)) return 'Upload a PNG, JPEG, or WebP image.'
  if (file.size > MAX_IMAGE_SIZE) return 'Receipt images must be 10 MB or smaller.'
}

export async function extractReceipt(image: string): Promise<Receipt> {
  if (!image) throw new Error('Choose a receipt image first')

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
