export const ranks = [
  {
    min: 0,
    max: 2999,
    name: "JUST LOOKING",
  },
  {
    min: 3000,
    max: 4999,
    name: "MARKET LEARNER",
  },
  {
    min: 5000,
    max: 6999,
    name: "SHARP SHOPPER",
  },
  {
    min: 7000,
    max: 8999,
    name: "PRICE DETECTIVE",
  },
  {
    min: 9000,
    max: Infinity,
    name: "MARKET ORACLE",
  },
];

export function getRank(score: number) {
  return (
    ranks.find(
      (rank) => score >= rank.min && score <= rank.max,
    ) ?? ranks[0]
  );
}

export function pointsToNextRank(score: number) {
  const currentIndex = ranks.findIndex(
    (rank) => score >= rank.min && score <= rank.max,
  );

  const next = ranks[currentIndex + 1];

  if (!next) {
    return 0;
  }

  return Math.max(0, next.min - score);
}