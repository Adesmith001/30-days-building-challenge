import {
  DuckResponseSchema,
  type DuckRequest,
  type DuckResponse,
} from "../schemas/ai.js";

type ResponseContext = Pick<
  DuckRequest,
  "action"
> & {
  state: Pick<
    DuckRequest["state"],
    "stage" | "clarity"
  >;
  currentQuestion: string;
};

export function coerceDuckResponse(
  raw: unknown,
  context: ResponseContext,
): DuckResponse {
  const partial =
    DuckResponseSchema
      .partial()
      .safeParse(raw);

  const value = partial.success
    ? partial.data
    : {};

  const question =
    value.question ??
    fallbackQuestion(context);

  return {
    kind: value.kind ?? "question",
    stage: value.stage ?? context.state.stage,
    clarity: clampClarity(
      value.clarity ?? context.state.clarity,
    ),
    question,
    questionType:
      value.questionType ?? "clarify",
    note: value.note ?? null,
    hint: value.hint ?? null,
    explanation: value.explanation ?? null,
    insight: value.insight ?? null,
    assumptions: value.assumptions ?? [],
    evidence: value.evidence ?? [],
    tryThis: value.tryThis ?? null,
    summary:
      value.summary ??
      "The problem is becoming clearer.",
    resolution: value.resolution ?? null,
  };
}

function fallbackQuestion(
  context: ResponseContext,
) {
  if (context.action === "start") {
    return "What specific situation or decision are you facing right now?";
  }

  return context.currentQuestion ||
    "What part of this feels most important to examine next?";
}

function clampClarity(value: number) {
  return Math.max(
    0,
    Math.min(100, Math.round(value)),
  );
}
