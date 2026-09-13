import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { AppShell } from "../components/app-shell";
import { ConfirmationStep } from "../components/new-commitment/confirmation-step";
import { CustomTimePicker } from "../components/new-commitment/custom-time-picker";
import { ExactStep } from "../components/new-commitment/exact-step";
import { PeriodStep } from "../components/new-commitment/period-step";
import { WhenStep } from "../components/new-commitment/when-step";
import { applyDayPeriod, applyExactHour, getQuickDate, type DayPeriod, type QuickTimeOption } from "../lib/time";

type Step = "when" | "period" | "exact" | "confirm";

type Props = {
  task: string;
  onBack: () => void;
  onCreate: (title: string, scheduledFor: number) => void;
};

export function NewCommitmentScreen({ task, onBack, onCreate }: Props) {
  const [step, setStep] = useState<Step>("when");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<DayPeriod | null>(null);
  const [customPickerOpen, setCustomPickerOpen] = useState(false);

  const suggestedHours = useMemo(() => {
    if (selectedPeriod === "morning") return [8, 9, 10];
    if (selectedPeriod === "afternoon") return [13, 14, 15];
    return [18, 19, 20];
  }, [selectedPeriod]);

  function handleQuickOption(option: QuickTimeOption) {
    const date = getQuickDate(option);
    setSelectedDate(date);
    setStep(option === "tomorrow" || option === "weekend" ? "period" : "confirm");
  }

  function handlePeriod(period: DayPeriod) {
    if (!selectedDate) return;
    setSelectedPeriod(period);
    setSelectedDate(applyDayPeriod(selectedDate, period));
    setStep("exact");
  }

  function handleHour(hour: number) {
    if (!selectedDate) return;
    setSelectedDate(applyExactHour(selectedDate, hour));
    setStep("confirm");
  }

  function handleCustomDate(value: string) {
    if (!value) return;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return;
    setSelectedDate(date);
    setStep("confirm");
    setCustomPickerOpen(false);
  }

  function goBack() {
    if (step === "when") return onBack();
    setStep(step === "period" ? "when" : step === "exact" ? "period" : "when");
  }

  const openCustomPicker = () => setCustomPickerOpen(true);

  return (
    <AppShell
      onLogoClick={onBack}
      right={
        <button
          className={["flex items-center", "gap-1.5 text-[12px]", "text-[#71717a]"].join(" ")}
          onClick={goBack}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
      }
    >
      <div className="mx-auto w-full max-w-[700px] px-5 py-16 sm:py-20">
        <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {step === "when" && <WhenStep task={task} onSelect={handleQuickOption} onCustom={openCustomPicker} />}
          {step === "period" && <PeriodStep task={task} onSelect={handlePeriod} onCustom={openCustomPicker} />}
          {step === "exact" && <ExactStep task={task} period={selectedPeriod} hours={suggestedHours} onSelect={handleHour} onCustom={openCustomPicker} />}
          {step === "confirm" && selectedDate && (
            <ConfirmationStep task={task} date={selectedDate} onCommit={() => onCreate(task, selectedDate.getTime())} onChange={() => setStep("when")} />
          )}
        </motion.div>

        {customPickerOpen && <CustomTimePicker onClose={() => setCustomPickerOpen(false)} onSelect={handleCustomDate} />}
      </div>
    </AppShell>
  );
}
