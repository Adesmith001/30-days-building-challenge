import {
  useState,
} from "react";

import ReactMarkdown
  from "react-markdown";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  LoadingState,
} from "../components/LoadingState";

import {
  Modal,
} from "../components/Modal";

import {
  ResponseComposer,
} from "../components/ResponseComposer";

import {
  SideRail,
} from "../components/SideRail";

import {
  ThreadView,
} from "../components/ThreadView";

import type {
  DuckSession,
} from "../schemas/session";

interface Props {
  session:
    DuckSession;

  busy:
    boolean;

  onAnswer:
    (
      text: string,
    ) => Promise<unknown>;

  onHint:
    () => Promise<unknown>;

  onExplain:
    () => Promise<unknown>;

  onResolve:
    (
      text: string,
    ) => Promise<unknown>;

  onPause:
    () => void;
}

export function SessionScreen({
  session,
  busy,
  onAnswer,
  onHint,
  onExplain,
  onResolve,
  onPause,
}: Props) {
  const [
    threadOpen,
    setThreadOpen,
  ] = useState(false);

  const [
    resolveOpen,
    setResolveOpen,
  ] = useState(false);

  if (
    busy &&
    !session.currentQuestion
  ) {
    return (
      <LoadingState />
    );
  }

  return (
    <main
      className="
        mx-auto
        min-h-[calc(100vh-170px)]
        w-full
        max-w-[1120px]
        px-5
        py-10
        md:px-8
        md:py-14
      "
    >
      <div
        className="
          grid
          gap-12
          lg:grid-cols-[minmax(0,720px)_240px]
          lg:gap-16
        "
      >
        <section>
          <AnimatePresence
            mode="wait"
          >
            <motion.div
              key={`
                ${session.questionCount}
                -
                ${session.currentQuestion?.text}
              `}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration:
                  0.22,
              }}
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-rule
                  pb-5
                  font-mono
                  text-[9px]
                  tracking-[0.16em]
                  text-muted
                "
              >
                <span>
                  DIALECTIC /
                  QUESTION{" "}
                  {String(
                    session.questionCount,
                  ).padStart(
                    2,
                    "0",
                  )}
                </span>

                <span
                  className="
                    border
                    border-rule
                    px-2
                    py-1
                    text-graphite
                  "
                >
                  {(
                    session
                      .currentQuestion
                      ?.type ??
                    "clarify"
                  ).toUpperCase()}
                </span>
              </div>

              {session.resolutionStatus ===
                "almost" ||
              session.resolutionStatus ===
                "needs-evidence" ? (
                <div
                  className="
                    mt-9
                    border-l-2
                    border-ink
                    pl-4
                  "
                >
                  <p
                    className="
                      font-mono
                      text-[9px]
                      tracking-[0.16em]
                      text-muted
                    "
                  >
                    RESOLUTION CHECK
                  </p>

                  <p
                    className="
                      mt-2
                      font-serif
                      text-3xl
                    "
                  >
                    ALMOST.
                  </p>

                  <p
                    className="
                      mt-1
                      font-serif
                      text-base
                      italic
                      text-graphite
                    "
                  >
                    One important
                    dependency is
                    still open.
                  </p>
                </div>
              ) : null}

              <h1
                className="
                  mt-10
                  font-serif
                  text-4xl
                  leading-[1.08]
                  tracking-[-0.02em]
                  md:text-6xl
                "
              >
                {session
                  .currentQuestion
                  ?.text ??
                  "What still feels unclear?"}
              </h1>

              {session.progressNote ? (
                <p
                  className="
                    mt-6
                    border-l
                    border-rule
                    pl-4
                    font-serif
                    text-lg
                    italic
                    leading-7
                    text-graphite
                  "
                >
                  {
                    session.progressNote
                  }
                </p>
              ) : null}

              {session.activeHint ? (
                <div
                  className="
                    mt-9
                    border-y
                    border-rule
                    bg-wash/45
                    px-5
                    py-6
                  "
                >
                  <div
                    className="
                      font-mono
                      text-[9px]
                      tracking-[0.16em]
                      text-muted
                    "
                  >
                    HINT{" "}
                    {
                      session.hintLevel
                    }{" "}
                    / 3
                  </div>

                  <p
                    className="
                      mt-3
                      font-serif
                      text-2xl
                      leading-9
                    "
                  >
                    {
                      session.activeHint
                    }
                  </p>
                </div>
              ) : null}

              {session.directExplanation ? (
                <div
                  className="
                    mt-9
                    border
                    border-ink
                    p-5
                    md:p-6
                  "
                >
                  <p
                    className="
                      mb-4
                      font-mono
                      text-[9px]
                      tracking-[0.16em]
                      text-muted
                    "
                  >
                    DIRECT EXPLANATION
                  </p>

                  <div
                    className="
                      max-w-none
                      font-serif
                      text-lg
                      leading-8
                      text-graphite

                      [&_code]:font-mono
                      [&_code]:text-sm

                      [&_li]:mb-2

                      [&_ol]:my-4
                      [&_ol]:pl-6

                      [&_p]:mb-4

                      [&_pre]:my-4
                      [&_pre]:overflow-x-auto
                      [&_pre]:bg-wash
                      [&_pre]:p-4

                      [&_ul]:my-4
                      [&_ul]:pl-6
                    "
                  >
                    <ReactMarkdown>
                      {
                        session.directExplanation
                      }
                    </ReactMarkdown>
                  </div>
                </div>
              ) : null}

              <div className="mt-10">
                <ResponseComposer
                  onSubmit={
                    async (text) => {
                      await onAnswer(
                        text,
                      );
                    }
                  }
                  disabled={
                    busy
                  }
                />
              </div>

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  items-center
                  gap-x-7
                  gap-y-3
                  font-mono
                  text-[9px]
                  tracking-[0.13em]
                  text-graphite
                "
              >
                <button
                  onClick={() =>
                    void onHint()
                  }
                  disabled={
                    busy ||
                    session.hintLevel >=
                      3
                  }
                  className="
                    border-b
                    border-ink
                    pb-1
                    disabled:border-rule
                    disabled:text-muted
                  "
                >
                  {session.hintLevel
                    ? "STRONGER HINT"
                    : "GIVE ME A HINT"}

                  {session.hintLevel <
                  3
                    ? " →"
                    : ""}
                </button>

                <button
                  onClick={() =>
                    void onExplain()
                  }
                  disabled={
                    busy
                  }
                  className="
                    border-b
                    border-rule
                    pb-1
                    hover:border-ink
                  "
                >
                  JUST EXPLAIN IT
                  TO ME
                </button>

                <button
                  onClick={() =>
                    setResolveOpen(
                      true,
                    )
                  }
                  className="
                    border-b
                    border-rule
                    pb-1
                    hover:border-ink
                  "
                >
                  I THINK I GOT IT →
                </button>

                <button
                  onClick={
                    onPause
                  }
                  className="
                    ml-auto
                    text-muted
                    hover:text-ink
                  "
                >
                  PAUSE
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <SideRail
          session={
            session
          }
          onThread={() =>
            setThreadOpen(
              true,
            )
          }
        />
      </div>

      <Modal
        open={
          threadOpen
        }
        onClose={() =>
          setThreadOpen(
            false,
          )
        }
        width="max-w-4xl"
      >
        <ThreadView
          session={
            session
          }
        />
      </Modal>

      <Modal
        open={
          resolveOpen
        }
        onClose={() =>
          setResolveOpen(
            false,
          )
        }
      >
        <p
          className="
            font-mono
            text-[9px]
            tracking-[0.16em]
            text-muted
          "
        >
          RESOLUTION CHECK
        </p>

        <h2
          className="
            mt-4
            font-serif
            text-4xl
          "
        >
          WHAT&apos;S YOUR
          CURRENT ANSWER?
        </h2>

        <p
          className="
            mt-4
            font-serif
            text-lg
            leading-7
            text-graphite
          "
        >
          Say it plainly.
          The duck will check
          whether it fits the
          thread you built.
        </p>

        <div className="mt-8">
          <ResponseComposer
            disabled={
              busy
            }
            placeholder="
              I think the answer is…
            "
            buttonLabel={
              busy
                ? "CHECKING…"
                : "CHECK IT →"
            }
            onSubmit={
              async (
                value,
              ) => {
                const result =
                  await onResolve(
                    value,
                  );

                if (
                  result
                ) {
                  setResolveOpen(
                    false,
                  );
                }
              }
            }
          />
        </div>
      </Modal>
    </main>
  );
}