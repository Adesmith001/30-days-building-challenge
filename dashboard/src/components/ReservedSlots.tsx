import { padDay, TOTAL_DAYS } from "../lib/challenge";

export function ReservedSlots({ completed }: { completed: number }) {
  return (
    <section className="reserved section-shell" aria-label="Reserved challenge slots">
      <p>[ DAYS {padDay(completed + 1)} - {TOTAL_DAYS} ]</p>
      <strong>EXHIBITION SLOTS RESERVED.</strong>
      <span>NOT SHIPPED YET.</span>
    </section>
  );
}
