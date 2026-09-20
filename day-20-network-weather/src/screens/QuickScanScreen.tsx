import { useEffect, useState } from 'react'
import { QUICK_SCAN_PROBES } from '../config/thresholds'
import { runLatencyScan } from '../lib/latency'
import { networkTestErrorMessage } from '../lib/networkApi'
import type { ProbeSample, QuickScanResult } from '../types/network'
import { ScanStage } from '../components/ScanStage'

interface QuickScanScreenProps {
  onComplete: (result: QuickScanResult) => void
  onCancel: () => void
}

export function QuickScanScreen({ onComplete, onCancel }: QuickScanScreenProps) {
  const [samples, setSamples] = useState<ProbeSample[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    void runLatencyScan(QUICK_SCAN_PROBES, (sample) => setSamples((current) => [...current, sample]))
      .then(onComplete)
      .catch((reason: unknown) => setError(networkTestErrorMessage(reason)))
  }, [onComplete])

  return (
    <main className="scan-screen page-shell">
      <div className="scan-intro">
        <span className="eyebrow">QUICK SCAN / {error ? 'SETUP NEEDED' : 'IN PROGRESS'}</span>
        <h1>
          Reading the
          <br />
          <em>atmosphere.</em>
        </h1>
        <p>We're making {QUICK_SCAN_PROBES} small requests to measure responsiveness and stability.</p>
      </div>
      {error && <p className="error-copy">{error}</p>}
      {!error && <div className="scan-list">
        <ScanStage
          label="Reachability"
          detail={
            samples.length
              ? `${samples.length} of ${QUICK_SCAN_PROBES} checks complete`
              : 'Connecting to the test endpoint'
          }
          active={!samples.length}
          done={samples.length === QUICK_SCAN_PROBES}
        />
        <ScanStage
          label="Latency pattern"
          detail="Calculating after the scan"
          active={samples.length > 2 && samples.length < QUICK_SCAN_PROBES}
          done={samples.length === QUICK_SCAN_PROBES}
        />
        <ScanStage
          label="Network weather"
          detail="Classifying your conditions"
          active={samples.length === QUICK_SCAN_PROBES}
        />
      </div>}
      {!error && <div className="progress-line">
        <i style={{ width: `${(samples.length / QUICK_SCAN_PROBES) * 100}%` }} />
      </div>}
      <button className="text-cta" onClick={onCancel}>
        {error ? 'Back home' : 'Cancel scan'}
      </button>
    </main>
  )
}
