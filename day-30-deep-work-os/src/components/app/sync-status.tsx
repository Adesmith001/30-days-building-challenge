"use client";

import { useAuth } from "@/components/auth-provider";
import { useSyncStore } from "@/stores/sync-store";

export function SyncStatus() {
  const { user } = useAuth();

  const status =
    useSyncStore((state) => state.status);

  const labels = {
    local: "This device only",
    offline: "Offline · saved locally",
    syncing: "Syncing…",
    synced: "Synced",
    issue: "Sync needs attention",
  };

  return (
    <div>
      <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
        {user ? "Account" : "Storage"}
      </p>

      <p className="text-xs">
        {user
          ? labels[status]
          : labels.local}
      </p>
    </div>
  );
}