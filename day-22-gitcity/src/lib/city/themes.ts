import type { SceneTheme, SceneThemeName } from "@/types/scene";

const themes: Record<SceneThemeName, SceneTheme> = {
  graphite: {
    name: "graphite",
    background: "#0b0d10",
    ground: "#0e1215",
    building: "#67737a",
    emptyLot: "#273038",
    accent: "#44f3a9",
    warm: "#f5c369",
    fog: "#0b0d10",
  },
  tungsten: {
    name: "tungsten",
    background: "#120f0a",
    ground: "#19140d",
    building: "#857767",
    emptyLot: "#3a2c1e",
    accent: "#f5c369",
    warm: "#ffdb91",
    fog: "#120f0a",
  },
  "mint-night": {
    name: "mint-night",
    background: "#071410",
    ground: "#0a1c16",
    building: "#4e8f78",
    emptyLot: "#15392d",
    accent: "#72ffd0",
    warm: "#c4ffe9",
    fog: "#071410",
  },
};

export function getSceneTheme(name: SceneThemeName) {
  return themes[name];
}

export function listSceneThemes() {
  return Object.values(themes);
}
