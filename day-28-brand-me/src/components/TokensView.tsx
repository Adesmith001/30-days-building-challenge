import {
  ChevronRight,
  Search,
} from "lucide-react"
import {
  useMemo,
  useState,
} from "react"
import type {
  BrandSystem,
} from "../types"

interface TokenRow {
  name: string
  value: string
  group: string
}

export function TokensView({
  system,
}: {
  system: BrandSystem
}) {
  const [query, setQuery] =
    useState("")

  const tokens = useMemo<TokenRow[]>(
    () => [
      ...Object.entries(
        system.colors.light,
      ).map(([key, value]) => ({
        name: `color.${key}`,
        value,
        group: "COLOR",
      })),

      ...Object.entries(
        system.spacing,
      ).map(([key, value]) => ({
        name: `spacing.${key}`,
        value: `${value}px`,
        group: "SPACING",
      })),

      ...Object.entries(
        system.radii,
      ).map(([key, value]) => ({
        name: `radius.${key}`,
        value: `${value}px`,
        group: "RADIUS",
      })),

      ...Object.entries(
        system.motion,
      )
        .filter(
          ([key]) =>
            ![
              "standard",
              "emphasized",
            ].includes(key),
        )
        .map(([key, value]) => ({
          name: `motion.${key}`,
          value: `${value}ms`,
          group: "MOTION",
        })),

      {
        name: "type.heading.family",
        value:
          system.typography.heading.family,
        group: "TYPE",
      },

      {
        name: "type.body.family",
        value:
          system.typography.body.family,
        group: "TYPE",
      },
    ],
    [system],
  )

  const filtered = tokens.filter(
    (token) =>
      token.name
        .toLowerCase()
        .includes(query.toLowerCase()),
  )

  return (
    <div className="grid min-h-full lg:grid-cols-[240px_1fr]">
      <aside className="border-r border-black/10 bg-[#f7f6f2] p-5">
        <div className="editor-eyebrow">
          DESIGN TOKENS
        </div>

        <div className="mt-7 space-y-1">
          {[
            "COLOR",
            "TYPE",
            "SPACING",
            "RADIUS",
            "SHADOW",
            "MOTION",
          ].map((group) => (
            <button
              key={group}
              className="flex w-full items-center justify-between border-b border-black/5 py-3 text-left text-xs font-bold"
            >
              {group}
              <ChevronRight
                size={12}
                className="text-black/30"
              />
            </button>
          ))}
        </div>
      </aside>

      <div className="p-5 md:p-8">
        <div className="editor-eyebrow">
          DESIGN
        </div>

        <h2 className="editor-title">
          TOKENS.
        </h2>

        <div className="mt-8 flex items-center gap-3 border border-black/15 bg-white px-4 py-3">
          <Search
            size={15}
            className="text-black/35"
          />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search primary, radius, motion..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <div className="mt-7 border-t border-black/10">
          {filtered.map((token) => (
            <button
              key={token.name}
              onClick={() =>
                navigator.clipboard.writeText(
                  token.value,
                )
              }
              className="grid w-full grid-cols-[1fr_auto] items-center border-b border-black/10 py-4 text-left hover:bg-black/[0.02]"
            >
              <div>
                <div className="font-mono text-xs">
                  {token.name}
                </div>

                <div className="mt-1 text-[9px] font-bold tracking-[0.1em] text-black/35">
                  {token.group}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {token.value.startsWith("#") && (
                  <span
                    className="h-7 w-7 border border-black/10"
                    style={{
                      background:
                        token.value,
                    }}
                  />
                )}

                <span className="max-w-[240px] truncate font-mono text-xs text-black/45">
                  {token.value}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}