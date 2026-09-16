import { formatNaira } from "./currency";

import type {
  ComparisonDraft,
  ComparisonMetrics,
} from "../types/comparison";

export function comparisonSummary(
  draft: ComparisonDraft,
  metrics: ComparisonMetrics,
) {
  const b =
    draft.homeB.name || "Home B";

  const a =
    draft.homeA.name || "Home A";

  const cash =
    Math.abs(metrics.cashSavingsB);

  const hours =
    Math.abs(metrics.extraHoursB);

  if (
    Math.abs(metrics.cashSavingsB) <
    50_000
  ) {
    return `The homes are only ${formatNaira(
      cash,
    )} apart annually, while the commute difference is ${Math.round(
      hours,
    )} hours.`;
  }

  if (
    metrics.cashSavingsB > 0 &&
    metrics.extraHoursB > 0
  ) {
    return `${b} saves ${formatNaira(
      cash,
    )}/year in cash, but adds ${Math.round(
      hours,
    )} commute hours.`;
  }

  if (
    metrics.cashSavingsB < 0 &&
    metrics.extraHoursB > 0
  ) {
    return `After transport, ${b} costs ${formatNaira(
      cash,
    )} more per year and adds ${Math.round(
      hours,
    )} commute hours.`;
  }

  if (
    metrics.cashSavingsB > 0 &&
    metrics.extraHoursB < 0
  ) {
    return `${b} uses ${formatNaira(
      cash,
    )} less cash and ${Math.round(
      hours,
    )} fewer commute hours per year.`;
  }

  return `${a} and ${b} trade cash and commute time differently. Compare the two measures separately.`;
}

export function hoursLabel(
  hours: number,
) {
  const rounded =
    Math.round(Math.abs(hours));

  return `${
    hours >= 0 ? "+" : "-"
  }${rounded} HOURS`;
}

export function weekHoursLabel(
  hours: number,
) {
  const totalMinutes =
    Math.round(hours * 60);

  const h =
    Math.floor(totalMinutes / 60);

  const m =
    totalMinutes % 60;

  return m
    ? `${h}H ${m}M`
    : `${h}H`;
}