import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createInitialInterviewState,
} from "@/lib/interview/state";

import {
  mergeInterviewState,
} from "@/lib/interview/merge-state";

describe(
  "mergeInterviewState",
  () => {
    it(
      "keeps existing requirements and adds new ones",
      () => {
        const current =
          createInitialInterviewState();

        current.functionalRequirements = [
          "Users can edit documents",
        ];

        const result =
          mergeInterviewState(
            current,
            {
              stage:
                "define_constraints",

              systemName:
                null,

              problemStatement:
                null,

              functionalRequirements: [
                "Users can collaborate in real time",
              ],

              nonFunctionalRequirements:
                [],

              constraints:
                [],

              unresolvedQuestions:
                [],

              discussedTopics:
                [],

              assumptions:
                [],

              decisions:
                [],

              risks:
                [],

              contradictions:
                [],

              scale: {
                dailyUsers:
                  null,

                concurrentUsers:
                  null,

                averageRps:
                  null,

                peakRps:
                  null,

                readWriteRatio:
                  null,

                geographicScope:
                  null,
              },

              shouldOfferSummary:
                false,
            },
          );

        expect(
          result.functionalRequirements,
        ).toContain(
          "Users can edit documents",
        );

        expect(
          result.functionalRequirements,
        ).toContain(
          "Users can collaborate in real time",
        );
      },
    );
  },
);
