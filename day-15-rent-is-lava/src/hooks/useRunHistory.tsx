import { useCallback, useState } from "react"

import type {
  ScenarioComparison,
  SimulationState,
} from "../types/simulation"

import {
  addStoredComparison,
  loadPersonalBest,
  loadRuns,
  saveCompletedRun,
} from "../lib/storage"

export function useRunHistory() {
  const [runs, setRuns] = useState(loadRuns)
  const [personalBest, setPersonalBest] = useState(
    loadPersonalBest,
  )

  const saveRun = useCallback(
    (state: SimulationState) => {
      const next = saveCompletedRun(state)

      setRuns(next)

      setPersonalBest((current) =>
        Math.max(current, state.score),
      )
    },
    [],
  )

  const saveComparison = useCallback(
    (
      seed: string,
      comparison: ScenarioComparison,
    ) => {
      const next = addStoredComparison(
        seed,
        comparison,
      )

      setRuns(next)
    },
    [],
  )

  return {
    runs,
    personalBest,
    saveRun,
    saveComparison,
  }
}