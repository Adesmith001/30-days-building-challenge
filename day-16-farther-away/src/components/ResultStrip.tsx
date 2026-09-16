import {
  formatNaira,
} from "../lib/currency";

export default function ResultStrip({
  cashSavingsB,
  extraHoursB,
  bName,
}: {
  cashSavingsB: number;
  extraHoursB: number;
  bName: string;
}) {
  const cashPositive =
    cashSavingsB >= 0;

  return (
    <div
      className="
        grid
        border
        border-line
        bg-paper-soft
        md:grid-cols-2
        md:divide-x
        md:divide-line
      "
    >
      <div
        className="
          p-5
          md:p-7
        "
      >
        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.1em]
            text-muted
          "
        >
          {cashPositive
            ? `${bName || "HOME B"} USES LESS CASH`
            : `${bName || "HOME B"} USES MORE CASH`}
        </p>

        <p
          className={`
            mt-2
            font-mono
            text-3xl
            ${
              cashPositive
                ? "text-savings"
                : "text-ink"
            }
          `}
        >
          {formatNaira(
            Math.abs(
              cashSavingsB,
            ),
          )}
        </p>

        <p
          className="
            mt-1
            font-mono
            text-[10px]
            text-muted
          "
        >
          PER YEAR
        </p>
      </div>

      <div
        className="
          border-t
          border-line
          p-5
          md:border-t-0
          md:p-7
        "
      >
        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.1em]
            text-muted
          "
        >
          {extraHoursB >= 0
            ? "ADDED COMMUTE TIME"
            : "COMMUTE TIME REDUCED"}
        </p>

        <p
          className={`
            mt-2
            font-mono
            text-3xl
            ${
              extraHoursB >= 0
                ? "text-time"
                : "text-ink"
            }
          `}
        >
          {Math.abs(
            Math.round(
              extraHoursB,
            ),
          )}{" "}
          HOURS
        </p>

        <p
          className="
            mt-1
            font-mono
            text-[10px]
            text-muted
          "
        >
          PER YEAR
        </p>
      </div>
    </div>
  );
}