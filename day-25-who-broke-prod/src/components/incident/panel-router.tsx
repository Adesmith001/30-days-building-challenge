import { getScenario } from "@/data/incidents";
import { useGameStore } from "@/store/use-game-store";
import { OverviewPanel } from "./overview-panel";
import { MetricsPanel } from "./metrics-panel";
import { LogsPanel } from "./logs-panel";
import { TracesPanel } from "./traces-panel";
import { DeploysPanel } from "./deploys-panel";
import { DiagnosticPanelView } from "./diagnostic-panel";
import { FlagsPanel } from "./flags-panel";
import { TimelinePanel } from "./timeline-panel";
import { EvidencePanel } from "./evidence-panel";
import { HypothesisPanel } from "./hypothesis-panel";
import { ActionsPanel } from "./actions-panel";
import { TerminalPanel } from "./terminal-panel";

export function PanelRouter() {
  const run = useGameStore(
    (state) => state.run,
  );

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  switch (run.panel) {
    case "overview":
      return <OverviewPanel />;

    case "metrics":
      return <MetricsPanel />;

    case "logs":
      return <LogsPanel />;

    case "traces":
      return <TracesPanel />;

    case "deploys":
      return <DeploysPanel />;

    case "database":
      return (
        <DiagnosticPanelView
          data={scenario.tools.database}
          kind="database"
        />
      );

    case "cache":
      return (
        <DiagnosticPanelView
          data={scenario.tools.cache}
          kind="cache"
        />
      );

    case "queues":
      return (
        <DiagnosticPanelView
          data={scenario.tools.queues}
          kind="queue"
        />
      );

    case "dependencies":
      return (
        <DiagnosticPanelView
          data={
            scenario.tools.dependencies
          }
          kind="dependency"
        />
      );

    case "flags":
      return <FlagsPanel />;

    case "timeline":
      return <TimelinePanel />;

    case "evidence":
      return <EvidencePanel />;

    case "hypothesis":
      return <HypothesisPanel />;

    case "actions":
      return <ActionsPanel />;

    case "terminal":
      return <TerminalPanel />;

    default:
      return <OverviewPanel />;
  }
}
