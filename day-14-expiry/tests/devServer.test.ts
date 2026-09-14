import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('local development server', () => {
  it('keeps the Vite and Vercel development commands separate', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> }
    expect(packageJson.scripts.dev).toBe('vite --port 5173')
    expect(packageJson.scripts['dev:api']).toBe('vercel dev --listen 5173')
    expect(packageJson.scripts['dev:vercel']).toBe('vercel dev --listen 5173')
  })
})
