import { lifeEvents } from "../data/events"

import type {
  ActiveMonth,
  FinancialProfile,
  MonthState,
  SimulationState,
} from "../types/simulation"

import {
  buildMonthlyExpenses,
  calculateRentTarget,
  expensesTotal,
  monthNames,
} from "./finances"

import { seededInt, seededUnit } from "./random"
import { scoreMonth } from "./scoring"

function chooseEvent(state: SimulationState, index: number) {
  const chance = seededUnit(
    `${state.seed}:month:${index}:event-chance`,
  )

  if (chance > 0.7) {
    return null
  }

  const available = lifeEvents.filter((event) => {
    if (event.kind !== "recurring") {
      return true
    }

    return !state.appliedRecurringEventIds.includes(event.id)
  })

  if (!available.length) {
    return null
  }

  const eventIndex = seededInt(
    `${state.seed}:month:${index}:event-index`,
    0,
    available.length - 1,
  )

  return available[eventIndex]
}

function prepareMonth(
  state: SimulationState,
  index: number,
): SimulationState {
  const oneOffCharge = state.oneOffCharges[index] ?? 0

  const expenses = buildMonthlyExpenses(
    state.profile,
    state.seed,
    index,
    state.recurring,
    oneOffCharge,
  )

  const normalExpenses = expensesTotal(expenses)

  const rentTarget =
    state.rentStatus === "covered"
      ? 0
      : calculateRentTarget(
          state.profile.annualRent,
          state.rentPot,
          state.profile.rentDueInMonths,
          index,
        )

  const current: ActiveMonth = {
    index,
    name: monthNames[index],
    income: state.profile.monthlyIncome,
    expenses,
    normalExpenses,
    rentTarget,
    rentContribution: 0,
    event: chooseEvent(state, index),
    eventCost: 0,
    eventIncome: 0,
    usedBuffer: 0,
    usedRent: 0,
    eventDeficit: 0,
    oneOffCharge,
    scoreGain: 0,
    scoreLabels: [],
  }

  return {
    ...state,
    monthIndex: index,
    current,
    phase: "payday" as const,
    pendingPayment: null,
    willEndAfterSummary: false,
  }
}

export function createSimulation(
  profile: FinancialProfile,
  seed: string,
): SimulationState {
  const emptyMonth: ActiveMonth = {
    index: 0,
    name: monthNames[0],
    income: profile.monthlyIncome,
    expenses: profile.expenses,
    normalExpenses: 0,
    rentTarget: 0,
    rentContribution: 0,
    event: null,
    eventCost: 0,
    eventIncome: 0,
    usedBuffer: 0,
    usedRent: 0,
    eventDeficit: 0,
    oneOffCharge: 0,
    scoreGain: 0,
    scoreLabels: [],
  }

  const state: SimulationState = {
    profile,
    seed,
    monthIndex: 0,
    phase: "payday",
    cash: 0,
    buffer: profile.startingBuffer,
    rentPot: profile.rentSaved,
    score: 0,
    cleanMonths: 0,
    rentWithdrawalCount: 0,
    rentWithdrawnTotal: 0,
    unexpectedCosts: 0,
    totalIncome: 0,
    totalNormalSpend: 0,
    rentStatus: "pending",
    rentShortfall: 0,
    current: emptyMonth,
    months: [],
    recurring: {},
    appliedRecurringEventIds: [],
    oneOffCharges: {},
    pendingPayment: null,
    scoreEvents: [],
    gapOpen: false,
    earlyBonusAwarded: false,
    willEndAfterSummary: false,
    decisionChoices: {},
    fundingChoices: {},
  }

  return prepareMonth(state, 0)
}

export function confirmAllocation(
  state: SimulationState,
) {
  if (state.phase !== "payday") {
    return state
  }

  let cash =
    state.cash +
    state.current.income -
    state.current.normalExpenses

  const remainingRent = Math.max(
    0,
    state.profile.annualRent - state.rentPot,
  )

  const contribution =
    state.rentStatus === "covered"
      ? 0
      : Math.min(
          state.current.rentTarget,
          remainingRent,
          Math.max(0, cash),
        )

  cash -= contribution

  const next: SimulationState = {
    ...state,
    cash,
    rentPot: state.rentPot + contribution,
    totalIncome:
      state.totalIncome + state.current.income,
    totalNormalSpend:
      state.totalNormalSpend +
      state.current.normalExpenses,
    current: {
      ...state.current,
      rentContribution: contribution,
    },
  }

  if (!next.current.event) {
    return finalizeMonth(next)
  }

  return {
    ...next,
    phase: "event" as const,
  }
}

export function finalizeMonth(
  state: SimulationState,
): SimulationState {
  const scored = scoreMonth(state)

  const score = state.score + scored.points

  const labels = scored.events.map(
    (event) => event.label,
  )

  const month: MonthState = {
    month: state.current.index + 1,
    name: state.current.name,
    income: state.current.income,
    expenses: state.current.expenses,
    normalExpenses: state.current.normalExpenses,
    rentTarget: state.current.rentTarget,
    rentContribution: state.current.rentContribution,
    eventTitle: state.current.event?.title ?? null,
    eventCost: state.current.eventCost,
    eventIncome: state.current.eventIncome,
    usedBuffer: state.current.usedBuffer,
    usedRent: state.current.usedRent,
    cash: state.cash,
    buffer: state.buffer,
    rentPot: state.rentPot,
    score,
    scoreGain: scored.points,
    clean:
      scored.events.some(
        (event) => event.type === "rent-target",
      ) &&
      state.current.usedRent === 0,
    scoreLabels: labels,
  }

  return {
    ...state,
    phase: "summary",
    score,
    cleanMonths: scored.cleanMonths,
    gapOpen: scored.gapOpen,
    earlyBonusAwarded: scored.earlyBonusAwarded,
    rentStatus: scored.rentStatus,
    rentShortfall: scored.rentShortfall,
    willEndAfterSummary: scored.willEnd,
    months: [...state.months, month],
    scoreEvents: [
      ...state.scoreEvents,
      ...scored.events,
    ],
    current: {
      ...state.current,
      scoreGain: scored.points,
      scoreLabels: labels,
    },
  }
}

export function advanceMonth(
  state: SimulationState,
) {
  if (state.phase !== "summary") {
    return state
  }

  if (
    state.willEndAfterSummary ||
    state.current.index >= 11
  ) {
    return {
      ...state,
      phase: "complete" as const,
    }
  }

  return prepareMonth(
    state,
    state.current.index + 1,
  )
}
