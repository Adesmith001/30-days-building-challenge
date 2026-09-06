import type {
  StopId,
  TrafficLevel,
} from "../types/game";

export interface RouteDefinition {
  id: string;
  from: StopId;
  to: StopId;
  name: string;
  difficulty: number;
}

export const ROUTES: RouteDefinition[] = [
  {
    id: "ikeja-oshodi",
    from: "ikeja",
    to: "oshodi",
    name: "AGEGE MOTOR ROAD",
    difficulty: 1.1,
  },
  {
    id: "ikeja-yaba",
    from: "ikeja",
    to: "yaba",
    name: "MAINLAND EXPRESS",
    difficulty: 1.3,
  },
  {
    id: "oshodi-yaba",
    from: "oshodi",
    to: "yaba",
    name: "MUSHIN LINK",
    difficulty: 1.15,
  },
  {
    id: "yaba-ojuelegba",
    from: "yaba",
    to: "ojuelegba",
    name: "HERBERT MACAULAY",
    difficulty: 1.05,
  },
  {
    id: "ojuelegba-surulere",
    from: "ojuelegba",
    to: "surulere",
    name: "WESTERN AVENUE",
    difficulty: 1,
  },
  {
    id: "yaba-cms",
    from: "yaba",
    to: "cms",
    name: "THIRD MAINLAND",
    difficulty: 1.4,
  },
  {
    id: "ojuelegba-cms",
    from: "ojuelegba",
    to: "cms",
    name: "CARTER LINK",
    difficulty: 1.25,
  },
  {
    id: "cms-vi",
    from: "cms",
    to: "vi",
    name: "MARINA AXIS",
    difficulty: 1,
  },
  {
    id: "vi-lekki",
    from: "vi",
    to: "lekki",
    name: "LEKKI-EPE",
    difficulty: 1.2,
  },
  {
    id: "cms-lekki",
    from: "cms",
    to: "lekki",
    name: "COASTAL LINK",
    difficulty: 1.45,
  },
];

export const TRAFFIC_SPEED: Record<
  TrafficLevel,
  number
> = {
  clear: 1,
  slow: 0.78,
  "go-slow": 0.5,
  madness: 0.3,
};

export const TRAFFIC_COST: Record<
  TrafficLevel,
  number
> = {
  clear: 1,
  slow: 1.3,
  "go-slow": 2,
  madness: 3.4,
};