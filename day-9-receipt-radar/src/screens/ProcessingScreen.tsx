const labels = [
  'READING RECEIPT',
  'EXTRACTING ITEMS',
  'CHECKING TOTALS',
  'LOOKING FOR ISSUES',
]

export function ProcessingScreen({
  step,
  error,
  onReset,
}: {
  step: number
  error?: string
  onReset: () => void
}) {
  return (
    <main className="processing">
      <div className="eyebrow">RADAR / INTAKE</div>
      <div className="process-count">
        0{Math.min(step, 4)} <span>/ 04</span>
      </div>
      <h1>{error ? 'SCAN FAILED' : labels[Math.max(0, step - 1)] || labels[0]}</h1>
      <div className="process-line">
        <i style={{ width: `${step * 25}%` }} />
      </div>
      <p>{error || 'Parsing printed values without correcting them.'}</p>
      {error && (
        <button className="button primary" onClick={onReset}>
          BACK TO UPLOAD
        </button>
      )}
    </main>
  )
}
