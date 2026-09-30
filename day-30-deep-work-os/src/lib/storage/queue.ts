import { db } from "@/lib/storage/db";
import { uid } from "@/lib/utils";
import type { SyncEntity } from "@/types";

export async function queueUpsert(
  entity: SyncEntity,
  recordId: string,
  payload: unknown,
) {
  await db.syncQueue.add({
    id: uid(),
    entity,
    recordId,
    operation: "upsert",
    payload,
    createdAt: new Date().toISOString(),
    attempts: 0,
  });
}

export async function queueDelete(
  entity: SyncEntity,
  recordId: string,
) {
  await db.syncQueue.add({
    id: uid(),
    entity,
    recordId,
    operation: "delete",
    payload: null,
    createdAt: new Date().toISOString(),
    attempts: 0,
  });
}