import { describe, expect, it } from 'vitest'
import { effectiveStatus, resolveExpiry } from '../src/domain/expiry'
import { parseRoute } from '../src/domain/routes'
import { validateCreateInput } from '../src/domain/validation'

describe('Expiry domain', () => {
  it('rejects blank and oversized fields', () => {
    expect(validateCreateInput({ title: ' ', message: 'x', expiry: { kind: 'after_opening' } }).title).toBeTruthy()
    expect(validateCreateInput({ title: 'ok', message: 'x'.repeat(10_001), expiry: { kind: 'after_opening' } }).message).toBeTruthy()
  })

  it('resolves preset and custom expiry choices', () => {
    const now = new Date('2026-09-14T12:00:00.000Z')
    expect(resolveExpiry({ kind: 'after_opening' }, now)).toEqual({ expiryType: 'after_opening', expiresAt: null, maxViews: 1 })
    expect(resolveExpiry({ kind: 'duration', minutes: 60 }, now).expiresAt).toBe('2026-09-14T13:00:00.000Z')
  })

  it('marks an elapsed active record as expired', () => {
    expect(effectiveStatus({ status: 'active', expiresAt: '2026-09-14T10:00:00.000Z' }, new Date('2026-09-14T10:00:01.000Z'))).toBe('expired')
  })

  it('parses application routes', () => {
    expect(parseRoute('/')).toEqual({ name: 'create' })
    expect(parseRoute('/history/abc')).toEqual({ name: 'history-detail', id: 'abc' })
    expect(parseRoute('/reset-password')).toEqual({ name: 'reset-password' })
    expect(parseRoute('/s/secret-id')).toEqual({ name: 'secret', id: 'secret-id' })
  })
})
