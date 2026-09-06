import { AlertTriangle } from "lucide-react";
import type { GameState } from "../types/game";

interface Props {
  state: GameState;
  onPayPolice(): void;
}

export function EventBanner({
  state,
  onPayPolice,
}: Props) {
  const event = state.incident;

  if (!event) return null;

  const dangerous =
    event.type === "roadblock" ||
    event.type === "police";

  return (
    <div
      className={`
        pointer-events-auto absolute
        left-1/2 top-4 z-30
        w-[calc(100%-2rem)]
        max-w-3xl -translate-x-1/2
        border-2 p-3
        shadow-[5px_5px_0_#171717]
        ${
          dangerous
            ? "border-red-700 bg-red-50"
            : "border-[#817762] bg-[#f7f4ef]"
        }
      `}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AlertTriangle
            size={18}
            className={
              dangerous
                ? "text-red-700"
                : ""
            }
          />

          <div>
            <div
              className={`
                text-xs font-black
                tracking-[0.15em]
                ${
                  dangerous
                    ? "text-red-700"
                    : ""
                }
              `}
            >
              {event.title}
            </div>

            <div className="mt-1 text-xs">
              {event.detail}
            </div>
          </div>
        </div>

        {event.type === "police" &&
          event.bribeCost && (
            <button
              onClick={onPayPolice}
              disabled={
                state.cash < event.bribeCost
              }
              className="
                cursor-pointer border
                border-black bg-[#ffd000]
                px-4 py-2 text-xs
                font-black
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              SETTLE ₦
              {event.bribeCost.toLocaleString()}
            </button>
          )}
      </div>
    </div>
  );
}