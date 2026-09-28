import {
  Check,
  Lock,
} from "lucide-react"
import {
  useState,
} from "react"
import { fonts } from "../data/fonts"
import type {
  BrandSystem,
} from "../types"
import {
  useBrandStore,
} from "../store/brand-store"

export function TypographyView({
  system,
}: {
  system: BrandSystem
}) {
  const [picker, setPicker] =
    useState<"heading" | "body" | null>(
      null,
    )

  const setOverride =
    useBrandStore((state) => state.setOverride)

  const project =
    useBrandStore((state) => state.project)

  if (!project) {
    return null
  }

  return (
    <div className="p-5 md:p-8">
      <div className="editor-eyebrow">
        TYPOGRAPHY
      </div>

      <h2 className="editor-title">
        TYPE
        <br />
        SYSTEM.
      </h2>

      <div className="mt-12 border-y border-black/10 py-12">
        <div
          className="text-[clamp(4rem,11vw,10rem)] leading-[0.82]"
          style={{
            fontFamily:
              `"${system.typography.heading.family}", sans-serif`,
            fontWeight:
              system.wordmark.weight,
            letterSpacing:
              `${system.wordmark.tracking}em`,
          }}
        >
          {system.name}
        </div>
      </div>

      <div className="grid border-b border-black/10 lg:grid-cols-2">
        <FontCard
          label="HEADING"
          family={
            system.typography.heading.family
          }
          locked={Boolean(
            project.locks.headingFont,
          )}
          onClick={() =>
            setPicker("heading")
          }
        />

        <FontCard
          label="BODY"
          family={
            system.typography.body.family
          }
          locked={Boolean(
            project.locks.bodyFont,
          )}
          onClick={() =>
            setPicker("body")
          }
        />
      </div>

      <div className="mt-12">
        <div className="editor-eyebrow">
          SPECIMEN
        </div>

        <h3
          className="mt-6 max-w-5xl text-[clamp(3rem,7vw,7rem)] leading-[0.9] tracking-[-0.045em]"
          style={{
            fontFamily:
              `"${system.typography.heading.family}", sans-serif`,
          }}
        >
          BUILD THE BUSINESS
          <br />
          WITHOUT THE BUSYWORK.
        </h3>

        <p
          className="mt-8 max-w-2xl text-lg leading-8 text-black/55"
          style={{
            fontFamily:
              `"${system.typography.body.family}", sans-serif`,
          }}
        >
          A design system is not a collection of
          attractive colors. It is a set of decisions
          that continue to work when the interface gets
          larger, denser and less perfect.
        </p>
      </div>

      <div className="mt-14">
        <div className="editor-eyebrow">
          TYPE SCALE
        </div>

        <div className="mt-5 divide-y divide-black/10 border-y border-black/10">
          {Object.entries(
            system.typography.scale,
          ).map(([name, value]) => (
            <div
              key={name}
              className="grid grid-cols-[90px_1fr_auto] items-center gap-3 py-4"
            >
              <div className="text-[10px] font-bold tracking-[0.08em]">
                {name.toUpperCase()}
              </div>

              <div
                className="truncate"
                style={{
                  fontFamily:
                    name.startsWith("body")
                      ? `"${system.typography.body.family}"`
                      : `"${system.typography.heading.family}"`,
                  fontSize:
                    Math.min(
                      value.size,
                      38,
                    ),
                  lineHeight:
                    value.lineHeight,
                  fontWeight:
                    value.weight,
                }}
              >
                Aa
              </div>

              <div className="font-mono text-[10px] text-black/40">
                {value.size.toFixed(1)}px
                {" · "}
                {value.weight}
                {" · "}
                {value.tracking}em
              </div>
            </div>
          ))}
        </div>
      </div>

      {picker && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 md:items-center"
          onClick={() => setPicker(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-y-auto border border-black/15 bg-[#f7f6f2] p-5 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="editor-eyebrow">
                  FONT PICKER
                </div>

                <h3 className="mt-2 text-2xl font-black">
                  {picker.toUpperCase()}
                </h3>
              </div>

              <div className="text-[10px] text-black/40">
                CHANGES LOCK BY DEFAULT
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {fonts
                .filter(
                  (font) =>
                    font.category !== "mono",
                )
                .map((font) => {
                  const current =
                    picker === "heading"
                      ? system.typography.heading
                          .family
                      : system.typography.body
                          .family

                  return (
                    <button
                      key={font.family}
                      onClick={() => {
                        setOverride(
                          picker === "heading"
                            ? "headingFont"
                            : "bodyFont",
                          font.family,
                        )

                        setPicker(null)
                      }}
                      className="flex w-full items-center justify-between border border-black/10 bg-white p-4 text-left"
                      style={{
                        fontFamily:
                          `"${font.family}", sans-serif`,
                      }}
                    >
                      <div>
                        <div className="text-xl">
                          {font.family}
                        </div>

                        <div className="mt-1 text-[10px] uppercase tracking-[0.08em] opacity-40">
                          {font.category}
                        </div>
                      </div>

                      {current ===
                        font.family && (
                        <Check size={16} />
                      )}
                    </button>
                  )
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FontCard({
  label,
  family,
  locked,
  onClick,
}: {
  label: string
  family: string
  locked: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="border-b border-black/10 p-6 text-left lg:border-b-0 lg:border-r"
    >
      <div className="flex items-center gap-2">
        <div className="editor-eyebrow">
          {label}
        </div>

        {locked && <Lock size={10} />}
      </div>

      <div
        className="mt-6 text-3xl"
        style={{
          fontFamily:
            `"${family}", sans-serif`,
        }}
      >
        {family}
      </div>

      <div className="mt-3 text-xs text-black/40">
        Click to change
      </div>
    </button>
  )
}