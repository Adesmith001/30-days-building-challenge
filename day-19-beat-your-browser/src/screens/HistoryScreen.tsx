import {
  useState,
} from "react";

import {
  PrimaryButton,
} from "../components/PrimaryButton";

import {
  SectionLabel,
} from "../components/SectionLabel";

import type {
  SavedRun,
} from "../types/benchmark";

interface Props {
  runs:
    SavedRun[];

  onClear:
    () => void;
}

const format = (
  value: number,
) =>
  value < 1000
    ? `${Math.round(value)}ms`
    : `${(
        value / 1000
      ).toFixed(2)}s`;

export function HistoryScreen({
  runs,
  onClear,
}: Props) {
  const [
    selected,
    setSelected,
  ] =
    useState<string | null>(
      runs[0]?.id ??
        null,
    );

  const active =
    runs.find(
      (run) =>
        run.id ===
        selected,
    );

  return (
    <main
      className="
        mx-auto
        max-w-6xl
        px-4
        py-8
        md:px-6
      "
    >
      <div
        className="
          flex
          flex-wrap
          items-end
          justify-between
          gap-4
        "
      >
        <div>
          <SectionLabel tone="lime">
            LOCAL HISTORY
          </SectionLabel>

          <h1
            className="
              mt-3
              text-4xl
              font-semibold
              tracking-[-.045em]
              sm:text-5xl
            "
          >
            RUNS.
          </h1>
        </div>

        {runs.length >
          0 && (
          <PrimaryButton
            tone="neutral"
            onClick={
              onClear
            }
          >
            CLEAR HISTORY
          </PrimaryButton>
        )}
      </div>

      {runs.length ===
      0 ? (
        <div
          className="
            mt-8
            border
            border-line
            bg-panel
            p-8
            text-sm
            text-muted
          "
        >
          No completed guided runs yet. Finish the three-round experiment and the summary will be saved locally in this browser.
        </div>
      ) : (
        <div
          className="
            mt-8
            grid
            gap-4
            lg:grid-cols-[.72fr_1.28fr]
          "
        >
          <div
            className="
              space-y-2
            "
          >
            {runs.map(
              (
                run,
              ) => (
                <button
                  key={
                    run.id
                  }
                  onClick={() =>
                    setSelected(
                      run.id,
                    )
                  }
                  className={`
                    w-full
                    border
                    p-4
                    text-left
                    transition
                    ${
                      selected ===
                      run.id
                        ? "border-lime bg-cell"
                        : "border-line bg-panel hover:border-muted"
                    }
                  `}
                >
                  <div
                    className="
                      font-mono
                      text-[9px]
                      text-muted
                    "
                  >
                    {new Date(
                      run.createdAt,
                    ).toLocaleString()}
                  </div>

                  <div
                    className="
                      mt-3
                      grid
                      grid-cols-2
                      gap-3
                      font-mono
                      text-xs
                    "
                  >
                    <span
                      className="
                        text-amber
                      "
                    >
                      MAIN{" "}
                      {format(
                        run.worstMainGapMs,
                      )}
                    </span>

                    <span
                      className="
                        text-cyan
                      "
                    >
                      WORKER{" "}
                      {format(
                        run.worstWorkerGapMs,
                      )}
                    </span>
                  </div>
                </button>
              ),
            )}
          </div>

          {active && (
            <RunDetail
              run={
                active
              }
            />
          )}
        </div>
      )}
    </main>
  );
}

function RunDetail({
  run,
}: {
  run: SavedRun;
}) {
  return (
    <section
      className="
        border
        border-line
        bg-panel
        p-5
      "
    >
      <div
        className="
          grid
          gap-px
          border
          border-line
          bg-line
          sm:grid-cols-2
        "
      >
        <Cell
          label="TOTAL MAIN COMPUTE"
          value={
            format(
              run.totalMainMs,
            )
          }
          tone="text-amber"
        />

        <Cell
          label="TOTAL WORKER COMPUTE"
          value={
            format(
              run.totalWorkerMs,
            )
          }
          tone="text-cyan"
        />

        <Cell
          label="WORST MAIN STALL"
          value={
            format(
              run.worstMainGapMs,
            )
          }
          tone="text-amber"
        />

        <Cell
          label="WORST WORKER STALL"
          value={
            format(
              run.worstWorkerGapMs,
            )
          }
          tone="text-cyan"
        />
      </div>

      <div
        className="
          mt-4
          space-y-2
        "
      >
        {run.rounds.map(
          (
            round,
          ) => (
            <div
              key={
                round.task
              }
              className="
                grid
                gap-3
                border
                border-line
                bg-canvas
                p-4
                font-mono
                text-[10px]
                sm:grid-cols-3
              "
            >
              <span
                className="
                  text-ink
                "
              >
                {round.task.toUpperCase()}
              </span>

              <span
                className="
                  text-amber
                "
              >
                MAIN GAP{" "}
                {format(
                  round.mainGapMs,
                )}
              </span>

              <span
                className="
                  text-cyan
                "
              >
                WORKER GAP{" "}
                {format(
                  round.workerGapMs,
                )}
              </span>
            </div>
          ),
        )}
      </div>
    </section>
  );
}

function Cell({
  label,
  value,
  tone,
}: {
  label: string;

  value: string;

  tone: string;
}) {
  return (
    <div
      className="
        bg-canvas
        p-4
      "
    >
      <div
        className="
          font-mono
          text-[9px]
          text-muted
        "
      >
        {label}
      </div>

      <div
        className={`
          metric
          mt-2
          font-mono
          text-xl
          ${tone}
        `}
      >
        {value}
      </div>
    </div>
  );
}