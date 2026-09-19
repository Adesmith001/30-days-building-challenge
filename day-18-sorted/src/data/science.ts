import type {
  SortPuzzle,
} from "../types/game";

import {
  assets,
} from "./assets";

export const sciencePuzzles:
  SortPuzzle[] = [
  {
    id: "science-body-size",
    prompt:
      "SMALLEST → LARGEST",
    direction: "asc",
    category: "SCIENCE",
    difficulty: "easy",
    description:
      "Sort by approximate diameter.",
    fact:
      "Mercury is larger than the Moon but smaller than Mars.",
    items: [
      {
        id: "moon",
        label: "Moon",
        value: 3474,
        displayValue:
          "3,474 km",
        image: assets.space,
      },
      {
        id: "mercury",
        label: "Mercury",
        value: 4879,
        displayValue:
          "4,879 km",
        image: assets.space,
      },
      {
        id: "mars",
        label: "Mars",
        value: 6779,
        displayValue:
          "6,779 km",
        image: assets.space,
      },
      {
        id: "earth",
        label: "Earth",
        value: 12742,
        displayValue:
          "12,742 km",
        image: assets.earth,
      },
    ],
  },
  {
    id: "science-sun-distance",
    prompt:
      "CLOSEST → FARTHEST",
    direction: "asc",
    category: "SCIENCE",
    difficulty: "easy",
    description:
      "Order by average distance from the Sun.",
    fact:
      "Mars orbits about 228 million kilometres from the Sun on average.",
    items: [
      {
        id: "mercury",
        label: "Mercury",
        value: 57.9,
        displayValue:
          "57.9M km",
        image: assets.space,
      },
      {
        id: "venus",
        label: "Venus",
        value: 108.2,
        displayValue:
          "108.2M km",
        image: assets.space,
      },
      {
        id: "earth",
        label: "Earth",
        value: 149.6,
        displayValue:
          "149.6M km",
        image: assets.earth,
      },
      {
        id: "mars",
        label: "Mars",
        value: 227.9,
        displayValue:
          "227.9M km",
        image: assets.space,
      },
    ],
  },
  {
    id: "science-day-length",
    prompt:
      "SHORTEST → LONGEST",
    direction: "asc",
    category: "SCIENCE",
    difficulty: "medium",
    description:
      "Sort by approximate rotation period.",
    fact:
      "Jupiter completes a rotation in roughly ten hours.",
    items: [
      {
        id: "jupiter",
        label: "Jupiter",
        value: 9.9,
        displayValue: "9.9 h",
        image: assets.space,
      },
      {
        id: "saturn",
        label: "Saturn",
        value: 10.7,
        displayValue: "10.7 h",
        image: assets.space,
      },
      {
        id: "earth",
        label: "Earth",
        value: 23.9,
        displayValue: "23.9 h",
        image: assets.earth,
      },
      {
        id: "mars",
        label: "Mars",
        value: 24.6,
        displayValue: "24.6 h",
        image: assets.space,
      },
    ],
  },
  {
    id: "science-orbit",
    prompt:
      "SHORTEST → LONGEST",
    direction: "asc",
    category: "SCIENCE",
    difficulty: "medium",
    description:
      "Sort by length of one orbit around the Sun.",
    fact:
      "Mercury completes a year in only about 88 Earth days.",
    items: [
      {
        id: "mercury",
        label: "Mercury",
        value: 88,
        displayValue:
          "88 days",
        image: assets.space,
      },
      {
        id: "venus",
        label: "Venus",
        value: 225,
        displayValue:
          "225 days",
        image: assets.space,
      },
      {
        id: "earth",
        label: "Earth",
        value: 365,
        displayValue:
          "365 days",
        image: assets.earth,
      },
      {
        id: "mars",
        label: "Mars",
        value: 687,
        displayValue:
          "687 days",
        image: assets.space,
      },
    ],
  },
  {
    id: "science-temperature",
    prompt:
      "COLDEST → HOTTEST",
    direction: "asc",
    category: "SCIENCE",
    difficulty: "hard",
    description:
      "Sort these temperatures in Celsius.",
    fact:
      "A typical home freezer is kept near −18°C.",
    items: [
      {
        id: "freezer",
        label: "Freezer",
        value: -18,
        displayValue:
          "≈ −18°C",
      },
      {
        id: "room",
        label: "Room",
        value: 22,
        displayValue:
          "≈ 22°C",
      },
      {
        id: "body",
        label: "Human Body",
        value: 37,
        displayValue:
          "≈ 37°C",
      },
      {
        id: "boil",
        label:
          "Boiling Water",
        value: 100,
        displayValue:
          "100°C",
      },
    ],
  },
];