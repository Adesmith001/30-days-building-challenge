import { money } from '../lib/formatting'
import { verify } from '../lib/verification'
import type { Receipt } from '../types/receipt'

type HistoryScreenProps = {
  receipts: Receipt[]
  onNew: () => void
  onOpen: (receipt: Receipt) => void
}

export function HistoryScreen({
  receipts,
  onNew,
  onOpen,
}: HistoryScreenProps) {
  return (
    <main className="history">
      <div className="eyebrow">LOCAL ARCHIVE / {receipts.length} RECEIPTS</div>

      <div className="history-title">
        <h1>Receipts</h1>
        <button className="button primary" onClick={onNew}>
          NEW SCAN →
        </button>
      </div>

      {receipts.length === 0 ? (
        <div className="empty">
          No saved receipts yet.
          <br />
          <button onClick={onNew}>Scan your first receipt →</button>
        </div>
      ) : (
        receipts.map((receipt, index) => (
          <button
            className="history-row"
            key={`${receipt.merchant}-${index}`}
            onClick={() => onOpen(receipt)}
          >
            <span>SEP {String(9 - index).padStart(2, '0')}</span>
            <b>{receipt.merchant}</b>
            <strong>{money(receipt.total)}</strong>
            <small>{verify(receipt).length ? 'REVIEW' : 'LOOKS GOOD'}</small>
            <span>→</span>
          </button>
        ))
      )}
    </main>
  )
}
