import type { ChangeEvent, RefObject } from 'react'

type LandingScreenProps = {
  onStart: () => void
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
  inputRef: RefObject<HTMLInputElement>
}

export function LandingScreen({ onStart, onUpload, inputRef }: LandingScreenProps) {
  return (
    <main className="landing">
      <div className="eyebrow">DAY 09 / MULTIMODAL AUDIT TOOL</div>
      <h1>
        Know what
        <br />
        <em>you paid for.</em>
      </h1>
      <p>
        Receipt Radar rebuilds messy receipts into a clean, checkable record —
        then independently checks the numbers.
      </p>
      <div className="landing-actions">
        <button className="button primary" onClick={onStart}>
          OPEN DEMO <span>→</span>
        </button>
        <button className="button" onClick={() => inputRef.current?.click()}>
          UPLOAD RECEIPT
        </button>
        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onUpload}
        />
      </div>
      <div className="landing-note">
        <span>01</span>
        <div>
          <b>READ</b> every printed value
          <br />
          <b>CHECK</b> every total locally
          <br />
          <b>REVIEW</b> anything uncertain
        </div>
      </div>
      <div className="privacy">
        Saved receipt data stays in this browser. Images submitted for scanning
        are sent to the configured receipt model for processing.
      </div>
    </main>
  )
}
