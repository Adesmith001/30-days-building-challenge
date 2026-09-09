import type { Receipt } from '../types/receipt'

const KEY = 'receipt-radar-history'

export function loadReceipts(): Receipt[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function saveReceipts(receipts: Receipt[]) {
  localStorage.setItem(KEY, JSON.stringify(receipts))
}

