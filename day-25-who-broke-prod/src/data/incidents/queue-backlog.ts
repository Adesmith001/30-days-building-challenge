import type { IncidentScenario } from "@/types";
import {
  healthyCache,
  healthyDatabase,
  healthyDependencies,
} from "./shared";

export const queueBacklog: IncidentScenario = {
  id: "queue-backlog",
  number: "04",
  title: "QUEUE BACKLOG",
  subtitle: "ORDERS DELAYED",
  skill: "ASYNC SYSTEMS",
  severity: "SEV-2",
  difficulty: "STANDARD",
  region: "EU-WEST",
  startClock: "09:18:00",
  degradeAt: -360,
  seed: 2504,
  impactStart: 620,
  impactPerMinute: 165,

  alert: {
    title: "ORDER PROCESSING DELAY",
    metric: "OLDEST MESSAGE",
    current: "18m 42s",
    baseline: "< 8s",
    startedAgo: "6 MIN AGO",
    affected: "ORDER PROCESSING",
    region: "EU-WEST",
    customerText:
      "ORDERS ARE ACCEPTED BUT DOWNSTREAM PROCESSING IS DELAYED.",
  },

  services: [
    {
      id: "web",
      name: "web",
      kind: "frontend",
      x: 7,
      y: 50,
    },
    {
      id: "orders-api",
      name: "orders-api",
      kind: "api",
      version: "v4.8.2",
      x: 28,
      y: 50,
    },
    {
      id: "orders-queue",
      name: "orders-queue",
      kind: "queue",
      x: 52,
      y: 50,
    },
    {
      id: "order-worker",
      name: "order-worker",
      kind: "worker",
      version: "v8.2.0",
      x: 75,
      y: 50,
    },
    {
      id: "postgres",
      name: "postgres",
      kind: "database",
      x: 92,
      y: 30,
    },
    {
      id: "email-provider",
      name: "email-provider",
      kind: "external",
      x: 92,
      y: 70,
    },
  ],

  dependencies: [
    { from: "web", to: "orders-api" },
    { from: "orders-api", to: "orders-queue" },
    { from: "orders-queue", to: "order-worker" },
    { from: "order-worker", to: "postgres" },
    { from: "order-worker", to: "email-provider" },
  ],

  metrics: [
    {
      id: "queue-depth",
      label: "QUEUE DEPTH",
      serviceId: "orders-queue",
      unit: "",
      normal: 310,
      incident: 42133,
      noise: 400,
      decimals: 0,
      evidenceLabel:
        "QUEUE DEPTH IS GROWING CONTINUOUSLY",
    },
    {
      id: "queue-ingress",
      label: "INGRESS",
      serviceId: "orders-queue",
      unit: "/min",
      normal: 800,
      incident: 800,
      noise: 18,
      decimals: 0,
    },
    {
      id: "queue-processing",
      label: "PROCESSING",
      serviceId: "order-worker",
      unit: "/min",
      normal: 805,
      incident: 260,
      noise: 12,
      decimals: 0,
      evidenceLabel:
        "PROCESSING RATE FELL BELOW QUEUE INGRESS",
    },
    {
      id: "api-errors",
      label: "ORDERS API ERROR",
      serviceId: "orders-api",
      unit: "%",
      normal: 0.4,
      incident: 0.6,
      noise: 0.1,
      decimals: 1,
    },
  ],

  logs: [
    {
      id: "poison-message",
      offset: -338,
      level: "ERROR",
      service: "order-worker",
      message:
        "message processing failed order=843992 retry=118 reason=unsupported fulfillment region",
      evidenceLabel:
        "ONE POISON MESSAGE IS RETRYING REPEATEDLY",
    },
    {
      id: "worker-throughput",
      offset: -331,
      level: "WARN",
      service: "order-worker",
      message:
        "consumer throughput below ingress processing=261/min ingress=804/min",
    },
    {
      id: "api-healthy-queue",
      offset: -325,
      level: "INFO",
      service: "orders-api",
      message:
        "POST /orders status=202 duration=82ms",
    },
  ],

  traces: [
    {
      id: "queueaccepted1",
      offset: -320,
      root: "POST /orders",
      status: "ok",
      durationMs: 96,
      evidenceLabel:
        "API ACCEPTS ORDERS QUICKLY WHILE ASYNC PROCESSING LAGS",
      spans: [
        {
          id: "q1",
          service: "orders-api",
          operation: "POST /orders",
          startMs: 0,
          durationMs: 96,
          depth: 0,
          status: "ok",
        },
        {
          id: "q2",
          service: "orders-queue",
          operation: "publish",
          startMs: 40,
          durationMs: 8,
          depth: 1,
          status: "ok",
        },
      ],
    },
  ],

  deploys: [
    {
      id: "worker-820",
      offset: -840,
      serviceId: "order-worker",
      version: "v8.2.0",
      commit: "fe198d2",
      summary: "Retry fulfillment validation failures",
      evidenceLabel:
        "ORDER WORKER V8.2.0 CHANGED RETRY BEHAVIOUR",
    },
  ],

  flags: [],

  tools: {
    database: healthyDatabase(),
    cache: healthyCache(),
    queues: {
      title: "ORDERS QUEUE",
      subtitle: "FULFILLMENT PIPELINE",
      note:
        "Ingress remains stable while worker throughput is substantially lower.",
      evidenceId: "queue-pressure-panel",
      evidenceLabel:
        "QUEUE INGESTS 800/MIN BUT PROCESSES ONLY 260/MIN",
      stats: [
        {
          label: "DEPTH",
          value: "42,133",
          state: "critical",
        },
        {
          label: "INGRESS",
          value: "800/min",
          state: "normal",
        },
        {
          label: "PROCESSING",
          value: "260/min",
          state: "critical",
        },
        {
          label: "OLDEST MESSAGE",
          value: "18m 42s",
          state: "critical",
        },
        {
          label: "WORKERS",
          value: "8",
          state: "normal",
        },
        {
          label: "DLQ",
          value: "3",
          state: "warning",
        },
      ],
    },
    dependencies: healthyDependencies(),
  },

  events: [
    {
      id: "worker-deploy",
      offset: -840,
      label: "WORKER DEPLOY",
      detail: "order-worker v8.2.0",
      kind: "change",
    },
    {
      id: "queue-growth",
      offset: -360,
      label: "QUEUE DEPTH RISING",
      kind: "warning",
    },
    {
      id: "queue-alert",
      offset: -180,
      label: "PROCESSING DELAY ALERT",
      kind: "alert",
    },
  ],

  actions: [
    {
      id: "pause-poison",
      label: "QUARANTINE POISON MESSAGE",
      target: "order 843992",
      costSeconds: 45,
      potential:
        "Problematic message moves aside and normal processing resumes.",
      consequence:
        "Worker throughput recovered and the backlog started draining.",
      effect: "mitigate",
    },
    {
      id: "rollback-worker",
      label: "ROLL BACK ORDER WORKER",
      target: "v8.2.0 → v8.1.6",
      costSeconds: 90,
      potential:
        "Consumers are replaced gradually.",
      consequence:
        "Retry behaviour returned to the previous implementation.",
      effect: "mitigate",
    },
    {
      id: "scale-workers",
      label: "SCALE WORKERS",
      target: "8 → 24",
      costSeconds: 60,
      potential:
        "More consumers will process messages concurrently.",
      consequence:
        "More workers repeatedly consumed the same failing workload.",
      effect: "waste",
    },
    {
      id: "drain-queue",
      label: "DROP QUEUE",
      target: "orders-queue",
      costSeconds: 20,
      potential:
        "Pending jobs will be discarded.",
      consequence:
        "Pending customer orders were discarded. Impact increased sharply.",
      effect: "harm",
      dangerDelta: 3,
    },
  ],

  rootCause: {
    componentId: "order-worker",
    cause: "poison message retry loop",
    trigger: "v8.2.0 retry change",
    summary:
      "A worker retry change caused a poison fulfillment message to retry continuously, collapsing throughput.",
    criticalEvidenceIds: [
      "queue-depth",
      "queue-processing",
      "poison-message",
      "worker-820",
    ],
  },

  hints: [
    "The API is accepting orders. What happens after that?",
    "Compare queue ingress with processing throughput.",
    "Inspect repeated worker failures and retry behaviour.",
  ],

  postmortem: {
    contributingFactors: [
      "Poison messages had no retry ceiling.",
      "The dead-letter policy did not cover validation failures.",
    ],
    followUps: [
      "Add bounded retries.",
      "Route poison messages to DLQ.",
      "Alert on ingress/processing divergence.",
    ],
    mitigation:
      "Quarantine the poison message or rollback the worker.",
  },
};
