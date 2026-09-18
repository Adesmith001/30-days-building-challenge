import type {
  SortPuzzle,
} from "../types/game";

import {
  assets,
} from "./assets";

export const worldPuzzles:
  SortPuzzle[] = [
  {
    id: "world-mountains",
    prompt:
      "LOWEST → HIGHEST",
    direction: "asc",
    category: "WORLD",
    difficulty: "easy",
    description:
      "Sort by summit elevation above sea level.",
    fact:
      "Mount Everest reaches about 8,849 metres above sea level.",
    items: [
      {
        id: "ben-nevis",
        label: "Ben Nevis",
        value: 1345,
        displayValue:
          "1,345 m",
        image:
          assets.mountain,
      },
      {
        id: "fuji",
        label: "Mount Fuji",
        value: 3776,
        displayValue:
          "3,776 m",
        image:
          assets.mountain,
      },
      {
        id: "kilimanjaro",
        label:
          "Kilimanjaro",
        value: 5895,
        displayValue:
          "5,895 m",
        image:
          assets.mountain,
      },
      {
        id: "everest",
        label: "Everest",
        value: 8849,
        displayValue:
          "8,849 m",
        image:
          assets.mountain,
      },
    ],
  },
  {
    id: "world-rivers",
    prompt:
      "SHORTEST → LONGEST",
    direction: "asc",
    category: "WORLD",
    difficulty: "medium",
    description:
      "Sort by commonly cited river length.",
    fact:
      "The Danube runs for roughly 2,850 kilometres.",
    items: [
      {
        id: "thames",
        label: "Thames",
        value: 346,
        displayValue:
          "346 km",
        image: assets.city,
      },
      {
        id: "rhine",
        label: "Rhine",
        value: 1230,
        displayValue:
          "1,230 km",
        image: assets.city,
      },
      {
        id: "danube",
        label: "Danube",
        value: 2850,
        displayValue:
          "2,850 km",
        image: assets.city,
      },
      {
        id: "nile",
        label: "Nile",
        value: 6650,
        displayValue:
          "≈ 6,650 km",
        image: assets.city,
      },
    ],
  },
  {
    id: "world-towers",
    prompt:
      "SHORTEST → TALLEST",
    direction: "asc",
    category: "WORLD",
    difficulty: "medium",
    description:
      "Sort these structures by architectural height.",
    fact:
      "Burj Khalifa is 828 metres tall.",
    items: [
      {
        id: "eiffel",
        label:
          "Eiffel Tower",
        value: 330,
        displayValue:
          "330 m",
        image: assets.city,
      },
      {
        id: "empire",
        label:
          "Empire State",
        value: 443,
        displayValue:
          "443 m",
        image: assets.city,
      },
      {
        id: "cn",
        label: "CN Tower",
        value: 553,
        displayValue:
          "553 m",
        image: assets.city,
      },
      {
        id: "burj",
        label:
          "Burj Khalifa",
        value: 828,
        displayValue:
          "828 m",
        image: assets.city,
      },
    ],
  },
  {
    id: "world-islands",
    prompt:
      "SMALLEST → LARGEST",
    direction: "asc",
    category: "WORLD",
    difficulty: "hard",
    description:
      "Sort by approximate land area.",
    fact:
      "Bali covers roughly 5,780 square kilometres.",
    items: [
      {
        id: "barbados",
        label: "Barbados",
        value: 430,
        displayValue:
          "430 km²",
        image: assets.beach,
      },
      {
        id: "singapore",
        label: "Singapore",
        value: 734,
        displayValue:
          "≈ 734 km²",
        image: assets.city,
      },
      {
        id: "tenerife",
        label: "Tenerife",
        value: 2034,
        displayValue:
          "2,034 km²",
        image: assets.beach,
      },
      {
        id: "bali",
        label: "Bali",
        value: 5780,
        displayValue:
          "≈ 5,780 km²",
        image: assets.beach,
      },
    ],
  },
  {
    id: "world-oceans",
    prompt:
      "SMALLEST → LARGEST",
    direction: "asc",
    category: "WORLD",
    difficulty: "hard",
    description:
      "Sort by approximate surface area.",
    fact:
      "The Atlantic is much larger than the Indian Ocean by surface area.",
    items: [
      {
        id: "arctic",
        label: "Arctic",
        value: 14.1,
        displayValue:
          "≈ 14.1M km²",
        image: assets.earth,
      },
      {
        id: "southern",
        label: "Southern",
        value: 20.3,
        displayValue:
          "≈ 20.3M km²",
        image: assets.earth,
      },
      {
        id: "indian",
        label: "Indian",
        value: 70.6,
        displayValue:
          "≈ 70.6M km²",
        image: assets.earth,
      },
      {
        id: "atlantic",
        label: "Atlantic",
        value: 106.5,
        displayValue:
          "≈ 106.5M km²",
        image: assets.earth,
      },
    ],
  },
];