import type {
  GameState,
  StopId,
} from "../types/game";
import { EventBanner } from "./EventBanner";
import { FleetPanel } from "./FleetPanel";
import { GameHUD } from "./GameHUD";
import { GlobalHeader } from "./GlobalHeader";
import { ScoreBurst } from "./ScoreBurst";
import { CityMap3D } from "./map/CityMap3D";

interface Props {
  state: GameState;
  onAbout(): void;
  onSelectDanfo(id: string): void;
  onDispatch(stop: StopId): void;
  onHorn(): void;
  onPolice(): void;
  onBuy(): void;
  onPause(): void;
  onSpeed(speed: 1 | 2): void;
  onEnd(): void;
}

export function GameScreen({
  state,
  onAbout,
  onSelectDanfo,
  onDispatch,
  onHorn,
  onPolice,
  onBuy,
  onPause,
  onSpeed,
  onEnd,
}: Props) {
  return (
    <div
      className="
        flex h-[100dvh] min-h-[650px]
        flex-col overflow-hidden
        bg-[#f2efe8]
      "
    >
      <GlobalHeader
        onAbout={onAbout}
        status="LIVE DISPATCH"
      />

      <GameHUD
        state={state}
        onPause={onPause}
        onSpeed={onSpeed}
      />

      <main className="relative min-h-0 flex-1">
        <CityMap3D
          state={state}
          onSelectDanfo={onSelectDanfo}
          onSelectStop={onDispatch}
        />

        <EventBanner
          state={state}
          onPayPolice={onPolice}
        />

        <ScoreBurst state={state} />

        <FleetPanel
          state={state}
          onDispatch={onDispatch}
          onHorn={onHorn}
          onBuy={onBuy}
        />

        <div
          className="
            absolute left-3 top-3 z-10
            hidden border border-[#171717]
            bg-[#f7f4ef] p-3
            text-[10px]
            shadow-[3px_3px_0_#171717]
            lg:block
          "
        >
          <div className="font-black">
            SECTOR: LAGOS METRO
          </div>

          <div className="mt-2">
            ACTIVE CORRIDORS: 10
          </div>

          <div className="mt-1">
            CITY HEALTH:
            {" "}
            {Array.from(
              { length: 3 },
              (_, index) =>
                index < state.health ? "●" : "○",
            ).join(" ")}
          </div>
        </div>
      </main>

      <footer
        className="
          grid grid-cols-3 items-center
          border-t border-[#918976]
          bg-[#f7f4ef] px-4 py-2
          text-[10px] sm:text-xs
        "
      >
        <div>
          🚌 {state.danfos.length} DANFOS
        </div>

        <div className="text-center">
          💵 ₦{state.cash.toLocaleString()} TREASURY
        </div>

        <div className="flex justify-end">
          <button
            onClick={onEnd}
            className="cursor-pointer hover:underline"
          >
            END RUN
          </button>
        </div>
      </footer>
    </div>
  );
}