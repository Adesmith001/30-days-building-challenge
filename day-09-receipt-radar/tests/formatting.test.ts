import assert from 'node:assert/strict'
import test from 'node:test'
import { money } from '../src/lib/formatting.ts'

test('formats uploaded receipts in their extracted currency', () => {
  assert.equal(money(12.5, 'USD'), '$12.50')
})
