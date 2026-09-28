import {
  useCallback,
  useState,
} from "react"
import type {
  BrandBrief,
  BrandProject,
  Interpretation,
} from "./types"
import {
  Landing,
} from "./components/Landing"
import {
  Generating,
} from "./components/Generating"
import {
  Workspace,
} from "./components/Workspace"
import {
  HistoryDrawer,
} from "./components/HistoryDrawer"
import {
  projectSeed,
} from "./lib/seed"
import {
  useBrandStore,
} from "./store/brand-store"

type Phase =
  | "landing"
  | "generating"
  | "workspace"

export default function App() {
  const [phase, setPhase] =
    useState<Phase>("landing")

  const [brief, setBrief] =
    useState<BrandBrief | null>(null)

  const [historyOpen, setHistoryOpen] =
    useState(false)

  const setProject =
    useBrandStore(
      (state) => state.setProject,
    )

  const generate = useCallback(
    (nextBrief: BrandBrief) => {
      setBrief(nextBrief)
      setPhase("generating")
    },
    [],
  )

  const ready = useCallback(
    (
      interpretation: Interpretation,
      source: "ai" | "local",
    ) => {
      if (!brief) {
        return
      }

      const now = Date.now()

      const seed =
        projectSeed(brief.name)

      const project: BrandProject = {
        id: crypto.randomUUID(),
        name: brief.name.trim(),
        brief,
        summary:
          interpretation.summary,
        keywords:
          interpretation.keywords,
        dna: interpretation.dna,
        seed,
        generatorVersion: 1,
        locks: {},
        overrides:
          brief.existingColor
            ? {
                primaryColor:
                  brief.existingColor,
              }
            : {},
        variants: [
          {
            id: crypto.randomUUID(),
            label: "A",
            seed,
            dna:
              structuredClone(
                interpretation.dna,
              ),
            locks: {},
            overrides:
              brief.existingColor
                ? {
                    primaryColor:
                      brief.existingColor,
                  }
                : {},
          },
        ],
        createdAt: now,
        updatedAt: now,
      }

      setProject(project)

      console.info(
        `[Brand Me] interpreter: ${source}`,
      )

      setPhase("workspace")
    },
    [
      brief,
      setProject,
    ],
  )

  function openExisting(
    project: BrandProject,
  ) {
    setProject(project)
    setPhase("workspace")
  }

  return (
    <>
      {phase === "landing" && (
        <Landing
          onGenerate={generate}
          onHistory={() =>
            setHistoryOpen(true)
          }
        />
      )}

      {phase === "generating" && brief && (
        <Generating
          brief={brief}
          onReady={ready}
        />
      )}

      {phase === "workspace" && (
        <Workspace
          onExit={() =>
            setPhase("landing")
          }
        />
      )}

      <HistoryDrawer
        open={historyOpen}
        onClose={() =>
          setHistoryOpen(false)
        }
        onOpen={openExisting}
      />
    </>
  )
}