import "server-only";

import {
  z,
} from "zod";

import {
  getGroq,
} from "@/lib/ai/client";

import {
  getServerEnv,
} from "@/lib/env";

import type {
  ChatMessage,
} from "@/types/chat";

import type {
  InterviewState,
} from "@/types/interview";

const requiredHeadings = [
  "ARCHITECTURE SUMMARY",
  "REQUIREMENTS",
  "CORE COMPONENTS",
  "DATA FLOW",
  "DECISIONS",
  "TRADE-OFFS",
  "RISKS",
  "OPEN QUESTIONS",
  "FAILURE MODES",
  "OPERATIONS",
  "NEXT DECISIONS",
];

export const reviewMarkdownSchema =
  z.string()
    .min(400)
    .refine(
      (value) =>
        requiredHeadings.every(
          (heading) =>
            value
              .toUpperCase()
              .includes(
                heading,
              ),
        ),

      "Review is missing required sections.",
    );

interface Input {
  state: InterviewState;
  summary?: string | null;
  messages: ChatMessage[];
}

export async function generateFinalReview({
  state,
  summary,
  messages,
}: Input) {
  const groq =
    getGroq();

  const env =
    getServerEnv();

  const recent =
    messages
      .slice(-20)
      .map(
        (message) =>
          `${
            message.role.toUpperCase()
          }: ${message.content}`,
      )
      .join("\n\n");

  const result =
    await groq.chat.completions.create({
      model:
        env.AI_MODEL,

      temperature: 0.2,

      max_completion_tokens:
        2600,

      messages: [
        {
          role: "system",

          content: `
Write a concise architecture review.

Use EXACTLY these major sections:

# ARCHITECTURE REVIEW

## ARCHITECTURE SUMMARY

## REQUIREMENTS

## CORE COMPONENTS

## DATA FLOW

## DECISIONS

## TRADE-OFFS

## RISKS

## OPEN QUESTIONS

## FAILURE MODES

## OPERATIONS

## NEXT DECISIONS

Rules:

- Synthesize. Do not simply replay the chat.
- Clearly distinguish confirmed facts from assumptions.
- Explicitly acknowledge uncertainty.
- Do not assign a score.
- Do not assign a grade.
- Do not claim production readiness.
- Do not invent architecture components.
- Preserve important trade-offs.
- Keep the review useful enough to paste into engineering notes.
          `.trim(),
        },

        {
          role: "user",

          content: `
STRUCTURED STATE

${JSON.stringify(
  state,
  null,
  2,
)}

ROLLING SUMMARY

${summary || "None"}

RECENT CONVERSATION

${recent}
          `.trim(),
        },
      ],
    });

  const markdown =
    result.choices[0]
      ?.message
      ?.content
      ?.trim();

  if (!markdown) {
    throw new Error(
      "Review generation failed.",
    );
  }

  return reviewMarkdownSchema.parse(
    markdown,
  );
}
