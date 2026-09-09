import { money } from '../lib/formatting'
import type { Receipt } from '../types/receipt'

type EditableReceiptProps = {
  receipt: Receipt
  update: (key: keyof Receipt, value: string) => void
}

export function EditableReceipt({ receipt, update }: EditableReceiptProps) {
  return (
    <div className="receipt-card">
      <div className="meta-grid">
        <label>
          MERCHANT
          <input value={receipt.merchant} onChange={(event) => update('merchant', event.target.value)} />
        </label>
        <label>
          DATE
          <input value={receipt.date} onChange={(event) => update('date', event.target.value)} />
        </label>
      </div>
      <div className="line-head">
        <span>ITEM DESCRIPTION</span>
        <span>AMOUNT</span>
      </div>
      {receipt.items.map((item) => (
        <div className="item-row" key={item.id}>
          <span>
            {item.name}
            <small>{item.category} Â· {item.confidence}% CONF</small>
          </span>
          <b>{money(item.total)}</b>
        </div>
      ))}
      <div className="totals">
        <label>
          SUBTOTAL
          <input value={receipt.subtotal} onChange={(event) => update('subtotal', event.target.value)} />
        </label>
        <label className="warn-label">
          VAT
          <input value={receipt.tax} onChange={(event) => update('tax', event.target.value)} />
        </label>
        <label className="total-label">
          TOTAL
          <input value={receipt.total} onChange={(event) => update('total', event.target.value)} />
        </label>
      </div>
    </div>
  )
}

