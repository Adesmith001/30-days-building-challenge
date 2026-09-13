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
  const minimumDate = new Date();
  minimumDate.setSeconds(0, 0);

  const minimum = toDateTimeLocalValue(minimumDate);
  const [date] = minimum.split("T");
  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedHour, setSelectedHour] = useState(String((minimumDate.getHours() % 12) || 12));
  const [selectedMinute, setSelectedMinute] = useState(String(minimumDate.getMinutes()));
  const [selectedMeridiem, setSelectedMeridiem] = useState(minimumDate.getHours() >= 12 ? "PM" : "AM");

  const selectedValue = `${selectedDate}T${to24Hour(selectedHour, selectedMeridiem)}:${selectedMinute}`;
  const isBeforeMinimum = selectedValue < minimum;

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

        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="text-[12px] text-[#71717a]">
            Date
            <input
              type="date"
              min={minimum.split("T")[0]}
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className={["mt-2 w-full", "rounded-lg border", "border-[#e4e4e7]", "px-3 py-3", "text-[14px]", "outline-none", "focus:border-black"].join(" ")}
            />
          </label>

          <fieldset className="min-w-0">
            <legend className="text-[12px] text-[#71717a]">Time</legend>
            <div className="mt-2 flex h-[116px] overflow-hidden rounded-lg border border-[#e4e4e7] bg-[#fafafa]">
              <WheelSelect ariaLabel="Hour" value={selectedHour} onChange={setSelectedHour} options={hours} />
              <WheelSelect ariaLabel="Minute" value={selectedMinute} onChange={setSelectedMinute} options={minutes} />
              <WheelSelect ariaLabel="AM or PM" value={selectedMeridiem} onChange={setSelectedMeridiem} options={["AM", "PM"]} />
            </div>
          </fieldset>
        </div>

        {isBeforeMinimum && <p className="mt-3 text-[12px] text-[#a1a1aa]">Choose a time in the future.</p>}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button disabled={isBeforeMinimum} onClick={() => onSelect(selectedValue)}>Use this time</Button>
        </div>
      </motion.div>
    </div>
  );
}

const hours = Array.from({ length: 12 }, (_, index) => String(index + 1));
const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));

function to24Hour(hour: string, meridiem: string) {
  const numericHour = Number(hour) % 12;
  return String(numericHour + (meridiem === "PM" ? 12 : 0)).padStart(2, "0");
}

type WheelSelectProps = {
  ariaLabel: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function WheelSelect({ ariaLabel, value, options, onChange }: WheelSelectProps) {
  return (
    <select
      aria-label={ariaLabel}
      size={3}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-w-0 flex-1 cursor-pointer snap-y snap-mandatory appearance-none overflow-y-auto bg-transparent text-center text-[15px] outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}
