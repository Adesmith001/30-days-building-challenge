import type { Route } from './types'

export function parseRoute(pathname: string): Route {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  if (parts.length === 0) return { name: 'create' }
  if (parts[0] === 'history' && parts.length === 1) return { name: 'history' }
  if (parts[0] === 'history' && parts[1] && parts.length === 2) return { name: 'history-detail', id: decodeURIComponent(parts[1]) }
  if (parts[0] === 's' && parts[1] && parts.length === 2) return { name: 'secret', id: decodeURIComponent(parts[1]) }
  if (parts[0] === 'reset-password' && parts.length === 1) return { name: 'reset-password' }
  return { name: 'not-found' }
}

export function navigate(path: string): void {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
