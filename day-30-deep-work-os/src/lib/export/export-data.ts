import { db } from "@/lib/storage/db";

export async function collectExportData() {
  const [sessions, sessionEvents, checkpoints, parkedItems, projects, dailyPlans] = await Promise.all([
    db.sessions.toArray(),
    db.sessionEvents.toArray(),
    db.checkpoints.toArray(),
    db.parkedItems.toArray(),
    db.projects.toArray(),
    db.dailyPlans.toArray(),
  ]);
  return { exportedAt: new Date().toISOString(), sessions, sessionEvents, checkpoints, parkedItems, projects, dailyPlans };
}

export async function downloadExport() {
  const payload = JSON.stringify(await collectExportData(), null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `deep-work-os-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
