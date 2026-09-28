import {
  Lock,
  RotateCcw,
  Shuffle,
  Unlock,
} from "lucide-react"
import type {
  BrandSystem,
  DNAKey,
} from "../types"
import {
  useBrandStore,
} from "../store/brand-store"

const dimensions: {
  key: DNAKey
  left: string
  right: string
}[] = [
  {
    key: "warmth",
    left: "COOL",
    right: "WARM",
  },
  {
    key: "energy",
    left: "QUIET",
    right: "ENERGETIC",
  },
  {
    key: "formality",
    left: "CASUAL",
    right: "FORMAL",
  },
  {
    key: "playfulness",
    left: "SERIOUS",
    right: "PLAYFUL",
  },
  {
    key: "boldness",
    left: "SUBTLE",
    right: "BOLD",
  },
  {
    key: "premium",
    left: "ACCESSIBLE",
    right: "PREMIUM",
  },
  {
    key: "technical",
    left: "HUMAN",
    right: "TECHNICAL",
  },
  {
    key: "editorial",
    left: "UTILITARIAN",
    right: "EDITORIAL",
  },
  {
    key: "density",
    left: "SPACIOUS",
    right: "DENSE",
  },
]

export function DNAPanel({
  system,
}: {
  system: BrandSystem
}) {
  const project =
    useBrandStore((state) => state.project)

  const updateDNA =
    useBrandStore((state) => state.updateDNA)

  const checkpoint =
    useBrandStore((state) => state.checkpoint)

  const remix =
    useBrandStore((state) => state.remix)

  const toggleLock =
    useBrandStore((state) => state.toggleLock)

  const setShowBefore =
    useBrandStore(
      (state) => state.setShowBefore,
    )

  if (!project) {
    return null
  }

  return (
    <aside className="h-full overflow-y-auto border-l border-black/10 bg-[#f7f6f2]">
      <div className="border-b border-black/10 p-5">
        <div className="text-[10px] font-bold tracking-[0.15em] text-black/40">
          THIS IS HOW I READ
          {" "}
          {project.name.toUpperCase()}.
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.keywords.map((word) => (
            <span
              key={word}
              className="border border-black/10 bg-white px-2.5 py-1.5 text-[9px] font-bold tracking-[0.1em]"
            >
              {word.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-black tracking-[-0.02em]">
              BRAND DNA
            </div>

            <div className="mt-1 text-[10px] text-black/40">
              Drag one axis. Watch everything move.
            </div>
          </div>

          <div className="text-[10px] font-bold text-black/30">
            LIVE
          </div>
        </div>

        <div className="space-y-6">
          {dimensions.map(
            ({
              key,
              left,
              right,
            }) => (
              <label
                key={key}
                className="block"
              >
                <div className="mb-2 flex items-center justify-between text-[9px] font-bold tracking-[0.1em] text-black/45">
                  <span>{left}</span>

                  <span>
                    {Math.round(
                      project.dna[key] * 100,
                    )}
                  </span>

                  <span>{right}</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={
                    project.dna[key] * 100
                  }
                  onPointerDown={checkpoint}
                  onChange={(event) =>
                    updateDNA(
                      key,
                      Number(
                        event.target.value,
                      ) / 100,
                    )
                  }
                  className="brand-slider w-full"
                />
              </label>
            ),
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2">
          <button
            onPointerDown={() =>
              setShowBefore(true)
            }
            onPointerUp={() =>
              setShowBefore(false)
            }
            onPointerLeave={() =>
              setShowBefore(false)
            }
            className="flex h-11 items-center justify-center gap-2 border border-black/15 bg-white text-[10px] font-bold tracking-[0.08em]"
          >
            <RotateCcw size={13} />
            HOLD BEFORE
          </button>

          <button
            onClick={remix}
            className="flex h-11 items-center justify-center gap-2 bg-black text-[10px] font-bold tracking-[0.08em] text-white"
          >
            <Shuffle size={13} />
            REMIX
          </button>
        </div>

        <div className="mt-6 border-t border-black/10 pt-5">
          <div className="mb-3 text-[10px] font-bold tracking-[0.13em] text-black/40">
            LOCKS
          </div>

          <LockButton
            active={Boolean(project.locks.primary)}
            label="PRIMARY COLOR"
            onClick={() =>
              toggleLock(
                "primary",
                system.colors.light.primary,
              )
            }
          />

          <LockButton
            active={Boolean(
              project.locks.headingFont,
            )}
            label="HEADING FONT"
            onClick={() =>
              toggleLock(
                "headingFont",
                system.typography.heading.family,
              )
            }
          />

          <LockButton
            active={Boolean(
              project.locks.bodyFont,
            )}
            label="BODY FONT"
            onClick={() =>
              toggleLock(
                "bodyFont",
                system.typography.body.family,
              )
            }
          />

          <LockButton
            active={Boolean(project.locks.radii)}
            label="RADII"
            onClick={() =>
              toggleLock(
                "radii",
                system.radii,
              )
            }
          />
        </div>
      </div>
    </aside>
  )
}

function LockButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="mb-2 flex w-full items-center justify-between border border-black/10 bg-white px-3 py-3 text-[10px] font-bold tracking-[0.08em]"
    >
      {label}

      {active ? (
        <Lock size={12} />
      ) : (
        <Unlock
          size={12}
          className="text-black/30"
        />
      )}
    </button>
  )
}