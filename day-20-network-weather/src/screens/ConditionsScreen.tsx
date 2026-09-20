import type { QuickScanResult } from '../types/network'
import { ConnectionCompass } from '../components/ConnectionCompass'
import { MetricValue } from '../components/MetricValue'
import { WeatherScene } from '../components/WeatherScene'
import { weatherCopy } from '../lib/weather'

interface ConditionsScreenProps {
  result: QuickScanResult
  onLive: () => void
  onDeepScan: () => void
  onBack: () => void
}

export function ConditionsScreen({ result, onLive, onDeepScan, onBack }: ConditionsScreenProps) {
  return (
    <main className="conditions-screen page-shell">
      <button className="back-link" onClick={onBack}>
        ← New check
      </button>
      <div className="condition-heading">
        <div>
          <span className="eyebrow">CURRENT CONDITIONS</span>
          <h1>
            Your network is
            <br />
            <em>{result.weather}.</em>
          </h1>
          <p>{weatherCopy[result.weather]}</p>
        </div>
        <WeatherScene weather={result.weather} />
      </div>
      <div className="metrics-row">
        <MetricValue label="MEDIAN LATENCY" value={result.metrics.medianLatencyMs} unit="ms" accent />
        <MetricValue label="JITTER" value={result.metrics.jitterMs} unit="ms" />
        <MetricValue
          label="FAILED HTTP"
          value={result.metrics.failedProbes}
          unit={`/ ${result.metrics.totalProbes}`}
        />
      </div>
      <ConnectionCompass metrics={result.metrics} />
      <div className="action-row">
        <button className="primary-cta" onClick={onLive}>
          WATCH FOR 60 SECONDS <span>↗</span>
        </button>
        <button className="secondary-cta" onClick={onDeepScan}>
          DEEP SCAN <span>＋</span>
        </button>
      </div>
    </main>
  )
}
