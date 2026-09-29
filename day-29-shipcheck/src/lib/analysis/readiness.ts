import type {
  ReleaseGate,
  ReleaseState,
} from "@/types/release";

export function deriveReleaseState(
  gates: ReleaseGate[],
): ReleaseState {
  const required = gates.filter((gate) => gate.required);

  if (
    required.some(
      (gate) =>
        gate.status === "fail" ||
        gate.status === "blocked",
    )
  ) {
    return "BLOCKED";
  }

  if (
    required.some((gate) => gate.status === "pending")
  ) {
    return "NEEDS_REVIEW";
  }

  if (
    required.some((gate) => gate.status === "waived")
  ) {
    return "READY_WITH_WAIVERS";
  }

  return "READY_TO_SHIP";
}

export function satisfiedGateCount(
  gates: ReleaseGate[],
) {
  const required = gates.filter((gate) => gate.required);

  return {
    satisfied: required.filter((gate) =>
      ["pass", "waived"].includes(gate.status),
    ).length,
    total: required.length,
  };
}