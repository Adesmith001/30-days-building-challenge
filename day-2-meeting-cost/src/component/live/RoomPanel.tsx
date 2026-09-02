import { UserRoundMinus } from "lucide-react";

import { attendeeCost } from "../../lib/calculations";
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
  settings: WorkSettings;
  currency: Currency;
  onLeave: (id: string) => void;
}

export function RoomPanel({
  attendees,
  elapsedMs,
  settings,
  currency,
  onLeave,
}: Props) {
  return (
    <aside className="hidden min-w-0 border-l border-black/20 bg-[#fafafa] xl:block">
      <header className="flex h-20 items-center border-b border-black/20 px-7 font-mono text-xs font-semibold tracking-[0.13em]">
        IN THE ROOM
      </header>

      <div className="p-7">
        {attendees.map((person) => (
          <article
            key={person.id}
            className={`flex items-start justify-between gap-5 border-b border-black/20 py-6 first:pt-0 ${
              person.active ? "" : "opacity-40"
            }`}
          >
            <div className="min-w-0">
              <strong className="block truncate text-base">
                {person.role}
                {person.quantity > 1 &&
                  ` ×${person.quantity}`}
              </strong>

              <span className="mt-1 block font-mono text-[10px] text-neutral-500">
                {person.active
                  ? person.joinedAtMs > 5000
                    ? `JOINED ${formatDuration(
                        person.joinedAtMs,
                      )}`
                    : "ACTIVE"
                  : `LEFT ${formatDuration(
                      person.leftAtMs ?? 0,
                    )}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap font-mono text-xs">
                {formatMoney(
                  attendeeCost(
                    person,
                    elapsedMs,
                    settings,
                  ),
                  currency,
                )}
              </span>

              {person.active && (
                <button
                  type="button"
                  aria-label={`Remove ${person.role}`}
                  onClick={() => onLeave(person.id)}
                  className="text-neutral-500 hover:text-black"
                >
                  <UserRoundMinus size={15} />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}