import type {
  XRayMode,
} from "../types/ui-analysis";

const MODES: {
  value: XRayMode;
  label: string;
}[] = [
  {
    value: "structure",
    label: "STRUCTURE",
  },
  {
    value: "colors",
    label: "COLORS",
  },
  {
    value: "type",
    label: "TYPE",
  },
  {
    value: "spacing",
    label: "SPACING",
  },
  {
    value: "components",
    label: "COMPONENTS",
  },
];

interface Props {
  value: XRayMode;
  onChange: (mode: XRayMode) => void;
}

export function ModeTabs({
  value,
  onChange,
}: Props) {
  return (
    <div className="flex h-10 shrink-0 overflow-x-auto border-t border-line bg-canvas">
      {MODES.map((mode) => (
        <button
          key={mode.value}
          onClick={() =>
            onChange(mode.value)
          }
          className={[
            "min-w-max border-r border-line px-4 font-mono text-[9px] font-semibold tracking-[0.07em]",
            value === mode.value
              ? "bg-ink text-white"
              : "text-muted hover:bg-panel hover:text-ink",
          ].join(" ")}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}