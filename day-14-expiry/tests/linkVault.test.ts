import { beforeEach, describe, expect, it } from 'vitest'
import { forgetLink, loadLink, rememberLink } from '../src/data/linkVault'

describe('creator link vault', () => {
  beforeEach(() => localStorage.clear())

  it('keeps and removes the complete link only in local browser storage', () => {
    rememberLink('secret-id', 'https://expiry.test/s/secret-id#browser-key')
    expect(loadLink('secret-id')).toBe('https://expiry.test/s/secret-id#browser-key')
    forgetLink('secret-id')
    expect(loadLink('secret-id')).toBeNull()
  })
})
