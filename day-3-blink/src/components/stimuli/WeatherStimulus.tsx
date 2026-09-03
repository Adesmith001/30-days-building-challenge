import {
  CloudSun,
  Droplets,
  Wind,
} from "lucide-react";
import type { Stimulus } from "../../types/game";
import { cn } from "../../lib/utils";

type Props = {
  stimulus: Stimulus;
  reveal?: boolean;
};

export function WeatherStimulus({
  stimulus,
  reveal = false,
}: Props) {
  const { data, question } = stimulus;
  const highlight = reveal && question.focusKey === "city";

  return (
    <div className="w-full max-w-3xl border border-slate-300 bg-white p-7 md:p-10">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-slate-500">
            WEATHER
          </p>

          <h2
            className={cn(
              "mt-3 text-4xl font-semibold",
              highlight && "ring-4 ring-blue-500",
            )}
          >
            {data.city}
          </h2>
        </div>

        <CloudSun className="size-14 text-blue-700" />
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <div className="border border-slate-300 p-7">
          <p className="text-7xl font-semibold tracking-tight">
            {data.temperature}
          </p>

          <p className="mt-4 text-lg text-slate-500">
            {data.condition}
          </p>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-4 border border-slate-300 p-5">
            <Droplets className="size-5" />

            <div>
              <p className="font-mono text-xs text-slate-500">
                HUMIDITY
              </p>

              <p className="mt-1 text-xl">
                {data.humidity}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border border-slate-300 p-5">
            <Wind className="size-5" />

            <div>
              <p className="font-mono text-xs text-slate-500">
                WIND
              </p>

              <p className="mt-1 text-xl">
                14 KM/H
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}