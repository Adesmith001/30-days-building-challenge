import { ColorTokenRow } from "./ColorTokenRow";
import { ComponentInventory } from "./ComponentInventory";
import { CopyButton } from "./CopyButton";
import { SpacingScale } from "./SpacingScale";
import { TypeSpecimen } from "./TypeSpecimen";

import type {
  ColorToken,
  DesignSystem,
  XRayMode,
} from "../types/ui-analysis";

interface Props {
  system: DesignSystem;
  mode: XRayMode;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdateColor: (
    id: string,
    patch: Partial<ColorToken>,
  ) => void;
  onMergeColor: (id: string) => void;
}

function confidenceLabel(value: number) {
  if (value >= 0.82) return "HIGH";
  if (value >= 0.62) return "MEDIUM";
  return "LOW";
}

export function Inspector({
  system,
  mode,
  selectedId,
  onSelect,
  onUpdateColor,
  onMergeColor,
}: Props) {
  const selectedColor =
    mode === "colors"
      ? system.colors.find(
          (token) => token.id === selectedId,
        )
      : null;

  return (
    <aside className="flex h-full min-h-0 flex-col bg-panel">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-line px-3">
        <span className="font-mono text-[9px] font-semibold uppercase">
          {mode} system
        </span>

        <span className="font-mono text-[8px] text-muted">
          {system.confidence}% CONF.
        </span>
      </div>

      {selectedColor && (
        <div className="border-b border-line bg-subtle p-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-[8px] text-muted">
                SELECTED TOKEN
              </div>

              <div className="mt-1 font-mono text-[11px] font-semibold uppercase">
                {selectedColor.name}
              </div>
            </div>

            <CopyButton
              value={selectedColor.hex}
            />
          </div>

          <div className="mt-3 grid grid-cols-[1fr_105px] gap-2">
            <input
              defaultValue={selectedColor.name}
              onBlur={(event) =>
                onUpdateColor(
                  selectedColor.id,
                  {
                    name:
                      event.target.value.trim() ||
                      selectedColor.name,
                    edited: true,
                  },
                )
              }
              className="h-8 border border-line bg-panel px-2 font-mono text-[9px] outline-none focus:border-accent"
            />

            <input
              defaultValue={selectedColor.hex}
              onBlur={(event) => {
                const value =
                  event.target.value.toUpperCase();

                if (
                  /^#[0-9A-F]{6}$/.test(value)
                ) {
                  onUpdateColor(
                    selectedColor.id,
                    {
                      hex: value,
                      edited: true,
                    },
                  );
                }
              }}
              className="h-8 border border-line bg-panel px-2 font-mono text-[9px] outline-none focus:border-accent"
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-[8px] text-muted">
              {confidenceLabel(
                selectedColor.confidence,
              )}{" "}
              CONFIDENCE
            </span>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  onMergeColor(
                    selectedColor.id,
                  )
                }
                className="font-mono text-[8px] font-semibold hover:text-accent"
              >
                MERGE SIMILAR
              </button>

              <button
                onClick={() =>
                  onUpdateColor(
                    selectedColor.id,
                    {
                      ignored:
                        !selectedColor.ignored,
                    },
                  )
                }
                className="font-mono text-[8px] font-semibold hover:text-danger"
              >
                {selectedColor.ignored
                  ? "RESTORE"
                  : "IGNORE"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {mode === "colors" && (
          <>
            <SectionLabel value="UI COLORS" />

            {system.colors
              .filter(
                (token) =>
                  token.kind === "ui" &&
                  !token.ignored,
              )
              .map((token) => (
                <ColorTokenRow
                  key={token.id}
                  token={token}
                  selected={
                    selectedId === token.id
                  }
                  onClick={() =>
                    onSelect(token.id)
                  }
                />
              ))}

            <SectionLabel value="CONTENT COLORS" />

            {system.colors
              .filter(
                (token) =>
                  token.kind === "content" &&
                  !token.ignored,
              )
              .map((token) => (
                <ColorTokenRow
                  key={token.id}
                  token={token}
                  selected={
                    selectedId === token.id
                  }
                  onClick={() =>
                    onSelect(token.id)
                  }
                />
              ))}
          </>
        )}

        {mode === "type" &&
          system.typography.map((token) => (
            <TypeSpecimen
              key={token.id}
              token={token}
              selected={
                selectedId === token.id
              }
              onClick={() =>
                onSelect(token.id)
              }
            />
          ))}

        {mode === "spacing" && (
          <SpacingScale
            tokens={system.spacing}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        )}

        {mode === "components" && (
          <ComponentInventory
            components={system.components}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        )}

        {mode === "structure" &&
          system.sections.map((section) => (
            <button
              key={section.id}
              onClick={() =>
                onSelect(section.id)
              }
              className={[
                "flex w-full items-center justify-between border-b border-line-soft px-3 py-3",
                selectedId === section.id
                  ? "bg-subtle"
                  : "hover:bg-subtle",
              ].join(" ")}
            >
              <span className="font-mono text-[9px] font-semibold uppercase">
                {section.name}
              </span>

              <span className="font-mono text-[8px] text-muted">
                {Math.round(
                  section.confidence * 100,
                )}
                %
              </span>
            </button>
          ))}
      </div>
    </aside>
  );
}

function SectionLabel({
  value,
}: {
  value: string;
}) {
  return (
    <div className="border-b border-line bg-canvas px-3 py-2 font-mono text-[8px] font-semibold tracking-[0.08em] text-muted">
      {value}
    </div>
  );
}