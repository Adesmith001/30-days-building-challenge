import "server-only";

import {
  getGroq,
} from "@/lib/ai/client";

import {
  getServerEnv,
} from "@/lib/env";

interface AIMessage {
  role:
    | "system"
    | "user"
    | "assistant";

  content: string;
}

export async function streamInterviewResponse(
  messages: AIMessage[],
  signal?: AbortSignal,
) {
  const groq =
    getGroq();

  const env =
    getServerEnv();

  return groq.chat.completions.create(
    {
      model:
        env.AI_MODEL,

      messages,

      temperature: 0.45,

      max_completion_tokens:
        1800,

      stream: true,
    },
    {
      signal,
    },
  );
}
