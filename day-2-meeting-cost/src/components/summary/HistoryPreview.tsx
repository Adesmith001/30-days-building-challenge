import { formatMoney } from "../../lib/formatting";
import type { MeetingRecord } from "../../types/meeting";
import { SectionLabel } from "../ui/SectionLabel";

interface Props {
  history: MeetingRecord[];
  current: MeetingRecord;
}

export function HistoryPreview({
  history,
  current,
}: Props) {
  const total = history.reduce(
    (sum, meeting) => sum + meeting.totalCost,
    0,
  );

  return (
    <section className="border border-black/20 bg-[#f8f8f8]/95 p-6 md:p-9">
      <div className="flex items-end justify-between gap-5 border-b border-black/20 pb-6">
        <SectionLabel>MEETING HISTORY</SectionLabel>

        <div className="text-right">
          <SectionLabel>TOTAL SPENT</SectionLabel>

          <strong className="mt-1 block font-mono text-2xl">
            {formatMoney(total, current.currency)}
          </strong>
        </div>
      </div>

      <div className="mt-7">
        <div className="grid grid-cols-[65px_1fr_90px] bg-black/[0.045] px-3 py-2 font-mono text-[8px] font-semibold tracking-[0.1em]">
          <span>DATE</span>
          <span>TOPIC</span>
          <span className="text-right">COST</span>
        </div>

        {history.slice(0, 5).map((meeting) => (
          <div
            key={meeting.id}
            className="grid min-h-12 grid-cols-[65px_1fr_90px] items-center border-b border-black/20 px-3 font-mono text-[10px]"
          >
            <span>
              {new Date(
                meeting.startedAtISO,
              ).toLocaleDateString("en-NG", {
                day: "2-digit",
                month: "2-digit",
              })}
            </span>

            <span className="truncate">
              {meeting.name}
            </span>

            <span className="text-right">
              {formatMoney(
                meeting.totalCost,
                meeting.currency,
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}