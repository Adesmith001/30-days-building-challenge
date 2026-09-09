import type { ChangeEvent, RefObject } from 'react'
import { RadarSummary } from '../components/RadarSummary'
import { ReceiptPaper } from '../components/ReceiptPaper'
import { demoReceipt } from '../data/demoReceipt'
import { verify } from '../lib/verification'

type LandingScreenProps = {
  onStart: () => void
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
  inputRef: RefObject<HTMLInputElement>
}

export function LandingScreen({ onStart, onUpload, inputRef }: LandingScreenProps) {
  const demoFlags = verify(demoReceipt)

  return (
    <main className="landing">
      <div className="landing-grid">
        <section className="landing-copy">
          <div className="eyebrow">RECEIPT VERIFICATION / IMAGE TO AUDIT</div>
          <h1>
            Know what
            <br />
            <em>you paid for.</em>
          </h1>
          <p>
            Upload a receipt. Get every line item, total, and mismatch in one
            editable record.
          </p>
          <div className="landing-actions">
            <button className="button primary" onClick={() => inputRef.current?.click()}>
              UPLOAD RECEIPT <span>↗</span>
            </button>
            <button className="button" onClick={onStart}>
              OPEN DEMO <span>→</span>
            </button>
            <input
              ref={inputRef}
              hidden
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onUpload}
            />
          </div>
        </section>

        <section className="landing-preview" aria-label="Example receipt audit">
          <header className="preview-toolbar">
            <span>EXAMPLE / RECEIPT_0909.JPG</span>
            <b>CHECK COMPLETE</b>
          </header>
          <div className="preview-receipt">
            <ReceiptPaper demo image={undefined} />
          </div>
          <div className="preview-audit">
            <RadarSummary flags={demoFlags} />
            <button type="button" onClick={onStart}>REVIEW THE FULL AUDIT →</button>
          </div>
        </section>
      </div>

      <footer className="landing-footer">
        <div className="landing-process" aria-label="How Receipt Radar works">
          <span><b>01</b> Upload</span>
          <span><b>02</b> Extract</span>
          <span><b>03</b> Check</span>
        </div>
        <p className="privacy">
          Saved data stays in this browser. Images are sent only for processing.
        </p>
      </footer>
    </main>
  )
}
