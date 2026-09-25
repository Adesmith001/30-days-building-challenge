import { useState } from "react";
import { Pin } from "lucide-react";
import { getScenario } from "@/data/incidents";
import { generateMetricSeries } from "@/lib/telemetry";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { MetricChart } from "./metric-chart";
import { useGameStore } from "@/store/use-game-store";

export function MetricsPanel() {
  const run = useGameStore(
    (state) => state.run,
  );

  const pinEvidence = useGameStore(
    (state) => state.pinEvidence,
  );

  const [selected, setSelected] =
    useState(0);

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  const selectedMetric =
    scenario.metrics[selected] ??
    scenario.metrics[0];

  function pinMetric() {
    if (
      !selectedMetric.evidenceLabel
    ) {
      return;
    }

    pinEvidence({
      sourceId: selectedMetric.id,
      kind: "metric",
      label:
        selectedMetric.evidenceLabel,
    });
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-5">
        <SectionHeader
          eyebrow="SIGNALS"
          title="METRICS"
          description="Correlate changes across time. Deployment markers are context, not conclusions."
        />

        {selectedMetric.evidenceLabel && (
          <Button
            variant="secondary"
            onClick={pinMetric}
          >
            <Pin size={12} />
            PIN
          </Button>
        )}
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden">
        {scenario.metrics.map(
          (metric, index) => (
            <button
              key={metric.id}
              onClick={() =>
                setSelected(index)
              }
              className={cn(
                "shrink-0 border px-3 py-2 font-mono text-[9px]",
                selected === index
                  ? "border-blue-600 bg-blue-950/30 text-blue-200"
                  : "border-zinc-800 text-zinc-600",
              )}
            >
              {metric.label}
            </button>
          ),
        )}
      </div>

      <div className="lg:hidden">
        <MetricChart
          metric={selectedMetric}
          data={generateMetricSeries(
            scenario,
            selectedMetric,
            run,
          )}
          deploys={scenario.deploys}
        />
      </div>

      <div className="hidden gap-4 lg:grid xl:grid-cols-2">
        {scenario.metrics.map(
          (metric) => (
            <button
              key={metric.id}
              onClick={() =>
                setSelected(
                  scenario.metrics.findIndex(
                    (item) =>
                      item.id === metric.id,
                  ),
                )
              }
              className="text-left"
            >
              <MetricChart
                metric={metric}
                data={generateMetricSeries(
                  scenario,
                  metric,
                  run,
                )}
                deploys={scenario.deploys}
              />
            </button>
          ),
        )}
      </div>
    </div>
  );
}
