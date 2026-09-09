import assert from 'node:assert/strict'
import test from 'node:test'
import { saveReceipts } from '../src/lib/storage.ts'
import type { Receipt } from '../src/types/receipt.ts'

test('saved history omits large receipt images', () => {
  let stored = ''
  globalThis.localStorage = {
    setItem: (_key: string, value: string) => { stored = value },
  } as Storage

  const receipt = {
    merchant: 'Real Mart', date: '2026-09-09', currency: 'NGN',
    subtotal: 1, tax: 0, fees: 0, total: 1, payment: 'cash', items: [],
    image: 'data:image/png;base64,very-large-image',
  } satisfies Receipt

  saveReceipts([receipt])

  assert.equal(JSON.parse(stored)[0].image, undefined)
})
