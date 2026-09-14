import { useEffect, useMemo, useState } from 'react'
import { AuthProvider, useAuth } from './auth/AuthProvider'
import { AppHeader } from './components/AppHeader'
import { createDemoRepository } from './data/demoRepository'
import { createRemoteRepository } from './data/remoteRepository'
import { parseRoute, navigate } from './domain/routes'
import type { Route } from './domain/types'
import { CreateScreen, type ReadyInfo } from './screens/CreateScreen'
import { HistoryDetailScreen } from './screens/HistoryDetailScreen'
import { HistoryScreen } from './screens/HistoryScreen'
import { LoginScreen } from './screens/LoginScreen'
import { ReadyScreen } from './screens/ReadyScreen'
import { ResetPasswordScreen } from './screens/ResetPasswordScreen'
import { RevealScreen } from './screens/RevealScreen'

function useRoute() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname))
  useEffect(() => { const update = () => setRoute(parseRoute(window.location.pathname)); window.addEventListener('popstate', update); return () => window.removeEventListener('popstate', update) }, [])
  return route
}

function ExpiryApp() {
  const auth = useAuth()
  const route = useRoute()
  const [readyInfo, setReadyInfo] = useState<ReadyInfo | null>(null)
  const [prefillTitle, setPrefillTitle] = useState('')
  const repository = useMemo(() => auth.configured ? createRemoteRepository(auth.getAccessToken) : createDemoRepository(localStorage), [auth.configured, auth.getAccessToken])
  if (!auth.ready) return <div className="loading-screen">Expiry<span className="mark">.</span></div>
  if (route.name === 'secret') return <RevealScreen id={route.id} repository={repository} />
  if (route.name === 'reset-password') return <ResetPasswordScreen />
  if (!auth.user) return <LoginScreen />
  if (route.name === 'not-found') return <main className="recipient-page"><section className="gone"><h1>Page not found.</h1><button onClick={() => navigate('/')}>Return home</button></section></main>
  const page = route.name === 'history' || route.name === 'history-detail' ? 'history' : 'create'
  return <div className="app-shell"><AppHeader page={page} />
    {route.name === 'history' ? <HistoryScreen repository={repository} /> : route.name === 'history-detail' ? <HistoryDetailScreen id={route.id} repository={repository} onRecreate={(title) => { setPrefillTitle(title); navigate('/') }} /> : readyInfo ? <ReadyScreen info={readyInfo} demo={!auth.configured} onAnother={() => setReadyInfo(null)} /> : <CreateScreen repository={repository} initialTitle={prefillTitle} onReady={setReadyInfo} />}
    <footer><span>Encrypted here. Gone when promised.</span><span>Day 14 / 30</span></footer>
  </div>
}

export default function App() { return <AuthProvider><ExpiryApp /></AuthProvider> }
