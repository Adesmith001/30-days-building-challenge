import { hashString, seededRandom } from "./rng";
import { scenarioTime } from "./time";
import type {
  IncidentRunState,
  IncidentScenario,
  LogEntry,
  MetricConfig,
  MetricPoint,
} from "@/types";

function clamp(
  value: number,
  min = 0,
  max = 1,
) {
  return Math.min(max, Math.max(min, value));
}

function severityAt(
  scenario: IncidentScenario,
  run: IncidentRunState,
  t: number,
) {
  let severity = clamp(
    (t - scenario.degradeAt) /
      Math.abs(scenario.degradeAt),
  );

  if (t < scenario.degradeAt) {
    severity = 0;
  }

  if (t > 0) {
    severity = 1;
  }

  if (run.mitigationStartedAt !== undefined) {
    const start = run.mitigationStartedAt;
    const end =
      run.activeAction?.endsAt ??
      run.recoveryAt ??
      start + 90;

    if (t >= start) {
      const progress = clamp(
        (t - start) / Math.max(1, end - start),
      );

      severity = Math.max(
        0.03,
        1 - progress * 0.97,
      );
    }
  }

  return severity;
}

export function generateMetricSeries(
  scenario: IncidentScenario,
  metric: MetricConfig,
  run: IncidentRunState,
): MetricPoint[] {
  const end = Math.max(0, run.simulatedTime);
  const start = -1200;
  const step = 30;

  const random = seededRandom(
    scenario.seed + hashString(metric.id),
  );

  const output: MetricPoint[] = [];

  for (let t = start; t <= end; t += step) {
    const severity = severityAt(
      scenario,
      run,
      t,
    );

    let target =
      metric.normal +
      (metric.incident - metric.normal) *
        severity;

    if (t >= 0 && run.danger > 0) {
      const delta =
        metric.incident - metric.normal;

      target += delta * run.danger * 0.12;
    }

    const noise =
      (random() - 0.5) *
      metric.noise *
      2;

    const decimals = metric.decimals ?? 1;
    const factor = 10 ** decimals;

    output.push({
      t,
      time: scenarioTime(scenario, t),
      value:
        Math.round(
          Math.max(0, target + noise) * factor,
        ) / factor,
    });
  }

  return output;
}

const noiseTemplates = [
  "request completed status=200",
  "health check passed",
  "cache lookup completed",
  "request context initialized",
  "trace exported",
  "connection returned to pool",
];

export function getScenarioLogs(
  scenario: IncidentScenario,
): LogEntry[] {
  const random = seededRandom(
    scenario.seed + 9001,
  );

  const services = scenario.services
    .filter(
      (service) =>
        service.kind !== "external",
    )
    .map((service) => service.name);

  const noise: LogEntry[] = [];

  for (let offset = -720; offset <= 30; offset += 28) {
    const service =
      services[
        Math.floor(random() * services.length)
      ];

    const template =
      noiseTemplates[
        Math.floor(
          random() * noiseTemplates.length,
        )
      ];

    noise.push({
      id: `noise-${scenario.id}-${offset}`,
      offset,
      level:
        random() > 0.92 ? "WARN" : "INFO",
      service,
      message: `${template} duration=${Math.round(
        20 + random() * 130,
      )}ms`,
    });
  }

  return [...noise, ...scenario.logs].sort(
    (a, b) => b.offset - a.offset,
  );
}
