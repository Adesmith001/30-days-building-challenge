import type {
  DetectedComponent,
} from "../types/ui-analysis";

interface Props {
  components: DetectedComponent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ComponentInventory({
  components,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div>
      {components.map((component) => (
        <button
          key={component.id}
          onClick={() =>
            onSelect(component.id)
          }
          className={[
            "flex w-full items-center justify-between border-b border-line-soft px-3 py-3 text-left",
            selectedId === component.id
              ? "bg-subtle"
              : "hover:bg-subtle",
          ].join(" ")}
        >
          <span className="font-mono text-[9px] font-semibold uppercase">
            {component.name}
          </span>

          <span className="font-mono text-[9px] text-muted">
            {component.count}
          </span>
        </button>
      ))}
    </div>
  );
}