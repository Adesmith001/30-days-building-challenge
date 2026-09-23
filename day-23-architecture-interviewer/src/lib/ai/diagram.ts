import "server-only";

import {
  getGroq,
} from "@/lib/ai/client";

import {
  getServerEnv,
} from "@/lib/env";

import type {
  InterviewState,
} from "@/types/interview";

export async function generateArchitectureDiagram(
  state: InterviewState,
  summary: string | null,
) {
  const groq =
    getGroq();

  const env =
    getServerEnv();

  const result =
    await groq.chat.completions.create({
      model:
        env.AI_MODEL,

      temperature: 0.15,

      max_completion_tokens:
        1200,

      messages: [
        {
          role: "system",

          content: `
Generate Mermaid flowchart syntax for the architecture.

Rules:
- Reflect ONLY components actually present in the supplied state.
- Never invent queues, caches, services, regions or databases.
- Suggested components must not appear.
- Prefer flowchart TD.
- Use simple labels.
- Do not use custom styling.
- Do not use HTML.
- Output Mermaid syntax only.
- Do not include markdown code fences.
          `.trim(),
        },

        {
          role: "user",

          content: `
ARCHITECTURE STATE

${JSON.stringify(
  state,
  null,
  2,
)}

SUMMARY

${summary || "None"}
          `.trim(),
        },
      ],
    });

  const mermaid =
    result.choices[0]
      ?.message
      ?.content
      ?.trim();

  if (
    !mermaid ||
    !/^(flowchart|graph)\s/i.test(
      mermaid,
    )
  ) {
    throw new Error(
      "Invalid diagram output.",
    );
  }

  return mermaid;
}
