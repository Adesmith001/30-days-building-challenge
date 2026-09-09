import type { Flag, Receipt } from '../types/receipt'
import { money } from './formatting'

export function verify(receipt: Receipt): Flag[] {
  const flags: Flag[] = []
  const itemSum = receipt.items.reduce((sum, item) => sum + item.total, 0)

  if (Math.abs(itemSum - receipt.subtotal) > 1) {
    flags.push({
      type: 'error',
      title: 'SUBTOTAL MISMATCH',
      detail: `${money(Math.abs(itemSum - receipt.subtotal))} difference`,
      field: 'subtotal',
    })
  }

  const expected = receipt.subtotal + receipt.tax + receipt.fees
  if (Math.abs(expected - receipt.total) > 1) {
    flags.push({
      type: 'error',
      title: 'TOTAL MISMATCH',
      detail: `${money(Math.abs(expected - receipt.total))} difference`,
      field: 'total',
    })
  }

  receipt.items.forEach((item) => {
    if (Math.abs(item.quantity * item.unitPrice - item.total) > 1) {
      flags.push({
        type: 'error',
        title: 'LINE ITEM MISMATCH',
        detail: `${item.name} · ${money(Math.abs(item.quantity * item.unitPrice - item.total))}`,
        field: item.id,
      })
    }
  })

  const names = new Set<string>()
  receipt.items.forEach((item) => {
    const key = item.name.toLowerCase().replace(/\s+/g, ' ').trim()
    if (names.has(key) && item.quantity === 1) {
      flags.push({
        type: 'warn',
        title: 'POSSIBLE DUPLICATE',
        detail: item.name,
      })
    }
    names.add(key)
  })

  if (receipt.tax && receipt.tax < 1400) {
    flags.push({
      type: 'warn',
      title: 'LOW CONFIDENCE',
      detail: 'VAT · 61%',
      field: 'tax',
    })
  }

  return flags
}
