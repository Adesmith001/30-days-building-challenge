import type { MetricDefinition } from "../types/game";

export function SourceDrawer({ metric }: { metric: MetricDefinition }) {
  return <details className="source-drawer"><summary>DATA SOURCE & METHOD</summary><p>{metric.sourceName} · checked {metric.lastVerified}</p><p>{metric.reference}. {metric.higherWins ? "Higher value wins." : "Earlier value wins."}</p><a href={metric.sourceUrl} target="_blank">Open source ↗</a></details>;
}
