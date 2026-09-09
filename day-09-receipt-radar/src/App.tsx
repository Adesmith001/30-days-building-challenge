import { Topbar } from './components/Topbar'
import { useReceiptApp } from './hooks/useReceiptApp'
import { HistoryScreen } from './screens/HistoryScreen'
import { LandingScreen } from './screens/LandingScreen'
import { ProcessingScreen } from './screens/ProcessingScreen'
import { ReviewScreen } from './screens/ReviewScreen'

export default function App() {
  const app = useReceiptApp()

  return (
    <div className="app-shell">
      <Topbar
        onHome={() => app.setStage('idle')}
        onHistory={() => app.setStage('history')}
      />

      {app.stage === 'review' && (
        <div className="context">
          <span>
            MERCHANT: <b>{app.receipt.merchant}</b>
          </span>
          <span className="context-center">
            ● &nbsp; CONFIDENCE {app.confidence}%
          </span>
          <span>
            {app.flags.length} FLAG{app.flags.length === 1 ? '' : 'S'}
          </span>
        </div>
      )}

      {app.stage === 'idle' && (
        <LandingScreen
          onStart={() => app.scan()}
          onUpload={(event) => app.scan(event.target.files?.[0])}
          inputRef={app.inputRef}
        />
      )}

      {app.stage === 'scanning' && (
        <ProcessingScreen
          step={app.processing}
          error={app.error}
          onReset={() => app.setStage('idle')}
        />
      )}

      {app.stage === 'history' && (
        <HistoryScreen
          receipts={app.saved}
          onNew={() => app.setStage('idle')}
          onOpen={app.openReceipt}
        />
      )}

      {app.stage === 'review' && (
        <ReviewScreen
          receipt={app.receipt}
          image={app.image}
          flags={app.flags}
          confidence={app.confidence}
          tab={app.tab}
          setTab={app.setTab}
          json={app.json}
          setJson={app.setJson}
          update={app.update}
          onSave={app.save}
          onReset={app.reset}
        />
      )}
    </div>
  )
}
