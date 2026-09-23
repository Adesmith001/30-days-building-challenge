import "server-only";

import {
  getGroq,
} from "@/lib/ai/client";

import {
  getServerEnv,
} from "@/lib/env";

export function fallbackTitle(
  content: string,
) {
  const words =
    content
      .replace(/[^\w\s-]/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 6);

  const title =
    words.join(" ");

  return (
    title ||
    "Architecture Interview"
  ).slice(0, 60);
}

export async function generateConversationTitle(
  firstMessage: string,
) {
  try {
    const groq =
      getGroq();

    const env =
      getServerEnv();

    const result =
      await groq.chat.completions.create({
        model:
          env.AI_STRUCTURED_MODEL,

        temperature: 0.2,

        max_completion_tokens:
          30,

        messages: [
          {
            role: "system",

            content: `
Generate a concise title for a software architecture conversation.

Rules:
- 2 to 6 words.
- No quotes.
- No punctuation at the end.
- Describe the system or architecture topic.
            `.trim(),
          },

          {
            role: "user",
            content:
              firstMessage,
          },
        ],
      });

    const title =
      result.choices[0]
        ?.message
        ?.content
        ?.trim()
        .replace(
          /^["']|["']$/g,
          "",
        );

    return (
      title ||
      fallbackTitle(
        firstMessage,
      )
    ).slice(0, 60);
  } catch {
    return fallbackTitle(
      firstMessage,
    );
  }
}
