export type NetworkWeather = 'clear' | 'cloudy' | 'rain' | 'storm' | 'offline'

export type NetworkTrend = 'improving' | 'stable' | 'worsening'

export interface ProbeSample {
  id: number
  timestamp: number
  latencyMs?: number
  failed: boolean
}

export interface NetworkMetrics {
  medianLatencyMs: number
  jitterMs: number
  failedProbes: number
  totalProbes: number
  downloadMbps?: number
  uploadMbps?: number
}

export interface QuickScanResult {
  samples: ProbeSample[]
  metrics: NetworkMetrics
  weather: NetworkWeather
  measuredAt: string
}

export interface DeepScanResult extends QuickScanResult {
  downloadMbps: number
  uploadMbps: number
  bytesDownloaded: number
  bytesUploaded: number
}

export interface NetworkSnapshot {
  id: string
  kind: 'quick' | 'deep' | 'live'
  measuredAt: string
  weather: NetworkWeather
  metrics: NetworkMetrics
}

export interface BrowserNetworkEstimate {
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

export interface LiveEvent {
  id: string
  timestamp: number
  type: 'weather' | 'spike'
  message: string
}
