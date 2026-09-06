export interface Rank {
  name: string;
  minimum: number;
}

export const RANKS: Rank[] = [
  {
    name: "ROOKIE CONDUCTOR",
    minimum: 0,
  },
  {
    name: "ROUTE BOY",
    minimum: 4_000,
  },
  {
    name: "AREA MASTER",
    minimum: 8_000,
  },
  {
    name: "TRANSPORT BOSS",
    minimum: 12_000,
  },
  {
    name: "LAGOS LEGEND",
    minimum: 16_000,
  },
];

export function getRank(score: number): Rank {
  return [...RANKS]
    .reverse()
    .find((rank) => score >= rank.minimum) ?? RANKS[0];
}

export function getNextRank(score: number): Rank | null {
  return RANKS.find((rank) => rank.minimum > score) ?? null;
}