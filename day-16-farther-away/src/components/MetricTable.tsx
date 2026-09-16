import type {
  ReactNode,
} from "react";

export interface MetricRow {
  label: string;
  value: ReactNode;
  note?: string;
}

export default function MetricTable({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: MetricRow[];
}) {
  return (
    <section
      className="
        border
        border-line
        bg-white/50
        p-5
        md:p-7
      "
    >
      <div
        className="
          mb-6
          border-b
          border-line
          pb-4
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
          {subtitle}
        </p>

        <h2
          className="
            mt-1
            font-serif
            text-2xl
            uppercase
          "
        >
          {title}
        </h2>
      </div>

      <div>
        {rows.map((row) => (
          <div
            key={row.label}
            className="
              grid
              grid-cols-[1fr_auto]
              gap-4
              border-b
              border-line
              py-3
              last:border-b-0
            "
          >
            <div>
              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.06em]
                  text-muted
                "
              >
                {row.label}
              </p>

              {row.note && (
                <p
                  className="
                    mt-1
                    text-[10px]
                    text-muted
                  "
                >
                  {row.note}
                </p>
              )}
            </div>

            <div
              className="
                text-right
                font-mono
                text-sm
                font-medium
              "
            >
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}