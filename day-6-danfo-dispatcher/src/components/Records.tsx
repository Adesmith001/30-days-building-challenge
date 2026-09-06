import type { RunRecord } from "../types/game";
import { GlobalHeader } from "./GlobalHeader";

interface Props {
  records: RunRecord[];
  onBack(): void;
  onAbout(): void;
}

export function Records({
  records,
  onBack,
  onAbout,
}: Props) {
  const bestScore =
    records[0]?.score ?? 0;

  const mostDelivered = Math.max(
    0,
    ...records.map((record) => record.delivered),
  );

  const bestFlow = Math.max(
    0,
    ...records.map((record) => record.bestFlow),
  );

  const bestEfficiency = Math.max(
    0,
    ...records.map(
      (record) => record.efficiency,
    ),
  );

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <GlobalHeader
        onAbout={onAbout}
        status="RECORD ARCHIVE"
      />

      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-end justify-between border-b border-[#918976] pb-8">
          <div>
            <div className="text-xs tracking-[0.16em]">
              LAGOS TRANSIT ARCHIVE
            </div>

            <h1 className="mt-3 text-5xl font-black">
              PERSONAL RECORDS
            </h1>
          </div>

          <button
            onClick={onBack}
            className="text-xs underline"
          >
            ← BACK
          </button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          {[
            [
              "HIGHEST SCORE",
              bestScore.toLocaleString(),
            ],
            ["MOST DELIVERED", mostDelivered],
            ["BEST FLOW", `×${bestFlow}`],
            [
              "BEST EFFICIENCY",
              `${bestEfficiency}%`,
            ],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="border border-[#918976] p-5"
            >
              <div className="text-[10px]">
                {label}
              </div>

              <div className="mt-2 text-2xl font-black">
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 border border-[#918976]">
          <div
            className="
              grid grid-cols-[1fr_auto_auto]
              gap-4 border-b
              border-[#918976]
              bg-[#eceae7] p-4
              text-xs
            "
          >
            <span>ROTATION</span>
            <span>DELIVERED</span>
            <span>SCORE</span>
          </div>

          {records.length === 0 && (
            <div className="p-10 text-center text-sm">
              NO RECORDED SHIFTS YET.
            </div>
          )}

          {records.map((record, index) => (
            <div
              key={record.runId}
              className="
                grid grid-cols-[1fr_auto_auto]
                gap-4 border-b
                border-[#ddd6c8]
                p-4 text-xs
                last:border-b-0
              "
            >
              <div>
                <strong>
                  #{String(index + 1).padStart(2, "0")}
                  {" · "}
                  {record.rank}
                </strong>

                <div className="mt-1 text-[#777061]">
                  {new Date(
                    record.date,
                  ).toLocaleDateString()}
                  {" · "}
                  {record.efficiency}% EFF.
                </div>
              </div>

              <strong>
                {record.delivered}
              </strong>

              <strong className="min-w-20 text-right">
                {record.score.toLocaleString()}
              </strong>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}