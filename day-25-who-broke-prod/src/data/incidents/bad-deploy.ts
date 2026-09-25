import type { IncidentScenario } from "@/types";
import {
  commerceEdges,
  commerceServices,
  healthyCache,
  healthyDatabase,
  healthyDependencies,
  healthyQueue,
} from "./shared";

export const badDeploy: IncidentScenario = {
  id: "bad-deploy",
  number: "01",
  title: "BAD DEPLOY",
  subtitle: "CHECKOUT FAILURE",
  skill: "CHANGE CORRELATION",
  severity: "SEV-2",
  difficulty: "STANDARD",
  region: "EU-WEST",
  startClock: "14:10:00",
  degradeAt: -240,
  seed: 2501,
  impactStart: 127,
  impactPerMinute: 48,

  alert: {
    title: "CHECKOUT FAILURE",
    metric: "CHECKOUT SUCCESS",
    current: "61%",
    baseline: "98.7%",
    startedAgo: "2 MIN AGO",
    affected: "CHECKOUT",
    region: "EU-WEST",
    customerText:
      "CUSTOMERS ARE FAILING TO COMPLETE ORDERS.",
  },

  services: commerceServices(
    "checkout-api",
    "checkout-api",
    "v2.4.1",
  ),

  dependencies: commerceEdges("checkout-api"),

  metrics: [
    {
      id: "error-rate",
      label: "CHECKOUT ERROR RATE",
      serviceId: "checkout-api",
      unit: "%",
      normal: 0.8,
      incident: 18.4,
      noise: 0.5,
      decimals: 1,
      evidenceLabel:
        "ERROR RATE BEGAN RISING AT 14:06",
    },
    {
      id: "latency",
      label: "LATENCY P95",
      serviceId: "checkout-api",
      unit: "ms",
      normal: 190,
      incident: 1800,
      noise: 38,
      decimals: 0,
    },
    {
      id: "request-rate",
      label: "REQUEST RATE",
      serviceId: "checkout-api",
      unit: "/min",
      normal: 1180,
      incident: 1200,
      noise: 22,
      decimals: 0,
    },
    {
      id: "cpu",
      label: "CPU",
      serviceId: "checkout-api",
      unit: "%",
      normal: 39,
      incident: 42,
      noise: 1.8,
      decimals: 0,
    },
    {
      id: "success",
      label: "CHECKOUT SUCCESS",
      serviceId: "checkout-api",
      unit: "%",
      normal: 98.7,
      incident: 61,
      noise: 0.8,
      decimals: 1,
    },
  ],

  logs: [
    {
      id: "log-serialize-1",
      offset: -227,
      level: "ERROR",
      service: "checkout-api",
      message:
        'Failed to serialize shippingAddress: unexpected field "district"',
      traceId: "ab12d90f",
      evidenceLabel:
        "SERIALIZATION FAILURES BEGIN AFTER DEPLOY",
    },
    {
      id: "log-serialize-2",
      offset: -224,
      level: "ERROR",
      service: "checkout-api",
      message:
        "checkout response serialization failed schema=ShippingAddressV3",
      traceId: "ef721bd0",
    },
    {
      id: "log-gateway",
      offset: -221,
      level: "WARN",
      service: "gateway",
      message:
        "checkout upstream returned 500 after 1811ms",
      traceId: "ef721bd0",
    },
    {
      id: "log-payment",
      offset: -220,
      level: "INFO",
      service: "payment-service",
      message:
        "provider request completed status=200 duration=84ms",
    },
    {
      id: "log-cart",
      offset: -217,
      level: "INFO",
      service: "checkout-api",
      message:
        "request completed method=GET path=/cart status=200",
    },
  ],

  traces: [
    {
      id: "ab12d90f",
      offset: -218,
      root: "POST /checkout",
      status: "error",
      durationMs: 1840,
      evidenceLabel:
        "FAILING TRACE ISOLATES FAILURE TO CHECKOUT API",
      spans: [
        {
          id: "a1",
          service: "gateway",
          operation: "POST /checkout",
          startMs: 0,
          durationMs: 1840,
          depth: 0,
          status: "error",
        },
        {
          id: "a2",
          service: "checkout-api",
          operation: "checkout",
          startMs: 20,
          durationMs: 1710,
          depth: 1,
          status: "error",
          annotation: "SERIALIZATION FAILURE",
        },
        {
          id: "a3",
          service: "postgres",
          operation: "SELECT cart",
          startMs: 82,
          durationMs: 31,
          depth: 2,
          status: "ok",
        },
        {
          id: "a4",
          service: "redis",
          operation: "GET session",
          startMs: 121,
          durationMs: 4,
          depth: 2,
          status: "ok",
        },
        {
          id: "a5",
          service: "payment-service",
          operation: "authorize",
          startMs: 144,
          durationMs: 112,
          depth: 2,
          status: "ok",
        },
      ],
    },
    {
      id: "cc48e110",
      offset: -210,
      root: "GET /cart",
      status: "ok",
      durationMs: 142,
      spans: [],
    },
  ],

  deploys: [
    {
      id: "deploy-payment-187",
      offset: -3120,
      serviceId: "payment-service",
      version: "v1.8.7",
      commit: "11df73a",
      summary: "Provider telemetry headers",
    },
    {
      id: "deploy-front-312",
      offset: -1680,
      serviceId: "web",
      version: "v3.1.2",
      commit: "71dcee9",
      summary: "Cart spacing adjustment",
    },
    {
      id: "deploy-checkout-241",
      offset: -420,
      serviceId: "checkout-api",
      version: "v2.4.1",
      commit: "a18f93c",
      summary: "Normalize checkout shipping payload",
      evidenceLabel:
        "CHECKOUT API V2.4.1 DEPLOYED AT 14:03",
    },
  ],

  flags: [
    {
      id: "new-checkout-flow",
      name: "NEW_CHECKOUT_FLOW",
      enabled: true,
      rollout: 100,
      changedOffset: -28800,
    },
  ],

  tools: {
    database: healthyDatabase(),
    cache: healthyCache(),
    queues: healthyQueue(),
    dependencies: healthyDependencies(),
  },

  events: [
    {
      id: "normal",
      offset: -720,
      label: "NORMAL CHECKOUT TRAFFIC",
      kind: "normal",
    },
    {
      id: "deploy",
      offset: -420,
      label: "DEPLOY",
      detail: "checkout-api v2.4.1",
      kind: "change",
    },
    {
      id: "errors",
      offset: -240,
      label: "CHECKOUT ERROR RATE RISING",
      kind: "warning",
    },
    {
      id: "alert",
      offset: -120,
      label: "ALERT FIRED",
      detail: "checkout success below threshold",
      kind: "alert",
    },
  ],

  actions: [
    {
      id: "rollback-checkout",
      label: "ROLL BACK CHECKOUT API",
      target: "v2.4.1 → v2.4.0",
      costSeconds: 90,
      potential:
        "Instances will be replaced gradually.",
      consequence:
        "Older checkout instances are replacing v2.4.1.",
      effect: "mitigate",
    },
    {
      id: "restart-checkout",
      label: "RESTART CHECKOUT API",
      target: "checkout-api",
      costSeconds: 45,
      potential:
        "All instances restart gradually.",
      consequence:
        "Instances restarted. Error rate briefly dips, then returns.",
      effect: "waste",
    },
    {
      id: "scale-checkout",
      label: "SCALE CHECKOUT API",
      target: "6 → 12 instances",
      costSeconds: 60,
      potential:
        "Capacity doubles while configuration remains unchanged.",
      consequence:
        "Capacity increased. Serialization failures continue.",
      effect: "waste",
    },
    {
      id: "purge-redis",
      label: "PURGE REDIS",
      target: "checkout-cache",
      costSeconds: 30,
      potential:
        "Cached checkout data will be removed.",
      consequence:
        "Cache hit rate collapsed and database reads jumped.",
      effect: "harm",
      dangerDelta: 1,
    },
    {
      id: "increase-pool",
      label: "INCREASE DATABASE POOL",
      target: "42 → 80 connections",
      costSeconds: 30,
      potential:
        "Application database concurrency increases.",
      consequence:
        "Pool increased. Checkout failures remain unchanged.",
      effect: "waste",
    },
  ],

  rootCause: {
    componentId: "checkout-api",
    cause: "deployment regression",
    trigger: "v2.4.1 rollout",
    summary:
      "v2.4.1 introduced an incompatible shipping-address serialization change.",
    criticalEvidenceIds: [
      "deploy-checkout-241",
      "error-rate",
      "log-serialize-1",
      "ab12d90f",
    ],
  },

  hints: [
    "Where did the first abnormal signal appear?",
    "Compare the first error spike with recent system changes.",
    "checkout-api v2.4.1 deserves closer inspection.",
  ],

  postmortem: {
    contributingFactors: [
      "No contract coverage for the payload schema change.",
      "The deployment passed unit tests without cross-service serialization validation.",
    ],
    followUps: [
      "Add schema contract tests.",
      "Add a canary error-rate guard.",
      "Alert on serialization failure rate.",
    ],
    mitigation: "Rollback checkout-api to v2.4.0.",
  },
};
