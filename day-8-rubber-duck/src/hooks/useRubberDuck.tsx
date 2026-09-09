import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  askDuck,
} from "../lib/api";

import {
  createUserMessage,
  sessionMessages,
} from "../lib/chat";

import {
  applyAIResponse,
  createSession,
} from "../lib/session";

import {
  loadSessions,
  saveSessions,
} from "../lib/storage";

import type {
  DuckRequest,
} from "../schemas/ai";

import type {
  DuckSession,
  ProblemMode,
} from "../schemas/session";

export function useRubberDuck() {
  const [
    sessions,
    setSessions,
  ] = useState<DuckSession[]>(
    () => loadSessions(),
  );

  const [
    currentId,
    setCurrentId,
  ] = useState<
    string | null
  >(null);

  const [
    busy,
    setBusy,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const current =
    useMemo(
      () =>
        sessions.find(
          (session) =>
            session.id ===
            currentId,
        ) ?? null,

      [
        sessions,
        currentId,
      ],
    );

  useEffect(
    () =>
      saveSessions(
        sessions,
      ),

    [sessions],
  );

  const replace = (
    next: DuckSession,
  ) => {
    setSessions(
      (all) => [
        next,

        ...all.filter(
          (item) =>
            item.id !==
            next.id,
        ),
      ],
    );
  };

  const run = async (
    session: DuckSession,
    payload: DuckRequest,
  ) => {
    setBusy(true);
    setError(null);

    try {
      const response =
        await askDuck(
          payload,
        );

      const next =
        applyAIResponse(
          session,
          response,
        );

      replace(next);

      return next;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );

      return null;
    } finally {
      setBusy(false);
    }
  };

  const start = async (
    input: {
      problem: string;
      tried: string;
      outcome: string;
      mode: ProblemMode;
    },
  ) => {
    const session =
      createSession(
        input,
      );

    setCurrentId(
      session.id,
    );

    replace(
      session,
    );

    const result =
      await run(
        session,

        makePayload(
          session,
          "start",
        ),
      );

    if (!result) {
      setSessions(
        (all) =>
          all.filter(
            (item) =>
              item.id !==
              session.id,
          ),
      );

      setCurrentId(
        null,
      );
    }

    return result;
  };

  const answer =
    async (
      text: string,
    ) => {
      if (
        !current
          ?.currentQuestion ||
        !text.trim()
      ) {
        return null;
      }

      const turn = {
        id:
          crypto.randomUUID(),

        question:
          current
            .currentQuestion
            .text,

        type:
          current
            .currentQuestion
            .type,

        answer:
          text.trim(),

        note:
          current
            .progressNote,

        createdAt:
          Date.now(),
      };

      const withTurn:
        DuckSession = {
        ...current,

        messages: [
          ...(current.messages ??
            sessionMessages(current)),
          createUserMessage(
            text,
          ),
        ],

        turns: [
          ...current.turns,
          turn,
        ],

        activeHint:
          undefined,

        directExplanation:
          undefined,

        updatedAt:
          Date.now(),
      };

      replace(withTurn);

      return run(
        withTurn,

        makePayload(
          withTurn,
          "answer",
          text,
        ),
      );
    };

  const hint =
    async () => {
      if (
        !current
          ?.currentQuestion ||
        current.hintLevel >= 3
      ) {
        return null;
      }

      const level =
        current.hintLevel + 1;

      return run(
        current,

        makePayload(
          current,
          "hint",
          "",
          level,
        ),
      );
    };

  const explain =
    async () => {
      if (!current) {
        return null;
      }

      return run(
        current,

        makePayload(
          current,
          "explain",
        ),
      );
    };

  const resolve =
    async (
      text: string,
    ) => {
      if (
        !current ||
        !text.trim()
      ) {
        return null;
      }

      const withAnswer: DuckSession = {
        ...current,
        messages: [
          ...(current.messages ??
            sessionMessages(current)),
          createUserMessage(text),
        ],
      };

      replace(withAnswer);

      return run(
        withAnswer,

        makePayload(
          current,
          "resolve",
          text,
        ),
      );
    };

  const pause = () => {
    if (!current) {
      return;
    }

    replace({
      ...current,

      status:
        "paused",

      updatedAt:
        Date.now(),
    });

    setCurrentId(
      null,
    );
  };

  const resume = (
    id: string,
  ) => {
    const session =
      sessions.find(
        (item) =>
          item.id === id,
      );

    if (!session) {
      return;
    }

    const next =
      session.status ===
      "resolved"
        ? session
        : {
            ...session,

            status:
              "active" as const,
          };

    replace(next);

    setCurrentId(
      id,
    );

    setError(null);
  };

  const remove = (
    id: string,
  ) => {
    setSessions(
      (all) =>
        all.filter(
          (item) =>
            item.id !== id,
        ),
    );

    if (
      currentId === id
    ) {
      setCurrentId(
        null,
      );
    }
  };

  return {
    sessions,
    current,
    busy,
    error,

    setError,

    start,
    answer,
    hint,
    explain,
    resolve,
    pause,
    resume,
    remove,

    setCurrentId,
  };
}

function makePayload(
  session: DuckSession,

  action:
    DuckRequest["action"],

  userText = "",

  hintLevel =
    session.hintLevel,
): DuckRequest {
  return {
    action,

    problem: {
      mode:
        session.mode,

      text:
        session.problem,

      tried:
        session.tried,

      outcome:
        session.outcome,
    },

    state: {
      stage:
        session.stage,

      clarity:
        session.clarity,

      summary:
        session
          .reasoningSummary,

      insights:
        session.insights,

      assumptions:
        session.assumptions,

      evidence:
        session.evidence,

      recentTurns:
        session.turns
          .slice(-6)
          .map(
            ({
              question,
              answer,
              type,
            }) => ({
              question,
              answer,
              type,
            }),
          ),
    },

    currentQuestion:
      session
        .currentQuestion
        ?.text ?? "",

    userText,

    hintLevel,
  };
}
