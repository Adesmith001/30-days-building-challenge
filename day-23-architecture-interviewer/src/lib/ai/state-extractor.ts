import "server-only";

import {
  getGroq,
} from "@/lib/ai/client";

import {
  getServerEnv,
} from "@/lib/env";

import {
  extractionJsonSchema,
  stateExtractionSchema,
} from "@/lib/ai/schemas";

import type {
  InterviewState,
} from "@/types/interview";

export async function extractInterviewState(
  current: InterviewState,
  userMessage: string,
  assistantMessage: string,
) {
  const groq =
    getGroq();

  const env =
    getServerEnv();

  const result =
    await groq.chat.completions.create({
      model:
        env.AI_STRUCTURED_MODEL,

      temperature: 0,

      messages: [
        {
          role: "system",

          content: `
Extract architecture-interview state changes.

You are NOT the interviewer here.
You are a state extraction engine.

Use only information supported by:
- the prior structured state
- the latest user message
- the latest interviewer response

Do not invent requirements.

Capture contradictions only when there is a genuine conflict.
Capture technology decisions only when the user actually chose them.
Capture assumptions that remain implicit or unverified.

Return the requested JSON schema.
          `.trim(),
        },

        {
          role: "user",

          content: `
CURRENT STATE

${JSON.stringify(
  current,
  null,
  2,
)}

LATEST USER MESSAGE

${userMessage}

LATEST INTERVIEWER RESPONSE

${assistantMessage}
          `.trim(),
        },
      ],

      response_format: {
        type: "json_schema",

        json_schema: {
          name:
            "architecture_state_update",

          strict: true,

          schema:
            extractionJsonSchema,
        },
      },
    });

  const content =
    result.choices[0]
      ?.message
      ?.content;

  if (!content) {
    throw new Error(
      "State extraction returned no content.",
    );
  }

  return stateExtractionSchema.parse(
    JSON.parse(content),
  );
}
