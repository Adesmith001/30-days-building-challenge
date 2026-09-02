import { Plus } from "lucide-react";
import { useState } from "react";

import {
  burnRatePerHour,
  peopleCount,
} from "../../lib/calculations";
import { formatMoney } from "../../lib/formatting";
import type {
  Attendee,
  Currency,
  WorkSettings as Settings,
} from "../../types/meeting";
import { Button } from "../ui/Button";
import { AttendeeTable } from "./AttendeeTable";
import { BurnRateCard } from "./BurnRateCard";
import { WorkSettings } from "./WorkSettings";

interface Props {
  name: string;
  attendees: Attendee[];
  settings: Settings;
  currency: Currency;
  onNameChange: (name: string) => void;
  onAttendeeChange: (
    id: string,
    patch: Partial<Attendee>,
  ) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onSettingsChange: (patch: Partial<Settings>) => void;
  onCurrencyChange: (currency: Currency) => void;
  onStart: () => void;
}

export function SetupScreen(props: Props) {
  const [advanced, setAdvanced] = useState(false);

  const hourly = burnRatePerHour(
    props.attendees,
    props.settings,
  );

  return (
    <main className="mx-auto w-[calc(100%-32px)] max-w-6xl py-10 md:w-[calc(100%-64px)] md:py-16">
      <section>
        <h1 className="max-w-5xl text-[clamp(2.5rem,5vw,4.3rem)] font-bold leading-[0.95] tracking-[-0.06em]">
          HOW MUCH IS THIS MEETING COSTING?
        </h1>

        <p className="mt-6 text-neutral-600">
          Add the people in the room. We'll do the
          uncomfortable maths.
        </p>

        <input
          value={props.name}
          onChange={(event) =>
            props.onNameChange(event.target.value)
          }
          placeholder="MEETING NAME — OPTIONAL"
          className="mt-8 w-full max-w-lg border-b border-black/30 bg-transparent py-3 font-mono text-xs outline-none placeholder:text-neutral-400"
        />
      </section>

      <div className="my-10 h-px bg-black/20 md:my-12" />

      <BurnRateCard
        attendees={props.attendees}
        settings={props.settings}
        currency={props.currency}
      />

      <div className="mt-10">
        <AttendeeTable
          attendees={props.attendees}
          settings={props.settings}
          currency={props.currency}
          onChange={props.onAttendeeChange}
          onRemove={props.onRemove}
        />
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <Button onClick={props.onAdd}>
          <Plus size={14} />
          ADD ROLE
        </Button>

        <Button
          variant="ghost"
          onClick={() => setAdvanced((value) => !value)}
        >
          {advanced ? "HIDE" : "SHOW"} WORK SETTINGS
        </Button>
      </div>

      {advanced && (
        <div className="mt-6">
          <WorkSettings
            settings={props.settings}
            currency={props.currency}
            onSettingsChange={props.onSettingsChange}
            onCurrencyChange={props.onCurrencyChange}
          />
        </div>
      )}

      <footer className="mt-12 flex flex-col gap-6 border-t border-black/20 pt-9 md:flex-row md:items-center md:justify-end">
        <div className="flex justify-center gap-5 font-mono text-[10px] font-semibold tracking-[0.09em]">
          <span>{peopleCount(props.attendees)} PEOPLE</span>
          <span>|</span>
          <span>
            {formatMoney(hourly, props.currency)} / HOUR
          </span>
        </div>

        <Button
          variant="primary"
          className="min-w-60"
          onClick={props.onStart}
        >
          START MEETING →
        </Button>
      </footer>
    </main>
  );
}