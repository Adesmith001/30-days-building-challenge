import type { IncidentScenario } from "@/types";
import {
  commerceEdges,
  commerceServices,
  healthyCache,
  healthyDatabase,
  healthyDependencies,
  healthyQueue,
} from "./shared";

export const memoryLeak: IncidentScenario = {
  id: "memory-leak",
  number: "06",
  title: "MEMORY LEAK",
  subtitle: "API INSTABILITY",
  skill: "RESOURCE DIAGNOSIS",
  severity: "SEV-2",
  difficulty: "HARD",
  region: "US-EAST",
  startClock: "21:12:00",
  degradeAt: -780,
  seed: 2506,
  impactStart: 51,
  impactPerMinute: 34,

  alert: {
    title: "API INSTABILITY",
    metric: "MEMORY",
    current: "94%",
    baseline: "52%",
    startedAgo: "5 MIN AGO",
    affected: "PROFILE API",
    region: "US-EAST",
    customerText:
      "SOME PROFILE REQUESTS FAIL WHEN INSTANCES RESTART.",
  },

  services: commerceServices(
    "profile-api",
    "profile-api",
    "v7.3.0",
  ),

  dependencies: commerceEdges("profile-api"),

  metrics: [
    {
      id: "memory-usage",
      label: "MEMORY",
      serviceId: "profile-api",
      unit: "%",
      normal: 52,
      incident: 94,
      noise: 1,
      decimals: 0,
      evidenceLabel:
        "PROFILE API MEMORY RISES STEADILY BETWEEN RESTARTS",
    },
    {
      id: "memory-errors",
      label: "ERROR RATE",
      serviceId: "profile-api",
      unit: "%",
      normal: 0.5,
      incident: 8.8,
      noise: 0.4,
      decimals: 1,
    },
    {
      id: "memory-cpu",
      label: "CPU",
      serviceId: "profile-api",
      unit: "%",
      normal: 38,
      incident: 42,
      noise: 1.6,
      decimals: 0,
    },
    {
      id: "memory-latency",
      label: "LATENCY P95",
      serviceId: "profile-api",
      unit: "ms",
      normal: 160,
      incident: 890,
      noise: 34,
      decimals: 0,
    },
  ],

  logs: [
    {
      id: "oom-kill",
      offset: -305,
      level: "ERROR",
      service: "profile-api",
      message:
        "container terminated reason=OOMKilled memory_limit=1024Mi",
      evidenceLabel:
        "PROFILE API INSTANCE WAS OOM-KILLED",
    },
    {
      id: "restart-complete",
      offset: -287,
      level: "INFO",
      service: "profile-api",
      message:
        "instance ready pod=profile-api-7d9f restart_count=1",
    },
    {
      id: "heap-growing",
      offset: -150,
      level: "WARN",
      service: "profile-api",
      message:
        "heap usage above threshold used=872Mi limit=1024Mi",
      evidenceLabel:
        "MEMORY BEGAN CLIMBING AGAIN AFTER RESTART",
    },
  ],

  traces: [
    {
      id: "memorytrace11",
      offset: -140,
      root: "GET /profile",
      status: "ok",
      durationMs: 186,
      evidenceLabel:
        "DEPENDENCIES REMAIN FAST WHILE PROFILE INSTANCE MEMORY CLIMBS",
      spans: [
        {
          id: "m1",
          service: "profile-api",
          operation: "GET /profile",
          startMs: 0,
          durationMs: 186,
          depth: 0,
          status: "ok",
        },
        {
          id: "m2",
          service: "postgres",
          operation: "SELECT profile",
          startMs: 35,
          durationMs: 28,
          depth: 1,
          status: "ok",
        },
      ],
    },
  ],

  deploys: [
    {
      id: "profile-730",
      offset: -960,
      serviceId: "profile-api",
      version: "v7.3.0",
      commit: "b713d28",
      summary: "Profile enrichment cache",
      evidenceLabel:
        "PROFILE API V7.3.0 DEPLOYED BEFORE MEMORY BEGAN CLIMBING",
    },
  ],

  flags: [],

  tools: {
    database: healthyDatabase(),
    cache: healthyCache(),
    queues: healthyQueue(),
    dependencies: healthyDependencies(),
  },

  events: [
    {
      id: "memory-deploy",
      offset: -960,
      label: "DEPLOY",
      detail: "profile-api v7.3.0",
      kind: "change",
    },
    {
      id: "memory-grow",
      offset: -780,
      label: "MEMORY TREND RISING",
      kind: "warning",
    },
    {
      id: "memory-restart-a",
      offset: -305,
      label: "INSTANCE OOM RESTART",
      kind: "system",
    },
    {
      id: "memory-grow-again",
      offset: -150,
      label: "MEMORY RISING AGAIN",
      kind: "warning",
    },
    {
      id: "memory-alert",
      offset: -90,
      label: "API INSTABILITY ALERT",
      kind: "alert",
    },
  ],

  actions: [
    {
      id: "rollback-profile",
      label: "ROLL BACK PROFILE API",
      target: "v7.3.0 → v7.2.6",
      costSeconds: 90,
      potential:
        "Instances return to the previous application version.",
      consequence:
        "New instances stabilize at baseline memory usage.",
      effect: "mitigate",
    },
    {
      id: "restart-profile",
      label: "RESTART PROFILE API",
      target: "all instances",
      costSeconds: 45,
      potential:
        "Heap usage resets immediately.",
      consequence:
        "Memory reset after restart, then began climbing again.",
      effect: "waste",
    },
    {
      id: "scale-profile",
      label: "SCALE PROFILE API",
      target: "6 → 12 instances",
      costSeconds: 60,
      potential:
        "Traffic is distributed across more leaking instances.",
      consequence:
        "Each new instance began the same upward memory trend.",
      effect: "waste",
    },
    {
      id: "raise-memory",
      label: "RAISE MEMORY LIMIT",
      target: "1Gi → 4Gi",
      costSeconds: 70,
      potential:
        "OOM restarts will occur later.",
      consequence:
        "Restarts slowed, but retained memory continued growing.",
      effect: "waste",
    },
  ],

  rootCause: {
    componentId: "profile-api",
    cause: "memory leak",
    trigger: "v7.3.0 rollout",
    summary:
      "Profile enrichment objects were retained per request in v7.3.0, producing a steady heap leak.",
    criticalEvidenceIds: [
      "memory-usage",
      "oom-kill",
      "heap-growing",
      "profile-730",
    ],
  },

  hints: [
    "What changes immediately after an instance restart?",
    "Does the improvement last?",
    "Compare the memory trend with the profile-api deployment.",
  ],

  postmortem: {
    contributingFactors: [
      "No sustained-memory regression test covered the enrichment path.",
      "Heap trend alerts were configured too close to the OOM threshold.",
    ],
    followUps: [
      "Add heap growth alerts.",
      "Run soak tests before deployment.",
      "Add memory-retention profiling to release validation.",
    ],
    mitigation:
      "Rollback profile-api to v7.2.6.",
  },
};
