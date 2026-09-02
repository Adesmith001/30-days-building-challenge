import {
  formatMoney,
  formatShortDuration,
} from "../../lib/formatting";

import type {
  Currency,
  MeetingRecord,
} from "../../types/meeting";

import { Button } from "../ui/Button";
import { SectionLabel } from "../ui/SectionLabel";

interface Props {
  history: MeetingRecord[];
  currency: Currency;
  onBack: () => void;
  onClear: () => void;
}

export function HistoryScreen({
  history,
  currency,
  onBack,
  onClear,
}: Props) {
  const totalSpend = history.reduce(
    (sum, meeting) => sum + meeting.totalCost,
    0,
  );

  const totalTime = history.reduce(
    (sum, meeting) => sum + meeting.durationMs,
    0,
  );

  const average = history.length
    ? totalSpend / history.length
    : 0;

  const expensive = [...history].sort(
    (a, b) => b.totalCost - a.totalCost,
  )[0];

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f7f7f7] px-4 py-12 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>LOCAL MEETING DATA</SectionLabel>

            <h1 className="mt-2 text-6xl font-bold tracking-[-0.07em] md:text-8xl">
              HISTORY
            </h1>

            <p className="mt-4 max-w-xl text-neutral-600">
              Meeting data is stored locally in your
              browser.
            </p>
          </div>

          <Button onClick={onBack}>
            ← BACK TO SETUP
          </Button>
        </header>

        <section className="mt-12 grid border border-black/20 md:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="TOTAL MEETING SPEND"
            value={formatMoney(totalSpend, currency)}
          />

          <Stat
            label="TIME IN MEETINGS"
            value={formatShortDuration(totalTime)}
          />

          <Stat
            label="AVERAGE COST"
            value={formatMoney(average, currency)}
          />

          <Stat
            label="MOST EXPENSIVE"
            value={
              expensive
                ? formatMoney(
                    expensive.totalCost,
                    expensive.currency,
                  )
                : "—"
            }
            secondary={expensive?.name}
          />
        </section>

        <section className="mt-10 overflow-x-auto border border-black/20">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[140px_1fr_90px_120px_150px] bg-black/[0.045] px-5 py-3 font-mono text-[9px] font-semibold tracking-[0.1em]">
              <span>DATE</span>
              <span>MEETING</span>
              <span>PEOPLE</span>
              <span>DURATION</span>
              <span className="text-right">COST</span>
            </div>

            {history.map((meeting) => (
              <div
                key={meeting.id}
                className="grid min-h-16 grid-cols-[140px_1fr_90px_120px_150px] items-center border-t border-black/20 px-5 font-mono text-xs"
              >
                <span>
                  {new Date(
                    meeting.startedAtISO,
                  ).toLocaleDateString()}
                </span>

                <strong>{meeting.name}</strong>

                <span>
                  {meeting.attendees.reduce(
                    (sum, person) =>
                      sum + person.quantity,
                    0,
                  )}
                </span>

                <span>
                  {formatShortDuration(
                    meeting.durationMs,
                  )}
                </span>

                <strong className="text-right">
                  {formatMoney(
                    meeting.totalCost,
                    meeting.currency,
                  )}
                </strong>
              </div>
            ))}

            {!history.length && (
              <div className="p-16 text-center font-mono text-xs text-neutral-500">
                NO MEETINGS YET.
              </div>
            )}
          </div>
        </section>

        {history.length > 0 && (
          <Button
            variant="ghost"
            className="mt-6"
            onClick={onClear}
          >
            CLEAR LOCAL HISTORY
          </Button>
        )}
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  secondary,
}: {
  label: string;
  value: string;
  secondary?: string;
}) {
  return (
    <article className="flex min-h-36 flex-col justify-between border-b border-r border-black/20 p-6">
      <SectionLabel>{label}</SectionLabel>

      <div>
        <strong className="font-mono text-2xl">
          {value}
        </strong>

        {secondary && (
          <small className="mt-2 block font-mono text-[9px] text-neutral-500">
            {secondary}
          </small>
        )}
      </div>
    </article>
  );
}