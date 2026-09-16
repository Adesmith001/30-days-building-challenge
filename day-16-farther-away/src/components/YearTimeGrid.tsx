interface Props {
  label: string;
  days: number;

  tone:
    | "ink"
    | "time";
}

export default function YearTimeGrid({
  label,
  days,
  tone,
}: Props) {
  const filled = Math.min(
    365,
    Math.max(
      0,
      Math.round(days),
    ),
  );

  return (
    <div>
      <div
        className="
          mb-4
          flex
          items-baseline
          justify-between
        "
      >
        <span
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.1em]
            text-muted
          "
        >
          {label}
        </span>

        <span
          className="
            font-mono
            text-sm
          "
        >
          {days.toFixed(1)} DAYS
        </span>
      </div>

      <div
        className="
          grid
          grid-cols-[repeat(26,minmax(0,1fr))]
          gap-[2px]
        "
        aria-label={
          `${days.toFixed(
            1,
          )} days of commute time`
        }
      >
        {Array.from(
          {
            length: 365,
          },
          (_, index) => (
            <span
              key={index}
              className={`
                aspect-square
                border
                border-line
                ${
                  index < filled
                    ? tone === "ink"
                      ? "bg-ink"
                      : "bg-time"
                    : "bg-transparent"
                }
              `}
            />
          ),
        )}
      </div>
    </div>
  );
}