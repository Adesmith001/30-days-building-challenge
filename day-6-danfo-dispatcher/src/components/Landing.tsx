import {
  ArrowRight,
  Route,
} from "lucide-react";
import type { RunRecord } from "../types/game";
import { GlobalHeader } from "./GlobalHeader";
import { MiniNetwork } from "./MiniNetwork";

interface Props {
  best: RunRecord | null;
  onStart(): void;
  onRecords(): void;
  onAbout(): void;
}

export function Landing({
  best,
  onStart,
  onRecords,
  onAbout,
}: Props) {
  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <GlobalHeader
        onAbout={onAbout}
        status="LAGOS METRO"
      />

      <main
        className="
          mx-auto grid min-h-[calc(100vh-56px)]
          max-w-[1500px] gap-12 px-6 py-14
          lg:grid-cols-[1.3fr_0.9fr]
          lg:items-center lg:px-10
        "
      >
        <section>
          <div
            className="
              mb-8 inline-flex items-center
              gap-3 border border-[#918976]
              px-3 py-1 text-xs font-bold
            "
          >
            <span className="size-3 rounded-full border border-black bg-[#ffd000]" />
            LAGOS TRANSPORT SIMULATOR
          </div>

          <h1
            className="
              max-w-3xl font-serif text-6xl
              font-black leading-[0.89]
              tracking-[-0.06em]
              sm:text-8xl
            "
          >
            KEEP
            <br />
            LAGOS
            <br />
            MOVING.
          </h1>

          <p
            className="
              mt-7 max-w-2xl text-sm
              leading-7 text-[#5f584b]
              sm:text-base
            "
          >
            Passengers are waiting. Traffic is building.
            Deploy your danfos, protect the network and
            try not to collapse the entire city.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={onStart}
              className="
                flex min-w-64 cursor-pointer
                items-center justify-between
                border border-black bg-[#ffd000]
                px-8 py-5 text-xl font-black
                shadow-[4px_4px_0_#171717]
                transition
                hover:-translate-y-1
              "
            >
              START SHIFT
              <ArrowRight />
            </button>

            <button
              onClick={onRecords}
              className="
                cursor-pointer border
                border-[#918976] px-6 py-5
                text-sm font-bold
                hover:bg-[#ece8e1]
              "
            >
              VIEW RECORDS
            </button>
          </div>

          <div
            className="
              mt-12 flex max-w-3xl
              items-center justify-between
              border-t border-[#cfc7b6]
              pt-5 text-xs
            "
          >
            <span>
              LIVE SIMULATION · SCORE ATTACK
            </span>

            <span className="flex items-center gap-2 text-[#386b54]">
              <Route size={15} />
              ROUTE GRID ACTIVE
            </span>
          </div>
        </section>

        <section
          className="
            border border-[#171717]
            bg-[#efedeb] p-6
            shadow-[6px_6px_0_#171717]
          "
        >
          <div
            className="
              flex items-center justify-between
              border-b border-[#9e9581]
              pb-5 text-xs font-bold
            "
          >
            <span>
              DISPATCH_TELEMETRY // LOG.01
            </span>

            <span className="bg-[#ffd000] px-2 py-1">
              RECORD
            </span>
          </div>

          <div
            className="
              flex items-end justify-between
              gap-4 py-7
            "
          >
            <div>
              <div className="text-xs text-[#716959]">
                PERSONAL BEST
              </div>

              <div
                className="
                  font-serif text-5xl font-black
                  tracking-[-0.06em]
                "
              >
                {(best?.score ?? 0).toLocaleString()}
              </div>
              {best && <div className="mt-1 text-xs uppercase">{best.difficulty ?? "standard"} mode</div>}
            </div>

            <div className="text-right text-xs">
              <div>COMMISSION</div>
              <div className="mt-2 border border-[#918976] px-4 py-2 text-lg font-black">
                {best?.rank ?? "ROOKIE CONDUCTOR"}
              </div>
            </div>
          </div>

          <MiniNetwork />

          <div
            className="
              mt-4 grid grid-cols-3 gap-4
              border-t border-[#c3bba8]
              pt-4 text-[10px]
            "
          >
            <span>
              THROUGHPUT:
              <strong className="ml-1">
                {best?.efficiency ?? 100}%
              </strong>
            </span>

            <span>
              FLOW:
              <strong className="ml-1">
                ×{best?.bestFlow ?? 0}
              </strong>
            </span>

            <span className="text-right text-[#386b54]">
              SYS: NOMINAL
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
