import assert from 'node:assert/strict'
import test from 'node:test'
import * as receiptApi from '../src/api.ts'

test('receipt extraction requires an uploaded image', async () => {
  await assert.rejects(
    () => receiptApi.extractReceipt(''),
    /Choose a receipt image first/,
  )
})

test('receipt uploads reject unsupported files', () => {
  assert.equal(typeof receiptApi.validateReceiptFile, 'function')
  assert.equal(
    receiptApi.validateReceiptFile({ type: 'application/pdf', size: 1_000 }),
    'Upload a PNG, JPEG, or WebP image.',
  )
})

test('receipt uploads reject images over 10 MB', () => {
  assert.equal(typeof receiptApi.validateReceiptFile, 'function')
  assert.equal(
    receiptApi.validateReceiptFile({ type: 'image/jpeg', size: 10 * 1024 * 1024 + 1 }),
    'Receipt images must be 10 MB or smaller.',
  )
})

test('receipt uploads accept supported images', () => {
  assert.equal(typeof receiptApi.validateReceiptFile, 'function')
  assert.equal(
    receiptApi.validateReceiptFile({ type: 'image/png', size: 1_000 }),
    undefined,
  )
})
