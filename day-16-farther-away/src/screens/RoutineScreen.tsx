import NumberField from "../components/NumberField";
import PrimaryButton from "../components/PrimaryButton";
import SetupShell from "../components/SetupShell";

import type {
  WorkRoutine,
} from "../types/comparison";

export default function RoutineScreen({
  routine,
  onChange,
  onNext,
}: {
  routine: WorkRoutine;

  onChange:
    (value: WorkRoutine) => void;

  onNext: () => void;
}) {
  const set = (
    key: keyof WorkRoutine,
    value: number,
  ) => {
    const next = {
      ...routine,
      [key]: value,
    };

    if (
      key === "workDaysPerWeek"
    ) {
      next.remoteDaysPerWeek =
        Math.min(
          next.remoteDaysPerWeek,
          value,
        );
    }

    onChange(next);
  };

  return (
    <SetupShell
      step="01 / 03"
      eyebrow="WORK ROUTINE"
      title="HOW OFTEN DO YOU ACTUALLY COMMUTE?"
      description="Start with the rhythm of your week. Remote days reduce both transport spend and commute time."
    >
      <div
        className="
          grid
          gap-10
          md:grid-cols-[1fr_2fr]
        "
      >
        <aside>
          <p
            className="
              font-serif
              text-2xl
            "
          >
            48 weeks by default.
          </p>

          <p
            className="
              mt-3
              max-w-xs
              text-sm
              leading-6
              text-muted
            "
          >
            Adjust for leave,
            holidays or your
            real work schedule.
          </p>
        </aside>

        <div
          className="
            space-y-8
          "
        >
          <div
            className="
              grid
              gap-8
              md:grid-cols-2
            "
          >
            <NumberField
              label="WORK DAYS / WEEK"
              value={
                routine.workDaysPerWeek
              }
              min={1}
              max={7}
              onChange={(value) =>
                set(
                  "workDaysPerWeek",
                  value,
                )
              }
              suffix="DAYS"
            />

            <NumberField
              label="REMOTE DAYS / WEEK"
              value={
                routine.remoteDaysPerWeek
              }
              min={0}
              max={
                routine.workDaysPerWeek
              }
              onChange={(value) =>
                set(
                  "remoteDaysPerWeek",
                  Math.min(
                    value,
                    routine.workDaysPerWeek,
                  ),
                )
              }
              suffix="DAYS"
            />
          </div>

          <NumberField
            label="WORK WEEKS / YEAR"
            value={
              routine.workWeeksPerYear
            }
            min={1}
            max={52}
            onChange={(value) =>
              set(
                "workWeeksPerYear",
                value,
              )
            }
            suffix="WEEKS"
          />

          <div
            className="
              flex
              justify-end
              pt-4
            "
          >
            <PrimaryButton
              onClick={onNext}
            >
              ADD HOME A →
            </PrimaryButton>
          </div>
        </div>
      </div>
    </SetupShell>
  );
}