import type {
  ChangedFile,
  CiCheck,
  ReleaseSession,
  ReleaseSource,
} from "@/types/release";
import { runDetectors, detectEnvironmentKeys } from "./detectors";
import { generateGates } from "./gates";

interface AnalyzeInput {
  id: string;
  title: string;
  repository: string;
  source: ReleaseSource;
  files: ChangedFile[];
  ci?: CiCheck[];
  baseSha?: string;
  headSha?: string;
}

export function analyzeRelease(
  input: AnalyzeInput,
): ReleaseSession {
  const ci = input.ci ?? [];
  const findings = runDetectors(input.files);
  const gates = generateGates(input.files, findings, ci);
  const now = new Date().toISOString();

  return {
    id: input.id,
    title: input.title,
    repository: input.repository,
    source: input.source,
    baseSha: input.baseSha,
    headSha: input.headSha,
    latestHeadSha: input.headSha,
    outdated: false,
    createdAt: now,
    updatedAt: now,
    changedFiles: input.files,
    findings,
    gates,
    ci,
    environments: detectEnvironmentKeys(input.files).map(
      (key) => ({
        key,
        local: "confirmed",
        preview: "missing",
        production: "not_verified",
      }),
    ),
    rollout: {
      strategy: "feature-flag",
      initialExposure: "5%",
      stages: "25% → 50% → 100%",
      stopConditions: "",
      owner: "",
    },
    rollback: {
      strategy: "rollback",
      reversibleSurface: "",
      recoveryApproach: "",
      dataConsiderations: "",
      trigger: "",
    },
    previewUrl: "",
    smokeChecks: [
      check("/"),
      check("/login"),
      check("/api/health"),
      check("/checkout"),
    ],
    verification: [
      verify("health", "HEALTH ENDPOINT RESPONDS"),
      verify("checkout", "CHECKOUT FLOW HEALTHY"),
      verify("auth", "AUTH FLOW HEALTHY"),
      verify("migration", "MIGRATION VERIFIED"),
      verify("observability", "ERROR RATE NORMAL"),
    ],
  };
}

function check(path: string) {
  return {
    id: `smoke-${path.replace(/\W+/g, "-") || "root"}`,
    path,
    expectedStatus: 200,
    status: "pending" as const,
  };
}

function verify(id: string, title: string) {
  return {
    id,
    title,
    status: "pending" as const,
  };
}