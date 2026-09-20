import { average } from "./statistics";

export function calculateJitter(latencies: number[]) {
  if (latencies.length < 2) return 0;
  return average(
    latencies
      .slice(1)
      .map((value, index) => Math.abs(value - latencies[index])),
  );
}
