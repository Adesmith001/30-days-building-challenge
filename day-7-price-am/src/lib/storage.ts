import type { MarketRecords } from "../types/game";

const tutorialKey = "price-am:tutorial-complete";
const recordsKey = "price-am:records";

export const emptyRecords: MarketRecords = {
  bestScore: 0,
  bestAccuracy: 0,
  bestStreak: 0,
  closestPercent: null,
  lowestSkips: null,
  gamesPlayed: 0,
  totalValueAppraised: 0,
};

export function getTutorialComplete() {
  return localStorage.getItem(tutorialKey) === "true";
}

export function saveTutorialComplete() {
  localStorage.setItem(tutorialKey, "true");
}

export function loadRecords(): MarketRecords {
  const saved = localStorage.getItem(recordsKey);

  if (!saved) {
    return emptyRecords;
  }

  try {
    return {
      ...emptyRecords,
      ...JSON.parse(saved),
    };
  } catch {
    return emptyRecords;
  }
}

export function saveRecords(records: MarketRecords) {
  localStorage.setItem(recordsKey, JSON.stringify(records));
}