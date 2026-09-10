import type {
  TypeToken,
} from "../types/ui-analysis";

interface Props {
  token: TypeToken;
  selected: boolean;
  onClick: () => void;
}

export function TypeSpecimen({
  token,
  selected,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full border-b border-line-soft p-3 text-left",
        selected
          ? "bg-subtle"
          : "hover:bg-subtle",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[9px] font-semibold uppercase">
          {token.name}
        </span>

        <span className="font-mono text-[8px] text-muted">
          {token.size} / {token.lineHeight}
          {" · "}
          {token.weight}
        </span>
      </div>

      <div
        className={[
          "mt-3 line-clamp-2 text-ink",
          token.familyClass === "mono"
            ? "font-mono"
            : "font-sans",
        ].join(" ")}
        style={{
          fontSize: `${Math.min(
            token.size,
            30,
          )}px`,
          lineHeight: 1.1,
          fontWeight: token.weight,
        }}
      >
        {token.sample || "UI X-Ray"}
      </div>
    </button>
  );
}