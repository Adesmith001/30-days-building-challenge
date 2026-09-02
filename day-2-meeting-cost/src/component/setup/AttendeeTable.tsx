import type {
  Attendee,
  Currency,
  WorkSettings,
} from "../../types/meeting";

import { AttendeeRow } from "./AttendeeRow";

interface Props {
  attendees: Attendee[];
  settings: WorkSettings;
  currency: Currency;
  onChange: (
    id: string,
    patch: Partial<Attendee>,
  ) => void;
  onRemove: (id: string) => void;
}

export function AttendeeTable({
  attendees,
  settings,
  currency,
  onChange,
  onRemove,
}: Props) {
  return (
    <section className="space-y-3 md:space-y-0 md:border md:border-black/20">
      <div className="hidden min-h-12 grid-cols-[minmax(220px,1.5fr)_minmax(170px,1fr)_110px_80px_140px_44px] bg-black/[0.035] font-mono text-[9px] font-semibold tracking-[0.12em] text-neutral-500 md:grid">
        {[
          "ROLE",
          "SALARY",
          "PERIOD",
          "COUNT",
          "HOURLY COST",
          "",
        ].map((label) => (
          <div
            key={label}
            className="flex items-center border-r border-black/20 px-4 last:border-r-0"
          >
            {label}
          </div>
        ))}
      </div>

      {attendees.map((attendee) => (
        <div
          key={attendee.id}
          className="border border-black/20 md:border-0"
        >
          <AttendeeRow
            attendee={attendee}
            settings={settings}
            currency={currency}
            onChange={(patch) =>
              onChange(attendee.id, patch)
            }
            onRemove={() => onRemove(attendee.id)}
          />
        </div>
      ))}
    </section>
  );
}