import type { InterviewStage } from "@/types/interview";

export const stageLabels: Record<
  InterviewStage,
  string
> = {
  understand: "UNDERSTANDING REQUIREMENTS",
  define_constraints: "DEFINING CONSTRAINTS",
  estimate_scale: "ESTIMATING SCALE",
  define_data: "DEFINING DATA",
  define_core_flow: "CORE FLOW",
  challenge_components: "CHALLENGING COMPONENTS",
  failure_testing: "FAILURE MODES",
  security_operations: "SECURITY + OPERATIONS",
  tradeoff_review: "TRADE-OFF REVIEW",
  wrap_up: "WRAP-UP",
};
