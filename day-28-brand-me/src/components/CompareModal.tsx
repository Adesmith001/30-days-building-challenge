import {
  Check,
  X,
} from "lucide-react"
import type {
  BrandProject,
  VariantSnapshot,
} from "../types"
import {
  generateBrandSystem,
} from "../lib/generate"
import {
  systemVariables,
} from "../lib/css-vars"
import {
  Preview,
} from "./Preview"

function fromSnapshot(
  project: BrandProject,
  variant: VariantSnapshot,
) {
  return {
    ...project,
    dna: variant.dna,
    seed: variant.seed,
    locks: variant.locks,
    overrides: variant.overrides,
  }
}

export function CompareModal({
  project,
  onClose,
}: {
  project: BrandProject
  onClose: () => void
}) {
  const first =
    project.variants[0]

  const latest =
    project.variants.at(-1)

  if (!first || !latest) {
    return null
  }

  const a = generateBrandSystem(
    fromSnapshot(project, first),
  )

  const b = generateBrandSystem(
    fromSnapshot(project, latest),
  )

  return (
    <div className="fixed inset-0 z-[80] bg-[#efeee9]">
      <header className="flex h-16 items-center justify-between border-b border-black/10 px-5">
        <div>
          <div className="editor-eyebrow">
            DIRECTIONS
          </div>

          <div className="text-sm font-black">
            A / B COMPARISON
          </div>
        </div>

        <button
          onClick={onClose}
          className="editor-button"
        >
          <X size={14} />
          CLOSE
        </button>
      </header>

      <div className="grid h-[calc(100vh-4rem)] overflow-y-auto xl:grid-cols-2">
        <Comparison
          label={`DIRECTION ${first.label}`}
          system={a}
        />

        <Comparison
          label={`DIRECTION ${latest.label}`}
          system={b}
        />
      </div>
    </div>
  )
}

function Comparison({
  label,
  system,
}: {
  label: string
  system: ReturnType<
    typeof generateBrandSystem
  >
}) {
  return (
    <section className="border-b border-black/10 p-4 xl:border-b-0 xl:border-r">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-black">
          {label}
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-black/35">
          <Check size={12} />
          SAME CONTENT
        </div>
      </div>

      <div
        className="overflow-hidden border border-black/15"
        style={systemVariables(
          system,
          "light",
        )}
      >
        <Preview
          system={system}
          mode="landing"
        />
      </div>
    </section>
  )
}