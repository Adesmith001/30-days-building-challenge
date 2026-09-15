import type {
  FundingSource,
  MonthlyExpenses,
  SimulationState,
} from "../types/simulation"

import { seededUnit } from "./random"
import { finalizeMonth } from "./simulation"

function mergeRecurring(
  current: Partial<MonthlyExpenses>,
  addition?: Partial<MonthlyExpenses>,
) {
  if (!addition) {
    return current
  }

  const result = { ...current }

  Object.entries(addition).forEach(([key, value]) => {
    const expenseKey = key as keyof MonthlyExpenses

    result[expenseKey] =
      (result[expenseKey] ?? 0) + (value ?? 0)
  })

  return result
}

function paymentKey(state: SimulationState) {
  return `${state.current.index}:${
    state.current.event?.id ?? "event"
  }`
}

function applyCost(
  state: SimulationState,
  title: string,
  eventId: string,
  cost: number,
) {
  const spendableCash = Math.max(0, state.cash)
  const fromCash = Math.min(cost, spendableCash)
  const remaining = cost - fromCash

  const next: SimulationState = {
    ...state,
    cash: state.cash - fromCash,
    unexpectedCosts:
      state.unexpectedCosts + cost,
    current: {
      ...state.current,
      eventCost: state.current.eventCost + cost,
    },
  }

  if (remaining <= 0) {
    return finalizeMonth(next)
  }

  return {
    ...next,
    phase: "funding" as const,
    pendingPayment: {
      title,
      eventId,
      total: cost,
      remaining,
    },
  }
}

function applyIncome(
  state: SimulationState,
  amount: number,
) {
  return finalizeMonth({
    ...state,
    cash: state.cash + amount,
    totalIncome: state.totalIncome + amount,
    current: {
      ...state.current,
      eventIncome:
        state.current.eventIncome + amount,
    },
  })
}

export function resolveCurrentEvent(
  state: SimulationState,
  choiceId?: string,
): SimulationState {
  if (state.phase !== "event") {
    return state
  }

  const event = state.current.event

  if (!event) {
    return finalizeMonth(state)
  }

  if (event.kind === "income") {
    return applyIncome(state, event.amount ?? 0)
  }

  if (event.kind === "cost") {
    return applyCost(
      state,
      event.title,
      event.id,
      event.amount ?? 0,
    )
  }

  if (event.kind === "recurring") {
    return finalizeMonth({
      ...state,
      recurring: mergeRecurring(
        state.recurring,
        event.recurring,
      ),
      appliedRecurringEventIds: [
        ...state.appliedRecurringEventIds,
        event.id,
      ],
    })
  }

  const choice = event.choices?.find(
    (item) => item.id === choiceId,
  )

  if (!choice) {
    return state
  }

  const key = paymentKey(state)

  let next: SimulationState = {
    ...state,
    decisionChoices: {
      ...state.decisionChoices,
      [key]: choice.id,
    },
    recurring: mergeRecurring(
      state.recurring,
      choice.recurring,
    ),
  }

  if (choice.followUp) {
    const trigger = seededUnit(
      `${state.seed}:${state.current.index}:${event.id}:${choice.id}`,
    )

    if (trigger < choice.followUp.chance) {
      const futureMonth = Math.min(
        11,
        state.current.index + 1,
      )

      next = {
        ...next,
        oneOffCharges: {
          ...next.oneOffCharges,
          [futureMonth]:
            (next.oneOffCharges[futureMonth] ?? 0) +
            choice.followUp.amount,
        },
      }
    }
  }

  if (choice.effect === "income") {
    return applyIncome(next, choice.amount)
  }

  return applyCost(
    next,
    event.title,
    event.id,
    choice.amount,
  )
}

export function fundPendingEvent(
  state: SimulationState,
  source: FundingSource,
): SimulationState {
  const payment = state.pendingPayment

  if (
    state.phase !== "funding" ||
    !payment
  ) {
    return state
  }

  const key = paymentKey(state)

  const fundingChoices = {
    ...state.fundingChoices,
    [key]: [
      ...(state.fundingChoices[key] ?? []),
      source,
    ],
  }

  if (source === "deficit") {
    const remaining = payment.remaining

    return finalizeMonth({
      ...state,
      cash: state.cash - remaining,
      pendingPayment: null,
      fundingChoices,
      current: {
        ...state.current,
        eventDeficit:
          state.current.eventDeficit + remaining,
      },
    })
  }

  if (source === "buffer") {
    const amount = Math.min(
      state.buffer,
      payment.remaining,
    )

    if (amount <= 0) {
      return state
    }

    const remaining = payment.remaining - amount

    const next: SimulationState = {
      ...state,
      buffer: state.buffer - amount,
      fundingChoices,
      pendingPayment:
        remaining > 0
          ? {
              ...payment,
              remaining,
            }
          : null,
      current: {
        ...state.current,
        usedBuffer:
          state.current.usedBuffer + amount,
      },
    }

    return remaining > 0
      ? next
      : finalizeMonth(next)
  }

  const amount = Math.min(
    state.rentPot,
    payment.remaining,
  )

  if (amount <= 0) {
    return state
  }

  const remaining = payment.remaining - amount
  const firstWithdrawal = state.current.usedRent === 0

  const next: SimulationState = {
    ...state,
    rentPot: state.rentPot - amount,
    gapOpen: true,
    rentWithdrawalCount:
      state.rentWithdrawalCount +
      (firstWithdrawal ? 1 : 0),
    rentWithdrawnTotal:
      state.rentWithdrawnTotal + amount,
    fundingChoices,
    pendingPayment:
      remaining > 0
        ? {
            ...payment,
            remaining,
          }
        : null,
    current: {
      ...state.current,
      usedRent:
        state.current.usedRent + amount,
    },
  }

  return remaining > 0
    ? next
    : finalizeMonth(next)
}
