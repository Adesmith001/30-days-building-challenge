import { OptionRow } from "../option-row";
import type { DayPeriod } from "../../lib/time";

type Props = {
  task: string;
  period: DayPeriod | null;
  hours: number[];
  onSelect: (hour: number) => void;
  onCustom: () => void;
};

export function ExactStep({ task, period, hours, onSelect, onCustom }: Props) {
  const label = period === "morning" ? "Morning" : period === "afternoon" ? "Afternoon" : "Evening";

  return (
    <div className="mx-auto max-w-[520px]">
      <p className="text-[12px] text-[#a1a1aa]">{task} â†’ Tomorrow â†’ {label}</p>

      <h1 className={["mt-3 text-[30px]", "font-semibold", "tracking-[-0.04em]"].join(" ")}>
        {label} is still pretty vague.
      </h1>

      <p className="mt-1 text-[15px] text-[#71717a]">How about...</p>

      <div className="mt-8 space-y-2">
        {hours.map((hour) => {
          const display = new Intl.DateTimeFormat("en-US", { hour: "numeric" }).format(new Date(2026, 1, 1, hour));

          return <OptionRow key={hour} title={display} onClick={() => onSelect(hour)} />;
        })}

        <OptionRow title="Pick another time" onClick={onCustom} />
      </div>
    </div>
  );
}
