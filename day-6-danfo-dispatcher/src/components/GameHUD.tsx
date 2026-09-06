import {
  Pause,
  Play,
} from "lucide-react";
import { DIFFICULTIES } from "../lib/difficulty";
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
        grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_auto_1fr]
        items-center border-b
        border-[#918976]
        bg-[#f7f4ef] px-3 py-2
      "
    >
      <div className="flex items-center gap-4">
        <div className="border border-[#918976] px-3 py-2">
          <div className="text-[9px] tracking-[0.18em]">
            {DIFFICULTIES[state.difficulty].label.toUpperCase()}
          </div>

          <strong>
            SHIFT {String(state.shift).padStart(2, "0")}
          </strong>
          <div className="mt-1 text-[10px] sm:hidden">{timeLabel(remaining)} remaining</div>
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

      <div className="col-span-2 flex justify-end gap-2 sm:col-span-1">
        <span className="mr-auto self-center text-[10px] sm:hidden">City health: {state.health}/3</span>
        <button
          onClick={onPause}
          aria-label={state.paused ? "Resume game" : "Pause game"}
          className="
            min-h-11 flex cursor-pointer items-center
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
          aria-label={`Game speed ${state.gameSpeed} times. Switch to ${state.gameSpeed === 1 ? 2 : 1} times speed`}
          onClick={() =>
            onSpeed(
              state.gameSpeed === 1 ? 2 : 1,
            )
          }
          className="
            min-h-11 border border-black bg-[#ffd000]
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
