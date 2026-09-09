import assert from 'node:assert/strict'
import test from 'node:test'
import type { Receipt } from '../src/types/receipt.ts'

const modulePath = '../src/lib/receipt.ts'

const sample: Receipt = {
  merchant: 'Corner Store',
  date: '2026-09-09',
  currency: 'NGN',
  subtotal: 500,
  tax: 0,
  fees: 0,
  total: 500,
  payment: 'CARD',
  items: [{
    id: 'item-1',
    name: 'Milk',
    category: 'GROCERIES',
    quantity: 1,
    unitPrice: 500,
    total: 500,
    confidence: 95,
  }],
}

test('updates an extracted line item without mutating the receipt', async () => {
  const { updateReceiptItem } = await import(modulePath)
  const updated = updateReceiptItem(sample, 'item-1', 'total', '650.50')

  assert.equal(sample.items[0].total, 500)
  assert.equal(updated.items[0].total, 650.5)
})

test('adds and removes correction line items', async () => {
  const { addReceiptItem, removeReceiptItem } = await import(modulePath)
  const added = addReceiptItem(sample)

  assert.equal(added.items.length, 2)
  assert.equal(added.items[1].name, 'New item')
  assert.deepEqual(removeReceiptItem(added, added.items[1].id), sample)
})
