import type { IncidentScenario } from "@/types";
import {
  commerceEdges,
  commerceServices,
  healthyCache,
  healthyDatabase,
  healthyQueue,
} from "./shared";

export const paymentOutage: IncidentScenario = {
  id: "payment-outage",
  number: "05",
  title: "PAYMENT OUTAGE",
  subtitle: "PROVIDER TIMEOUTS",
  skill: "DEPENDENCY FAILURE",
  severity: "SEV-1",
  difficulty: "HARD",
  region: "GLOBAL",
  startClock: "18:07:00",
  degradeAt: -210,
  seed: 2505,
  impactStart: 248,
  impactPerMinute: 108,

  alert: {
    title: "PAYMENT FAILURE",
    metric: "PAYMENT TIMEOUTS",
    current: "34%",
    baseline: "0.3%",
    startedAgo: "3 MIN AGO",
    affected: "PAYMENTS",
    region: "GLOBAL",
    customerText:
      "CUSTOMERS CANNOT COMPLETE PAYMENT AUTHORIZATION.",
  },

  services: commerceServices(
    "checkout-api",
    "checkout-api",
    "v2.4.3",
  ),

  dependencies: commerceEdges("checkout-api"),

  metrics: [
    {
      id: "provider-latency",
      label: "PROVIDER P95",
      serviceId: "payment-provider",
      unit: "ms",
      normal: 84,
      incident: 12000,
      noise: 220,
      decimals: 0,
      evidenceLabel:
        "PAYMENT PROVIDER LATENCY SPIKED TO 12 SECONDS",
    },
    {
      id: "provider-timeouts",
      label: "PROVIDER TIMEOUTS",
      serviceId: "payment-provider",
      unit: "%",
      normal: 0.3,
      incident: 34,
      noise: 0.8,
      decimals: 1,
      evidenceLabel:
        "PAYMENT PROVIDER TIMEOUT RATE ROSE TO 34%",
    },
    {
      id: "retry-rate",
      label: "PAYMENT RETRIES",
      serviceId: "payment-service",
      unit: "/min",
      normal: 14,
      incident: 980,
      noise: 28,
      decimals: 0,
    },
    {
      id: "checkout-success-payment",
      label: "CHECKOUT SUCCESS",
      serviceId: "checkout-api",
      unit: "%",
      normal: 98.8,
      incident: 58,
      noise: 1,
      decimals: 1,
    },
  ],

  logs: [
    {
      id: "provider-timeout-log",
      offset: -198,
      level: "ERROR",
      service: "payment-service",
      message:
        "provider request timeout provider=paybridge duration=12000ms attempt=3",
      traceId: "pay119aa",
      evidenceLabel:
        "PAYMENT SERVICE IS TIMING OUT WAITING ON EXTERNAL PROVIDER",
    },
    {
      id: "payment-retry-log",
      offset: -192,
      level: "WARN",
      service: "payment-service",
      message:
        "retry volume above baseline provider=paybridge retries=942/min",
    },
    {
      id: "checkout-normal-db",
      offset: -187,
      level: "INFO",
      service: "checkout-api",
      message:
        "database phase completed duration=29ms",
    },
  ],

  traces: [
    {
      id: "pay119aa",
      offset: -181,
      root: "POST /checkout",
      status: "error",
      durationMs: 12190,
      evidenceLabel:
        "TRACE SPENDS ALMOST ALL TIME IN EXTERNAL PAYMENT PROVIDER",
      spans: [
        {
          id: "o1",
          service: "gateway",
          operation: "POST /checkout",
          startMs: 0,
          durationMs: 12190,
          depth: 0,
          status: "error",
        },
        {
          id: "o2",
          service: "checkout-api",
          operation: "checkout",
          startMs: 20,
          durationMs: 12140,
          depth: 1,
          status: "error",
        },
        {
          id: "o3",
          service: "postgres",
          operation: "load cart",
          startMs: 41,
          durationMs: 29,
          depth: 2,
          status: "ok",
        },
        {
          id: "o4",
          service: "payment-service",
          operation: "authorize",
          startMs: 92,
          durationMs: 12020,
          depth: 2,
          status: "error",
        },
        {
          id: "o5",
          service: "payment-provider",
          operation: "POST /authorize",
          startMs: 110,
          durationMs: 12000,
          depth: 3,
          status: "error",
          annotation: "TIMEOUT",
        },
      ],
    },
  ],

  deploys: [
    {
      id: "unrelated-payment-web",
      offset: -180,
      serviceId: "web",
      version: "v3.4.0",
      commit: "ef90c21",
      summary: "Checkout accessibility labels",
      evidenceLabel:
        "FRONTEND DEPLOY OCCURRED 30 SECONDS BEFORE PROVIDER ALERT",
    },
    {
      id: "payment-service-old",
      offset: -14400,
      serviceId: "payment-service",
      version: "v1.8.7",
      commit: "111dca8",
      summary: "Telemetry normalization",
    },
  ],

  flags: [],

  tools: {
    database: healthyDatabase(),
    cache: healthyCache(),
    queues: healthyQueue(),
    dependencies: {
      title: "EXTERNAL DEPENDENCIES",
      subtitle: "PROVIDER HEALTH",
      note:
        "Internal services are mostly healthy while the payment provider is severely degraded.",
      evidenceId: "provider-degradation",
      evidenceLabel:
        "EXTERNAL PAYMENT PROVIDER IS DEGRADED WHILE INTERNAL DEPENDENCIES ARE HEALTHY",
      stats: [
        {
          label: "PAYMENT PROVIDER",
          value: "12s · 34% timeout",
          state: "critical",
        },
        {
          label: "EMAIL PROVIDER",
          value: "74ms · 0.1%",
          state: "normal",
        },
        {
          label: "OBJECT STORAGE",
          value: "39ms · 0.0%",
          state: "normal",
        },
      ],
    },
  },

  events: [
    {
      id: "payment-front-deploy",
      offset: -180,
      label: "FRONTEND DEPLOY",
      detail: "web v3.4.0",
      kind: "change",
    },
    {
      id: "provider-degrade",
      offset: -210,
      label: "PROVIDER LATENCY RISING",
      kind: "warning",
    },
    {
      id: "payment-alert",
      offset: -120,
      label: "PAYMENT ALERT FIRED",
      kind: "alert",
    },
  ],

  actions: [
    {
      id: "circuit-breaker",
      label: "ENABLE CIRCUIT BREAKER",
      target: "payment-provider",
      costSeconds: 40,
      potential:
        "Fail fast and stop repeatedly waiting on degraded requests.",
      consequence:
        "Provider requests fail fast and internal retry pressure begins dropping.",
      effect: "mitigate",
    },
    {
      id: "stop-retries",
      label: "STOP AGGRESSIVE RETRIES",
      target: "payment-service",
      costSeconds: 35,
      potential:
        "Retry traffic will be queued instead of immediately replayed.",
      consequence:
        "Retry amplification stopped and internal service pressure stabilized.",
      effect: "mitigate",
    },
    {
      id: "rollback-web",
      label: "ROLL BACK FRONTEND",
      target: "v3.4.0 → v3.3.9",
      costSeconds: 70,
      potential:
        "Revert the recent frontend release.",
      consequence:
        "Frontend reverted. Provider timeouts remained unchanged.",
      effect: "waste",
    },
    {
      id: "increase-timeout",
      label: "INCREASE PROVIDER TIMEOUT",
      target: "12s → 30s",
      costSeconds: 20,
      potential:
        "Requests wait longer before failing.",
      consequence:
        "Requests occupied resources for longer and internal pressure increased.",
      effect: "harm",
      dangerDelta: 2,
    },
  ],

  rootCause: {
    componentId: "payment-provider",
    cause: "third-party provider degradation",
    trigger: "provider incident",
    summary:
      "The external payment provider degraded, causing 12-second authorization timeouts and retry amplification.",
    criticalEvidenceIds: [
      "provider-latency",
      "provider-timeouts",
      "provider-timeout-log",
      "pay119aa",
      "provider-degradation",
    ],
  },

  hints: [
    "Separate internal health from external dependency health.",
    "Where does the failing trace spend most of its time?",
    "You cannot repair the provider. Think about protecting your own system.",
  ],

  postmortem: {
    contributingFactors: [
      "Retries were aggressive during provider degradation.",
      "Circuit breaking was not enabled automatically.",
    ],
    followUps: [
      "Automate circuit breaking.",
      "Add bounded exponential retry.",
      "Introduce delayed payment retry workflow.",
    ],
    mitigation:
      "Enable the provider circuit breaker and stop aggressive retries.",
  },
};
