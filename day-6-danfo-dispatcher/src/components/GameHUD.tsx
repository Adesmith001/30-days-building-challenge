import {
  Pause,
  Play,
} from "lucide-react";
import { getFlowMultiplier } from "../lib/scoring";
import { shiftDurationMs } from "../lib/sim/step";
import type { GameState } from "../types/game";

interface Props {
  state: GameState;
  onPause(): void;
  onSpeed(speed: 1 | 2): void;
}

function timeLabel(ms: number) {
  const seconds = Math.max(
    0,
    Math.ceil(ms / 1_000),
  );

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(
    secs,
  ).padStart(2, "0")}`;
}

export function GameHUD({
  state,
  onPause,
  onSpeed,
}: Props) {
  const duration = shiftDurationMs(state.shift);

  const remaining =
    duration -
    (state.now - state.shiftStartedAt);

  return (
    <div
      className="
        grid grid-cols-[1fr_auto_1fr]
        items-center border-b
        border-[#918976]
        bg-[#f7f4ef] px-4 py-3
      "
    >
      <div className="flex items-center gap-4">
        <div className="border border-[#918976] px-3 py-2">
          <div className="text-[9px] tracking-[0.18em]">
            ACTIVE PHASE
          </div>

          <strong>
            SHIFT {String(state.shift).padStart(2, "0")}
          </strong>
        </div>

        <span className="hidden text-xs sm:inline">
          ◷ {timeLabel(remaining)} REMAINING
        </span>
      </div>

      <div className="text-center">
        <div className="text-[9px] tracking-[0.2em]">
          CITY SCORE
        </div>

        <div
          className="
            text-4xl font-black
            tracking-[-0.05em]
            sm:text-5xl
          "
        >
          {state.score.toLocaleString()}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onPause}
          className="
            flex cursor-pointer items-center
            gap-2 border border-[#918976]
            px-3 py-2 text-xs
          "
        >
          {state.paused ? (
            <Play size={14} />
          ) : (
            <Pause size={14} />
          )}

          <span className="hidden sm:inline">
            {state.paused ? "RESUME" : "PAUSE"}
          </span>
        </button>

        <button
          onClick={() =>
            onSpeed(
              state.gameSpeed === 1 ? 2 : 1,
            )
          }
          className="
            border border-black bg-[#ffd000]
            px-3 py-2 text-sm font-black
          "
        >
          FLOW ×
          {getFlowMultiplier(state.flow)}
          {" · "}
          {state.gameSpeed}×
        </button>
      </div>
    </div>
  );
}