import type { NetworkMetrics } from '../types/network'
import { activityFit } from '../lib/activity'

export function ConnectionCompass({ metrics }: { metrics: NetworkMetrics }) {
  const fit = activityFit(metrics)

  return (
    <section className="compass panel">
      <div>
        <span className="eyebrow">CONNECTION COMPASS</span>
        <h3>{fit.label}</h3>
        <p>{fit.detail}</p>
      </div>
      <div className="compass-needle" aria-hidden="true">
        <span>RESPONSIVE</span>
        <i />
      </div>
    </section>
  )
}
