import { forwardRef } from "react";

import {
  attendeeCost,
  peopleCount,
} from "../../lib/calculations";

import {
  formatClock,
  formatDate,
  formatDuration,
  formatMoney,
} from "../../lib/formatting";

import type { MeetingRecord } from "../../types/meeting";

export const MeetingReceipt = forwardRef<
  HTMLDivElement,
  { meeting: MeetingRecord }
>(({ meeting }, ref) => {
  const people = peopleCount(meeting.attendees);

  const costPerMinute =
    meeting.durationMs > 0
      ? meeting.totalCost /
        (meeting.durationMs / 60_000)
      : 0;

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-[430px] bg-white px-7 py-10 font-mono md:px-10 md:py-12"
    >
      <header className="text-center">
        <h1 className="font-sans text-5xl font-bold tracking-[-0.06em]">
          RECEIPT
        </h1>

        <span className="mt-2 block text-[10px] text-neutral-500">
          #TX-{meeting.id.slice(0, 8).toUpperCase()}
        </span>
      </header>

      <Divider />

      <div className="space-y-2 text-xs">
        <Meta
          label="DATE:"
          value={formatDate(meeting.startedAtISO)}
        />

        <Meta
          label="TIME:"
          value={`${formatClock(
            meeting.startedAtISO,
          )} - ${formatClock(meeting.endedAtISO)}`}
        />

        <Meta
          label="DURATION:"
          value={formatDuration(meeting.durationMs)}
        />

        <Meta
          label="ATTENDEES:"
          value={String(people)}
        />
      </div>

      <Divider />

      <div className="space-y-6">
        {meeting.attendees.map((person) => (
          <div
            key={person.id}
            className="flex items-start justify-between gap-5 text-xs"
          >
            <div>
              <strong className="block">
                {person.quantity}x{" "}
                {person.role.toUpperCase()}
              </strong>

              {!person.active && (
                <small className="mt-1 block text-[9px] text-neutral-500">
                  LEFT AT{" "}
                  {formatDuration(person.leftAtMs ?? 0)}
                </small>
              )}
            </div>

            <span>
              {formatMoney(
                attendeeCost(
                  person,
                  meeting.durationMs,
                  meeting.workSettings,
                ),
                meeting.currency,
              )}
            </span>
          </div>
        ))}
      </div>

      <Divider />

      <div className="flex items-center justify-between gap-5">
        <strong className="text-lg">TOTAL</strong>

        <strong className="text-3xl font-medium tracking-[-0.05em]">
          {formatMoney(
            meeting.totalCost,
            meeting.currency,
          )}
        </strong>
      </div>

      <div className="mt-5 space-y-1 text-[9px] text-neutral-500">
        <div>
          COST / MIN{" "}
          {formatMoney(
            costPerMinute,
            meeting.currency,
          )}
        </div>

        <div>
          COST / PERSON{" "}
          {formatMoney(
            meeting.totalCost / Math.max(people, 1),
            meeting.currency,
          )}
        </div>
      </div>

      <div className="mt-12 text-center text-[10px] leading-5 text-neutral-500">
        THANK YOU FOR YOUR TIME.
        <br />
        IT IS GONE FOREVER.
      </div>
    </div>
  );
});

function Divider() {
  return (
    <div className="my-9 border-t-2 border-dashed border-neutral-200" />
  );
}

function Meta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-5">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}