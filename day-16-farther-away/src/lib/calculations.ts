import type {
  ComparisonDraft,
  ComparisonMetrics,
  HomeMetrics,
  HomeOption,
  WorkRoutine,
} from "../types/comparison";

export function calculateHomeMetrics(
  home: HomeOption,
  routine: WorkRoutine,
): HomeMetrics {
  const commuteDaysPerWeek = Math.max(
    0,
    routine.workDaysPerWeek -
      routine.remoteDaysPerWeek,
  );

  const annualCommuteDays =
    commuteDaysPerWeek *
    routine.workWeeksPerYear;

  const annualTransportCost =
    home.oneWayTransportCost *
    2 *
    annualCommuteDays;

  const annualCommuteHours =
    (
      home.oneWayMinutes *
      2 *
      annualCommuteDays
    ) / 60;

  const annualCashCost =
    home.annualRent +
    annualTransportCost;

  return {
    commuteDaysPerWeek,
    annualCommuteDays,

    annualTransportCost,
    annualCashCost,

    monthlyRentEquivalent:
      home.annualRent / 12,

    monthlyTransportEquivalent:
      annualTransportCost / 12,

    monthlyCashEquivalent:
      annualCashCost / 12,

    annualCommuteHours,

    commuteDayEquivalent:
      annualCommuteHours / 24,

    weeklyCommuteHours:
      (
        home.oneWayMinutes *
        2 *
        commuteDaysPerWeek
      ) / 60,
  };
}

export function calculateComparison(
  draft: ComparisonDraft,
): ComparisonMetrics {
  const homeA = calculateHomeMetrics(
    draft.homeA,
    draft.routine,
  );

  const homeB = calculateHomeMetrics(
    draft.homeB,
    draft.routine,
  );

  const rentSavingsB =
    draft.homeA.annualRent -
    draft.homeB.annualRent;

  const extraTransportB =
    homeB.annualTransportCost -
    homeA.annualTransportCost;

  const cashSavingsB =
    homeA.annualCashCost -
    homeB.annualCashCost;

  const extraHoursB =
    homeB.annualCommuteHours -
    homeA.annualCommuteHours;

  const extraCommuteDaysB =
    extraHoursB / 24;

  const breakEvenRentB =
    draft.homeA.annualRent -
    extraTransportB;

  const timeBreakEvenHourly =
    cashSavingsB > 0 &&
    extraHoursB > 0
      ? cashSavingsB / extraHoursB
      : null;

  return {
    homeA,
    homeB,

    rentSavingsB,
    extraTransportB,
    cashSavingsB,

    extraHoursB,
    extraCommuteDaysB,

    breakEvenRentB,
    timeBreakEvenHourly,
  };
}

export function timeAdjustedCost(
  cashCost: number,
  hours: number,
  hourly: number,
) {
  return cashCost + hours * hourly;
}