import {
  describe,
  expect,
  it,
} from "vitest";

import {
  fallbackTitle,
} from "@/lib/ai/title";

describe(
  "fallbackTitle",
  () => {
    it(
      "uses a small meaningful prefix",
      () => {
        expect(
          fallbackTitle(
            "I'm building a real-time collaborative document editor for teams",
          ),
        ).toBe(
          "Im building a real-time collaborative document",
        );
      },
    );
  },
);
