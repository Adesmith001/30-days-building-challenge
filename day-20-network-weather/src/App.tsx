import { useCallback, useState } from 'react'
import './index.css'
import { GlobalHeader } from './components/GlobalHeader'
import { loadSnapshots, saveSnapshot, clearSnapshots } from './lib/storage'
import type { DeepScanResult, NetworkSnapshot, QuickScanResult } from './types/network'
import { AboutScreen } from './screens/AboutScreen'
import { ConditionsScreen } from './screens/ConditionsScreen'
import { DeepScanScreen } from './screens/DeepScanScreen'
import { HistoryScreen } from './screens/HistoryScreen'
import { HomeScreen } from './screens/HomeScreen'
import { LiveScreen } from './screens/LiveScreen'
import { QuickScanScreen } from './screens/QuickScanScreen'
import { ReportScreen } from './screens/ReportScreen'
import type { Screen } from './routes'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [quickResult, setQuickResult] = useState<QuickScanResult>()
  const [deepResult, setDeepResult] = useState<DeepScanResult>()
  const [history, setHistory] = useState(loadSnapshots)
  const saveLive = useCallback((snapshot: NetworkSnapshot) => setHistory(saveSnapshot(snapshot)), [])
  const finishQuick = useCallback((result: QuickScanResult) => {
    setQuickResult(result)
    setScreen('conditions')
  }, [])
  const finishDeep = useCallback((result: DeepScanResult) => {
    setDeepResult(result)
    setScreen('report')
  }, [])
  const navigate = (next: 'home' | 'history' | 'about') => setScreen(next)

  return (
    <>
      <GlobalHeader screen={screen} onNavigate={navigate} />
      {screen === 'home' && <HomeScreen onScan={() => setScreen('quick')} onAbout={() => setScreen('about')} />}
      {screen === 'quick' && <QuickScanScreen onComplete={finishQuick} onCancel={() => setScreen('home')} />}
      {screen === 'conditions' && quickResult && (
        <ConditionsScreen
          result={quickResult}
          onBack={() => setScreen('home')}
          onLive={() => setScreen('live')}
          onDeepScan={() => setScreen('deep')}
        />
      )}
      {screen === 'live' && quickResult && (
        <LiveScreen initial={quickResult} onBack={() => setScreen('conditions')} onSnapshot={saveLive} />
      )}
      {screen === 'deep' && <DeepScanScreen onComplete={finishDeep} onCancel={() => setScreen('conditions')} />}
      {screen === 'report' && deepResult && (
        <ReportScreen
          result={deepResult}
          onLive={() => setScreen('live')}
          onRescan={() => setScreen('quick')}
          onHistory={() => setScreen('history')}
        />
      )}
      {screen === 'history' && (
        <HistoryScreen
          snapshots={history}
          onClear={() => {
            clearSnapshots()
            setHistory([])
          }}
        />
      )}
      {screen === 'about' && <AboutScreen />}
    </>
  )
}

export default App
