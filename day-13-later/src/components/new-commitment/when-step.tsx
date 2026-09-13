import { OptionRow } from "../option-row";
import type { QuickTimeOption } from "../../lib/time";

type Props = {
  task: string;
  onSelect: (value: QuickTimeOption) => void;
  onCustom: () => void;
};

export function WhenStep({ task, onSelect, onCustom }: Props) {
  return (
    <div className="mx-auto max-w-[520px]">
      <p className="text-[12px] text-[#a1a1aa]">{task}</p>

      <h1 className={["mt-3 text-[32px]", "font-semibold", "tracking-[-0.04em]"].join(" ")}>
        Okay. When is later?
      </h1>

      <div className="mt-8 space-y-2">
        <OptionRow title="In 10 minutes" description="Soon enough to count." onClick={() => onSelect("10-minutes")} />
        <OptionRow title="In an hour" description="Give yourself a little room." onClick={() => onSelect("1-hour")} />
        <OptionRow title="Tonight" description="Before today ends." onClick={() => onSelect("tonight")} />
        <OptionRow title="Tomorrow" description="We'll need to narrow that down." onClick={() => onSelect("tomorrow")} />
        <OptionRow title="This weekend" description="Saturday." onClick={() => onSelect("weekend")} />
        <OptionRow title="Pick a time" onClick={onCustom} />
      </div>
    </div>
  );
}
