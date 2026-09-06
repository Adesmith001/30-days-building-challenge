import {
  BusFront,
  Fuel,
  Volume2,
} from "lucide-react";
import { STOP_IDS, STOP_BY_ID } from "../data/stops";
import type {
  GameState,
  StopId,
} from "../types/game";

interface Props {
  state: GameState;
  onDispatch(id: StopId): void;
  onHorn(): void;
  onBuy(): void;
}

export function FleetPanel({
  state,
  onDispatch,
  onHorn,
  onBuy,
}: Props) {
  const selected = state.danfos.find(
    (danfo) =>
      danfo.id === state.selectedDanfoId,
  );

  if (!selected) {
    return (
      <aside
        className="
          absolute bottom-16 right-3 z-20
          w-[calc(100%-1.5rem)]
          border border-[#171717]
          bg-[#f7f4ef] p-4
          shadow-[4px_4px_0_#171717]
          sm:bottom-auto sm:right-4 sm:top-4
          sm:w-80
        "
      >
        <div className="text-xs font-black tracking-[0.15em]">
          DISPATCH CONTROL
        </div>

        <p className="mt-3 text-xs leading-5 text-[#676052]">
          Click a yellow danfo on the city grid,
          then choose its destination.
        </p>

        <button
          onClick={onBuy}
          disabled={state.cash < 4_000}
          className="
            mt-4 w-full cursor-pointer
            border border-black bg-[#ffd000]
            px-3 py-3 text-xs font-black
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          + DEPLOY DANFO · ₦4,000
        </button>
      </aside>
    );
  }

  return (
    <aside
      className="
        absolute bottom-14 right-3 z-20
        max-h-[45vh]
        w-[calc(100%-1.5rem)]
        overflow-auto border
        border-[#171717]
        bg-[#f7f4ef] p-4
        shadow-[4px_4px_0_#171717]
        sm:bottom-auto sm:right-4 sm:top-4
        sm:max-h-[80vh] sm:w-80
      "
    >
      <div className="flex items-center justify-between border-b border-[#9f9683] pb-3">
        <div className="flex items-center gap-2">
          <BusFront size={17} />
          <strong>{selected.name}</strong>
        </div>

        <span className="text-[9px] uppercase">
          {selected.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="border border-[#aaa18d] p-3">
          <div>ONBOARD</div>
          <strong className="text-lg">
            {selected.passengers.length}/
            {selected.capacity}
          </strong>
        </div>

        <div className="border border-[#aaa18d] p-3">
          <div className="flex items-center gap-1">
            <Fuel size={12} />
            FUEL
          </div>
          <strong className="text-lg">
            {Math.round(selected.fuel)}%
          </strong>
        </div>
      </div>

      <div className="mt-4 border-t border-[#aaa18d] pt-4">
        <div className="mb-3 text-xs font-black">
          WHERE TO?
        </div>

        <div className="grid grid-cols-2 gap-2">
          {STOP_IDS.filter(
            (id) => id !== selected.node,
          ).map((id) => (
            <button
              key={id}
              disabled={selected.status !== "idle"}
              onClick={() => onDispatch(id)}
              className="
                cursor-pointer border
                border-[#8e8572] px-2 py-2
                text-left text-[10px]
                hover:bg-[#ffd000]
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <strong>
                {STOP_BY_ID[id].code}
              </strong>

              <div className="mt-1">
                Q:
                {state.stops[id].waiting.length}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onHorn}
        disabled={
          selected.status !== "moving" ||
          selected.hornUses <= 0
        }
        className="
          mt-4 flex w-full cursor-pointer
          items-center justify-center gap-2
          border border-black bg-[#ffd000]
          px-3 py-3 text-sm font-black
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        <Volume2 size={17} />
        USE HORN
        <span>
          [{selected.hornUses}]
        </span>
      </button>
    </aside>
  );
}