import { formatMetric } from "../lib/format";

export function StatCharge({ left, right, metricId }: { left: number; right: number; metricId: string }) {
  const total = left + right;
  const leftWidth = total ? Math.max(12, Math.min(88, (left / total) * 100)) : 50;
  return <section className="stat-charge"><p>BATTLE POWER REVEALED</p><div><strong>{formatMetric(left, metricId)}</strong><strong>{formatMetric(right, metricId)}</strong></div><div className="power-bar"><i style={{ width: `${leftWidth}%` }} /></div></section>;
}
