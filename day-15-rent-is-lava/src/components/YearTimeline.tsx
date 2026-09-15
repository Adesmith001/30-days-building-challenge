import { monthNames } from "../lib/finances"

interface Props {
  currentMonth: number
  completedMonths: number
  rentMonth: number
}

export function YearTimeline({
  currentMonth,
  completedMonths,
  rentMonth,
}: Props) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[620px] grid-cols-12 gap-2">
        {monthNames.map((month, index) => {
          const monthNumber = index + 1
          const completed = monthNumber <= completedMonths
          const current = monthNumber === currentMonth
          const rent = monthNumber === rentMonth

          return (
            <div
              key={month}
              className="text-center"
            >
              <span
                className={`font-mono text-[8px] tracking-[0.1em] ${
                  current
                    ? "text-orange"
                    : "text-muted"
                }`}
              >
                {month.slice(0, 3)}
              </span>

              <div className="mt-2 flex h-5 items-center justify-center">
                <span
                  className={`block h-2 w-2 ${
                    completed
                      ? "bg-ink"
                      : current
                        ? "border border-orange bg-orange"
                        : "border border-rule-dark"
                  }`}
                />
              </div>

              {rent && (
                <span className="mt-1 block font-mono text-[7px] tracking-[0.12em] text-orange">
                  RENT
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}