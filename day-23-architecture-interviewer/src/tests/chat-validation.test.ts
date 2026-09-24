import {
  describe,
  expect,
  it,
} from "vitest";

import {
  chatRequestSchema,
} from "@/lib/validation/chat";

describe(
  "chat validation",
  () => {
    it(
      "rejects messages over 20,000 characters",
      () => {
        const result =
          chatRequestSchema.safeParse(
            {
              conversationId:
                null,

              requestId:
                crypto.randomUUID(),

              mode:
                "message",

              content:
                "a".repeat(
                  20_001,
                ),
            },
          );

        expect(
          result.success,
        ).toBe(false);
      },
    );
  },
);
