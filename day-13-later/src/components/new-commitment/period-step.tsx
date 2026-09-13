import { OptionRow } from "../option-row";
import type { DayPeriod } from "../../lib/time";

type Props = {
  task: string;
  onSelect: (value: DayPeriod) => void;
  onCustom: () => void;
};

export function PeriodStep({ task, onSelect, onCustom }: Props) {
  return (
    <div className="mx-auto max-w-[520px]">
      <p className="text-[12px] text-[#a1a1aa]">{task} â†’ Tomorrow</p>

      <h1 className={["mt-3 text-[32px]", "font-semibold", "tracking-[-0.04em]"].join(" ")}>
        Tomorrow is a whole day.
      </h1>

      <p className="mt-1 text-[16px] text-[#71717a]">When tomorrow?</p>

      <div className="mt-8 space-y-2">
        <OptionRow title="Morning" description="Around 9:00 AM" onClick={() => onSelect("morning")} />
        <OptionRow title="Afternoon" description="Around 2:00 PM" onClick={() => onSelect("afternoon")} />
        <OptionRow title="Evening" description="Around 7:00 PM" onClick={() => onSelect("evening")} />
        <OptionRow title="Pick a time" onClick={onCustom} />
      </div>
    </div>
  );
}
