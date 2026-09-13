import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { toDateTimeLocalValue } from "../../lib/time";

type Props = {
  onClose: () => void;
  onSelect: (value: string) => void;
};

export function CustomTimePicker({ onClose, onSelect }: Props) {
  const minimum = toDateTimeLocalValue(new Date());
  const [value, setValue] = useState(minimum);

  return (
    <div className={["fixed inset-0 z-50", "flex items-center", "justify-center", "bg-black/15 px-5"].join(" ")}>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={["w-full max-w-[420px]", "rounded-2xl border", "border-[#e4e4e7]", "bg-white p-6"].join(" ")}
      >
        <div className={["flex items-center", "gap-2"].join(" ")}>
          <CalendarDays className="h-4 w-4" />
          <h2 className="text-[16px] font-medium">Pick a real time</h2>
        </div>

        <input
          type="datetime-local"
          min={minimum}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className={["mt-5 w-full", "rounded-lg border", "border-[#e4e4e7]", "px-4 py-3", "outline-none", "focus:border-black"].join(" ")}
        />

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSelect(value)}>Use this time</Button>
        </div>
      </motion.div>
    </div>
  );
}
