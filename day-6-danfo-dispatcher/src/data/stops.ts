import type { StopId } from "../types/game";

export interface StopDefinition {
  id: StopId;
  name: string;
  code: string;
  position: [number, number, number];
  capacity: number;
  refuel?: boolean;
}

export const STOPS: StopDefinition[] = [
  {
    id: "ikeja",
    name: "IKEJA TERMINAL",
    code: "IKJ",
    position: [-6.4, 0, -4.2],
    capacity: 12,
    refuel: true,
  },
  {
    id: "oshodi",
    name: "OSHODI",
    code: "OSH",
    position: [-3.8, 0, -3],
    capacity: 12,
  },
  {
    id: "yaba",
    name: "YABA HUB",
    code: "YAB",
    position: [-1.4, 0, -0.4],
    capacity: 10,
  },
  {
    id: "ojuelegba",
    name: "OJUELEGBA",
    code: "OJL",
    position: [-4.1, 0, 1],
    capacity: 10,
  },
  {
    id: "surulere",
    name: "SURULERE",
    code: "SRL",
    position: [-5.8, 0, 3.5],
    capacity: 10,
  },
  {
    id: "cms",
    name: "CMS MARINA",
    code: "CMS",
    position: [2.2, 0, 2.3],
    capacity: 14,
    refuel: true,
  },
  {
    id: "vi",
    name: "VI",
    code: "VIC",
    position: [4.5, 0, 1.1],
    capacity: 12,
  },
  {
    id: "lekki",
    name: "LEKKI PHASE 1",
    code: "LKK",
    position: [7, 0, 3.2],
    capacity: 12,
  },
];

export const STOP_IDS = STOPS.map((stop) => stop.id);

export const STOP_BY_ID = Object.fromEntries(
  STOPS.map((stop) => [stop.id, stop]),
) as Record<StopId, StopDefinition>;