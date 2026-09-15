import type {
  FinancialProfile,
  FundingSource,
  SimulationState,
} from "../types/simulation"

import {
  fundPendingEvent,
  resolveCurrentEvent,
} from "./eventResolution"

import {
  advanceMonth,
  confirmAllocation,
  createSimulation,
} from "./simulation"

function fundingKey(state: SimulationState) {
  return `${state.current.index}:${
    state.current.event?.id ?? "event"
  }`
}

function validSource(
  state: SimulationState,
  source?: FundingSource,
): FundingSource {
  if (source === "buffer" && state.buffer > 0) {
    return "buffer"
  }

  if (source === "rent" && state.rentPot > 0) {
    return "rent"
  }

  if (source === "deficit") {
    return "deficit"
  }

  if (state.buffer > 0) {
    return "buffer"
  }

  if (state.rentPot > 0) {
    return "rent"
  }

  return "deficit"
}

export function runScenario(
  profile: FinancialProfile,
  seed: string,
  decisionChoices: Record<string, string>,
  originalFunding: Record<string, FundingSource[]>,
): SimulationState {
  let state = createSimulation(profile, seed)

  const cursors: Record<string, number> = {}

  for (let guard = 0; guard < 250; guard += 1) {
    if (state.phase === "complete") {
      break
    }

    if (state.phase === "payday") {
      state = confirmAllocation(state)
      continue
    }

    if (state.phase === "event") {
      const event = state.current.event

      if (event?.kind === "decision") {
        const key = fundingKey(state)

        const choice =
          decisionChoices[key] ??
          event.choices?.[0]?.id

        state = resolveCurrentEvent(state, choice)
      } else {
        state = resolveCurrentEvent(state)
      }

      continue
    }

    if (state.phase === "funding") {
      const key = fundingKey(state)
      const cursor = cursors[key] ?? 0
      const stored = originalFunding[key]?.[cursor]

      const source = validSource(state, stored)

      cursors[key] = cursor + 1

      state = fundPendingEvent(state, source)
      continue
    }

    if (state.phase === "summary") {
      state = advanceMonth(state)
    }
  }

  return state
}
