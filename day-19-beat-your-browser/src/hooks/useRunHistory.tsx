import {
  useState,
} from "react";

import type {
  SavedRun,
} from "../types/benchmark";

import {
  loadRuns,
  saveRuns,
} from "../lib/storage";

export function useRunHistory() {
  const [
    runs,
    setRuns,
  ] =
    useState<SavedRun[]>(
      () =>
        loadRuns(),
    );

  const addRun = (
    run: SavedRun,
  ) => {
    setRuns(
      (current) => {
        const next = [
          run,
          ...current,
        ].slice(
          0,
          20,
        );

        saveRuns(next);

        return next;
      },
    );
  };

  const clearRuns = () => {
    setRuns([]);

    saveRuns([]);
  };

  return {
    runs,
    addRun,
    clearRuns,
  };
}