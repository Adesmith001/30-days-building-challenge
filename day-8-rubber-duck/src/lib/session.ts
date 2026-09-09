import type {
  DuckResponse,
} from "../schemas/ai";

import type {
  DuckSession,
  ProblemMode,
} from "../schemas/session";

import {
  sessionMessages,
  responseMessage,
} from "./chat";

export function createSession(
  input: {
    problem: string;
    tried: string;
    outcome: string;
    mode: ProblemMode;
  },
): DuckSession {
  const now =
    Date.now();

  return {
    id:
      crypto.randomUUID(),

    title:
      makeTitle(input.problem),

    mode:
      input.mode,

    problem:
      input.problem.trim(),

    tried:
      input.tried.trim(),

    outcome:
      input.outcome.trim(),

    status:
      "active",

    createdAt:
      now,

    updatedAt:
      now,

    stage:
      "define",

    clarity:
      20,

    questionCount:
      0,

    hintLevel:
      0,

    reasoningSummary:
      "",

    messages: [
      {
        id: "problem",
        role: "user",
        content: input.problem.trim(),
        createdAt: now,
      },
    ],

    turns:
      [],

    insights:
      [],

    assumptions:
      [],

    evidence:
      [],

    reasoningMap:
      [],
  };
}

export function applyAIResponse(
  session: DuckSession,
  data: DuckResponse,
): DuckSession {
  const resolutionQuestion =
    data.resolution
      ?.remainingQuestion;

  const question =
    data.question &&
    data.questionType
      ? {
          text:
            data.question,

          type:
            data.questionType,
        }
      : resolutionQuestion
        ? {
            text:
              resolutionQuestion,

            type:
              "reflection" as const,
          }
        : session.currentQuestion;

  const assistantMessage =
    responseMessage(data);

  return {
    ...session,

    stage:
      data.stage,

    previousClarity:
      session.clarity,

    clarity:
      Math.max(
        0,

        Math.min(
          100,
          data.clarity,
        ),
      ),

    currentQuestion:
      question,

    questionCount:
      (
        data.kind === "question" &&
        data.question
      ) ||
      resolutionQuestion
        ? session.questionCount + 1
        : session.questionCount,

    progressNote:
      data.note ??
      undefined,

    activeHint:
      data.hint?.text ??
      (
        data.kind === "hint"
          ? session.activeHint
          : undefined
      ),

    hintLevel:
      data.hint?.level ??
      (
        data.kind === "question"
          ? 0
          : session.hintLevel
      ),

    reasoningSummary:
      data.summary,

    messages: assistantMessage
      ? [
          ...(session.messages ??
            sessionMessages(session)),
          assistantMessage,
        ]
      : session.messages ??
        sessionMessages(session),

    insights:
      mergeUnique(
        session.insights,

        data.insight
          ? [data.insight]
          : [],
      ),

    assumptions:
      mergeUnique(
        session.assumptions,
        data.assumptions,
      ),

    evidence:
      mergeUnique(
        session.evidence,
        data.evidence,
      ),

    tryThis:
      data.tryThis ??
      undefined,

    directExplanation:
      data.explanation ??
      session.directExplanation,

    resolutionStatus:
      data.resolution?.status ??
      session.resolutionStatus,

    conclusion:
      data.resolution
        ?.conclusion ??
      session.conclusion,

    reasoningMap:
      data.resolution
        ?.reasoningMap
        ?.length
        ? data.resolution
            .reasoningMap
        : session.reasoningMap,

    status:
      data.resolution
        ?.status === "resolved"
        ? "resolved"
        : session.status,

    updatedAt:
      Date.now(),
  };
}

function mergeUnique(
  current: string[],
  incoming: string[],
) {
  return [
    ...new Set([
      ...current,
      ...incoming,
    ]),
  ].slice(-20);
}

export function makeTitle(
  problem: string,
) {
  const compact =
    problem
      .replace(
        /\s+/g,
        " ",
      )
      .trim();

  const words =
    compact
      .split(" ")
      .slice(0, 9)
      .join(" ");

  return words.length <
    compact.length
    ? `${words}…`
    : words;
}

export function formatElapsed(
  start: number,
  end: number,
) {
  const total =
    Math.max(
      0,

      Math.floor(
        (end - start) /
          1000,
      ),
    );

  const minutes =
    Math.floor(
      total / 60,
    );

  const seconds =
    total % 60;

  return `${
    String(minutes)
      .padStart(
        2,
        "0",
      )
  }:${
    String(seconds)
      .padStart(
        2,
        "0",
      )
  }`;
}
