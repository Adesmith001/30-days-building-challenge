export function MetricValue({ label, value, unit = '', accent = false }: { label: string; value: string | number; unit?: string; accent?: boolean }) {
  return <div className="metric-value">
    <span className="metric-label">{label}</span>
    <span className={accent ? 'metric-number accent' : 'metric-number'}>{value}<small>{unit}</small></span>
  </div>
}
