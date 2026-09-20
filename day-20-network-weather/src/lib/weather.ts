import { NETWORK_THRESHOLDS } from '../config/thresholds'
import type { NetworkMetrics, NetworkWeather } from '../types/network'

function severity(value: number, thresholds: readonly [number, number, number]) {
  if (value < thresholds[0]) return 0
  if (value < thresholds[1]) return 1
  if (value < thresholds[2]) return 2
  return 3
}

export function classifyNetworkWeather(metrics: NetworkMetrics): NetworkWeather {
  if (metrics.totalProbes > 0 && metrics.failedProbes === metrics.totalProbes) return 'offline'

  const score = Math.max(
    severity(metrics.medianLatencyMs, [
      NETWORK_THRESHOLDS.latency.clear,
      NETWORK_THRESHOLDS.latency.cloudy,
      NETWORK_THRESHOLDS.latency.rain,
    ]),
    severity(metrics.jitterMs, [
      NETWORK_THRESHOLDS.jitter.clear,
      NETWORK_THRESHOLDS.jitter.cloudy,
      NETWORK_THRESHOLDS.jitter.rain,
    ]),
    metrics.failedProbes >= NETWORK_THRESHOLDS.failures.storm
      ? 3
      : metrics.failedProbes >= NETWORK_THRESHOLDS.failures.rain
        ? 2
        : 0,
  )

  return ['clear', 'cloudy', 'rain', 'storm'][score] as NetworkWeather
}

export const weatherCopy: Record<NetworkWeather, string> = {
  clear: 'Quick responses. Steady connection.',
  cloudy: 'Mostly usable, with some delay or variation.',
  rain: 'Noticeable delay or instability is showing up.',
  storm: 'The connection is struggling to respond consistently right now.',
  offline: "The test endpoint can't be reached.",
}

export function weatherReasons(metrics: NetworkMetrics) {
  const reasons = [
    metrics.medianLatencyMs >= 250
      ? 'Latency is very high in this test.'
      : metrics.medianLatencyMs >= 120
        ? 'Latency is noticeably elevated.'
        : metrics.medianLatencyMs >= 60
          ? 'Latency is mildly elevated.'
          : 'Latency is responsive.',
    metrics.jitterMs >= 60
      ? 'Latency variation is very high.'
      : metrics.jitterMs >= 30
        ? 'Latency is varying noticeably.'
        : metrics.jitterMs >= 15
          ? 'Some latency variation is present.'
          : 'Latency variation is low.',
  ]

  if (metrics.failedProbes > 0) {
    reasons.push(`${metrics.failedProbes} HTTP ${metrics.failedProbes === 1 ? 'probe failed' : 'probes failed'}.`)
  }
  return reasons
}
