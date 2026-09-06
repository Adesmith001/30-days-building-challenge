import type { UpgradeId } from "../types/game";

export interface UpgradeDefinition {
  id: UpgradeId;
  name: string;
  description: string;
  stat: string;
}

export const UPGRADES: UpgradeDefinition[] = [
  {
    id: "bigger-bus",
    name: "BIGGER BUS",
    description: "Conductor found two more seats somehow.",
    stat: "+2 CAPACITY",
  },
  {
    id: "sharp-driver",
    name: "SHARP DRIVER",
    description: "This driver knows every shortcut.",
    stat: "+15% SPEED",
  },
  {
    id: "full-tank",
    name: "FULL TANK",
    description: "More movement. Less petrol station drama.",
    stat: "+25% FUEL EFFICIENCY",
  },
  {
    id: "area-boy",
    name: "AREA BOY CONNECTION",
    description: "Traffic somehow respects you a little more.",
    stat: "-15% TRAFFIC PENALTY",
  },
  {
    id: "extra-horn",
    name: "HORN UPGRADE",
    description: "More horn. Because obviously.",
    stat: "+1 HORN / DANFO",
  },
];

export function getUpgradeChoices(
  shift: number,
): UpgradeDefinition[] {
  const offset = (shift - 1) % UPGRADES.length;

  return [
    UPGRADES[offset],
    UPGRADES[(offset + 1) % UPGRADES.length],
    UPGRADES[(offset + 3) % UPGRADES.length],
  ];
}