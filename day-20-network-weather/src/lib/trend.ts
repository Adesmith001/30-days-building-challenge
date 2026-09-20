import type { NetworkTrend, ProbeSample } from "../types/network";
import { median } from "./statistics";

function successfulLatencies(samples: ProbeSample[]) {
  return samples
    .filter((sample) => !sample.failed && sample.latencyMs !== undefined)
    .map((sample) => sample.latencyMs as number);
}

export function detectSpike(current: number, recent: number[]) {
  if (recent.length < 3) return false;
  const baseline = median(recent.slice(-5));
  return current > Math.max(baseline * 2.5, baseline + 100);
}

export function calculateTrend(samples: ProbeSample[]): NetworkTrend {
  const latencies = successfulLatencies(samples);
  if (latencies.length < 10) return "stable";
  const previous = median(latencies.slice(-10, -5));
  const latest = median(latencies.slice(-5));
  const difference = latest - previous;
  if (Math.abs(difference) <= Math.max(10, previous * 0.15)) return "stable";
  return difference < 0 ? "improving" : "worsening";
}
