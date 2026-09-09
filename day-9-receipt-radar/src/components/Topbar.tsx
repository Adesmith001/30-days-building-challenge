type TopbarProps = {
  onHome: () => void
  onHistory: () => void
}

export function Topbar({ onHome, onHistory }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="batch">
        09 / 30 <span>[BATCH FORENSIC_2026_Q3]</span>
      </div>
      <button className="brand" onClick={onHome}>RECEIPT RADAR</button>
      <nav>
        <button onClick={onHistory}>RECEIPTS</button>
        <span>·</span>
        <button>ABOUT</button>
        <span>·</span>
        <button>SOURCE ↗</button>
      </nav>
    </header>
  )
}
