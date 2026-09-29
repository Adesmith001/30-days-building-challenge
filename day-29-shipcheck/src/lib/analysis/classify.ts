import type { ImpactArea } from "@/types/release";

const rules: Array<{
  area: ImpactArea;
  patterns: RegExp[];
}> = [
  {
    area: "DATABASE",
    patterns: [
      /migrations?\//i,
      /schema\//i,
      /prisma\//i,
      /drizzle\//i,
      /supabase\/migrations/i,
      /schema\.(ts|js|sql)$/i,
    ],
  },
  {
    area: "AUTH",
    patterns: [
      /auth/i,
      /permission/i,
      /authorization/i,
      /roles?\//i,
      /session/i,
    ],
  },
  {
    area: "PAYMENTS",
    patterns: [
      /payment/i,
      /checkout/i,
      /billing/i,
      /stripe/i,
      /webhook/i,
    ],
  },
  {
    area: "CONFIG",
    patterns: [
      /\.env/i,
      /config\//i,
      /environment/i,
    ],
  },
  {
    area: "DEPENDENCIES",
    patterns: [
      /package\.json$/i,
      /pnpm-lock\.yaml$/i,
      /package-lock\.json$/i,
      /yarn\.lock$/i,
      /bun\.lock/i,
    ],
  },
  {
    area: "INFRA",
    patterns: [
      /Dockerfile/i,
      /docker-compose/i,
      /vercel\.json/i,
      /\.github\/workflows/i,
      /terraform/i,
      /k8s/i,
      /helm/i,
    ],
  },
  {
    area: "TESTS",
    patterns: [
      /\.test\./i,
      /\.spec\./i,
      /tests?\//i,
      /__tests__/i,
    ],
  },
  {
    area: "OBSERVABILITY",
    patterns: [
      /monitoring/i,
      /telemetry/i,
      /logging/i,
      /sentry/i,
      /metrics/i,
    ],
  },
  {
    area: "API",
    patterns: [
      /\/api\//i,
      /^api\//i,
      /routes?\//i,
      /controllers?\//i,
      /handlers?\//i,
      /openapi/i,
      /graphql/i,
    ],
  },
  {
    area: "FRONTEND",
    patterns: [
      /components?\//i,
      /pages?\//i,
      /src\/app\//i,
      /styles?\//i,
      /\.(css|scss|sass)$/i,
    ],
  },
];

export function classifyFile(path: string): ImpactArea[] {
  const matches = rules
    .filter((rule) =>
      rule.patterns.some((pattern) => pattern.test(path)),
    )
    .map((rule) => rule.area);

  return [...new Set(matches)];
}