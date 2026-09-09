import type { Item, Receipt } from '../types/receipt'

export type EditableItemField = keyof Pick<
  Item,
  'name' | 'category' | 'quantity' | 'unitPrice' | 'total'
>

const numericItemFields: EditableItemField[] = ['quantity', 'unitPrice', 'total']

export function updateReceiptItem(
  receipt: Receipt,
  id: string,
  key: EditableItemField,
  value: string,
): Receipt {
  return {
    ...receipt,
    items: receipt.items.map((item) => item.id === id
      ? { ...item, [key]: numericItemFields.includes(key) ? Number(value.replace(/,/g, '')) || 0 : value }
      : item),
  }
}

export function addReceiptItem(receipt: Receipt): Receipt {
  return {
    ...receipt,
    items: [...receipt.items, {
      id: crypto.randomUUID(),
      name: 'New item',
      category: 'UNCATEGORIZED',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      confidence: 100,
    }],
  }
}

export function removeReceiptItem(receipt: Receipt, id: string): Receipt {
  return { ...receipt, items: receipt.items.filter((item) => item.id !== id) }
}
