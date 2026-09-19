import {
  PrimaryButton,
} from "../components/PrimaryButton";

import {
  SectionLabel,
} from "../components/SectionLabel";

import type {
  BenchmarkComparison,
} from "../types/benchmark";

interface Props {
  comparisons:
    BenchmarkComparison[];

  onLab:
    () => void;

  onAgain:
    () => void;

  onRuns:
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

export function ResultsScreen({
  comparisons,
  onLab,
  onAgain,
  onRuns,
}: Props) {
  const totalMain =
    comparisons.reduce(
      (
        sum,
        item,
      ) =>
        sum +
        item.main
          .measurement
          .taskDurationMs,
      0,
    );

  const totalWorker =
    comparisons.reduce(
      (
        sum,
        item,
      ) =>
        sum +
        item.worker
          .measurement
          .taskDurationMs,
      0,
    );

  const worstMain =
    Math.max(
      ...comparisons.map(
        (item) =>
          item.main
            .measurement
            .maxFrameGapMs,
      ),
    );

  const worstWorker =
    Math.max(
      ...comparisons.map(
        (item) =>
          item.worker
            .measurement
            .maxFrameGapMs,
      ),
    );

  const taskDelta =
    totalWorker -
    totalMain;

  const stallDelta =
    worstMain -
    worstWorker;

  const share =
    async () => {
      const text =
        `BEAT YOUR BROWSER — Day 19/30\n` +
        `Main worst UI stall: ${format(worstMain)}\n` +
        `Worker worst UI stall: ${format(worstWorker)}\n` +
        `Same work. Different thread.`;

      if (
        navigator.share
      ) {
        await navigator.share(
          {
            title:
              "Beat Your Browser",

            text,
          },
        );

        return;
      }

      await navigator.clipboard
        .writeText(
          text,
        );
    };

  return (
    <main
      className="
        mx-auto
        max-w-6xl
        px-4
        py-10
        md:px-6
      "
    >
      <SectionLabel tone="lime">
        GUIDED RUN COMPLETE
      </SectionLabel>

      <h1
        className="
          mt-3
          text-5xl
          font-semibold
          tracking-[-.05em]
          sm:text-7xl
        "
      >
        YOUR BROWSER SURVIVED.
      </h1>

      <section
        className="
          mt-8
          grid
          gap-px
          border
          border-line
          bg-line
          md:grid-cols-2
        "
      >
        <Summary
          title="MAIN THREAD"
          tone="amber"
          compute={
            totalMain
          }
          stall={
            worstMain
          }
        />

        <Summary
          title="WEB WORKER"
          tone="cyan"
          compute={
            totalWorker
          }
          stall={
            worstWorker
          }
        />
      </section>

      <section
        className="
          mt-4
          border
          border-line
          bg-panel
          p-6
          sm:p-8
        "
      >
        <div
          className="
            grid
            gap-5
            sm:grid-cols-2
          "
        >
          <Delta
            label="COMPUTE DIFFERENCE"
            value={
              `${
                taskDelta >=
                0
                  ? "+"
                  : "−"
              }${format(
                Math.abs(
                  taskDelta,
                ),
              )}`
            }
          />

          <Delta
            label="WORST-STALL REDUCTION"
            value={
              `−${format(
                Math.max(
                  0,
                  stallDelta,
                ),
              )}`
            }
            tone="text-lime"
          />
        </div>

        <h2
          className="
            mt-8
            text-3xl
            font-semibold
            tracking-[-.04em]
            sm:text-5xl
          "
        >
          IT DIDN'T MAKE THE WORK DISAPPEAR.
        </h2>

        <h2
          className="
            mt-1
            text-3xl
            font-semibold
            tracking-[-.04em]
            text-lime
            sm:text-5xl
          "
        >
          IT MOVED IT OUT OF THE WAY.
        </h2>

        <p
          className="
            mt-5
            max-w-3xl
            text-sm
            leading-6
            text-muted
          "
        >
          Workers let CPU-heavy JavaScript run separately from the main execution context, so long calculations do not have to monopolize the thread handling interface work.
        </p>
      </section>

      <section
        className="
          mt-4
          border
          border-line
          bg-canvas
          p-5
        "
      >
        <div
          className="
            font-mono
            text-[9px]
            text-muted
          "
        >
          SHARE CARD
        </div>

        <div
          className="
            mt-4
            grid
            gap-4
            sm:grid-cols-2
          "
        >
          <div>
            <div
              className="
                font-mono
                text-[10px]
                text-amber
              "
            >
              MAIN UI STALL
            </div>

            <div
              className="
                metric
                mt-1
                font-mono
                text-3xl
              "
            >
              {format(
                worstMain,
              )}
            </div>
          </div>

          <div>
            <div
              className="
                font-mono
                text-[10px]
                text-cyan
              "
            >
              WORKER UI STALL
            </div>

            <div
              className="
                metric
                mt-1
                font-mono
                text-3xl
              "
            >
              {format(
                worstWorker,
              )}
            </div>
          </div>
        </div>

        <div
          className="
            mt-5
            text-2xl
            font-semibold
            tracking-tight
          "
        >
          SAME WORK. DIFFERENT THREAD.
        </div>
      </section>

      <div
        className="
          mt-6
          flex
          flex-wrap
          gap-3
        "
      >
        <PrimaryButton
          onClick={
            onLab
          }
        >
          OPEN PERFORMANCE LAB →
        </PrimaryButton>

        <PrimaryButton
          tone="neutral"
          onClick={
            share
          }
        >
          SHARE RESULT
        </PrimaryButton>

        <PrimaryButton
          tone="neutral"
          onClick={
            onRuns
          }
        >
          VIEW RUNS
        </PrimaryButton>

        <PrimaryButton
          tone="neutral"
          onClick={
            onAgain
          }
        >
          RUN AGAIN
        </PrimaryButton>
      </div>
    </main>
  );
}

function Summary({
  title,
  tone,
  compute,
  stall,
}: {
  title: string;

  tone:
    | "amber"
    | "cyan";

  compute: number;

  stall: number;
}) {
  const color =
    tone === "amber"
      ? "text-amber"
      : "text-cyan";

  return (
    <div
      className="
        bg-panel
        p-6
      "
    >
      <div
        className={`
          font-mono
          text-[10px]
          ${color}
        `}
      >
        {title}
      </div>

      <div
        className="
          mt-6
          grid
          grid-cols-2
          gap-4
        "
      >
        <Delta
          label="TOTAL COMPUTE"
          value={
            format(
              compute,
            )
          }
        />

        <Delta
          label="WORST UI STALL"
          value={
            format(
              stall,
            )
          }
          tone={
            color
          }
        />
      </div>
    </div>
  );
}

function Delta({
  label,
  value,
  tone = "text-ink",
}: {
  label: string;

  value: string;

  tone?: string;
}) {
  return (
    <div>
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
          text-2xl
          ${tone}
        `}
      >
        {value}
      </div>
    </div>
  );
}