import {
  Check,
  Clipboard,
  Lock,
} from "lucide-react"
import {
  useState,
} from "react"
import type {
  BrandSystem,
  ColorStep,
} from "../types"
import {
  contrastRatio,
} from "../lib/color"
import {
  useBrandStore,
} from "../store/brand-store"

const steps: ColorStep[] = [
  50,
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
  950,
]

export function PaletteView({
  system,
}: {
  system: BrandSystem
}) {
  const [selected, setSelected] =
    useState(system.colors.light.primary)

  const project =
    useBrandStore((state) => state.project)

  const setOverride =
    useBrandStore((state) => state.setOverride)

  const toggleLock =
    useBrandStore((state) => state.toggleLock)

  const [brandColor, setBrandColor] =
    useState(system.colors.light.primary)

  if (!project) {
    return null
  }

  const foreground =
    system.colors.light.primaryForeground

  const ratio = contrastRatio(
    system.colors.light.primary,
    foreground,
  )

  return (
    <div className="grid min-h-full gap-0 xl:grid-cols-[1fr_300px]">
      <div className="p-5 md:p-8">
        <div className="mb-10">
          <div className="editor-eyebrow">
            COLOR SYSTEM
          </div>

          <h2 className="editor-title">
            COLOR
            <br />
            SYSTEM.
          </h2>
        </div>

        <Scale
          label="PRIMARY"
          scale={system.colors.primary}
          selected={selected}
          onSelect={setSelected}
        />

        <Scale
          label="NEUTRAL"
          scale={system.colors.neutral}
          selected={selected}
          onSelect={setSelected}
        />

        <div className="mt-12">
          <div className="editor-eyebrow">
            SEMANTIC
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6">
            {[
              [
                "BACKGROUND",
                system.colors.light.background,
              ],
              [
                "SURFACE",
                system.colors.light.surface,
              ],
              [
                "TEXT",
                system.colors.light.foreground,
              ],
              [
                "PRIMARY",
                system.colors.light.primary,
              ],
              [
                "SUCCESS",
                system.colors.light.success,
              ],
              [
                "WARNING",
                system.colors.light.warning,
              ],
              [
                "DANGER",
                system.colors.light.danger,
              ],
            ].map(([name, color]) => (
              <button
                key={name}
                onClick={() =>
                  setSelected(color)
                }
                className="overflow-hidden border border-black/10 bg-white text-left"
              >
                <div
                  className="h-20"
                  style={{
                    background: color,
                  }}
                />

                <div className="p-3">
                  <div className="text-[9px] font-bold tracking-[0.08em]">
                    {name}
                  </div>

                  <div className="mt-1 font-mono text-[9px] text-black/40">
                    {color}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="border-l border-black/10 bg-[#f7f6f2] p-5">
        <div className="editor-eyebrow">
          TOKEN INSPECTOR
        </div>

        <div
          className="mt-5 h-28 border border-black/10"
          style={{
            background: selected,
          }}
        />

        <div className="mt-5 text-2xl font-black">
          PRIMARY
        </div>

        <Info
          label="HEX"
          value={selected}
        />

        <Info
          label="USED BY"
          value="BUTTONS · LINKS · FOCUS"
        />

        <Info
          label="PRIMARY PAIR"
          value={`${ratio.toFixed(2)}:1`}
        />

        <div className="mt-5 flex items-center gap-2 text-xs">
          <Check size={14} />
          {ratio >= 4.5
            ? "BODY TEXT PAIR PASSES"
            : "PAIR NEEDS ATTENTION"}
        </div>

        <button
          onClick={() =>
            navigator.clipboard.writeText(
              selected,
            )
          }
          className="editor-button mt-6 w-full"
        >
          <Clipboard size={13} />
          COPY COLOR
        </button>

        <button
          onClick={() =>
            toggleLock(
              "primary",
              system.colors.light.primary,
            )
          }
          className="editor-button mt-2 w-full"
        >
          <Lock size={13} />
          {project.locks.primary
            ? "UNLOCK PRIMARY"
            : "LOCK PRIMARY"}
        </button>

        <div className="mt-8 border-t border-black/10 pt-6">
          <div className="editor-eyebrow">
            EXISTING BRAND COLOR
          </div>

          <input
            value={brandColor}
            onChange={(event) =>
              setBrandColor(event.target.value)
            }
            className="mt-3 w-full border border-black/15 bg-white px-3 py-3 font-mono text-xs outline-none"
          />

          <button
            onClick={() =>
              setOverride(
                "primaryColor",
                brandColor,
              )
            }
            className="mt-2 w-full bg-black px-3 py-3 text-[10px] font-bold tracking-[0.08em] text-white"
          >
            USE + LOCK DIRECTION
          </button>
        </div>
      </aside>
    </div>
  )
}

function Scale({
  label,
  scale,
  selected,
  onSelect,
}: {
  label: string
  scale: Record<ColorStep, string>
  selected: string
  onSelect: (value: string) => void
}) {
  return (
    <div className="mb-10">
      <div className="editor-eyebrow">
        {label}
      </div>

      <div className="mt-4 grid grid-cols-4 md:grid-cols-6 xl:grid-cols-11">
        {steps.map((step) => {
          const color = scale[step]

          return (
            <button
              key={step}
              onClick={() =>
                onSelect(color)
              }
              className={
                selected === color
                  ? "outline outline-2 outline-black"
                  : ""
              }
            >
              <div
                className="h-20 md:h-28"
                style={{
                  background: color,
                }}
              />

              <div className="bg-white px-2 py-2 text-left">
                <div className="text-[9px] font-bold">
                  {step}
                </div>

                <div className="mt-1 font-mono text-[8px] text-black/35">
                  {color}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="mt-5 border-t border-black/10 pt-4">
      <div className="editor-eyebrow">
        {label}
      </div>

      <div className="mt-2 break-words font-mono text-xs">
        {value}
      </div>
    </div>
  )
}