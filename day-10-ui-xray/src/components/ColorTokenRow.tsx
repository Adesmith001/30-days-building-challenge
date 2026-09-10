import type {
  ColorToken,
} from "../types/ui-analysis";

interface Props {
  token: ColorToken;
  selected: boolean;
  onClick: () => void;
}

export function ColorTokenRow({
  token,
  selected,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={[
        "grid w-full grid-cols-[18px_1fr_auto] items-center gap-3 border-b border-line-soft px-3 py-2.5 text-left",
        selected
          ? "bg-subtle"
          : "hover:bg-subtle",
      ].join(" ")}
    >
      <span
        className="size-4 border border-black/10"
        style={{
          backgroundColor: token.hex,
        }}
      />

      <span className="min-w-0">
        <span className="block truncate font-mono text-[9px] font-semibold uppercase text-ink">
          {token.name}
        </span>

        <span className="mt-0.5 block font-mono text-[8px] text-muted">
          {token.usage.length
            ? token.usage.join(" · ")
            : token.role}
        </span>
      </span>

      <span className="font-mono text-[9px] text-muted">
        {token.hex}
      </span>
    </button>
  );
}