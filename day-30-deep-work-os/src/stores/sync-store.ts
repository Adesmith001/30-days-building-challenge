import { create } from "zustand";

type SyncStatus =
  | "local"
  | "offline"
  | "syncing"
  | "synced"
  | "issue";

interface SyncState {
  status: SyncStatus;
  lastSyncedAt?: string;

  setStatus: (status: SyncStatus) => void;
  markSynced: () => void;
}

export const useSyncStore = create<SyncState>(
  (set) => ({
    status: "local",

    setStatus: (status) => set({ status }),

    markSynced: () =>
      set({
        status: "synced",
        lastSyncedAt:
          new Date().toISOString(),
      }),
  }),
);