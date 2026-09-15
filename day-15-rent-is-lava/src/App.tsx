/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react"

import type {
  FinancialProfile,
  ScenarioComparison,
} from "./types/simulation"

import { GameHeader } from "./components/GameHeader"
import { defaultProfile } from "./data/presets"
import { useRunHistory } from "./hooks/useRunHistory"
import { useSimulation } from "./hooks/useSimulation"
import { makeRunSeed } from "./lib/seed"

import { AboutScreen } from "./screens/AboutScreen"
import { CompareScreen } from "./screens/CompareScreen"
import { ExpensesScreen } from "./screens/ExpensesScreen"
import { HistoryScreen } from "./screens/HistoryScreen"
import { HomeScreen } from "./screens/HomeScreen"
import { PreviewScreen } from "./screens/PreviewScreen"
import { ResultsScreen } from "./screens/ResultsScreen"
import { SetupScreen } from "./screens/SetupScreen"
import { SimulationScreen } from "./screens/SimulationScreen"

type Screen =
  | "home"
  | "setup"
  | "expenses"
  | "preview"
  | "simulation"
  | "results"
  | "compare"
  | "history"
  | "about"

export default function App() {
  const [screen, setScreen] =
    useState<Screen>("home")

  const [profile, setProfile] =
    useState<FinancialProfile>(defaultProfile)

  const [previousScreen, setPreviousScreen] =
    useState<Screen>("home")

  const simulation = useSimulation()

  const {
    runs,
    personalBest,
    saveRun,
    saveComparison,
  } = useRunHistory()

  useEffect(() => {
    if (
      simulation.state?.phase === "complete" &&
      screen === "simulation"
    ) {
      saveRun(simulation.state)
      setScreen("results")
    }
  }, [
    simulation.state,
    screen,
    saveRun,
  ])

  const telemetry = useMemo(() => {
    const state = simulation.state

    if (!state || screen !== "simulation") {
      return null
    }

    const rentPercent = Math.min(
      100,
      (state.rentPot /
        state.profile.annualRent) *
        100,
    )

    return {
      month: state.current.index + 1,
      rentPercent,
      score: state.score,
    }
  }, [simulation.state, screen])

  const openAbout = () => {
    setPreviousScreen(screen)
    setScreen("about")
  }

  const beginRun = () => {
    simulation.start(profile, makeRunSeed())
    setScreen("simulation")
  }

  const newRun = () => {
    simulation.clear()
    setScreen("setup")
  }

  const saveScenario = (
    comparison: ScenarioComparison,
  ) => {
    if (!simulation.state) {
      return
    }

    saveComparison(
      simulation.state.seed,
      comparison,
    )
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <GameHeader
        onAbout={openAbout}
        month={telemetry?.month}
        rentPercent={telemetry?.rentPercent}
        score={telemetry?.score}
      />

      {screen === "home" && (
        <HomeScreen
          personalBest={personalBest}
          onStart={() => setScreen("setup")}
          onHistory={() => setScreen("history")}
        />
      )}

      {screen === "setup" && (
        <SetupScreen
          profile={profile}
          onChange={setProfile}
          onContinue={() =>
            setScreen("expenses")
          }
        />
      )}

      {screen === "expenses" && (
        <ExpensesScreen
          profile={profile}
          onChange={setProfile}
          onContinue={() =>
            setScreen("preview")
          }
        />
      )}

      {screen === "preview" && (
        <PreviewScreen
          profile={profile}
          onStart={beginRun}
        />
      )}

      {screen === "simulation" &&
        simulation.state && (
          <main className="mx-auto max-w-[1200px] px-5 py-12 md:px-12 md:py-16">
            <SimulationScreen
              state={simulation.state}
              onConfirmPayday={
                simulation.confirmPayday
              }
              onResolveEvent={
                simulation.resolveEvent
              }
              onFundEvent={simulation.fundEvent}
              onNextMonth={simulation.nextMonth}
            />
          </main>
        )}

      {screen === "results" &&
        simulation.state && (
          <ResultsScreen
            state={simulation.state}
            personalBest={personalBest}
            onCompare={() =>
              setScreen("compare")
            }
            onHistory={() =>
              setScreen("history")
            }
            onNewRun={newRun}
          />
        )}

      {screen === "compare" &&
        simulation.state && (
          <CompareScreen
            original={simulation.state}
            onBack={() =>
              setScreen("results")
            }
            onSave={saveScenario}
          />
        )}

      {screen === "history" && (
        <HistoryScreen
          runs={runs}
          onBack={() => setScreen("home")}
          onNewRun={() =>
            setScreen("setup")
          }
        />
      )}

      {screen === "about" && (
        <AboutScreen
          onBack={() =>
            setScreen(previousScreen)
          }
        />
      )}
    </div>
  )
}