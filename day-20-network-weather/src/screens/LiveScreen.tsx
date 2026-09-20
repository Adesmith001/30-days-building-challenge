import { useEffect, useState } from 'react'
import { LIVE_DURATION_MS, LIVE_INTERVAL_MS, LIVE_MAX_PROBES } from '../config/thresholds'
import { metricsFromSamples, probeLatency } from '../lib/latency'
import { calculateTrend, detectSpike } from '../lib/trend'
import { classifyNetworkWeather, weatherCopy } from '../lib/weather'
import type { NetworkSnapshot, ProbeSample, QuickScanResult } from '../types/network'
import { MetricValue } from '../components/MetricValue'
import { WeatherScene } from '../components/WeatherScene'

export function LiveScreen({ initial, onBack, onSnapshot }: { initial: QuickScanResult; onBack: () => void; onSnapshot: (snapshot: NetworkSnapshot) => void }) {
  const [samples, setSamples] = useState(initial.samples); const [running, setRunning] = useState(true); const [elapsed, setElapsed] = useState(0)
  useEffect(() => { const started = Date.now(); let timer: number | undefined; const tick = async () => { if (!running || samples.length >= LIVE_MAX_PROBES) return; const sample = await probeLatency(samples.length + 1); setSamples((current) => [...current, sample]) }; timer = window.setInterval(() => { setElapsed(Date.now() - started); void tick() }, LIVE_INTERVAL_MS); return () => window.clearInterval(timer) }, [running, samples.length])
  useEffect(() => { if (elapsed >= LIVE_DURATION_MS || samples.length >= LIVE_MAX_PROBES) setRunning(false) }, [elapsed, samples.length])
  const metrics = metricsFromSamples(samples); const weather = classifyNetworkWeather(metrics); const latencies = samples.filter((sample) => sample.latencyMs !== undefined).map((sample) => sample.latencyMs as number); const latest = latencies.at(-1) ?? metrics.medianLatencyMs; const spike = detectSpike(latest, latencies.slice(0, -1))
  const finish = () => { onSnapshot({ id: `live-${Date.now()}`, kind: 'live', measuredAt: new Date().toISOString(), weather, metrics }); onBack() }
  return <main className="live-screen page-shell"><button className="back-link" onClick={onBack}>← Conditions</button><div className="live-heading"><div><span className="eyebrow">LIVE MONITOR / {running ? 'WATCHING' : 'COMPLETE'}</span><h1>Weather can<br /><em>change.</em></h1><p>{weatherCopy[weather]}</p></div><WeatherScene weather={weather} /></div>{spike && <div className="spike-alert">ϟ LATENCY SPIKE DETECTED <span>{latest}ms right now</span></div>}<div className="metrics-row"><MetricValue label="CURRENT LATENCY" value={latest} unit="ms" accent /><MetricValue label="MEDIAN" value={metrics.medianLatencyMs} unit="ms" /><MetricValue label="SAMPLES" value={samples.length} unit={`/ ${LIVE_MAX_PROBES}`} /></div><div className="live-meta"><span>Trend: <strong>{calculateTrend(samples)}</strong></span><span>{Math.min(60, Math.round(elapsed / 1000))} / 60 sec</span></div><div className="live-bars">{samples.map((sample) => <i key={sample.id} className={sample.failed ? 'failed' : ''} style={{ height: `${Math.min(100, (sample.latencyMs ?? 10) / 3)}%` }} />)}</div><button className="primary-cta" onClick={finish}>{running ? 'STOP & SAVE' : 'SAVE LIVE RESULT'} <span>↗</span></button></main>
}
