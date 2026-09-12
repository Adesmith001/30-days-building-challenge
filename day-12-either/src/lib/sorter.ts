import type { SortState } from "../types";

export type SortChoice =
  | "left"
  | "right"
  | "tie";

function cloneState(state: SortState): SortState {
  return {
    runs: state.runs.map((run) => [...run]),
    nextRuns: state.nextRuns.map((run) => [...run]),
    runIndex: state.runIndex,
    leftIndex: state.leftIndex,
    rightIndex: state.rightIndex,
    merged: [...state.merged],
    done: state.done,
    ranking: [...state.ranking],
  };
}

function resetCurrentMerge(state: SortState) {
  state.leftIndex = 0;
  state.rightIndex = 0;
  state.merged = [];
}

function normalizeState(input: SortState): SortState {
  const state = cloneState(input);

  if (state.done) {
    return state;
  }

  while (!state.done) {
    if (state.runs.length === 1) {
      state.done = true;
      state.ranking = [...state.runs[0]];

      return state;
    }

    if (state.runIndex >= state.runs.length) {
      if (state.nextRuns.length === 1) {
        state.done = true;
        state.ranking = [...state.nextRuns[0]];

        return state;
      }

      state.runs = state.nextRuns.map((run) => [
        ...run,
      ]);

      state.nextRuns = [];
      state.runIndex = 0;

      resetCurrentMerge(state);

      continue;
    }

    const left = state.runs[state.runIndex];

    const right =
      state.runs[state.runIndex + 1];

    if (!right) {
      state.nextRuns.push([...left]);
      state.runIndex += 2;

      resetCurrentMerge(state);

      continue;
    }

    const leftFinished =
      state.leftIndex >= left.length;

    const rightFinished =
      state.rightIndex >= right.length;

    if (leftFinished || rightFinished) {
      const remainder = [
        ...left.slice(state.leftIndex),
        ...right.slice(state.rightIndex),
      ];

      const completed = [
        ...state.merged,
        ...remainder,
      ];

      state.nextRuns.push(completed);
      state.runIndex += 2;

      resetCurrentMerge(state);

      continue;
    }

    return state;
  }

  return state;
}

export function createSortState(
  optionIds: string[],
): SortState {
  const initial: SortState = {
    runs: optionIds.map((id) => [id]),
    nextRuns: [],
    runIndex: 0,
    leftIndex: 0,
    rightIndex: 0,
    merged: [],
    done: optionIds.length <= 1,
    ranking:
      optionIds.length === 1 ? [...optionIds] : [],
  };

  return normalizeState(initial);
}

export function getCurrentPair(
  input: SortState,
) {
  const state = normalizeState(input);

  if (state.done) {
    return null;
  }

  const leftRun = state.runs[state.runIndex];

  const rightRun =
    state.runs[state.runIndex + 1];

  if (!leftRun || !rightRun) {
    return null;
  }

  const leftId =
    leftRun[state.leftIndex];

  const rightId =
    rightRun[state.rightIndex];

  if (!leftId || !rightId) {
    return null;
  }

  return {
    leftId,
    rightId,
  };
}

export function applyChoice(
  input: SortState,
  choice: SortChoice,
) {
  const normalized = normalizeState(input);

  if (normalized.done) {
    return normalized;
  }

  const pair = getCurrentPair(normalized);

  if (!pair) {
    return normalizeState(normalized);
  }

  const state = cloneState(normalized);

  if (choice === "left") {
    state.merged.push(pair.leftId);
    state.leftIndex += 1;
  }

  if (choice === "right") {
    state.merged.push(pair.rightId);
    state.rightIndex += 1;
  }

  if (choice === "tie") {
    state.merged.push(
      pair.leftId,
      pair.rightId,
    );

    state.leftIndex += 1;
    state.rightIndex += 1;
  }

  return normalizeState(state);
}

export function estimateComparisons(
  optionCount: number,
) {
  if (optionCount <= 1) {
    return 0;
  }

  const levels =
    Math.ceil(Math.log2(optionCount));

  return (
    optionCount * levels -
    2 ** levels +
    1
  );
}