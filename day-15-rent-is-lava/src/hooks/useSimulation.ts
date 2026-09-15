import { useState } from "react"

import type {
  FinancialProfile,
  FundingSource,
  SimulationState,
} from "../types/simulation"

import {
  fundPendingEvent,
  resolveCurrentEvent,
} from "../lib/eventResolution"

import {
  advanceMonth,
  confirmAllocation,
  createSimulation,
} from "../lib/simulation"

export function useSimulation() {
  const [state, setState] =
    useState<SimulationState | null>(null)

  const start = (
    profile: FinancialProfile,
    seed: string,
  ) => {
    setState(createSimulation(profile, seed))
  }

  const confirmPayday = () => {
    setState((current): SimulationState | null =>
      current
        ? confirmAllocation(current)
        : current,
    )
  }

  const resolveEvent = (choiceId?: string) => {
    setState((current): SimulationState | null =>
      current
        ? resolveCurrentEvent(current, choiceId)
        : current,
    )
  }

  const fundEvent = (source: FundingSource) => {
    setState((current): SimulationState | null =>
      current
        ? fundPendingEvent(current, source)
        : current,
    )
  }

  const nextMonth = () => {
    setState((current): SimulationState | null =>
      current
        ? advanceMonth(current)
        : current,
    )
  }

  const clear = () => {
    setState(null)
  }

  return {
    state,
    start,
    clear,
    confirmPayday,
    resolveEvent,
    fundEvent,
    nextMonth,
  }
}
