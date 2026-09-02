import { useState } from "react";

import type {
  Attendee,
  AttendeeDraft,
  Currency,
  WorkSettings,
} from "../../types/meeting";

import { AddAttendeeModal } from "./AddAttendeeModal";
import { CostGraph } from "./CostGraph";
import { LiveControls } from "./LiveControls";
import { LiveCostDisplay } from "./LiveCostDisplay";
import { RoomPanel } from "./RoomPanel";

interface Props {
  attendees: Attendee[];
  elapsedMs: number;
  totalCost: number;
  settings: WorkSettings;
  currency: Currency;
  paused: boolean;
  fullscreen: boolean;
  milestone: string | null;
  onPause: () => void;
  onResume: () => void;
  onAdd: (draft: AttendeeDraft) => void;
  onLeave: (id: string) => void;
  onFocus: () => void;
  onEnd: () => void;
}

export function LiveScreen(props: Props) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <main
      className={`min-h-screen ${
        props.fullscreen
          ? "bg-black text-white"
          : "grid bg-[#f7f7f7] xl:grid-cols-[minmax(0,1fr)_330px]"
      }`}
    >
      <section
        className={`flex min-h-screen min-w-0 flex-col items-center overflow-hidden ${
          props.fullscreen
            ? "px-[6vw] py-[8vh]"
            : "bg-[#f8f8f8] px-5 py-12 md:px-12 [background-image:linear-gradient(rgba(0,0,0,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.045)_1px,transparent_1px)] [background-size:46px_46px]"
        }`}
      >
        {props.paused && (
          <div className="absolute left-5 top-5 border border-current px-3 py-1.5 font-mono text-[9px] font-semibold tracking-[0.12em]">
            PAUSED
          </div>
        )}

        <LiveCostDisplay
          attendees={props.attendees}
          elapsedMs={props.elapsedMs}
          totalCost={props.totalCost}
          settings={props.settings}
          currency={props.currency}
          fullscreen={props.fullscreen}
        />

        {!props.fullscreen && (
          <CostGraph
            attendees={props.attendees}
            elapsedMs={props.elapsedMs}
            totalCost={props.totalCost}
            settings={props.settings}
          />
        )}

        <LiveControls
          paused={props.paused}
          onPause={props.onPause}
          onResume={props.onResume}
          onAdd={() => setAddOpen(true)}
          onFocus={props.onFocus}
          onEnd={props.onEnd}
        />

        {props.milestone && (
          <div className="mt-6 text-center font-mono text-[11px] text-neutral-500 underline underline-offset-4">
            {props.milestone}
          </div>
        )}
      </section>

      {!props.fullscreen && (
        <RoomPanel
          attendees={props.attendees}
          elapsedMs={props.elapsedMs}
          settings={props.settings}
          currency={props.currency}
          onLeave={props.onLeave}
        />
      )}

      {addOpen && (
        <AddAttendeeModal
          onClose={() => setAddOpen(false)}
          onAdd={props.onAdd}
        />
      )}
    </main>
  );
}