import type { EditableItemField } from '../lib/receipt'
import type { Receipt } from '../types/receipt'

type EditableReceiptProps = {
  receipt: Receipt
  update: (key: keyof Receipt, value: string) => void
  updateItem: (id: string, key: EditableItemField, value: string) => void
  addItem: () => void
  removeItem: (id: string) => void
}

export function EditableReceipt({
  receipt,
  update,
  updateItem,
  addItem,
  removeItem,
}: EditableReceiptProps) {
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
        <label>
          CURRENCY
          <input value={receipt.currency} onChange={(event) => update('currency', event.target.value.toUpperCase())} />
        </label>
        <label>
          PAYMENT
          <input value={receipt.payment} onChange={(event) => update('payment', event.target.value)} />
        </label>
      </div>
      <div className="line-head">
        <span>ITEM DESCRIPTION</span>
        <span>AMOUNT</span>
      </div>
      {receipt.items.map((item) => (
        <div className="item-row" key={item.id}>
          <label>
            DESCRIPTION
            <input value={item.name} onChange={(event) => updateItem(item.id, 'name', event.target.value)} />
          </label>
          <label>
            CATEGORY
            <input value={item.category} onChange={(event) => updateItem(item.id, 'category', event.target.value)} />
          </label>
          <label>
            QTY
            <input type="number" min="0" step="any" value={item.quantity} onChange={(event) => updateItem(item.id, 'quantity', event.target.value)} />
          </label>
          <label>
            UNIT PRICE
            <input type="number" min="0" step="any" value={item.unitPrice} onChange={(event) => updateItem(item.id, 'unitPrice', event.target.value)} />
          </label>
          <label>
            TOTAL
            <input type="number" min="0" step="any" value={item.total} onChange={(event) => updateItem(item.id, 'total', event.target.value)} />
          </label>
          <button
            className="remove-item"
            type="button"
            aria-label={`Remove ${item.name}`}
            onClick={() => removeItem(item.id)}
          >
            ×
          </button>
        </div>
      ))}
      <button className="add-item" type="button" onClick={addItem}>+ ADD MISSING ITEM</button>
      <div className="totals">
        <label>
          SUBTOTAL
          <input value={receipt.subtotal} onChange={(event) => update('subtotal', event.target.value)} />
        </label>
        <label className="warn-label">
          VAT
          <input value={receipt.tax} onChange={(event) => update('tax', event.target.value)} />
        </label>
        <label>
          FEES
          <input value={receipt.fees} onChange={(event) => update('fees', event.target.value)} />
        </label>
        <label className="total-label">
          TOTAL
          <input value={receipt.total} onChange={(event) => update('total', event.target.value)} />
        </label>
      </div>
    </div>
  )
}
