import {
  useMemo,
  useState,
} from "react";

import {
  buildCssVariables,
  buildJsonExport,
  buildTailwindTheme,
} from "../lib/export";

import { CopyButton } from "../components/CopyButton";

import type {
  DesignSystem,
} from "../types/ui-analysis";

type ExportMode =
  | "css"
  | "tailwind"
  | "json";

interface Props {
  system: DesignSystem;
}

export function ExportScreen({
  system,
}: Props) {
  const [mode, setMode] =
    useState<ExportMode>("css");

  const values = useMemo(
    () => ({
      css: buildCssVariables(system),
      tailwind:
        buildTailwindTheme(system),
      json: buildJsonExport(system),
    }),
    [system],
  );

  const output = values[mode];

  return (
    <main className="min-h-[calc(100vh-44px)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col justify-between gap-5 border-b border-line pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono text-[9px] text-accent">
              EXPORT SYSTEM
            </div>

            <h1 className="mt-2 font-sans text-3xl font-semibold tracking-[-0.04em]">
              Ready for implementation.
            </h1>

            <p className="mt-2 max-w-xl text-sm text-muted">
              User edits and ignored tokens
              are reflected automatically.
            </p>
          </div>

          <CopyButton value={output} />
        </div>

        <div className="mt-6 flex border-b border-line">
          {(
            [
              ["css", "CSS VARIABLES"],
              ["tailwind", "TAILWIND V4"],
              ["json", "JSON"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={[
                "border-r border-line px-4 py-2.5 font-mono text-[9px]",
                mode === value
                  ? "bg-ink text-white"
                  : "bg-panel text-muted hover:text-ink",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        <pre className="overflow-x-auto border-x border-b border-line bg-panel p-5 font-mono text-[11px] leading-6 text-ink">
          <code>{output}</code>
        </pre>

        <div className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-3">
          <Summary
            value={
              system.colors.filter(
                (color) => !color.ignored,
              ).length
            }
            label="COLORS"
          />

          <Summary
            value={system.typography.length}
            label="TYPE STYLES"
          />

          <Summary
            value={system.components.length}
            label="COMPONENT TYPES"
          />
        </div>
      </div>
    </main>
  );
}

function Summary({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="bg-panel p-5">
      <div className="font-sans text-3xl font-semibold">
        {value}
      </div>

      <div className="mt-1 font-mono text-[8px] text-muted">
        {label}
      </div>
    </div>
  );
}