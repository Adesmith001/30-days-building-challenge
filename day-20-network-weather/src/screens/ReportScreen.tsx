import type { DeepScanResult } from '../types/network'
import { MetricValue } from '../components/MetricValue'
import { WeatherScene } from '../components/WeatherScene'
import { weatherCopy } from '../lib/weather'

export function ReportScreen({ result, onRescan, onHistory, onLive }: { result: DeepScanResult; onRescan: () => void; onHistory: () => void; onLive: () => void }) {
  return <main className="report-screen page-shell"><div className="report-heading"><span className="eyebrow">NETWORK WEATHER REPORT</span><WeatherScene weather={result.weather} compact /><h1>{result.weather}<em> conditions.</em></h1><p>{weatherCopy[result.weather]}</p></div><div className="report-metrics"><MetricValue label="DOWNLOAD" value={result.downloadMbps} unit="Mbps" accent /><MetricValue label="UPLOAD" value={result.uploadMbps} unit="Mbps" /><MetricValue label="LATENCY" value={result.metrics.medianLatencyMs} unit="ms" /><MetricValue label="JITTER" value={result.metrics.jitterMs} unit="ms" /></div><div className="report-note"><span className="eyebrow">THE TAKEAWAY</span><p>{result.downloadMbps > 50 && result.metrics.medianLatencyMs > 120 ? 'Fast transfer speed does not always mean a responsive connection.' : 'Your transfer speed and responsiveness are telling a similar story.'}</p></div><div className="action-row"><button className="primary-cta" onClick={onLive}>WATCH LIVE <span>↗</span></button><button className="secondary-cta" onClick={onRescan}>RUN AGAIN</button><button className="secondary-cta" onClick={onHistory}>VIEW HISTORY</button></div></main>
}
