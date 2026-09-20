interface ScanStageProps {
  label: string
  detail: string
  done?: boolean
  active?: boolean
}

export function ScanStage({ label, detail, done = false, active = false }: ScanStageProps) {
  return (
    <div className={active ? 'scan-stage active' : 'scan-stage'}>
      <span className="scan-dot">{done ? '✓' : active ? '•' : '○'}</span>
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
    </div>
  )
}
