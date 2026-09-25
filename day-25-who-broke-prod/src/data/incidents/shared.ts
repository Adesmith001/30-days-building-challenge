import type {
  DiagnosticPanel,
  ServiceDefinition,
} from "@/types";

export function commerceServices(
  primaryId: string,
  primaryName: string,
  version: string,
): ServiceDefinition[] {
  return [
    {
      id: "web",
      name: "web",
      kind: "frontend",
      version: "v3.1.2",
      x: 8,
      y: 50,
    },
    {
      id: "gateway",
      name: "api-gateway",
      kind: "gateway",
      version: "v4.8.1",
      x: 27,
      y: 50,
    },
    {
      id: primaryId,
      name: primaryName,
      kind: "api",
      version,
      x: 48,
      y: 50,
    },
    {
      id: "postgres",
      name: "postgres",
      kind: "database",
      x: 70,
      y: 20,
    },
    {
      id: "redis",
      name: "redis",
      kind: "cache",
      x: 70,
      y: 43,
    },
    {
      id: "payment-service",
      name: "payment-service",
      kind: "api",
      version: "v1.8.7",
      x: 70,
      y: 69,
    },
    {
      id: "payment-provider",
      name: "payment-provider",
      kind: "external",
      x: 91,
      y: 69,
    },
  ];
}

export const commerceEdges = (
  primaryId: string,
) => [
  { from: "web", to: "gateway" },
  { from: "gateway", to: primaryId },
  { from: primaryId, to: "postgres" },
  { from: primaryId, to: "redis" },
  { from: primaryId, to: "payment-service" },
  {
    from: "payment-service",
    to: "payment-provider",
  },
];

export function healthyDatabase(): DiagnosticPanel {
  return {
    title: "POSTGRES",
    subtitle: "PRIMARY · EU-WEST-1",
    note: "No unusual database pressure detected.",
    stats: [
      {
        label: "CONNECTIONS",
        value: "42 / 100",
        state: "normal",
      },
      {
        label: "QUERY P95",
        value: "32ms",
        state: "normal",
      },
      {
        label: "CPU",
        value: "36%",
        state: "normal",
      },
      {
        label: "LOCK WAIT",
        value: "0",
        state: "normal",
      },
      {
        label: "POOL WAIT",
        value: "18ms",
        state: "normal",
      },
    ],
  };
}

export function healthyCache(): DiagnosticPanel {
  return {
    title: "REDIS",
    subtitle: "CACHE · EU-WEST-1",
    note: "Cache behaviour is stable.",
    stats: [
      {
        label: "HIT RATE",
        value: "93%",
        state: "normal",
      },
      {
        label: "MEMORY",
        value: "61%",
        state: "normal",
      },
      {
        label: "EVICTIONS",
        value: "LOW",
        state: "normal",
      },
      {
        label: "OPS / SEC",
        value: "NORMAL",
        state: "normal",
      },
    ],
  };
}

export function healthyQueue(): DiagnosticPanel {
  return {
    title: "ORDER EVENTS",
    subtitle: "ASYNC PROCESSING",
    note: "No unusual queue pressure detected.",
    stats: [
      {
        label: "DEPTH",
        value: "184",
        state: "normal",
      },
      {
        label: "INGRESS",
        value: "810/min",
        state: "normal",
      },
      {
        label: "PROCESSING",
        value: "816/min",
        state: "normal",
      },
      {
        label: "OLDEST",
        value: "2.1s",
        state: "normal",
      },
    ],
  };
}

export function healthyDependencies(): DiagnosticPanel {
  return {
    title: "EXTERNAL DEPENDENCIES",
    subtitle: "PROVIDER HEALTH",
    note: "External providers are within baseline.",
    stats: [
      {
        label: "PAYMENT",
        value: "84ms · 0.4%",
        state: "normal",
      },
      {
        label: "EMAIL",
        value: "72ms · 0.1%",
        state: "normal",
      },
      {
        label: "STORAGE",
        value: "41ms · 0.0%",
        state: "normal",
      },
    ],
  };
}
