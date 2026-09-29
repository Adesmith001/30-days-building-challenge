import type {
  ChangedFile,
  Finding,
  ImpactArea,
} from "@/types/release";

function finding(
  id: string,
  detectorId: string,
  category: ImpactArea | "RELEASE",
  severity: Finding["severity"],
  title: string,
  description: string,
  files: ChangedFile[],
): Finding {
  return {
    id,
    detectorId,
    category,
    severity,
    title,
    description,
    sourcePaths: files.map((file) => file.path),
  };
}

export function runDetectors(
  files: ChangedFile[],
): Finding[] {
  const results: Finding[] = [];

  const withArea = (area: ImpactArea) =>
    files.filter((file) => file.areas.includes(area));

  const database = withArea("DATABASE");
  const auth = withArea("AUTH");
  const payments = withArea("PAYMENTS");
  const config = withArea("CONFIG");
  const dependencies = withArea("DEPENDENCIES");
  const infra = withArea("INFRA");
  const api = withArea("API");
  const tests = withArea("TESTS");

  if (database.length) {
    results.push(
      finding(
        "database-change",
        "database",
        "DATABASE",
        "review",
        "DATABASE CHANGE DETECTED",
        "Database schema or migration-related files changed.",
        database,
      ),
    );

    const destructivePattern = database.some((file) =>
      /(DROP\s+(TABLE|COLUMN)|ALTER\s+COLUMN|SET\s+NOT\s+NULL)/i.test(
        file.patch ?? "",
      ),
    );

    if (destructivePattern) {
      results.push(
        finding(
          "schema-operation",
          "database",
          "DATABASE",
          "review",
          "SCHEMA OPERATION REQUIRES REVIEW",
          "A schema operation pattern was detected. Compatibility must be reviewed.",
          database,
        ),
      );
    }
  }

  const envKeys = detectEnvironmentKeys(files);

  if (envKeys.length) {
    results.push(
      finding(
        "environment-reference",
        "environment",
        "CONFIG",
        "review",
        "NEW CONFIG REFERENCE",
        `Environment references detected: ${envKeys.join(", ")}.`,
        config.length ? config : files,
      ),
    );
  }

  if (dependencies.length) {
    results.push(
      finding(
        "dependency-change",
        "dependencies",
        "DEPENDENCIES",
        "review",
        "DEPENDENCY FILE CHANGED",
        "A package manifest or dependency lockfile changed.",
        dependencies,
      ),
    );
  }

  if (auth.length) {
    results.push(
      finding(
        "auth-change",
        "auth",
        "AUTH",
        "review",
        "AUTHENTICATION SURFACE CHANGED",
        "Authentication or authorization-related files changed.",
        auth,
      ),
    );
  }

  if (payments.length) {
    results.push(
      finding(
        "payments-change",
        "payments",
        "PAYMENTS",
        "review",
        "PAYMENT FLOW CHANGED",
        "Payment, checkout, billing or webhook files changed.",
        payments,
      ),
    );
  }

  if (api.length) {
    results.push(
      finding(
        "api-change",
        "api",
        "API",
        "review",
        "API SURFACE CHANGED",
        "API routes, handlers or schemas changed.",
        api,
      ),
    );
  }

  if (infra.length) {
    results.push(
      finding(
        "infra-change",
        "infra",
        "INFRA",
        "review",
        "DEPLOYMENT CONFIG CHANGED",
        "Infrastructure or deployment configuration changed.",
        infra,
      ),
    );
  }

  if (
    files.some((file) =>
      file.areas.some((area) =>
        ["API", "PAYMENTS", "AUTH"].includes(area),
      ),
    ) &&
    tests.length === 0
  ) {
    results.push(
      finding(
        "tests-not-detected",
        "tests",
        "TESTS",
        "info",
        "RELATED TEST FILE CHANGE NOT DETECTED",
        "This does not prove the release is untested. Test evidence should be supplied.",
        files,
      ),
    );
  }

  return results;
}

export function detectEnvironmentKeys(
  files: ChangedFile[],
): string[] {
  const keys = new Set<string>();

  for (const file of files) {
    const patch = file.patch ?? "";

    const runtimePatterns = [
      /process\.env\.([A-Z0-9_]+)/g,
      /import\.meta\.env\.([A-Z0-9_]+)/g,
    ];

    for (const pattern of runtimePatterns) {
      for (const match of patch.matchAll(pattern)) {
        keys.add(match[1]);
      }
    }

    if (/\.env(\.|$)/i.test(file.path)) {
      for (const match of patch.matchAll(
        /^\+([A-Z][A-Z0-9_]+)=/gm,
      )) {
        keys.add(match[1]);
      }
    }
  }

  return [...keys];
}