import {
  describe,
  expect,
  it,
} from "vitest";

import {
  reviewMarkdownSchema,
} from "@/lib/ai/review";

describe(
  "architecture review",
  () => {
    it(
      "requires every review section",
      () => {
        const review = `
# ARCHITECTURE REVIEW

## ARCHITECTURE SUMMARY
Summary text.

## REQUIREMENTS
Requirements.

## CORE COMPONENTS
Components.

## DATA FLOW
Flow.

## DECISIONS
Decisions.

## TRADE-OFFS
Tradeoffs.

## RISKS
Risks.

## OPEN QUESTIONS
Questions.

## FAILURE MODES
Failures.

## OPERATIONS
Operations.

## NEXT DECISIONS
Next decisions.

${"Detailed architecture context. ".repeat(
  20,
)}
        `;

        expect(
          reviewMarkdownSchema.safeParse(
            review,
          ).success,
        ).toBe(true);
      },
    );
  },
);
