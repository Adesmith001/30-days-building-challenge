import type {
  DuckSession,
} from "../schemas/session";

import {
  formatElapsed,
} from "../lib/session";

interface Props {
  session:
    DuckSession;

  onNew:
    () => void;

  onThreads:
    () => void;
}

export function SummaryScreen({
  session,
  onNew,
  onThreads,
}: Props) {
  return (
    <main
      className="
        mx-auto
        min-h-[calc(100vh-170px)]
        w-full
        max-w-5xl
        px-5
        py-12
        md:px-8
        md:py-16
      "
    >
      <div
        className="
          font-mono
          text-[9px]
          tracking-[0.17em]
          text-muted
        "
      >
        SESSION COMPLETE
      </div>

      <h1
        className="
          mt-4
          font-serif
          text-5xl
          md:text-7xl
        "
      >
        THERE IT IS.
      </h1>

      <p
        className="
          mt-4
          font-serif
          text-xl
          italic
          text-graphite
        "
      >
        That&apos;s the answer
        you&apos;ve been
        circling around.
      </p>

      <section
        className="
          mt-10
          border
          border-ink
          p-6
          md:p-8
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-rule
            pb-4
            font-mono
            text-[9px]
            tracking-[0.15em]
            text-muted
          "
        >
          <span>
            SYNTHESIZED INSIGHT
          </span>

          <span>
            CLARITY{" "}
            {
              session.clarity
            }{" "}
            / 100
          </span>
        </div>

        <blockquote
          className="
            mt-7
            font-serif
            text-3xl
            leading-10
            md:text-4xl
            md:leading-[1.25]
          "
        >
          “
          {session.conclusion ||
            session.reasoningSummary}
          ”
        </blockquote>
      </section>

      <div
        className="
          mt-8
          grid
          gap-6
          border-y
          border-rule
          py-6
          sm:grid-cols-3
        "
      >
        <Metric
          label="CLARITY"
          value={`
            ${session.clarity}
            / 100
          `}
        />

        <Metric
          label="QUESTIONS"
          value={String(
            session.questionCount,
          ).padStart(
            2,
            "0",
          )}
        />

        <Metric
          label="ELAPSED"
          value={
            formatElapsed(
              session.createdAt,
              session.updatedAt,
            )
          }
        />
      </div>

      <section className="mt-12">
        <p
          className="
            font-mono
            text-[9px]
            tracking-[0.17em]
            text-muted
          "
        >
          HOW YOU GOT THERE
        </p>

        <div
          className="
            mt-7
            space-y-0
          "
        >
          {(
            session.reasoningMap
              .length
              ? session.reasoningMap
              : fallbackMap(
                  session,
                )
          ).map(
            (
              node,
              index,
              all,
            ) => (
              <div
                key={`
                  ${node.label}
                  -
                  ${index}
                `}
                className="
                  grid
                  grid-cols-[90px_1fr]
                  gap-5
                "
              >
                <div
                  className="
                    font-mono
                    text-[9px]
                    tracking-[0.14em]
                    text-muted
                  "
                >
                  {node.label.toUpperCase()}
                </div>

                <div>
                  <p
                    className="
                      border-l
                      border-rule
                      pb-7
                      pl-5
                      font-serif
                      text-xl
                      leading-8
                    "
                  >
                    {node.text}
                  </p>

                  {index <
                  all.length -
                    1 ? (
                    <div
                      className="
                        ml-[-3px]
                        h-6
                        border-l
                        border-rule
                      "
                    />
                  ) : null}
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      <div
        className="
          mt-12
          flex
          flex-wrap
          gap-4
          border-t
          border-rule
          pt-7
        "
      >
        <button
          onClick={
            onNew
          }
          className="
            border
            border-ink
            bg-ink
            px-6
            py-3
            font-mono
            text-[10px]
            tracking-[0.15em]
            text-white
          "
        >
          START NEW PROBLEM →
        </button>

        <button
          onClick={
            onThreads
          }
          className="
            border
            border-rule
            px-6
            py-3
            font-mono
            text-[10px]
            tracking-[0.15em]
          "
        >
          YOUR THREADS
        </button>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p
        className="
          font-mono
          text-[9px]
          tracking-[0.15em]
          text-muted
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          font-serif
          text-3xl
        "
      >
        {value}
      </p>
    </div>
  );
}

function fallbackMap(
  session: DuckSession,
) {
  return [
    {
      label: "START",
      text:
        session.problem,
    },

    ...session.insights
      .slice(-3)
      .map(
        (text) => ({
          label:
            "INSIGHT",

          text,
        }),
      ),

    {
      label:
        "CONCLUSION",

      text:
        session.conclusion ||
        session.reasoningSummary,
    },
  ];
}