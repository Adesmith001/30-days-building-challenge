import { z } from "zod";

const category = z.enum([
  "now",
  "soon",
  "later",
  "ideas",
  "let_go",
]);

const kind = z.enum([
  "task",
  "idea",
  "thought",
]);

export const aiItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category,
  kind,
  reason: z.string(),
  metadata: z.string(),
  estimateMinutes: z.number().int(),
});

export const nextActionSchema = z.object({
  itemId: z.string(),
  title: z.string(),
  reason: z.string(),
});

export const untangleResultSchema = z.object({
  summary: z.string(),
  nextAction: nextActionSchema,
  items: z.array(aiItemSchema),
  safety: z.object({
    requiresSupport: z.boolean(),
    message: z.string(),
  }),
});

export const planResultSchema = z.object({
  intro: z.string(),
  steps: z.array(
    z.object({
      itemId: z.string(),
      title: z.string(),
      reason: z.string(),
      estimateMinutes: z.number().int(),
    }),
  ),
});

export const requestSchema = z.object({
  mode: z.enum([
    "untangle",
    "simplify",
    "plan",
    "important",
  ]),
  text: z.string().min(1).max(2000),
  items: z.array(aiItemSchema).max(50).optional(),
});

const itemProperties = {
  id: {
    type: "string",
  },
  title: {
    type: "string",
  },
  category: {
    type: "string",
    enum: [
      "now",
      "soon",
      "later",
      "ideas",
      "let_go",
    ],
  },
  kind: {
    type: "string",
    enum: ["task", "idea", "thought"],
  },
  reason: {
    type: "string",
  },
  metadata: {
    type: "string",
  },
  estimateMinutes: {
    type: "integer",
  },
} as const;

export const untangleJsonSchema = {
  type: "object",
  properties: {
    summary: {
      type: "string",
    },
    nextAction: {
      type: "object",
      properties: {
        itemId: {
          type: "string",
        },
        title: {
          type: "string",
        },
        reason: {
          type: "string",
        },
      },
      required: [
        "itemId",
        "title",
        "reason",
      ],
      additionalProperties: false,
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: itemProperties,
        required: [
          "id",
          "title",
          "category",
          "kind",
          "reason",
          "metadata",
          "estimateMinutes",
        ],
        additionalProperties: false,
      },
    },
    safety: {
      type: "object",
      properties: {
        requiresSupport: {
          type: "boolean",
        },
        message: {
          type: "string",
        },
      },
      required: [
        "requiresSupport",
        "message",
      ],
      additionalProperties: false,
    },
  },
  required: [
    "summary",
    "nextAction",
    "items",
    "safety",
  ],
  additionalProperties: false,
} as const;

export const nextActionJsonSchema = {
  type: "object",
  properties: {
    itemId: {
      type: "string",
    },
    title: {
      type: "string",
    },
    reason: {
      type: "string",
    },
  },
  required: [
    "itemId",
    "title",
    "reason",
  ],
  additionalProperties: false,
} as const;

export const planJsonSchema = {
  type: "object",
  properties: {
    intro: {
      type: "string",
    },
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          itemId: {
            type: "string",
          },
          title: {
            type: "string",
          },
          reason: {
            type: "string",
          },
          estimateMinutes: {
            type: "integer",
          },
        },
        required: [
          "itemId",
          "title",
          "reason",
          "estimateMinutes",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["intro", "steps"],
  additionalProperties: false,
} as const;