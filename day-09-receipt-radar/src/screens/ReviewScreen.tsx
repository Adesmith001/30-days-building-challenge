import { EditableReceipt } from '../components/EditableReceipt'
import { RadarSummary } from '../components/RadarSummary'
import { ReceiptPaper } from '../components/ReceiptPaper'
import { SpendBreakdown } from '../components/SpendBreakdown'
import type { EditableItemField } from '../lib/receipt'
import type { Flag, Receipt, ReceiptSource } from '../types/receipt'

type ReviewScreenProps = {
  receipt: Receipt
  image?: string
  source: ReceiptSource
  fileName: string
  flags: Flag[]
  confidence: number
  tab: 'original' | 'extracted'
  setTab: (tab: 'original' | 'extracted') => void
  json: boolean
  setJson: (value: boolean) => void
  update: (key: keyof Receipt, value: string) => void
  updateItem: (id: string, key: EditableItemField, value: string) => void
  addItem: () => void
  removeItem: (id: string) => void
  onSave: () => void
  onReset: () => void
  onNew: () => void
}

export function ReviewScreen({
  receipt,
  image,
  source,
  fileName,
  flags,
  confidence,
  tab,
  setTab,
  json,
  setJson,
  update,
  updateItem,
  addItem,
  removeItem,
  onSave,
  onReset,
  onNew,
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
          <small>{source === 'demo' ? 'DEMO' : fileName}</small>
        </div>
        <div className="scan-canvas">
          <ReceiptPaper image={image} demo={source === 'demo'} />
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
            <EditableReceipt
              receipt={receipt}
              update={update}
              updateItem={updateItem}
              addItem={addItem}
              removeItem={removeItem}
            />
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
          <button className="button" onClick={onReset}>RESET CHANGES</button>
          <button className="button primary" onClick={source === 'demo' ? onNew : onSave}>
            {source === 'demo' ? 'SCAN YOUR RECEIPT →' : 'SAVE RECEIPT →'}
          </button>
        </div>
      </footer>
    </main>
  )
}
