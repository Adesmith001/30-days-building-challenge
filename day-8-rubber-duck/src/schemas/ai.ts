import { z } from "zod";

export const QuestionTypeSchema = z.enum([
  "clarify",
  "assumption",
  "evidence",
  "comparison",
  "priority",
  "cause",
  "consequence",
  "constraint",
  "test",
  "reflection",
]);

export const ReasoningStageSchema = z.enum([
  "define",
  "narrow",
  "question",
  "test",
  "resolve",
]);

export const DuckResponseSchema = z.object({
  kind: z.enum([
    "question",
    "hint",
    "explanation",
    "resolution",
  ]),

  stage: ReasoningStageSchema,

  clarity: z
    .number()
    .int()
    .min(0)
    .max(100),

  question: z
    .string()
    .nullable(),

  questionType: QuestionTypeSchema
    .nullable(),

  note: z
    .string()
    .nullable(),

  hint: z
    .object({
      level: z
        .number()
        .int()
        .min(1)
        .max(3),

      text: z.string(),
    })
    .nullable(),

  explanation: z
    .string()
    .nullable(),

  insight: z
    .string()
    .nullable(),

  assumptions: z.array(
    z.string(),
  ),

  evidence: z.array(
    z.string(),
  ),

  tryThis: z
    .string()
    .nullable(),

  summary: z.string(),

  resolution: z
    .object({
      status: z.enum([
        "resolved",
        "almost",
        "needs-evidence",
      ]),

      conclusion: z
        .string()
        .nullable(),

      remainingQuestion: z
        .string()
        .nullable(),

      reasoningMap: z.array(
        z.object({
          label: z.string(),
          text: z.string(),
        }),
      ),
    })
    .nullable(),
});

const RecentTurnSchema = z.object({
  question: z
    .string()
    .max(1200),

  answer: z
    .string()
    .max(8000),

  type: QuestionTypeSchema,
});

export const DuckRequestSchema = z.object({
  action: z.enum([
    "start",
    "answer",
    "hint",
    "explain",
    "resolve",
  ]),

  problem: z.object({
    mode: z
      .string()
      .max(80),

    text: z
      .string()
      .min(1)
      .max(12000),

    tried: z
      .string()
      .max(6000),

    outcome: z
      .string()
      .max(6000),
  }),

  state: z.object({
    stage: ReasoningStageSchema,

    clarity: z
      .number()
      .int()
      .min(0)
      .max(100),

    summary: z
      .string()
      .max(8000),

    insights: z
      .array(
        z.string().max(1000),
      )
      .max(20),

    assumptions: z
      .array(
        z.string().max(1000),
      )
      .max(20),

    evidence: z
      .array(
        z.string().max(1000),
      )
      .max(20),

    recentTurns: z
      .array(RecentTurnSchema)
      .max(6),
  }),

  currentQuestion: z
    .string()
    .max(1200),

  userText: z
    .string()
    .max(12000),

  hintLevel: z
    .number()
    .int()
    .min(0)
    .max(3),
});

export const duckResponseJsonSchema = {
  type: "object",

  additionalProperties: false,

  properties: {
    kind: {
      type: "string",
      enum: [
        "question",
        "hint",
        "explanation",
        "resolution",
      ],
    },

    stage: {
      type: "string",
      enum: [
        "define",
        "narrow",
        "question",
        "test",
        "resolve",
      ],
    },

    clarity: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },

    question: {
      anyOf: [
        { type: "string" },
        { type: "null" },
      ],
    },

    questionType: {
      anyOf: [
        {
          type: "string",

          enum: [
            "clarify",
            "assumption",
            "evidence",
            "comparison",
            "priority",
            "cause",
            "consequence",
            "constraint",
            "test",
            "reflection",
          ],
        },

        {
          type: "null",
        },
      ],
    },

    note: {
      anyOf: [
        { type: "string" },
        { type: "null" },
      ],
    },

    hint: {
      anyOf: [
        {
          type: "object",

          additionalProperties: false,

          properties: {
            level: {
              type: "integer",
              minimum: 1,
              maximum: 3,
            },

            text: {
              type: "string",
            },
          },

          required: [
            "level",
            "text",
          ],
        },

        {
          type: "null",
        },
      ],
    },

    explanation: {
      anyOf: [
        { type: "string" },
        { type: "null" },
      ],
    },

    insight: {
      anyOf: [
        { type: "string" },
        { type: "null" },
      ],
    },

    assumptions: {
      type: "array",

      items: {
        type: "string",
      },
    },

    evidence: {
      type: "array",

      items: {
        type: "string",
      },
    },

    tryThis: {
      anyOf: [
        { type: "string" },
        { type: "null" },
      ],
    },

    summary: {
      type: "string",
    },

    resolution: {
      anyOf: [
        {
          type: "object",

          additionalProperties: false,

          properties: {
            status: {
              type: "string",

              enum: [
                "resolved",
                "almost",
                "needs-evidence",
              ],
            },

            conclusion: {
              anyOf: [
                { type: "string" },
                { type: "null" },
              ],
            },

            remainingQuestion: {
              anyOf: [
                { type: "string" },
                { type: "null" },
              ],
            },

            reasoningMap: {
              type: "array",

              items: {
                type: "object",

                additionalProperties: false,

                properties: {
                  label: {
                    type: "string",
                  },

                  text: {
                    type: "string",
                  },
                },

                required: [
                  "label",
                  "text",
                ],
              },
            },
          },

          required: [
            "status",
            "conclusion",
            "remainingQuestion",
            "reasoningMap",
          ],
        },

        {
          type: "null",
        },
      ],
    },
  },

  required: [
    "kind",
    "stage",
    "clarity",
    "question",
    "questionType",
    "note",
    "hint",
    "explanation",
    "insight",
    "assumptions",
    "evidence",
    "tryThis",
    "summary",
    "resolution",
  ],
} as const;

export type DuckRequest =
  z.infer<typeof DuckRequestSchema>;

export type DuckResponse =
  z.infer<typeof DuckResponseSchema>;

export type QuestionType =
  z.infer<typeof QuestionTypeSchema>;

export type ReasoningStage =
  z.infer<typeof ReasoningStageSchema>;