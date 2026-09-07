import { formatNumber } from "../lib/currency";

interface Props {
  card: number;
  total: number;
  score: number;
  streak: number;
  skipsLeft: number;
}

export function GameHUD({
  card,
  total,
  score,
  streak,
  skipsLeft,
}: Props) {
  return (
    <div className="mx-auto mb-6 w-full max-w-[520px]">
      <div
        className="
          grid grid-cols-3 rounded-xl border
          border-[#b8c5ba] bg-white
        "
      >
        <Metric
          label="CARD"
          value={`${String(card).padStart(2, "0")} / ${total}`}
        />

        <Metric
          label="SCORE"
          value={formatNumber(score)}
          border
        />

        <Metric
          label="STREAK"
          value={`×${Math.max(streak, 1)}`}
          border
          accent
        />
      </div>

      <div className="mt-2 flex justify-center">
        <span
          className="
            rounded-full border border-[#d2d8d1]
            bg-[#f5f4f1] px-3 py-1 font-mono
            text-[10px] font-bold tracking-[0.14em]
            text-[#667168]
          "
        >
          SKIPS {skipsLeft}
        </span>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  border = false,
  accent = false,
}: {
  label: string;
  value: string;
  border?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        "py-3 text-center",
        border ? "border-l border-[#d2d8d1]" : "",
      ].join(" ")}
    >
      <div
        className="
          text-xs uppercase tracking-[0.08em]
          text-[#697169]
        "
      >
        {label}
      </div>

      <div
        className={[
          "mt-1 font-mono text-lg font-black sm:text-xl",
          accent ? "text-[#9a5c00]" : "",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}