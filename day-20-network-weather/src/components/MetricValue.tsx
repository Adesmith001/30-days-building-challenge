interface MetricValueProps {
  label: string
  value: string | number
  unit?: string
  accent?: boolean
}

export function MetricValue({ label, value, unit = '', accent = false }: MetricValueProps) {
  return (
    <div className="metric-value" aria-label={`${label}: ${value}${unit}`}>
      <span className="metric-label">{label}</span>
      <span className={accent ? 'metric-number accent' : 'metric-number'}>
        {value}
        <small>{unit}</small>
      </span>
    </div>
  )
}
