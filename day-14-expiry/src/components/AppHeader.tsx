import { navigate } from '../domain/routes'
import { useAuth } from '../auth/AuthProvider'

export function AppHeader({ page }: { page: 'create' | 'history' }) {
  const auth = useAuth()
  const name = String(auth.user?.user_metadata.full_name ?? auth.user?.email ?? 'You')
  const initials = name.split(/\s+/u).slice(0, 2).map((word) => word[0]).join('').toUpperCase()
  const avatar = auth.user?.user_metadata.avatar_url ?? auth.user?.user_metadata.picture
  return <header className="app-header">
    <button className="wordmark" onClick={() => navigate('/')}>Expiry<span className="mark">.</span></button>
    <nav aria-label="Primary navigation">
      <button className={page === 'create' ? 'active' : ''} onClick={() => navigate('/')}>Create</button>
      <button className={page === 'history' ? 'active' : ''} onClick={() => navigate('/history')}>History</button>
    </nav>
    <details className="user-menu">
      <summary aria-label="Open account menu"><span>{initials}</span>{typeof avatar === 'string' && avatar ? <img src={avatar} alt={name} referrerPolicy="no-referrer" onError={(event) => event.currentTarget.remove()} /> : null}</summary>
      <div><strong>{name}</strong><span>{auth.user?.email}</span><button onClick={() => navigate('/history')}>History</button><button onClick={() => void auth.signOut()}>Sign out</button></div>
    </details>
  </header>
}
