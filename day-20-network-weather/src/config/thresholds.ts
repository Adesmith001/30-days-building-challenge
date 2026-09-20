export const NETWORK_THRESHOLDS = {
  latency: { clear: 60, cloudy: 120, rain: 250 },
  jitter: { clear: 15, cloudy: 30, rain: 60 },
  failures: { rain: 1, storm: 2 },
} as const

export const QUICK_SCAN_PROBES = 12
export const PROBE_TIMEOUT_MS = 3000
export const LIVE_DURATION_MS = 60_000
export const LIVE_INTERVAL_MS = 2000
export const LIVE_MAX_PROBES = 30
