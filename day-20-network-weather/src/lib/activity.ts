import type { NetworkMetrics } from '../types/network'

export function activityFit(metrics: NetworkMetrics) {
  if (metrics.failedProbes > 1 || metrics.medianLatencyMs >= 250) return { label: 'Video calls may struggle', detail: 'Expect delays, freezes, or dropped moments.' }
  if (metrics.medianLatencyMs >= 120 || metrics.jitterMs >= 30) return { label: 'Browsing is workable', detail: 'Pages should load, but interactive apps may feel laggy.' }
  return { label: 'Good for interactive work', detail: 'The connection is responding quickly and consistently.' }
}
