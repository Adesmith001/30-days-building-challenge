import {
  useMemo,
  useState,
} from "react";

import {
  AppHeader,
} from "./components/AppHeader";

import {
  BottomRail,
} from "./components/BottomRail";

import {
  HistoryDrawer,
} from "./components/HistoryDrawer";

import {
  Modal,
} from "./components/Modal";

import {
  SessionHUD,
} from "./components/SessionHUD";

import {
  Toast,
} from "./components/Toast";

import {
  useRubberDuck,
} from "./hooks/useRubberDuck";

import {
  LandingScreen,
} from "./screens/LandingScreen";

import {
  SessionScreen,
} from "./screens/SessionScreen";

import {
  SetupScreen,
} from "./screens/SetupScreen";

import {
  SummaryScreen,
} from "./screens/SummaryScreen";

type View =
  | "landing"
  | "setup"
  | "session"
  | "summary";

export default function App() {
  const duck =
    useRubberDuck();

  const [
    view,
    setView,
  ] = useState<View>(
    "landing",
  );

  const [
    historyOpen,
    setHistoryOpen,
  ] = useState(false);

  const [
    aboutOpen,
    setAboutOpen,
  ] = useState(false);

  const latest =
    useMemo(
      () =>
        duck.sessions.find(
          (session) =>
            session.status !==
            "resolved",
        ),

      [
        duck.sessions,
      ],
    );

  const goHome = () => {
    if (
      duck.current &&
      duck.current.status ===
        "active"
    ) {
      duck.pause();
    }

    setView(
      "landing",
    );
  };

  const openSession = (
    id: string,
  ) => {
    const session =
      duck.sessions.find(
        (item) =>
          item.id === id,
      );

    duck.resume(
      id,
    );

    setHistoryOpen(
      false,
    );

    setView(
      session?.status ===
        "resolved"
        ? "summary"
        : "session",
    );
  };

  const stage =
    duck.current?.stage ??
    "define";

  return (
    <div
      className="
        min-h-screen
        bg-paper
        text-ink
      "
    >
      <AppHeader
        onHome={
          goHome
        }
        onThreads={() =>
          setHistoryOpen(
            true,
          )
        }
        onAbout={() =>
          setAboutOpen(
            true,
          )
        }
      />

      {duck.current &&
      (
        view === "session" ||
        view === "summary"
      ) ? (
        <SessionHUD
          session={
            duck.current
          }
        />
      ) : null}

      {duck.error ? (
        <Toast
          message={duck.error}
          onDismiss={() => duck.setError(null)}
        />
      ) : null}

      {view ===
      "landing" ? (
        <LandingScreen
          latest={
            latest
          }
          onStart={() =>
            setView(
              "setup",
            )
          }
          onResume={(
            id,
          ) =>
            openSession(
              id,
            )
          }
        />
      ) : null}

      {view ===
      "setup" ? (
        <SetupScreen
          busy={
            duck.busy
          }
          onSubmit={
            async (
              input,
            ) => {
              const result =
                await duck.start(
                  input,
                );

              if (
                result
              ) {
                setView(
                  "session",
                );
              }
            }
          }
        />
      ) : null}

      {view ===
        "session" &&
      duck.current ? (
        <SessionScreen
          session={
            duck.current
          }
          busy={
            duck.busy
          }
          onAnswer={
            async (
              text,
            ) => {
              const result =
                await duck.answer(
                  text,
                );

              if (
                result?.status ===
                "resolved"
              ) {
                setView(
                  "summary",
                );
              }

              return result;
            }
          }
          onHint={
            duck.hint
          }
          onExplain={
            duck.explain
          }
          onResolve={
            async (
              text,
            ) => {
              const result =
                await duck.resolve(
                  text,
                );

              if (
                result?.status ===
                "resolved"
              ) {
                setView(
                  "summary",
                );
              }

              return result;
            }
          }
          onPause={() => {
            duck.pause();

            setView(
              "landing",
            );
          }}
        />
      ) : null}

      {view ===
        "summary" &&
      duck.current ? (
        <SummaryScreen
          session={
            duck.current
          }
          onNew={() => {
            duck.setCurrentId(
              null,
            );

            setView(
              "setup",
            );
          }}
          onThreads={() =>
            setHistoryOpen(
              true,
            )
          }
        />
      ) : null}

      <HistoryDrawer
        open={
          historyOpen
        }
        sessions={
          duck.sessions
        }
        onClose={() =>
          setHistoryOpen(
            false,
          )
        }
        onOpen={
          openSession
        }
        onDelete={
          duck.remove
        }
      />

      <Modal
        open={
          aboutOpen
        }
        onClose={() =>
          setAboutOpen(
            false,
          )
        }
      >
        <p
          className="
            font-mono
            text-[9px]
            tracking-[0.17em]
            text-muted
          "
        >
          ABOUT RUBBER DUCK
        </p>

        <h2
          className="
            mt-4
            font-serif
            text-4xl
          "
        >
          ONE GOOD QUESTION
          AT A TIME.
        </h2>

        <div
          className="
            mt-6
            space-y-4
            font-serif
            text-lg
            leading-8
            text-graphite
          "
        >
          <p>
            Rubber Duck helps
            you define a problem,
            test assumptions,
            collect evidence,
            and reach a useful
            next step without
            dumping an essay
            on you.
          </p>

          <p>
            Your session history
            is stored in this
            browser. Content
            needed for AI
            reasoning is sent
            to the configured
            Gemini API.
          </p>
        </div>
      </Modal>

      <BottomRail
        stage={stage}
      />
    </div>
  );
}
