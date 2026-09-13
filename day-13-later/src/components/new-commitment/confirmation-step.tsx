import { Countdown } from "../countdown";
import { Button } from "../ui/button";

type Props = {
  task: string;
  date: Date;
  onCommit: () => void;
  onChange: () => void;
};

export function ConfirmationStep({ task, date, onCommit, onChange }: Props) {
  const day = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" }).format(date);
  const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(date);

  return (
    <div className={["mx-auto flex", "max-w-[500px]", "flex-col items-center", "py-8 text-center"].join(" ")}>
      <p className="text-[12px] text-[#71717a]">You said you'd do it.</p>
      <h1 className={["mt-4 text-[25px]", "font-medium", "tracking-[-0.03em]"].join(" ")}>{task}</h1>
      <p className="mt-5 text-[13px] text-[#71717a]">{day}</p>
      <p className={["mt-1 text-[48px]", "font-semibold", "tracking-[-0.06em]"].join(" ")}>{time}</p>
      <p className="mt-3 text-[13px] text-[#71717a]">
        <Countdown timestamp={date.getTime()} suffix=" until it's no longer â€œlaterâ€." />
      </p>

      <div className={["mt-9 flex w-full", "max-w-[340px]", "flex-col gap-2"].join(" ")}>
        <Button onClick={onCommit}>I'm committed</Button>
        <Button variant="text" onClick={onChange}>Actually, change it</Button>
      </div>
    </div>
  );
}
