import type { Flag } from '../types/receipt'

export function RadarSummary({ flags }: { flags: Flag[] }) {
  return (
    <section className="radar">
      <div className="section-title">
        <span>RADAR SUMMARY</span>
        <b>{flags.length ? `${flags.length} THINGS TO CHECK` : 'LOOKS GOOD'}</b>
      </div>
      {flags.length ? (
        flags.map((flag, index) => (
          <div className={`flag ${flag.type}`} key={`${flag.title}-${index}`}>
            <span>0{index + 1}</span>
            <div>
              <b>{flag.title}</b>
              <small>{flag.detail}</small>
            </div>
          </div>
        ))
      ) : (
        <div className="resolved">✓ All printed totals reconcile within the rounding tolerance.</div>
      )}
    </section>
  )
}
