import {
  roundPhase,
} from "../lib/scoring";

export function GameHeader({
  round,
  total,
  score,
}: {
  round: number;
  total: number;
  score: number;
}) {
  return (
    <div
      className="
        grid
        grid-cols-3
        items-center
        rounded-xl
        border
        border-white/10
        bg-white/5
        px-3
        py-2
      "
    >
      <div>
        <span
          className="
            block
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-slate-500
          "
        >
          Round
        </span>

        <span
          className="
            font-display
            text-sm
            font-bold
          "
        >
          {String(
            round + 1,
          ).padStart(
            2,
            "0",
          )}
          {" / "}
          {String(
            total,
          ).padStart(
            2,
            "0",
          )}
        </span>
      </div>

      <div
        className="
          text-center
        "
      >
        <span
          className="
            block
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-slate-500
          "
        >
          Score
        </span>

        <span
          className="
            font-display
            text-sm
            font-bold
            text-gold
          "
        >
          {score.toLocaleString()}
        </span>
      </div>

      <div
        className="
          text-right
        "
      >
        <span
          className="
            block
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-slate-500
          "
        >
          Phase
        </span>

        <span
          className="
            font-display
            text-[11px]
            font-bold
            text-emerald-300
          "
        >
          {roundPhase(
            round,
            total,
          )}
        </span>
      </div>
    </div>
  );
}