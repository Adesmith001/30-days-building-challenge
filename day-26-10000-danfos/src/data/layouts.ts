import type { CityLayout } from "../types";

export const layouts: CityLayout[] = [
  {
    id: "mainland",
    name: "Mainland Rush",
    subtitle: "Yaba → Ikeja → Oshodi",
    nodes: [
      { id: "yaba", name: "YABA", x: -190, z: 40, signal: true },
      { id: "ojuelegba", name: "OJUELEGBA", x: -105, z: 5 },
      { id: "surulere", name: "SURULERE", x: -85, z: 105 },
      { id: "oshodi", name: "OSHODI", x: 10, z: 40, signal: true },
      { id: "ikeja", name: "IKEJA", x: 120, z: 120, signal: true },
      { id: "ketu", name: "KETU", x: 205, z: 55 },
      { id: "mile12", name: "MILE 12", x: 215, z: -65 },
      { id: "cms", name: "CMS", x: -130, z: -145, signal: true },
      { id: "vi", name: "VI", x: -15, z: -175 },
      { id: "lekki", name: "LEKKI", x: 135, z: -160, signal: true },
      { id: "anthony", name: "ANTHONY", x: 35, z: -50 },
      { id: "maryland", name: "MARYLAND", x: 95, z: 10 },
    ],
    edges: [
      { a: 0, b: 1 },
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 2, b: 4 },
      { a: 3, b: 4 },
      { a: 4, b: 5 },
      { a: 5, b: 6 },
      { a: 6, b: 9 },
      { a: 9, b: 8 },
      { a: 8, b: 7 },
      { a: 7, b: 1 },
      { a: 3, b: 10 },
      { a: 10, b: 8 },
      { a: 10, b: 11 },
      { a: 11, b: 4 },
      { a: 11, b: 6 },
      { a: 10, b: 9 },
      { a: 3, b: 11 },
    ],
  },

  {
    id: "island",
    name: "Island Loop",
    subtitle: "CMS → VI → Lekki",
    nodes: [
      { id: "cms", name: "CMS", x: -220, z: -30, signal: true },
      { id: "marina", name: "MARINA", x: -150, z: -110 },
      { id: "ikoyi", name: "IKOYI", x: -95, z: 55, signal: true },
      { id: "vi", name: "VI", x: -15, z: -70, signal: true },
      { id: "oniru", name: "ONIRU", x: 85, z: -80 },
      { id: "lekki1", name: "LEKKI", x: 185, z: -50, signal: true },
      { id: "chevron", name: "CHEVRON", x: 225, z: 65 },
      { id: "ajah", name: "AJAH", x: 160, z: 150 },
      { id: "osborne", name: "OSBORNE", x: -65, z: 155 },
      { id: "falomo", name: "FALOMO", x: 25, z: 55 },
      { id: "eko", name: "EKO ATLANTIC", x: -35, z: -170 },
    ],
    edges: [
      { a: 0, b: 1 },
      { a: 0, b: 2 },
      { a: 1, b: 3 },
      { a: 1, b: 10 },
      { a: 10, b: 3 },
      { a: 3, b: 4 },
      { a: 4, b: 5 },
      { a: 5, b: 6 },
      { a: 6, b: 7 },
      { a: 7, b: 9 },
      { a: 9, b: 8 },
      { a: 8, b: 2 },
      { a: 2, b: 9 },
      { a: 9, b: 3 },
      { a: 3, b: 5 },
      { a: 4, b: 9 },
    ],
  },

  {
    id: "interchange",
    name: "Interchange",
    subtitle: "Dense junction laboratory",
    nodes: [
      { id: "west", name: "WEST", x: -230, z: 0 },
      { id: "northwest", name: "NW", x: -125, z: 125 },
      { id: "north", name: "IKEJA", x: 0, z: 205, signal: true },
      { id: "northeast", name: "KETU", x: 130, z: 125 },
      { id: "east", name: "MILE 12", x: 230, z: 0 },
      { id: "southeast", name: "LEKKI", x: 130, z: -130 },
      { id: "south", name: "VI", x: 0, z: -205, signal: true },
      { id: "southwest", name: "CMS", x: -130, z: -130 },
      { id: "center", name: "OSHODI", x: 0, z: 0, signal: true },
      { id: "innerW", name: "YABA", x: -75, z: 0 },
      { id: "innerE", name: "MARYLAND", x: 75, z: 0 },
      { id: "innerN", name: "OJUELEGBA", x: 0, z: 75 },
      { id: "innerS", name: "SURULERE", x: 0, z: -75 },
    ],
    edges: [
      { a: 0, b: 9 },
      { a: 9, b: 8 },
      { a: 8, b: 10 },
      { a: 10, b: 4 },
      { a: 2, b: 11 },
      { a: 11, b: 8 },
      { a: 8, b: 12 },
      { a: 12, b: 6 },
      { a: 1, b: 9 },
      { a: 1, b: 11 },
      { a: 3, b: 10 },
      { a: 3, b: 11 },
      { a: 5, b: 10 },
      { a: 5, b: 12 },
      { a: 7, b: 9 },
      { a: 7, b: 12 },
      { a: 9, b: 11 },
      { a: 11, b: 10 },
      { a: 10, b: 12 },
      { a: 12, b: 9 },
    ],
  },
];

export function getLayout(id: string) {
  return layouts.find((layout) => layout.id === id) ?? layouts[0];
}

export function getLayoutBounds(layout: CityLayout) {
  const xs = layout.nodes.map((node) => node.x);
  const zs = layout.nodes.map((node) => node.z);

  return {
    minX: Math.min(...xs) - 70,
    maxX: Math.max(...xs) + 70,
    minZ: Math.min(...zs) - 70,
    maxZ: Math.max(...zs) + 70,
  };
}
