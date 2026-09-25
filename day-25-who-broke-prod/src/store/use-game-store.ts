import { create } from "zustand";
import { persist } from "zustand/middleware";
import { scenarios, getScenario } from "@/data/incidents";
import {
  advanceRun,
  createRun,
  panelCosts,
} from "@/lib/simulation";
import { calculateScore } from "@/lib/scoring";
import { hashString } from "@/lib/rng";
import type {
  AppView,
  EvidencePin,
  HistoryRecord,
  Hypothesis,
  Panel,
  RootCauseSubmission,
} from "@/types";

interface ShiftState {
  ids: string[];
  index: number;
  scores: number[];
}

interface CompletedShift {
  ids: string[];
  scores: number[];
}

interface GameStore {
  view: AppView;
  run: ReturnType<typeof createRun> | null;
  history: HistoryRecord[];
  shift: ShiftState | null;
  completedShift: CompletedShift | null;

  setView: (view: AppView) => void;
  startIncident: (id: string) => void;
  startDaily: () => void;
  startShift: () => void;
  acknowledge: () => void;
  openPanel: (panel: Panel) => void;
  pinEvidence: (
    pin: Omit<EvidencePin, "id" | "at">,
  ) => void;
  saveHypothesis: (
    hypothesis: Omit<
      Hypothesis,
      "id" | "at"
    >,
  ) => void;
  setNotes: (notes: string) => void;
  executeAction: (id: string) => void;
  tickMitigation: () => void;
  verifyRecovery: () => void;
  goRootCause: () => void;
  submitRootCause: (
    submission: RootCauseSubmission,
  ) => void;
  showScore: () => void;
  continueAfterScore: () => void;
  restartIncident: () => void;
  abandonIncident: () => void;
  togglePause: () => void;
  useHint: (level: number) => void;
}

function loadRun(id: string) {
  const scenario = getScenario(id);

  if (!scenario) {
    throw new Error(
      `Unknown incident: ${id}`,
    );
  }

  return createRun(scenario);
}

export const useGameStore =
  create<GameStore>()(
    persist(
      (set, get) => ({
        view: "landing",
        run: null,
        history: [],
        shift: null,
        completedShift: null,

        setView: (view) => set({ view }),

        startIncident: (id) =>
          set({
            run: loadRun(id),
            view: "incident",
            completedShift: null,
          }),

        startDaily: () => {
          const date = new Date()
            .toISOString()
            .slice(0, 10);

          const index =
            hashString(
              `who-broke-prod-${date}`,
            ) % scenarios.length;

          set({
            run: loadRun(
              scenarios[index].id,
            ),
            view: "incident",
          });
        },

        startShift: () => {
          const ids = scenarios
            .slice(0, 3)
            .map((scenario) => scenario.id);

          set({
            shift: {
              ids,
              index: 0,
              scores: [],
            },
            run: loadRun(ids[0]),
            view: "incident",
            completedShift: null,
          });
        },

        acknowledge: () =>
          set((state) => ({
            run: state.run
              ? {
                  ...state.run,
                  status: "investigating",
                }
              : null,
          })),

        openPanel: (panel) =>
          set((state) => {
            if (!state.run) {
              return state;
            }

            const scenario = getScenario(
              state.run.scenarioId,
            );

            const seconds =
              panelCosts[panel] ?? 0;

            return {
              run: {
                ...advanceRun(
                  scenario,
                  state.run,
                  seconds,
                ),
                panel,
              },
            };
          }),

        pinEvidence: (pin) =>
          set((state) => {
            if (!state.run) {
              return state;
            }

            const exists =
              state.run.evidence.some(
                (item) =>
                  item.sourceId ===
                  pin.sourceId,
              );

            if (exists) {
              return state;
            }

            return {
              run: {
                ...state.run,
                evidence: [
                  ...state.run.evidence,
                  {
                    ...pin,
                    id: crypto.randomUUID(),
                    at: state.run.simulatedTime,
                  },
                ],
              },
            };
          }),

        saveHypothesis: (hypothesis) =>
          set((state) => {
            if (!state.run) {
              return state;
            }

            return {
              run: {
                ...state.run,
                hypotheses: [
                  ...state.run.hypotheses,
                  {
                    ...hypothesis,
                    id: crypto.randomUUID(),
                    at: state.run.simulatedTime,
                  },
                ],
              },
            };
          }),

        setNotes: (notes) =>
          set((state) => ({
            run: state.run
              ? {
                  ...state.run,
                  notes,
                }
              : null,
          })),

        executeAction: (id) =>
          set((state) => {
            if (!state.run) {
              return state;
            }

            const scenario = getScenario(
              state.run.scenarioId,
            );

            const action =
              scenario.actions.find(
                (item) => item.id === id,
              );

            if (!action) {
              return state;
            }

            const executed = {
              id: crypto.randomUUID(),
              actionId: action.id,
              label: action.label,
              effect: action.effect,
              consequence:
                action.consequence,
              at: state.run.simulatedTime,
            };

            if (
              action.effect === "mitigate"
            ) {
              return {
                run: {
                  ...state.run,
                  status: "mitigating",
                  mitigationStartedAt:
                    state.run.simulatedTime,
                  activeAction: {
                    actionId: action.id,
                    label: action.label,
                    startAt:
                      state.run.simulatedTime,
                    endsAt:
                      state.run.simulatedTime +
                      action.costSeconds,
                  },
                  actions: [
                    ...state.run.actions,
                    executed,
                  ],
                },
              };
            }

            const advanced = advanceRun(
              scenario,
              state.run,
              action.costSeconds,
            );

            return {
              run: {
                ...advanced,
                danger:
                  advanced.danger +
                  (action.dangerDelta ?? 0),
                actions: [
                  ...advanced.actions,
                  executed,
                ],
              },
            };
          }),

        tickMitigation: () =>
          set((state) => {
            if (
              !state.run?.activeAction ||
              state.run.paused
            ) {
              return state;
            }

            const scenario = getScenario(
              state.run.scenarioId,
            );

            const next = advanceRun(
              scenario,
              state.run,
              15,
            );

            if (
              next.simulatedTime >=
              state.run.activeAction.endsAt
            ) {
              return {
                run: {
                  ...next,
                  simulatedTime:
                    state.run.activeAction
                      .endsAt,
                  status: "verifying",
                  recoveryAt:
                    state.run.activeAction
                      .endsAt,
                  activeAction: undefined,
                },
              };
            }

            return {
              run: next,
            };
          }),

        verifyRecovery: () =>
          set((state) => ({
            run:
              state.run?.status ===
              "verifying"
                ? {
                    ...state.run,
                    status: "recovered",
                    verified: true,
                  }
                : state.run,
          })),

        goRootCause: () =>
          set((state) => ({
            run: state.run
              ? {
                  ...state.run,
                  status: "root-cause",
                }
              : null,
          })),

        submitRootCause: (submission) =>
          set((state) => ({
            run: state.run
              ? {
                  ...state.run,
                  rootCauseSubmission:
                    submission,
                  status: "postmortem",
                }
              : null,
          })),

        showScore: () =>
          set((state) => {
            if (!state.run) {
              return state;
            }

            const scenario = getScenario(
              state.run.scenarioId,
            );

            const score = calculateScore(
              scenario,
              state.run,
            );

            const record: HistoryRecord = {
              id: crypto.randomUUID(),
              scenarioId: scenario.id,
              scenarioTitle:
                scenario.title,
              completedAt:
                new Date().toISOString(),
              score: score.total,
              rank: score.rank,
              recoveryTime:
                state.run.recoveryAt ??
                state.run.simulatedTime,
              impact: state.run.impact,
            };

            const shift = state.shift
              ? {
                  ...state.shift,
                  scores: [
                    ...state.shift.scores,
                    score.total,
                  ],
                }
              : null;

            return {
              run: {
                ...state.run,
                status: "score",
                finalScore: score,
              },
              history: [
                record,
                ...state.history,
              ].slice(0, 50),
              shift,
            };
          }),

        continueAfterScore: () => {
          const state = get();

          if (!state.shift) {
            set({
              run: null,
              view: "library",
            });

            return;
          }

          const nextIndex =
            state.shift.index + 1;

          if (
            nextIndex <
            state.shift.ids.length
          ) {
            const id =
              state.shift.ids[nextIndex];

            set({
              shift: {
                ...state.shift,
                index: nextIndex,
              },
              run: loadRun(id),
              view: "incident",
            });

            return;
          }

          set({
            completedShift: {
              ids: state.shift.ids,
              scores: state.shift.scores,
            },
            shift: null,
            run: null,
            view: "shift-complete",
          });
        },

        restartIncident: () =>
          set((state) => {
            if (!state.run) {
              return state;
            }

            return {
              run: loadRun(
                state.run.scenarioId,
              ),
              view: "incident",
            };
          }),

        abandonIncident: () =>
          set({
            run: null,
            shift: null,
            view: "landing",
          }),

        togglePause: () =>
          set((state) => ({
            run: state.run
              ? {
                  ...state.run,
                  paused:
                    !state.run.paused,
                }
              : null,
          })),

        useHint: (level) =>
          set((state) => {
            if (
              !state.run ||
              state.run.hintsUsed.includes(
                level,
              )
            ) {
              return state;
            }

            return {
              run: {
                ...state.run,
                hintsUsed: [
                  ...state.run.hintsUsed,
                  level,
                ],
              },
            };
          }),
      }),
      {
        name: "who-broke-prod-v1",
      },
    ),
  );
