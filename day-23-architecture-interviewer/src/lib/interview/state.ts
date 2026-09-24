import type { InterviewState } from "@/types/interview";

export function createInitialInterviewState(): InterviewState {
  return {
    stage: "understand",
    functionalRequirements: [],
    nonFunctionalRequirements: [],
    assumptions: [],
    decisions: [],
    unresolvedQuestions: [],
    risks: [],
    constraints: [],
    scale: {},
    discussedTopics: [],
    contradictions: [],
  };
}
