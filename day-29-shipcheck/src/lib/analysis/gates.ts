import type {
  CiCheck,
  Finding,
  ReleaseGate,
} from "@/types/release";
import { detectEnvironmentKeys } from "./detectors";
import type { ChangedFile } from "@/types/release";

function gate(
  data: Omit<ReleaseGate, "evidence">,
): ReleaseGate {
  return {
    ...data,
    evidence: [],
  };
}

export function generateGates(
  files: ChangedFile[],
  findings: Finding[],
  ci: CiCheck[],
): ReleaseGate[] {
  const gates: ReleaseGate[] = [];

  if (ci.length) {
    const required = ci.filter((check) => check.required);

    const status =
      required.some((check) => check.status === "fail")
        ? "fail"
        : required.some((check) => check.status === "pending")
          ? "pending"
          : "pass";

    gates.push(
      gate({
        id: "ci-required",
        type: "automated",
        category: "CI",
        title: "REQUIRED CI CHECKS PASS",
        description:
          "Required source-control checks must complete successfully.",
        why: "CI metadata was found for this change.",
        verify: [
          "Required checks completed",
          "No required check is failing",
        ],
        required: true,
        status,
        sourceFindingIds: [],
      }),
    );
  }

  const has = (id: string) =>
    findings.some((finding) => finding.id === id);

  if (has("database-change")) {
    gates.push(
      human(
        "migration-review",
        "DATABASE",
        "MIGRATION REVIEW",
        "A database migration or schema file changed.",
        [
          "Migration succeeds against the current schema",
          "Expected data remains valid",
        ],
        ["database-change"],
      ),
      human(
        "migration-compatibility",
        "DATABASE",
        "BACKWARD COMPATIBILITY REVIEW",
        "Application versions may overlap during deployment.",
        [
          "Old application version remains compatible",
          "New version can operate during rollout",
        ],
        ["database-change"],
      ),
      human(
        "postdeploy-data",
        "DATABASE",
        "POST-DEPLOY DATA CHECK DEFINED",
        "Database changes need an explicit verification step.",
        [
          "Define what data state is expected",
          "Define how it will be inspected",
        ],
        ["database-change"],
      ),
    );
  }

  for (const key of detectEnvironmentKeys(files)) {
    gates.push(
      human(
        `env-${slug(key)}`,
        "CONFIG",
        `${key} DEPLOYMENT ENVIRONMENT CONFIRMED`,
        `${key} is referenced by this release.`,
        [
          "Preview environment confirmed",
          "Production environment confirmed",
          "Do not store the secret value",
        ],
        ["environment-reference"],
      ),
    );
  }

  if (has("dependency-change")) {
    gates.push(
      human(
        "dependency-evidence",
        "DEPENDENCIES",
        "UPDATED DEPENDENCIES BUILD AND TEST",
        "A manifest or dependency lockfile changed.",
        [
          "Lockfile is expected",
          "Build succeeds",
          "Relevant test evidence exists",
        ],
        ["dependency-change"],
      ),
    );
  }

  if (has("auth-change")) {
    gates.push(
      human(
        "auth-unauthenticated",
        "AUTH",
        "UNAUTHENTICATED FLOW VERIFIED",
        "Authentication-related files changed.",
        ["Unauthenticated access behaves as expected"],
        ["auth-change"],
      ),
      human(
        "auth-authorized",
        "AUTH",
        "AUTHORIZED FLOW VERIFIED",
        "Authentication-related files changed.",
        ["Expected signed-in flow succeeds"],
        ["auth-change"],
      ),
      human(
        "auth-privileged",
        "AUTH",
        "PRIVILEGED FLOW VERIFIED",
        "Authorization-related code changed.",
        ["Privileged access remains correctly restricted"],
        ["auth-change"],
      ),
    );
  }

  if (has("payments-change")) {
    gates.push(
      human(
        "payment-success",
        "PAYMENTS",
        "SUCCESSFUL PAYMENT VERIFIED",
        "Payment code changed.",
        ["Successful payment path completed"],
        ["payments-change"],
      ),
      human(
        "payment-failure",
        "PAYMENTS",
        "FAILED PAYMENT VERIFIED",
        "Payment code changed.",
        ["Failure path produces the expected result"],
        ["payments-change"],
      ),
      human(
        "payment-webhook",
        "PAYMENTS",
        "WEBHOOK HANDLING VERIFIED",
        "Payment or webhook code changed.",
        ["Webhook is handled once", "Retry behavior is understood"],
        ["payments-change"],
      ),
    );
  }

  if (has("api-change")) {
    gates.push(
      human(
        "api-compatibility",
        "API",
        "API COMPATIBILITY REVIEW",
        "An API surface changed.",
        [
          "Consumers remain compatible",
          "Removed or altered contracts were reviewed",
        ],
        ["api-change"],
      ),
    );
  }

  if (has("infra-change")) {
    gates.push(
      human(
        "pipeline-review",
        "INFRA",
        "BUILD / DEPLOY PIPELINE REVIEWED",
        "Deployment configuration changed.",
        ["Deployment behavior has been reviewed"],
        ["infra-change"],
      ),
    );
  }

  const meaningfulRelease = findings.some((finding) =>
    ["DATABASE", "API", "AUTH", "PAYMENTS", "CONFIG"].includes(
      finding.category,
    ),
  );

  if (meaningfulRelease) {
    gates.push(
      human(
        "observability-plan",
        "OBSERVABILITY",
        "FAILURE SIGNAL DEFINED",
        "This release changes a critical application surface.",
        [
          "Metric, dashboard, log query or health signal identified",
        ],
        [],
      ),
      human(
        "rollout-plan",
        "ROLLOUT",
        "ROLLOUT PLAN DEFINED",
        "The release should have an explicit deployment strategy.",
        ["Deployment strategy selected", "Stop conditions documented"],
        [],
      ),
      human(
        "rollback-plan",
        "ROLLBACK",
        "ROLLBACK / FORWARD-FIX PLAN EXISTS",
        "A recovery path should exist before the release.",
        ["Recovery approach documented", "Trigger documented"],
        [],
      ),
      human(
        "preview-smoke",
        "PREVIEW",
        "PREVIEW SMOKE CHECKS PASS",
        "Critical routes should be checked before production.",
        ["Configured preview endpoints respond as expected"],
        [],
      ),
    );
  }

  return dedupe(gates);
}

function human(
  id: string,
  category: ReleaseGate["category"],
  title: string,
  why: string,
  verify: string[],
  sources: string[],
): ReleaseGate {
  return gate({
    id,
    type: "human",
    category,
    title,
    description: why,
    why,
    verify,
    required: true,
    status: "pending",
    sourceFindingIds: sources,
  });
}

function dedupe(gates: ReleaseGate[]) {
  return [...new Map(gates.map((item) => [item.id, item])).values()];
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}