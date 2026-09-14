import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Supabase migration', () => {
  const sql = () => readFileSync(resolve(process.cwd(), 'supabase/migrations/202609140001_expiry.sql'), 'utf8').toLowerCase()

  it('protects all application tables with RLS and grants owner history access', () => {
    const source = sql()
    for (const table of ['secrets', 'history', 'rate_limits']) expect(source).toContain(`alter table public.${table} enable row level security`)
    expect(source).toMatch(/auth\.uid\(\)\)\s*=\s*owner_id/u)
    expect(source).toContain('revoke all on public.secrets from anon, authenticated')
  })

  it('serializes reveals and restricts security-definer functions', () => {
    const source = sql()
    expect(source).toContain('for update')
    expect(source).toContain("security definer\nset search_path = ''")
    expect(source).toContain('ciphertext = null')
    expect(source).toContain('consume_rate_limit')
    expect(source).toContain('revoke execute on function public.reveal_secret')
  })
})
