import { padDay, TOTAL_DAYS, type DaySlot } from "../lib/challenge";

export function ProgressSection({ completed, percent, slots }: { completed: number; percent: number; slots: DaySlot[] }) {
  return (
    <section className="progress section-shell" aria-labelledby="progress-title">
      <div className="section-label">
        <h2 id="progress-title">Progress Log</h2>
        <span>{padDay(completed)} / {TOTAL_DAYS} SHIPPED</span>
      </div>
      <div className="progress__bar" aria-label={`${completed} of ${TOTAL_DAYS} projects shipped`}>
        <span style={{ width: `${percent}%` }} />
      </div>
      <ol className="progress__pips" aria-label="Thirty day completion map">
        {slots.map((slot) => (
          <li key={slot.day} className={slot.status}>
            <span>{padDay(slot.day)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
