import { burnRatePerHour } from "../../lib/calculations";
import { formatMoney } from "../../lib/formatting";
import type {
  Attendee,
  Currency,
  WorkSettings,
} from "../../types/meeting";
import { SectionLabel } from "../ui/SectionLabel";

interface Props {
  attendees: Attendee[];
  settings: WorkSettings;
  currency: Currency;
}

export function BurnRateCard({
  attendees,
  settings,
  currency,
}: Props) {
  const hourly = burnRatePerHour(attendees, settings);

  return (
    <section className="border border-black/20 px-6 py-7 md:px-8">
      <SectionLabel>CURRENT BURN RATE</SectionLabel>

      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-baseline md:gap-8">
        <strong className="font-mono text-2xl font-medium tracking-[-0.05em] md:text-4xl">
          {formatMoney(hourly, currency)} / HOUR
        </strong>

        <span className="font-mono text-xs text-neutral-500">
          {formatMoney(hourly / 60, currency)} / MIN
        </span>
      </div>
    </section>
  );
}