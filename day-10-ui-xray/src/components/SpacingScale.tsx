import type {
  NumberToken,
} from "../types/ui-analysis";

interface Props {
  tokens: NumberToken[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SpacingScale({
  tokens,
  selectedId,
  onSelect,
}: Props) {
  const largest = Math.max(
    ...tokens.map((token) => token.value),
    1,
  );

  return (
    <div>
      {tokens.map((token) => (
        <button
          key={token.id}
          onClick={() =>
            onSelect(token.id)
          }
          className={[
            "grid w-full grid-cols-[42px_1fr_42px] items-center gap-3 border-b border-line-soft px-3 py-3 text-left",
            selectedId === token.id
              ? "bg-subtle"
              : "hover:bg-subtle",
          ].join(" ")}
        >
          <span className="font-mono text-[9px] font-semibold uppercase">
            {token.name}
          </span>

          <span className="h-1 bg-line">
            <span
              className="block h-full bg-accent"
              style={{
                width: `${
                  (token.value / largest) * 100
                }%`,
              }}
            />
          </span>

          <span className="text-right font-mono text-[9px] text-muted">
            {token.value}px
          </span>
        </button>
      ))}
    </div>
  );
}