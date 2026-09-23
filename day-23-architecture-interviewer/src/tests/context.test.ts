import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildInterviewContext,
} from "@/lib/interview/context";

import {
  createInitialInterviewState,
} from "@/lib/interview/state";

import type {
  ChatMessage,
} from "@/types/chat";

describe(
  "buildInterviewContext",
  () => {
    it(
      "limits verbatim history to latest 16 messages",
      () => {
        const messages:
          ChatMessage[] =
          Array.from({
            length: 30,
          }).map(
            (_, index) => ({
              id:
                String(index),

              conversation_id:
                "conversation",

              user_id:
                "user",

              role:
                index % 2
                  ? "assistant"
                  : "user",

              content:
                `Message ${index}`,

              metadata: {},

              sequence_number:
                index + 1,

              created_at:
                new Date()
                  .toISOString(),
            }),
          );

        const context =
          buildInterviewContext({
            messages,

            state:
              createInitialInterviewState(),

            summary:
              "Older summary",
          });

        const conversationMessages =
          context.filter(
            (message) =>
              message.role !==
              "system",
          );

        expect(
          conversationMessages,
        ).toHaveLength(
          16,
        );

        expect(
          conversationMessages[0]
            .content,
        ).toBe(
          "Message 14",
        );
      },
    );
  },
);
