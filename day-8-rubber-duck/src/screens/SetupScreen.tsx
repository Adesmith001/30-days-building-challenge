import {
  useState,
} from "react";

import type {
  ProblemMode,
} from "../schemas/session";

const modes: {
  value: ProblemMode;
  label: string;
}[] = [
  {
    value: "general",
    label:
      "FIGURE SOMETHING OUT",
  },

  {
    value: "decision",
    label:
      "MAKE A DECISION",
  },

  {
    value: "learn",
    label:
      "UNDERSTAND SOMETHING",
  },

  {
    value:
      "troubleshoot",

    label:
      "TROUBLESHOOT",
  },

  {
    value: "improve",
    label:
      "IMPROVE SOMETHING",
  },

  {
    value: "code",
    label: "CODE",
  },
];

interface Props {
  busy: boolean;

  onSubmit: (
    data: {
      problem: string;
      tried: string;
      outcome: string;
      mode: ProblemMode;
    },
  ) => void;
}

export function SetupScreen({
  busy,
  onSubmit,
}: Props) {
  const [
    problem,
    setProblem,
  ] = useState("");

  const [
    tried,
    setTried,
  ] = useState("");

  const [
    outcome,
    setOutcome,
  ] = useState("");

  const [
    mode,
    setMode,
  ] = useState<
    ProblemMode
  >("general");

  const [
    showExtras,
    setShowExtras,
  ] = useState(false);

  return (
    <main
      className="
        mx-auto
        min-h-[calc(100vh-132px)]
        w-full
        max-w-4xl
        px-5
        py-12
        md:px-8
        md:py-16
      "
    >
      <div
        className="
          flex
          items-center
          gap-4
          font-mono
          text-[9px]
          tracking-[0.16em]
          text-muted
        "
      >
        <span
          className="
            border
            border-rule
            px-2
            py-1
            text-graphite
          "
        >
          NEW THOUGHT
        </span>

        <span>
          STAGE 01 —
          ARTICULATION
        </span>
      </div>

      <h1
        className="
          mt-7
          font-serif
          text-5xl
          leading-[1.02]
          md:text-7xl
        "
      >
        WHAT ARE YOU
        <br />
        STUCK ON?
      </h1>

      <div
        className="
          mt-12
          border-l
          border-ink
          pl-5
          md:pl-7
        "
      >
        <textarea
          autoFocus
          value={problem}
          onChange={(
            event,
          ) =>
            setProblem(
              event.target.value,
            )
          }
          placeholder="
            Explain it however
            you would explain
            it to a friend.
          "
          rows={8}
          className="
            w-full
            resize-none
            bg-transparent
            font-serif
            text-xl
            leading-8
            outline-none
            placeholder:italic
            placeholder:text-muted
            md:text-2xl
            md:leading-10
          "
        />

        <div
          className="
            border-t
            border-rule
            pt-4
            font-mono
            text-[9px]
            tracking-[0.14em]
            text-muted
          "
        >
          ONE PARAGRAPH IS
          ENOUGH TO START
        </div>
      </div>

      <div className="mt-9">
        <p
          className="
            mb-3
            font-mono
            text-[9px]
            tracking-[0.15em]
            text-muted
          "
        >
          OPTIONAL MODE
        </p>

        <div
          className="
            flex
            flex-wrap
            gap-2
          "
        >
          {modes.map(
            (item) => (
              <button
                key={
                  item.value
                }
                onClick={() =>
                  setMode(
                    item.value,
                  )
                }
                className={`
                  border
                  px-3
                  py-2
                  font-mono
                  text-[9px]
                  tracking-[0.12em]

                  ${
                    mode ===
                    item.value
                      ? `
                        border-ink
                        bg-ink
                        text-white
                      `
                      : `
                        border-rule
                        text-graphite
                      `
                  }
                `}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      </div>

      <button
        onClick={() =>
          setShowExtras(
            (value) =>
              !value,
          )
        }
        className="
          mt-8
          border-b
          border-rule
          pb-1
          font-mono
          text-[10px]
          tracking-[0.14em]
        "
      >
        {showExtras
          ? "HIDE CONTEXT −"
          : "ADD CONTEXT +"}
      </button>

      {showExtras ? (
        <div
          className="
            mt-6
            grid
            gap-5
            md:grid-cols-2
          "
        >
          <Field
            label="
              WHAT HAVE YOU TRIED?
            "
            value={
              tried
            }
            onChange={
              setTried
            }
          />

          <Field
            label="
              WHAT WOULD A GOOD
              OUTCOME LOOK LIKE?
            "
            value={
              outcome
            }
            onChange={
              setOutcome
            }
          />
        </div>
      ) : null}

      <div
        className="
          mt-12
          flex
          justify-end
          border-t
          border-rule
          pt-7
        "
      >
        <button
          disabled={
            busy ||
            !problem.trim()
          }
          onClick={() =>
            onSubmit({
              problem,
              tried,
              outcome,
              mode,
            })
          }
          className="
            border
            border-ink
            bg-ink
            px-7
            py-4
            font-mono
            text-[10px]
            tracking-[0.17em]
            text-white
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          {busy
            ? "ASKING…"
            : "ASK THE DUCK →"}
        </button>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;

  onChange:
    (
      value: string,
    ) => void;
}) {
  return (
    <label
      className="
        block
        border-t
        border-rule
        pt-4
      "
    >
      <span
        className="
          font-mono
          text-[9px]
          tracking-[0.14em]
          text-muted
        "
      >
        {label}
      </span>

      <textarea
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        rows={3}
        className="
          mt-3
          w-full
          resize-none
          bg-transparent
          font-serif
          text-lg
          leading-7
          outline-none
        "
      />
    </label>
  );
}