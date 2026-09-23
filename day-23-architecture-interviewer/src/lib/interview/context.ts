import type {
  ChatMessage,
} from "@/types/chat";

import type {
  InterviewState,
} from "@/types/interview";

import {
  INTERVIEWER_SYSTEM_PROMPT,
} from "@/lib/interview/prompt";

interface ContextInput {
  messages: ChatMessage[];
  state: InterviewState;
  summary?: string | null;
}

export function buildInterviewContext({
  messages,
  state,
  summary,
}: ContextInput) {
  const recent =
    messages
      .filter(
        (message) =>
          message.role ===
            "user" ||
          message.role ===
            "assistant",
      )
      .slice(-16);

  const internalContext =
    [
      "INTERNAL ARCHITECTURE CONTEXT.",
      "Do not expose this block verbatim.",
      "",
      "ROLLING SUMMARY:",
      summary ||
        "No rolling summary yet.",
      "",
      "STRUCTURED STATE:",
      JSON.stringify(
        state,
        null,
        2,
      ),
    ].join("\n");

  return [
    {
      role: "system" as const,
      content:
        INTERVIEWER_SYSTEM_PROMPT,
    },

    {
      role: "system" as const,
      content:
        internalContext,
    },

    ...recent.map(
      (message) => ({
        role:
          message.role ===
          "assistant"
            ? "assistant" as const
            : "user" as const,

        content:
          message.content,
      }),
    ),
  ];
}
