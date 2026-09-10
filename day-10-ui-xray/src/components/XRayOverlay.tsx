import type {
  Bounds,
  DesignSystem,
  XRayMode,
} from "../types/ui-analysis";

interface OverlayItem {
  id: string;
  label: string;
  bounds: Bounds[];
}

interface Props {
  system: DesignSystem;
  mode: XRayMode;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function getItems(
  system: DesignSystem,
  mode: XRayMode,
): OverlayItem[] {
  if (mode === "structure") {
    return system.sections.map((section) => ({
      id: section.id,
      label: section.name,
      bounds: [section.bounds],
    }));
  }

  if (mode === "colors") {
    return system.colors
      .filter((color) => !color.ignored)
      .map((color) => ({
        id: color.id,
        label: color.name,
        bounds: color.bounds,
      }));
  }

  if (mode === "type") {
    return system.typography.map((token) => ({
      id: token.id,
      label: token.name,
      bounds: token.bounds,
    }));
  }

  if (mode === "spacing") {
    return system.spacing.map((token) => ({
      id: token.id,
      label: token.name,
      bounds: token.bounds,
    }));
  }

  return system.components.map(
    (component) => ({
      id: component.id,
      label: component.name,
      bounds: component.instances,
    }),
  );
}

export function XRayOverlay({
  system,
  mode,
  selectedId,
  onSelect,
}: Props) {
  const items = getItems(system, mode);

  return (
    <div className="pointer-events-none absolute inset-0">
      {items.flatMap((item) =>
        item.bounds.map((bounds, index) => {
          const selected =
            selectedId === item.id;

          return (
            <button
              key={`${item.id}-${index}`}
              onClick={() =>
                onSelect(item.id)
              }
              aria-label={item.label}
              className={[
                "pointer-events-auto absolute border transition-all",
                selected
                  ? "z-20 border-2 border-accent bg-accent/10"
                  : "z-10 border border-accent/55 hover:bg-accent/10",
              ].join(" ")}
              style={{
                left: `${bounds.x * 100}%`,
                top: `${bounds.y * 100}%`,
                width: `${bounds.width * 100}%`,
                height: `${bounds.height * 100}%`,
              }}
            >
              {(selected ||
                mode === "structure") && (
                <span className="absolute -top-5 left-0 whitespace-nowrap bg-ink px-1.5 py-0.5 font-mono text-[8px] uppercase text-white">
                  {item.label}
                </span>
              )}
            </button>
          );
        }),
      )}
    </div>
  );
}