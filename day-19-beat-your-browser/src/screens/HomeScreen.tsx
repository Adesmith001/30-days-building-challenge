import {
  motion,
} from "motion/react";

import {
  PrimaryButton,
} from "../components/PrimaryButton";

import {
  SectionLabel,
} from "../components/SectionLabel";

interface Props {
  onStart:
    () => void;
}

export function HomeScreen({
  onStart,
}: Props) {
  return (
    <main
      className="
        mx-auto
        grid
        min-h-[calc(100vh-56px)]
        max-w-7xl
        items-center
        gap-10
        px-4
        py-12
        md:grid-cols-[1.05fr_.95fr]
        md:px-6
      "
    >
      <motion.section
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <SectionLabel tone="lime">
          BROWSER PERFORMANCE EXPERIMENT · DAY 19 / 30
        </SectionLabel>

        <h1
          className="
            mt-5
            max-w-3xl
            text-5xl
            font-semibold
            leading-[.92]
            tracking-[-.055em]
            sm:text-7xl
            lg:text-8xl
          "
        >
          MAKE YOUR
          <br />

          <span
            className="
              text-lime
            "
          >
            BROWSER
          </span>

          <br />

          SWEAT.
        </h1>

        <p
          className="
            mt-6
            max-w-xl
            text-sm
            leading-6
            text-muted
            sm:text-base
          "
        >
          Run the same
          CPU-heavy work two
          ways. One monopolizes
          the page. One moves
          the work off the UI
          thread.
        </p>

        <div
          className="
            mt-8
            flex
            flex-wrap
            items-center
            gap-3
          "
        >
          <PrimaryButton
            onClick={
              onStart
            }
          >
            START THE RACE →
          </PrimaryButton>

          <span
            className="
              font-mono
              text-[10px]
              tracking-[.1em]
              text-dim
            "
          >
            MAIN THREAD · WEB WORKER · REAL MEASUREMENTS
          </span>
        </div>
      </motion.section>

      <section
        className="
          border
          border-line
          bg-panel
          p-4
          sm:p-6
        "
      >
        <div
          className="
            mb-4
            flex
            items-center
            justify-between
            font-mono
            text-[9px]
            text-muted
          "
        >
          <span>
            EXPERIMENT PREVIEW
          </span>

          <span
            className="
              text-lime
            "
          >
            RESPONSIVENESS
          </span>
        </div>

        <div
          className="
            grid
            gap-3
            sm:grid-cols-2
          "
        >
          <PreviewLane
            title="MAIN THREAD"
            tone="amber"
            stalled
          />

          <PreviewLane
            title="WEB WORKER"
            tone="cyan"
          />
        </div>

        <div
          className="
            mt-3
            border
            border-line
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
            THE QUESTION
          </div>

          <div
            className="
              mt-2
              text-xl
              font-semibold
              tracking-tight
            "
          >
            CAN THE PAGE KEEP RESPONDING?
          </div>
        </div>
      </section>
    </main>
  );
}

function PreviewLane({
  title,
  tone,
  stalled = false,
}: {
  title: string;

  tone:
    | "amber"
    | "cyan";

  stalled?: boolean;
}) {
  const color =
    tone === "amber"
      ? "text-amber"
      : "text-cyan";

  return (
    <div
      className="
        border
        border-line
        bg-canvas
        p-4
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
          mt-7
          flex
          h-14
          items-end
          gap-1
        "
      >
        {Array.from(
          {
            length: 18,
          },
          (
            _,
            index,
          ) => (
            <span
              key={
                index
              }
              className={`
                w-full
                ${
                  stalled &&
                  index > 5 &&
                  index < 14
                    ? "h-1 bg-danger/30"
                    : `bg-current ${color}`
                }
              `}
              style={{
                height:
                  stalled &&
                  index > 5 &&
                  index < 14
                    ? 4
                    : 12 +
                      (index %
                        4) *
                        6,
              }}
            />
          ),
        )}
      </div>

      <div
        className="
          mt-5
          font-mono
          text-[9px]
          text-muted
        "
      >
        {stalled
          ? "UI STALL VISIBLE"
          : "FRAMES KEEP ARRIVING"}
      </div>
    </div>
  );
}