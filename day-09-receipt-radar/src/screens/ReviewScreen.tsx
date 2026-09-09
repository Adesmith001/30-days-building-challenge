import { EditableReceipt } from '../components/EditableReceipt'
import { RadarSummary } from '../components/RadarSummary'
import { ReceiptPaper } from '../components/ReceiptPaper'
import { SpendBreakdown } from '../components/SpendBreakdown'
import type { Flag, Receipt } from '../types/receipt'

type ReviewScreenProps = {
  receipt: Receipt
  image?: string
  flags: Flag[]
  confidence: number
  tab: 'original' | 'extracted'
  setTab: (tab: 'original' | 'extracted') => void
  json: boolean
  setJson: (value: boolean) => void
  update: (key: keyof Receipt, value: string) => void
  onSave: () => void
  onReset: () => void
}

export function ReviewScreen({
  receipt,
  image,
  flags,
  confidence,
  tab,
  setTab,
  json,
  setJson,
  update,
  onSave,
  onReset,
}: ReviewScreenProps) {
  return (
    <main className="review">
      <div className="mobile-tabs">
        <button className={tab === 'original' ? 'active' : ''} onClick={() => setTab('original')}>
          ORIGINAL
        </button>
        <button className={tab === 'extracted' ? 'active' : ''} onClick={() => setTab('extracted')}>
          EXTRACTED
        </button>
      </div>

      <section className={'pane original ' + (tab === 'original' ? 'mobile-visible' : '')}>
        <div className="pane-head">
          <span>ORIGINAL</span>
          <small>RAW_SCAN_0909.JPG</small>
        </div>
        <div className="scan-canvas">
          <ReceiptPaper image={image} />
        </div>
      </section>

      <section className={'pane extracted ' + (tab === 'extracted' ? 'mobile-visible' : '')}>
        <div className="pane-head">
          <span>EXTRACTED</span>
          <div>
            <button onClick={() => setJson(false)} className={!json ? 'active-link' : ''}>
              RECEIPT
            </button>
            <button onClick={() => setJson(true)} className={json ? 'active-link' : ''}>
              JSON
            </button>
          </div>
        </div>

        {json ? (
          <pre className="json-view">{JSON.stringify(receipt, null, 2)}</pre>
        ) : (
          <div className="extract-scroll">
            <EditableReceipt receipt={receipt} update={update} />
            <RadarSummary flags={flags} />
            <SpendBreakdown receipt={receipt} />
            <div className="privacy inline">
              This is not a fraud score. Radar only highlights values worth checking.
            </div>
          </div>
        )}
      </section>

      <footer className="review-footer">
        <div>
          <span className={flags.length ? 'status-dot red' : 'status-dot'} />
          {flags.length ? flags.length + ' THINGS TO CHECK' : 'LOOKS GOOD'}
          <small>RECEIPT CONFIDENCE {confidence}</small>
        </div>
        <div>
          <button className="button" onClick={onReset}>RESET DEMO</button>
          <button className="button primary" onClick={onSave}>SAVE RECEIPT →</button>
        </div>
      </footer>
    </main>
  )
}
