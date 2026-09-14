const KEY = 'expiry.linkVault.v1'

function read(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, string> } catch { return {} }
}

export function rememberLink(secretId: string, url: string): void {
  localStorage.setItem(KEY, JSON.stringify({ ...read(), [secretId]: url }))
}

export function loadLink(secretId: string): string | null { return read()[secretId] ?? null }

export function forgetLink(secretId: string): void {
  const links = read(); delete links[secretId]; localStorage.setItem(KEY, JSON.stringify(links))
}
