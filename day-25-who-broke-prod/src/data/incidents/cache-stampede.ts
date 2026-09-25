import type { IncidentScenario } from "@/types";
import {
  commerceEdges,
  commerceServices,
  healthyDependencies,
  healthyQueue,
} from "./shared";

export const cacheStampede: IncidentScenario = {
  id: "cache-stampede",
  number: "03",
  title: "CACHE STAMPEDE",
  subtitle: "CATALOG DEGRADATION",
  skill: "CACHING",
  severity: "SEV-1",
  difficulty: "STANDARD",
  region: "GLOBAL",
  startClock: "16:24:00",
  degradeAt: -180,
  seed: 2503,
  impactStart: 311,
  impactPerMinute: 92,

  alert: {
    title: "CATALOG DEGRADATION",
    metric: "PRODUCT P95",
    current: "3.4s",
    baseline: "180ms",
    startedAgo: "2 MIN AGO",
    affected: "CATALOG",
    region: "GLOBAL",
    customerText:
      "PRODUCT PAGES ARE SLOW AND SOME REQUESTS ARE FAILING.",
  },

  services: commerceServices(
    "catalog-api",
    "catalog-api",
    "v6.2.8",
  ),

  dependencies: commerceEdges("catalog-api"),

  metrics: [
    {
      id: "cache-hit-rate",
      label: "CACHE HIT RATE",
      serviceId: "redis",
      unit: "%",
      normal: 94,
      incident: 21,
      noise: 1.4,
      decimals: 0,
      evidenceLabel:
        "CACHE HIT RATE COLLAPSED BEFORE DATABASE READS SURGED",
    },
    {
      id: "db-reads",
      label: "DATABASE READS",
      serviceId: "postgres",
      unit: "/min",
      normal: 820,
      incident: 9300,
      noise: 180,
      decimals: 0,
      evidenceLabel:
        "DATABASE READS SPIKED AS CACHE HIT RATE FELL",
    },
    {
      id: "catalog-latency",
      label: "CATALOG P95",
      serviceId: "catalog-api",
      unit: "ms",
      normal: 180,
      incident: 3400,
      noise: 60,
      decimals: 0,
    },
    {
      id: "redis-ops",
      label: "REDIS OPS",
      serviceId: "redis",
      unit: "/s",
      normal: 2400,
      incident: 6800,
      noise: 120,
      decimals: 0,
    },
  ],

  logs: [
    {
      id: "cache-miss-burst",
      offset: -168,
      level: "WARN",
      service: "catalog-api",
      message:
        "cache miss burst key=popular-products shard=03 misses=1842/10s",
      evidenceLabel:
        "POPULAR PRODUCT CACHE MISSES SURGED SIMULTANEOUSLY",
    },
    {
      id: "cache-db-read",
      offset: -162,
      level: "WARN",
      service: "postgres",
      message:
        "read volume above baseline table=products calls=9124/min",
    },
    {
      id: "cache-redis-ok",
      offset: -159,
      level: "INFO",
      service: "redis",
      message:
        "node healthy memory=62% evictions=0 connection_errors=0",
    },
  ],

  traces: [
    {
      id: "catalogff21",
      offset: -150,
      root: "GET /products/featured",
      status: "error",
      durationMs: 3310,
      evidenceLabel:
        "CATALOG TRACE FALLS THROUGH CACHE INTO EXPENSIVE DATABASE READ",
      spans: [
        {
          id: "c1",
          service: "gateway",
          operation: "GET /products/featured",
          startMs: 0,
          durationMs: 3310,
          depth: 0,
          status: "error",
        },
        {
          id: "c2",
          service: "catalog-api",
          operation: "load products",
          startMs: 16,
          durationMs: 3270,
          depth: 1,
          status: "error",
        },
        {
          id: "c3",
          service: "redis",
          operation: "MGET featured",
          startMs: 32,
          durationMs: 6,
          depth: 2,
          status: "ok",
          annotation: "MISS",
        },
        {
          id: "c4",
          service: "postgres",
          operation: "SELECT products",
          startMs: 43,
          durationMs: 3010,
          depth: 2,
          status: "error",
        },
      ],
    },
  ],

  deploys: [
    {
      id: "catalog-deploy-old",
      offset: -5400,
      serviceId: "catalog-api",
      version: "v6.2.8",
      commit: "f128aab",
      summary: "Product ranking telemetry",
    },
    {
      id: "unrelated-web-cache",
      offset: -210,
      serviceId: "web",
      version: "v3.2.0",
      commit: "d80b991",
      summary: "Header experiment styles",
      evidenceLabel:
        "FRONTEND DEPLOY OCCURRED NEAR INCIDENT START",
    },
  ],

  flags: [],

  tools: {
    database: {
      title: "POSTGRES",
      subtitle: "CATALOG READ PRIMARY",
      note:
        "Read volume is far above baseline while lock pressure remains low.",
      stats: [
        {
          label: "READS",
          value: "+1,034%",
          state: "critical",
        },
        {
          label: "CPU",
          value: "87%",
          state: "critical",
        },
        {
          label: "LOCK WAIT",
          value: "4ms",
          state: "normal",
        },
        {
          label: "CONNECTIONS",
          value: "71 / 100",
          state: "warning",
        },
      ],
    },
    cache: {
      title: "REDIS",
      subtitle: "CATALOG CACHE",
      note:
        "Redis remains available; the hit-rate collapse is application behaviour.",
      evidenceId: "cache-panel-hit-rate",
      evidenceLabel:
        "REDIS IS AVAILABLE WHILE HIT RATE COLLAPSED TO 21%",
      stats: [
        {
          label: "HIT RATE",
          value: "21%",
          state: "critical",
        },
        {
          label: "MEMORY",
          value: "62%",
          state: "normal",
        },
        {
          label: "EVICTIONS",
          value: "0",
          state: "normal",
        },
        {
          label: "OPS / SEC",
          value: "6.8K",
          state: "warning",
        },
      ],
    },
    queues: healthyQueue(),
    dependencies: healthyDependencies(),
  },

  events: [
    {
      id: "cache-expiry",
      offset: -180,
      label: "POPULAR PRODUCT CACHE EXPIRED",
      kind: "system",
    },
    {
      id: "cache-misses",
      offset: -165,
      label: "CACHE HIT RATE FALLING",
      kind: "warning",
    },
    {
      id: "cache-alert",
      offset: -120,
      label: "CATALOG LATENCY ALERT",
      kind: "alert",
    },
  ],

  actions: [
    {
      id: "enable-stale-cache",
      label: "ENABLE STALE VALUES",
      target: "catalog-cache",
      costSeconds: 40,
      potential:
        "Serve recently expired values while refreshing asynchronously.",
      consequence:
        "Database pressure begins dropping as stale responses absorb demand.",
      effect: "mitigate",
    },
    {
      id: "warm-cache",
      label: "WARM POPULAR CACHE",
      target: "featured-products",
      costSeconds: 55,
      potential:
        "Repopulate high-demand product keys.",
      consequence:
        "Hit rate begins recovering as popular keys are repopulated.",
      effect: "mitigate",
    },
    {
      id: "purge-cache",
      label: "PURGE REDIS",
      target: "catalog-cache",
      costSeconds: 25,
      potential:
        "All cached catalog values are removed.",
      consequence:
        "Hit rate fell to 0%. Database reads accelerated sharply.",
      effect: "harm",
      dangerDelta: 2,
    },
    {
      id: "scale-db-cache",
      label: "SCALE DATABASE",
      target: "read replicas +2",
      costSeconds: 90,
      potential:
        "Read capacity increases.",
      consequence:
        "More read capacity bought time, but cache misses continue.",
      effect: "waste",
    },
  ],

  rootCause: {
    componentId: "redis",
    cause: "cache stampede",
    trigger: "simultaneous cache expiry",
    summary:
      "Popular catalog keys expired simultaneously without jitter or request coalescing.",
    criticalEvidenceIds: [
      "cache-hit-rate",
      "db-reads",
      "cache-miss-burst",
      "catalogff21",
    ],
  },

  hints: [
    "Compare cache hit rate with database read volume.",
    "Is Redis unavailable, or are requests simply missing the cache?",
    "Look at what happened to the popular product keys immediately before the spike.",
  ],

  postmortem: {
    contributingFactors: [
      "Popular keys shared the same TTL.",
      "No single-flight request coalescing existed.",
    ],
    followUps: [
      "Introduce TTL jitter.",
      "Add stale-while-revalidate.",
      "Coalesce concurrent cache fills.",
    ],
    mitigation:
      "Serve stale values while warming high-demand cache keys.",
  },
};
