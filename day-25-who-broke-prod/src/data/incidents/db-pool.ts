import type { IncidentScenario } from "@/types";
import {
  commerceEdges,
  commerceServices,
  healthyCache,
  healthyDependencies,
  healthyQueue,
} from "./shared";

export const dbPool: IncidentScenario = {
  id: "db-pool",
  number: "02",
  title: "DB CONNECTION POOL",
  subtitle: "API LATENCY",
  skill: "DATABASE DIAGNOSIS",
  severity: "SEV-2",
  difficulty: "STANDARD",
  region: "EU-WEST",
  startClock: "10:42:00",
  degradeAt: -210,
  seed: 2502,
  impactStart: 84,
  impactPerMinute: 39,

  alert: {
    title: "API LATENCY",
    metric: "P95 LATENCY",
    current: "4.8s",
    baseline: "210ms",
    startedAgo: "3 MIN AGO",
    affected: "ORDERS API",
    region: "EU-WEST",
    customerText:
      "ORDER REQUESTS ARE TIMING OUT OR RESPONDING SLOWLY.",
  },

  services: commerceServices(
    "orders-api",
    "orders-api",
    "v5.9.0",
  ),

  dependencies: commerceEdges("orders-api"),

  metrics: [
    {
      id: "api-latency",
      label: "API LATENCY P95",
      serviceId: "orders-api",
      unit: "ms",
      normal: 210,
      incident: 4800,
      noise: 80,
      decimals: 0,
    },
    {
      id: "db-connections",
      label: "DB CONNECTIONS",
      serviceId: "postgres",
      unit: "%",
      normal: 44,
      incident: 98,
      noise: 1.2,
      decimals: 0,
      evidenceLabel:
        "DATABASE CONNECTIONS APPROACHED POOL LIMIT",
    },
    {
      id: "pool-wait",
      label: "POOL WAIT P95",
      serviceId: "orders-api",
      unit: "ms",
      normal: 24,
      incident: 1700,
      noise: 34,
      decimals: 0,
      evidenceLabel:
        "POOL WAIT ROSE WHILE QUERY TIME STAYED LOW",
    },
    {
      id: "query-latency",
      label: "QUERY P95",
      serviceId: "postgres",
      unit: "ms",
      normal: 30,
      incident: 32,
      noise: 1,
      decimals: 0,
    },
    {
      id: "db-cpu",
      label: "DATABASE CPU",
      serviceId: "postgres",
      unit: "%",
      normal: 41,
      incident: 44,
      noise: 1.8,
      decimals: 0,
    },
  ],

  logs: [
    {
      id: "dbpool-timeout-1",
      offset: -190,
      level: "ERROR",
      service: "orders-api",
      message:
        "database pool acquisition timeout after 2000ms active=98 idle=2",
      traceId: "poola812",
      evidenceLabel:
        "APPLICATION REQUESTS ARE WAITING FOR DATABASE CONNECTIONS",
    },
    {
      id: "dbpool-query-ok",
      offset: -184,
      level: "INFO",
      service: "postgres",
      message:
        "statement completed duration=28ms rows=12",
    },
    {
      id: "dbpool-warning",
      offset: -181,
      level: "WARN",
      service: "orders-api",
      message:
        "connection checkout duration exceeded threshold duration=1420ms",
    },
  ],

  traces: [
    {
      id: "poola812",
      offset: -173,
      root: "POST /orders",
      status: "error",
      durationMs: 4920,
      evidenceLabel:
        "TRACE SPENDS MOST TIME WAITING BEFORE DATABASE QUERY",
      spans: [
        {
          id: "p1",
          service: "gateway",
          operation: "POST /orders",
          startMs: 0,
          durationMs: 4920,
          depth: 0,
          status: "error",
        },
        {
          id: "p2",
          service: "orders-api",
          operation: "acquire connection",
          startMs: 18,
          durationMs: 1810,
          depth: 1,
          status: "error",
          annotation: "POOL WAIT",
        },
        {
          id: "p3",
          service: "postgres",
          operation: "INSERT order",
          startMs: 1840,
          durationMs: 32,
          depth: 2,
          status: "ok",
        },
      ],
    },
  ],

  deploys: [
    {
      id: "deploy-orders-590",
      offset: -510,
      serviceId: "orders-api",
      version: "v5.9.0",
      commit: "9ac43b1",
      summary: "Refactor transaction lifecycle",
      evidenceLabel:
        "ORDERS API V5.9.0 DEPLOYED BEFORE POOL SATURATION",
    },
    {
      id: "deploy-web-db",
      offset: -1560,
      serviceId: "web",
      version: "v3.1.3",
      commit: "7ed219c",
      summary: "Order status copy changes",
    },
  ],

  flags: [
    {
      id: "bulk-order",
      name: "BULK_ORDER_V2",
      enabled: false,
      rollout: 0,
      changedOffset: -7200,
    },
  ],

  tools: {
    database: {
      title: "POSTGRES",
      subtitle: "PRIMARY · EU-WEST-1",
      note:
        "Query execution remains fast while connection acquisition is saturated.",
      evidenceId: "database-pool-pressure",
      evidenceLabel:
        "POOL WAIT IS HIGH WHILE QUERY P95 REMAINS LOW",
      stats: [
        {
          label: "CONNECTIONS",
          value: "98 / 100",
          state: "critical",
        },
        {
          label: "QUERY P95",
          value: "32ms",
          state: "normal",
        },
        {
          label: "POOL WAIT",
          value: "1.7s",
          state: "critical",
        },
        {
          label: "CPU",
          value: "44%",
          state: "normal",
        },
        {
          label: "LOCK WAIT",
          value: "0",
          state: "normal",
        },
      ],
    },
    cache: healthyCache(),
    queues: healthyQueue(),
    dependencies: healthyDependencies(),
  },

  events: [
    {
      id: "db-deploy",
      offset: -510,
      label: "DEPLOY",
      detail: "orders-api v5.9.0",
      kind: "change",
    },
    {
      id: "pool-rising",
      offset: -210,
      label: "POOL WAIT RISING",
      kind: "warning",
    },
    {
      id: "db-alert",
      offset: -120,
      label: "LATENCY ALERT FIRED",
      kind: "alert",
    },
  ],

  actions: [
    {
      id: "rollback-orders",
      label: "ROLL BACK ORDERS API",
      target: "v5.9.0 → v5.8.4",
      costSeconds: 90,
      potential:
        "Instances are replaced with the previous application version.",
      consequence:
        "New instances stop leaking database connections.",
      effect: "mitigate",
    },
    {
      id: "restart-orders",
      label: "RESTART ORDERS API",
      target: "orders-api",
      costSeconds: 45,
      potential:
        "Connections held by current instances are released.",
      consequence:
        "Pool pressure drops temporarily but begins climbing again.",
      effect: "waste",
    },
    {
      id: "increase-db-pool",
      label: "INCREASE DATABASE POOL",
      target: "100 → 180",
      costSeconds: 40,
      potential:
        "More concurrent connections become available.",
      consequence:
        "Headroom increases temporarily. Connection growth continues.",
      effect: "waste",
    },
    {
      id: "restart-db",
      label: "RESTART DATABASE",
      target: "postgres-primary",
      costSeconds: 120,
      potential:
        "All current connections will be interrupted.",
      consequence:
        "Database restart caused an avoidable burst of request failures.",
      effect: "harm",
      dangerDelta: 2,
    },
  ],

  rootCause: {
    componentId: "orders-api",
    cause: "connection lifecycle regression",
    trigger: "v5.9.0 rollout",
    summary:
      "orders-api v5.9.0 leaked database connections, exhausting the application connection pool.",
    criticalEvidenceIds: [
      "db-connections",
      "pool-wait",
      "dbpool-timeout-1",
      "poola812",
      "deploy-orders-590",
    ],
  },

  hints: [
    "Database CPU is not the only database signal.",
    "Compare query execution time with connection acquisition time.",
    "Inspect what changed in orders-api before pool usage began climbing.",
  ],

  postmortem: {
    contributingFactors: [
      "Connection lifecycle behaviour was not load-tested.",
      "Pool saturation alerts fired after customer latency had already risen.",
    ],
    followUps: [
      "Add connection checkout latency alerts.",
      "Add lifecycle leak tests.",
      "Introduce per-instance connection gauges.",
    ],
    mitigation:
      "Rollback orders-api to v5.8.4.",
  },
};
