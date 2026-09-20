import { PROBE_TIMEOUT_MS, QUICK_SCAN_PROBES } from '../config/thresholds'
import type { NetworkMetrics, ProbeSample, QuickScanResult } from '../types/network'
import { calculateJitter } from './jitter'
import { median, roundMetric } from './statistics'
import { classifyNetworkWeather } from './weather'

const wait = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

export async function probeLatency(id: number, timeoutMs = PROBE_TIMEOUT_MS): Promise<ProbeSample> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)
  const startedAt = performance.now()

  try {
    const token = crypto.randomUUID?.() ?? `${Date.now()}-${id}`
    const response = await fetch(`/api/ping?t=${encodeURIComponent(token)}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
    if (!response.ok) throw new Error('Probe request failed')
    return { id, timestamp: Date.now(), latencyMs: performance.now() - startedAt, failed: false }
  } catch {
    return { id, timestamp: Date.now(), failed: true }
  } finally {
    window.clearTimeout(timeout)
  }
}

export function metricsFromSamples(samples: ProbeSample[]): NetworkMetrics {
  const successful = samples
    .filter((sample) => !sample.failed && sample.latencyMs !== undefined)
    .map((sample) => sample.latencyMs as number)
  return {
    medianLatencyMs: roundMetric(median(successful)),
    jitterMs: roundMetric(calculateJitter(successful)),
    failedProbes: samples.filter((sample) => sample.failed).length,
    totalProbes: samples.length,
  }
}

export function resultFromSamples(samples: ProbeSample[]): QuickScanResult {
  const metrics = metricsFromSamples(samples)
  return { samples, metrics, weather: classifyNetworkWeather(metrics), measuredAt: new Date().toISOString() }
}

export async function runLatencyScan(total = QUICK_SCAN_PROBES, onSample?: (sample: ProbeSample) => void) {
  const samples: ProbeSample[] = []
  for (let index = 0; index < total; index += 1) {
    const sample = await probeLatency(index + 1)
    samples.push(sample)
    onSample?.(sample)
    if (index < total - 1) await wait(100)
  }
  return resultFromSamples(samples)
}
