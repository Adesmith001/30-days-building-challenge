import { z } from "zod";

import {
  interviewStages,
} from "@/types/interview";

export const stateExtractionSchema =
  z.object({
    stage:
      z.enum(interviewStages),

    systemName:
      z.string().nullable(),

    problemStatement:
      z.string().nullable(),

    functionalRequirements:
      z.array(z.string()),

    nonFunctionalRequirements:
      z.array(z.string()),

    constraints:
      z.array(z.string()),

    unresolvedQuestions:
      z.array(z.string()),

    discussedTopics:
      z.array(z.string()),

    assumptions:
      z.array(
        z.object({
          statement:
            z.string(),

          status:
            z.enum([
              "unverified",
              "confirmed",
              "unresolved",
              "rejected",
            ]),

          evidence:
            z.string().nullable(),
        }),
      ),

    decisions:
      z.array(
        z.object({
          decision:
            z.string(),

          reason:
            z.string().nullable(),

          tradeoff:
            z.string().nullable(),

          status:
            z.enum([
              "current",
              "reconsidering",
              "replaced",
            ]),
        }),
      ),

    risks:
      z.array(
        z.object({
          title:
            z.string(),

          description:
            z.string(),

          severity:
            z.enum([
              "low",
              "medium",
              "high",
            ]),

          resolved:
            z.boolean(),
        }),
      ),

    contradictions:
      z.array(
        z.object({
          earlierStatement:
            z.string(),

          laterStatement:
            z.string(),

          question:
            z.string(),

          resolved:
            z.boolean(),
        }),
      ),

    scale:
      z.object({
        dailyUsers:
          z.number().nullable(),

        concurrentUsers:
          z.number().nullable(),

        averageRps:
          z.number().nullable(),

        peakRps:
          z.number().nullable(),

        readWriteRatio:
          z.string().nullable(),

        geographicScope:
          z.string().nullable(),
      }),

    shouldOfferSummary:
      z.boolean(),
  });

export type StateExtraction =
  z.infer<
    typeof stateExtractionSchema
  >;

export const extractionJsonSchema = {
  type: "object",

  additionalProperties: false,

  properties: {
    stage: {
      type: "string",
      enum: interviewStages,
    },

    systemName: {
      type: [
        "string",
        "null",
      ],
    },

    problemStatement: {
      type: [
        "string",
        "null",
      ],
    },

    functionalRequirements: {
      type: "array",
      items: {
        type: "string",
      },
    },

    nonFunctionalRequirements: {
      type: "array",
      items: {
        type: "string",
      },
    },

    constraints: {
      type: "array",
      items: {
        type: "string",
      },
    },

    unresolvedQuestions: {
      type: "array",
      items: {
        type: "string",
      },
    },

    discussedTopics: {
      type: "array",
      items: {
        type: "string",
      },
    },

    assumptions: {
      type: "array",

      items: {
        type: "object",

        additionalProperties:
          false,

        properties: {
          statement: {
            type: "string",
          },

          status: {
            type: "string",

            enum: [
              "unverified",
              "confirmed",
              "unresolved",
              "rejected",
            ],
          },

          evidence: {
            type: [
              "string",
              "null",
            ],
          },
        },

        required: [
          "statement",
          "status",
          "evidence",
        ],
      },
    },

    decisions: {
      type: "array",

      items: {
        type: "object",

        additionalProperties:
          false,

        properties: {
          decision: {
            type: "string",
          },

          reason: {
            type: [
              "string",
              "null",
            ],
          },

          tradeoff: {
            type: [
              "string",
              "null",
            ],
          },

          status: {
            type: "string",

            enum: [
              "current",
              "reconsidering",
              "replaced",
            ],
          },
        },

        required: [
          "decision",
          "reason",
          "tradeoff",
          "status",
        ],
      },
    },

    risks: {
      type: "array",

      items: {
        type: "object",

        additionalProperties:
          false,

        properties: {
          title: {
            type: "string",
          },

          description: {
            type: "string",
          },

          severity: {
            type: "string",

            enum: [
              "low",
              "medium",
              "high",
            ],
          },

          resolved: {
            type: "boolean",
          },
        },

        required: [
          "title",
          "description",
          "severity",
          "resolved",
        ],
      },
    },

    contradictions: {
      type: "array",

      items: {
        type: "object",

        additionalProperties:
          false,

        properties: {
          earlierStatement: {
            type: "string",
          },

          laterStatement: {
            type: "string",
          },

          question: {
            type: "string",
          },

          resolved: {
            type: "boolean",
          },
        },

        required: [
          "earlierStatement",
          "laterStatement",
          "question",
          "resolved",
        ],
      },
    },

    scale: {
      type: "object",

      additionalProperties:
        false,

      properties: {
        dailyUsers: {
          type: [
            "number",
            "null",
          ],
        },

        concurrentUsers: {
          type: [
            "number",
            "null",
          ],
        },

        averageRps: {
          type: [
            "number",
            "null",
          ],
        },

        peakRps: {
          type: [
            "number",
            "null",
          ],
        },

        readWriteRatio: {
          type: [
            "string",
            "null",
          ],
        },

        geographicScope: {
          type: [
            "string",
            "null",
          ],
        },
      },

      required: [
        "dailyUsers",
        "concurrentUsers",
        "averageRps",
        "peakRps",
        "readWriteRatio",
        "geographicScope",
      ],
    },

    shouldOfferSummary: {
      type: "boolean",
    },
  },

  required: [
    "stage",
    "systemName",
    "problemStatement",
    "functionalRequirements",
    "nonFunctionalRequirements",
    "constraints",
    "unresolvedQuestions",
    "discussedTopics",
    "assumptions",
    "decisions",
    "risks",
    "contradictions",
    "scale",
    "shouldOfferSummary",
  ],
} as const;
