"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  EnvironmentStatus,
  GateEvidence,
  ReleaseSession,
  RollbackPlan,
  RolloutPlan,
  SmokeCheck,
} from "@/types/release";
import { analyzeRelease } from "@/lib/analysis/analyze";
import { classifyFile } from "@/lib/analysis/classify";

export type WorkspaceView =
  | "overview"
  | "changes"
  | "gates"
  | "rollout"
  | "verify"
  | "packet";

interface Store {
  sessions: ReleaseSession[];
  activeId?: string;
  view: WorkspaceView;

  setSession: (session: ReleaseSession) => void;
  setView: (view: WorkspaceView) => void;
  updateActive: (
    updater: (session: ReleaseSession) => ReleaseSession,
  ) => void;

  addEvidence: (
    gateId: string,
    evidence: GateEvidence,
  ) => void;

  waiveGate: (
    gateId: string,
    reason: string,
  ) => void;

  refreshDemoCi: () => void;

  setEnvironment: (
    key: string,
    target: "local" | "preview" | "production",
    status: EnvironmentStatus,
  ) => void;

  saveRollout: (plan: RolloutPlan) => void;
  saveRollback: (plan: RollbackPlan) => void;

  saveSmokeChecks: (
    url: string,
    checks: SmokeCheck[],
  ) => void;

  startVerification: () => void;
  verifyItem: (id: string, note?: string) => void;

  simulatePrChange: () => void;
  reanalyzeDemo: () => void;
}

export const useReleaseStore = create<Store>()(
  persist(
    (set, get) => ({
      sessions: [],
      view: "overview",

      setSession(session) {
        set((state) => ({
          activeId: session.id,
          sessions: upsert(state.sessions, session),
        }));
      },

      setView(view) {
        set({ view });
      },

      updateActive(updater) {
        const activeId = get().activeId;
        if (!activeId) return;

        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === activeId
              ? {
                  ...updater(session),
                  updatedAt: new Date().toISOString(),
                }
              : session,
          ),
        }));
      },

      addEvidence(gateId, evidence) {
        get().updateActive((session) => ({
          ...session,
          gates: session.gates.map((gate) =>
            gate.id === gateId
              ? {
                  ...gate,
                  status: "pass",
                  evidence: [...gate.evidence, evidence],
                }
              : gate,
          ),
        }));
      },

      waiveGate(gateId, reason) {
        get().updateActive((session) => ({
          ...session,
          gates: session.gates.map((gate) =>
            gate.id === gateId
              ? {
                  ...gate,
                  status: "waived",
                  evidence: [
                    ...gate.evidence,
                    {
                      id: crypto.randomUUID(),
                      type: "note",
                      text: reason,
                      by: "ADESMITH",
                      timestamp: new Date().toISOString(),
                    },
                  ],
                }
              : gate,
          ),
        }));
      },

      refreshDemoCi() {
        get().updateActive((session) => ({
          ...session,
          ci: session.ci.map((check) =>
            check.name === "E2E CHECKOUT"
              ? { ...check, status: "pass" }
              : check,
          ),
          gates: session.gates.map((gate) =>
            gate.id === "ci-required"
              ? { ...gate, status: "pass" }
              : gate,
          ),
        }));
      },

      setEnvironment(key, target, status) {
        get().updateActive((session) => {
          const environments = session.environments.map(
            (item) =>
              item.key === key
                ? { ...item, [target]: status }
                : item,
          );

          const environment = environments.find(
            (item) => item.key === key,
          );

          const confirmed =
            environment?.preview === "confirmed" &&
            environment?.production === "confirmed";

          return {
            ...session,
            environments,
            gates: session.gates.map((gate) =>
              gate.id ===
              `env-${key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
                ? {
                    ...gate,
                    status: confirmed
                      ? "pass"
                      : "pending",
                  }
                : gate,
            ),
          };
        });
      },

      saveRollout(plan) {
        get().updateActive((session) => ({
          ...session,
          rollout: plan,
          gates: passGate(session, "rollout-plan"),
        }));
      },

      saveRollback(plan) {
        get().updateActive((session) => ({
          ...session,
          rollback: plan,
          gates: passGate(session, "rollback-plan"),
        }));
      },

      saveSmokeChecks(url, checks) {
        get().updateActive((session) => ({
          ...session,
          previewUrl: url,
          smokeChecks: checks,
          gates: session.gates.map((gate) =>
            gate.id === "preview-smoke"
              ? {
                  ...gate,
                  status: checks.every(
                    (check) => check.status === "pass",
                  )
                    ? "pass"
                    : "fail",
                }
              : gate,
          ),
        }));
      },

      startVerification() {
        get().updateActive((session) => ({
          ...session,
          verificationStartedAt:
            new Date().toISOString(),
        }));
      },

      verifyItem(id, note) {
        get().updateActive((session) => ({
          ...session,
          verification: session.verification.map(
            (item) =>
              item.id === id
                ? { ...item, status: "pass", note }
                : item,
          ),
        }));
      },

      simulatePrChange() {
        get().updateActive((session) => ({
          ...session,
          outdated: true,
          latestHeadSha: "91c77ab",
        }));
      },

      reanalyzeDemo() {
        const current = active(get());
        if (!current) return;

        const authFile = {
          path: "src/middleware/auth.ts",
          status: "modified" as const,
          additions: 54,
          deletions: 12,
          patch: "+export async function authorize() {}",
          areas: classifyFile("src/middleware/auth.ts"),
        };

        const next = analyzeRelease({
          id: current.id,
          title: current.title,
          repository: current.repository,
          source: current.source,
          files: [...current.changedFiles, authFile],
          ci: current.ci,
          baseSha: current.baseSha,
          headSha: current.latestHeadSha,
        });

        const previous = new Map(
          current.gates.map((gate) => [gate.id, gate]),
        );

        next.gates = next.gates.map((gate) => {
          const existing = previous.get(gate.id);

          if (!existing) return gate;

          return {
            ...gate,
            status: existing.status,
            evidence: existing.evidence,
          };
        });

        next.rollout = current.rollout;
        next.rollback = current.rollback;
        next.environments = current.environments;
        next.previewUrl = current.previewUrl;
        next.smokeChecks = current.smokeChecks;

        next.delta = {
          addedFiles: [authFile.path],
          newAreas: ["AUTH"],
          addedGateIds: next.gates
            .filter((gate) => !previous.has(gate.id))
            .map((gate) => gate.id),
          preservedGateIds: next.gates
            .filter((gate) => previous.has(gate.id))
            .map((gate) => gate.id),
        };

        next.outdated = false;

        get().setSession(next);
      },
    }),
    {
      name: "shipcheck-release-store",
    },
  ),
);

function active(store: Store) {
  return store.sessions.find(
    (session) => session.id === store.activeId,
  );
}

function upsert(
  sessions: ReleaseSession[],
  session: ReleaseSession,
) {
  const exists = sessions.some(
    (item) => item.id === session.id,
  );

  return exists
    ? sessions.map((item) =>
        item.id === session.id ? session : item,
      )
    : [session, ...sessions];
}

function passGate(
  session: ReleaseSession,
  id: string,
) {
  return session.gates.map((gate) =>
    gate.id === id
      ? { ...gate, status: "pass" as const }
      : gate,
  );
}