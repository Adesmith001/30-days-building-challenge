import { formatNaira } from "../lib/currency"

interface Props {
  rentPot: number
  target: number
  monthsLeft?: number
}

export function RentMeter({
  rentPot,
  target,
  monthsLeft,
}: Props) {
  const percentage =
    target <= 0
      ? 100
      : Math.min(100, (rentPot / target) * 100)

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
            RENT POT
          </p>

          <p className="mt-1 font-mono text-2xl font-medium tracking-[-0.04em] md:text-3xl">
            {formatNaira(rentPot)}
          </p>
        </div>

        <div className="text-right">
          <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
            OF {formatNaira(target)}
          </p>

          <p className="mt-1 font-mono text-sm">
            {Math.round(percentage)}%
          </p>
        </div>
      </div>

      <div className="h-[3px] bg-rule">
        <div
          className={`h-full transition-all duration-500 ${
            percentage >= 100
              ? "bg-green"
              : "bg-orange"
          }`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {monthsLeft !== undefined && (
        <p className="mt-3 text-right font-mono text-[9px] tracking-[0.13em] text-muted">
          {monthsLeft} MONTHS LEFT
        </p>
      )}
    </div>
  )
}