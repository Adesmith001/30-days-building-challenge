const ranks = [
  { min: 0, name: "CURSOR TOURIST" },
  { min: 3000, name: "TRYING" },
  { min: 4500, name: "QUICK HANDS" },
  { min: 6000, name: "BUTTON CHASER" },
  { min: 7500, name: "BUTTON HUNTER" },
  { min: 9000, name: "UNTOUCHABLE" },
];

export function getRank(score: number) {
  return [...ranks]
    .reverse()
    .find((rank) => score >= rank.min) ?? ranks[0];
}

export function getNextRank(score: number) {
  const next = ranks.find((rank) => rank.min > score);

  if (!next) {
    return null;
  }

  return {
    ...next,
    pointsAway: next.min - score,
  };
}