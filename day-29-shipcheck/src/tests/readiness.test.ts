import { describe, expect, it } from "vitest";
import { deriveReleaseState } from "@/lib/analysis/readiness";
import type { ReleaseGate } from "@/types/release";

function gate(
  id: string,
  status: ReleaseGate["status"],
): ReleaseGate {
  return {
    id,
    type: "human",
    category: "API",
    title: id,
    description: "",
    why: "",
    verify: [],
    required: true,
    status,
    evidence: [],
    sourceFindingIds: [],
  };
}

describe("release state", () => {
  it("is ready when all required gates pass", () => {
    expect(
      deriveReleaseState([
        gate("one", "pass"),
        gate("two", "pass"),
      ]),
    ).toBe("READY_TO_SHIP");
  });

  it("needs review when a required gate is pending", () => {
    expect(
      deriveReleaseState([
        gate("one", "pass"),
        gate("two", "pending"),
      ]),
    ).toBe("NEEDS_REVIEW");
  });

  it("is blocked when a gate fails", () => {
    expect(
      deriveReleaseState([
        gate("one", "pass"),
        gate("two", "fail"),
      ]),
    ).toBe("BLOCKED");
  });

  it("distinguishes waivers from passes", () => {
    expect(
      deriveReleaseState([
        gate("one", "pass"),
        gate("two", "waived"),
      ]),
    ).toBe("READY_WITH_WAIVERS");
  });
});