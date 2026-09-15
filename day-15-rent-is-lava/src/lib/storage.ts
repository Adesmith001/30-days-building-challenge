import type {
  SavedRun,
  ScenarioComparison,
  SimulationState,
} from "../types/simulation"

const RUNS_KEY = "rent-is-lava:runs"
const BEST_KEY = "rent-is-lava:best"

export function loadRuns(): SavedRun[] {
  try {
    const raw = localStorage.getItem(RUNS_KEY)

    if (!raw) {
      return []
    }

    return JSON.parse(raw) as SavedRun[]
  } catch {
    return []
  }
}

export function loadPersonalBest() {
  try {
    return Number(
      localStorage.getItem(BEST_KEY) ?? 0,
    )
  } catch {
    return 0
  }
}

export function saveCompletedRun(
  state: SimulationState,
) {
  const existing = loadRuns()

  const found = existing.find(
    (run) => run.id === state.seed,
  )

  if (found) {
    return existing
  }

  const run: SavedRun = {
    id: state.seed,
    timestamp: new Date().toISOString(),
    state,
    comparisons: [],
  }

  const next = [run, ...existing].slice(0, 20)

  localStorage.setItem(
    RUNS_KEY,
    JSON.stringify(next),
  )

  const currentBest = loadPersonalBest()

  if (state.score > currentBest) {
    localStorage.setItem(
      BEST_KEY,
      String(state.score),
    )
  }

  return next
}

export function addStoredComparison(
  seed: string,
  comparison: ScenarioComparison,
) {
  const runs = loadRuns()

  const next = runs.map((run) => {
    if (run.id !== seed) {
      return run
    }

    return {
      ...run,
      comparisons: [
        ...run.comparisons,
        comparison,
      ],
    }
  })

  localStorage.setItem(
    RUNS_KEY,
    JSON.stringify(next),
  )

  return next
}