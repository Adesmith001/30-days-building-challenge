import {
  burnRatePerHour,
  peopleCount,
} from "../../lib/calculations";
import {
  formatDuration,
  formatMoney,
} from "../../lib/formatting";

import type {
  Attendee,
  Currency,
  WorkSettings,
} from "../../types/meeting";

interface Props {
  attendees: Attendee[];
  elapsedMs: number;
  totalCost: number;
  settings: WorkSettings;
  currency: Currency;
  fullscreen: boolean;
}

export function LiveCostDisplay({
  attendees,
  elapsedMs,
  totalCost,
  settings,
  currency,
  fullscreen,
}: Props) {
  const hourly = burnRatePerHour(
    attendees,
    settings,
    true,
  );

  const people = peopleCount(attendees, true);

  return (
    <div className="flex w-full flex-col items-center">
      {!fullscreen && (
        <div className="bg-black px-10 py-3 font-mono text-xs font-semibold tracking-[0.08em] text-white">
          THIS MEETING HAS
        </div>
      )}

      <div
        aria-live="polite"
        className={`mt-8 max-w-full text-center font-mono font-medium tabular-nums tracking-[-0.08em] ${
          fullscreen
            ? "text-[clamp(5rem,15vw,16rem)] text-white"
            : "text-[clamp(4rem,10vw,9rem)]"
        }`}
      >
        {formatMoney(totalCost, currency)}
      </div>

      <div
        className={`mt-4 font-mono tabular-nums ${
          fullscreen
            ? "text-[clamp(2rem,5vw,4.5rem)] text-neutral-600"
            : "text-[clamp(1.8rem,4vw,3rem)] text-neutral-500"
        }`}
      >
        {formatDuration(elapsedMs)}
      </div>

      <div
        className={`mt-12 h-px w-full ${
          fullscreen ? "bg-white/10" : "bg-black/20"
        }`}
      />

      <div
        className={`flex w-full justify-center gap-5 border-b py-5 font-mono text-xs ${
          fullscreen
            ? "border-white/10 text-neutral-600"
            : "border-black/20"
        }`}
      >
        <span>{people} PEOPLE</span>
        <span>•</span>
        <span>
          {formatMoney(hourly / 60, currency)} / MIN
        </span>
      </div>
    </div>
  );
}