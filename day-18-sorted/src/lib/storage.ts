import type {
  PlayerRecords,
  RunRecord,
} from "../types/game";

const RECORDS_KEY =
  "sorted.records.v1";

const HISTORY_KEY =
  "sorted.history.v1";

const TUTORIAL_KEY =
  "sorted.tutorial.v1";

const defaults:
  PlayerRecords = {
    personalBest: 0,
    mostPerfectRounds: 0,
    runsPlayed: 0,
    completedPuzzleIds: [],
    dailyResults: {},
  };

export function loadRecords():
  PlayerRecords {
  try {
    return {
      ...defaults,
      ...JSON.parse(
        localStorage.getItem(
          RECORDS_KEY,
        ) || "{}",
      ),
    };
  } catch {
    return defaults;
  }
}

export function saveRecords(
  records: PlayerRecords,
) {
  localStorage.setItem(
    RECORDS_KEY,
    JSON.stringify(
      records,
    ),
  );
}

export function loadHistory():
  RunRecord[] {
  try {
    return JSON.parse(
      localStorage.getItem(
        HISTORY_KEY,
      ) || "[]",
    );
  } catch {
    return [];
  }
}

export function saveRun(
  record: RunRecord,
) {
  const current =
    loadHistory();

  const isNew =
    !current.some(
      (item) =>
        item.id ===
        record.id,
    );

  const history = [
    record,
    ...current.filter(
      (item) =>
        item.id !==
        record.id,
    ),
  ].slice(
    0,
    30,
  );

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(
      history,
    ),
  );

  return isNew;
}

export function hasSeenTutorial() {
  return (
    localStorage.getItem(
      TUTORIAL_KEY,
    ) === "yes"
  );
}

export function markTutorialSeen() {
  localStorage.setItem(
    TUTORIAL_KEY,
    "yes",
  );
}