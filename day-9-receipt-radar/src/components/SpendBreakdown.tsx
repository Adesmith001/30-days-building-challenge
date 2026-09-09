import { money } from '../lib/formatting'
import type { Receipt } from '../types/receipt'

export function SpendBreakdown({ receipt }: { receipt: Receipt }) {
  const groups = receipt.items.reduce<Record<string, number>>(
    (out, item) => {
      out[item.category] = (out[item.category] || 0) + item.total
      return out
    },
    {},
  )

  return (
    <section className="spend">
      <div className="section-title">
        <span>WHERE THE MONEY WENT</span>
        <b>BREAKDOWN</b>
      </div>
      {Object.entries(groups).map(([key, value]) => (
        <div className="spend-row" key={key}>
          <span>{key}</span>
          <i>
            <em style={{ width: `${Math.min(100, (value / receipt.total) * 100 * 2.5)}%` }} />
          </i>
          <b>{money(value, receipt.currency)}</b>
        </div>
      ))}
    </section>
  )
}
