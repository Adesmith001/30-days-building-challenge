import type { ReleaseSession } from "@/types/release";
import { deriveReleaseState } from "@/lib/analysis/readiness";

export function generateReleasePacket(
  session: ReleaseSession,
) {
  const areas = [
    ...new Set(
      session.changedFiles.flatMap((file) => file.areas),
    ),
  ];

  const lines = [
    `# ${session.title}`,
    "",
    `Repository: ${session.repository}`,
    session.source.prNumber
      ? `PR: #${session.source.prNumber}`
      : "",
    session.headSha
      ? `Commit: ${session.headSha}`
      : "",
    `State: ${deriveReleaseState(session.gates)}`,
    "",
    "## Change Summary",
    "",
    `Files changed: ${session.changedFiles.length}`,
    `Additions: +${sum(session, "additions")}`,
    `Deletions: -${sum(session, "deletions")}`,
    "",
    "## Affected Areas",
    "",
    ...areas.map((area) => `- ${area}`),
    "",
    "## Required Gates",
    "",
    ...session.gates
      .filter((gate) => gate.required)
      .map(
        (gate) =>
          `- ${mark(gate.status)} ${gate.title} — ${gate.status.toUpperCase()}`,
      ),
    "",
    "## Waivers",
    "",
    ...waivers(session),
    "",
    "## Environment",
    "",
    ...session.environments.map(
      (env) =>
        `- ${env.key}: preview=${env.preview}, production=${env.production}`,
    ),
    "",
    "## Rollout Plan",
    "",
    `Strategy: ${session.rollout.strategy}`,
    `Initial exposure: ${session.rollout.initialExposure || "N/A"}`,
    `Stages: ${session.rollout.stages || "N/A"}`,
    `Stop conditions: ${session.rollout.stopConditions || "Not defined"}`,
    "",
    "## Rollback / Forward-Fix Plan",
    "",
    `Strategy: ${session.rollback.strategy}`,
    `Recovery: ${session.rollback.recoveryApproach || "Not defined"}`,
    `Data considerations: ${session.rollback.dataConsiderations || "Not defined"}`,
    `Trigger: ${session.rollback.trigger || "Not defined"}`,
    "",
    "## Preview Checks",
    "",
    ...session.smokeChecks.map(
      (check) =>
        `- ${check.path}: ${check.status.toUpperCase()}${
          check.actualStatus
            ? ` (${check.actualStatus})`
            : ""
        }`,
    ),
    "",
    "## Post-Deploy Verification",
    "",
    ...session.verification.map(
      (item) =>
        `- ${item.status === "pass" ? "[x]" : "[ ]"} ${item.title}`,
    ),
    "",
    "## Source",
    "",
    session.source.url ?? "Pasted diff",
  ];

  return lines.filter(Boolean).join("\n");
}

export function generateReleaseSummary(
  session: ReleaseSession,
) {
  const required = session.gates.filter(
    (gate) => gate.required,
  );

  const satisfied = required.filter((gate) =>
    ["pass", "waived"].includes(gate.status),
  ).length;

  const areas = [
    ...new Set(
      session.changedFiles.flatMap((file) => file.areas),
    ),
  ];

  return [
    `SHIPCHECK — ${session.source.prNumber ? `PR #${session.source.prNumber}` : session.title}`,
    "",
    `Affected: ${areas.join(" · ")}`,
    `Required gates: ${satisfied} / ${required.length} satisfied`,
    `Waivers: ${required.filter((gate) => gate.status === "waived").length}`,
    `Rollout: ${session.rollout.strategy}`,
    `Rollback: ${session.rollback.strategy}`,
    `Post-deploy checks: ${session.verification.length} defined`,
  ].join("\n");
}

function sum(
  session: ReleaseSession,
  key: "additions" | "deletions",
) {
  return session.changedFiles.reduce(
    (total, file) => total + file[key],
    0,
  );
}

function mark(status: string) {
  if (status === "pass") return "[x]";
  if (status === "waived") return "[-]";
  return "[ ]";
}

function waivers(session: ReleaseSession) {
  const items = session.gates.filter(
    (gate) => gate.status === "waived",
  );

  if (!items.length) return ["None"];

  return items.flatMap((gate) => [
    `### ${gate.title}`,
    ...gate.evidence.map(
      (item) =>
        `- ${item.text} — ${item.by}, ${item.timestamp}`,
    ),
  ]);
}