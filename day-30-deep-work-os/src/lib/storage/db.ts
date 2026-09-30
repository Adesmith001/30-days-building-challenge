import Dexie, { type EntityTable } from "dexie";

import type {
  DailyPlan,
  DeepWorkSession,
  ParkedItem,
  Project,
  SessionCheckpoint,
  SessionEvent,
} from "@/types";

class DeepWorkDB extends Dexie {
  sessions!: EntityTable<DeepWorkSession, "id">;
  sessionEvents!: EntityTable<SessionEvent, "id">;
  checkpoints!: EntityTable<SessionCheckpoint, "id">;
  parkedItems!: EntityTable<ParkedItem, "id">;
  projects!: EntityTable<Project, "id">;
  dailyPlans!: EntityTable<DailyPlan, "id">;

  constructor() {
    super("deep-work-os");

    this.version(1).stores({
      sessions:
        "id,status,resultStatus,projectId,createdAt,updatedAt,startedAt,endedAt",
      sessionEvents: "id,sessionId,type,timestamp",
      checkpoints: "id,sessionId,createdAt",
      parkedItems: "id,sessionId,resolved,createdAt",
    });

    this.version(2).stores({
      sessions:
        "id,status,resultStatus,projectId,createdAt,updatedAt,startedAt,endedAt",
      sessionEvents: "id,sessionId,type,timestamp",
      checkpoints: "id,sessionId,createdAt",
      parkedItems: "id,sessionId,resolved,createdAt",
      projects: "id,name,archived,createdAt,updatedAt",
      dailyPlans: "id,date,updatedAt",
    });
  }
}

export const db = new DeepWorkDB();
