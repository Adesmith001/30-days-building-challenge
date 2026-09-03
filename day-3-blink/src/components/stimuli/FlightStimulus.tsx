import {
  Plane,
  QrCode,
} from "lucide-react";
import type { Stimulus } from "../../types/game";
import { cn } from "../../lib/utils";

type Props = {
  stimulus: Stimulus;
  reveal?: boolean;
};

export function FlightStimulus({
  stimulus,
  reveal = false,
}: Props) {
  const { data, question } = stimulus;
  const highlight = reveal && question.focusKey === "seat";

  return (
    <div className="w-full max-w-4xl overflow-hidden border border-slate-300 bg-white">
      <div className="grid md:grid-cols-[1fr_220px]">
        <div className="p-7 md:p-10">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs tracking-[0.2em] text-slate-500">
              BOARDING PASS
            </p>

            <Plane className="size-6 text-blue-700" />
          </div>

          <div className="mt-12 flex items-center justify-between">
            <div>
              <p className="text-5xl font-semibold">
                {data.from}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Departure
              </p>
            </div>

            <div className="mx-5 h-px flex-1 bg-slate-300" />

            <Plane className="size-6" />

            <div className="mx-5 h-px flex-1 bg-slate-300" />

            <div className="text-right">
              <p className="text-5xl font-semibold">
                {data.to}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Arrival
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-5 border-t border-slate-200 pt-7">
            <div>
              <p className="font-mono text-xs text-slate-500">
                TIME
              </p>

              <p className="mt-2 font-mono text-xl">
                {data.time}
              </p>
            </div>

            <div>
              <p className="font-mono text-xs text-slate-500">
                GATE
              </p>

              <p className="mt-2 font-mono text-xl">
                {data.gate}
              </p>
            </div>

            <div
              className={cn(
                highlight && "ring-4 ring-blue-500",
              )}
            >
              <p className="font-mono text-xs text-slate-500">
                SEAT
              </p>

              <p className="mt-2 font-mono text-xl">
                {data.seat}
              </p>
            </div>
          </div>
        </div>

        <div className="grid place-items-center border-t border-dashed border-slate-300 bg-slate-50 p-10 md:border-l md:border-t-0">
          <div className="text-center">
            <QrCode className="mx-auto size-24" />

            <p className="mt-5 font-mono text-xs tracking-[0.15em]">
              SCAN AT GATE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}