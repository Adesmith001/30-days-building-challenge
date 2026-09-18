import type {
  SortPuzzle,
} from "../types/game";

import {
  assets,
} from "./assets";

export const miscPuzzles:
  SortPuzzle[] = [
  {
    id:
      "everyday-length",
    prompt:
      "SHORTEST → LONGEST",
    direction: "asc",
    category: "EVERYDAY",
    difficulty: "easy",
    description:
      "Sort by approximate physical length.",
    fact:
      "A standard football pitch is around 100–110 metres long.",
    items: [
      {
        id: "phone",
        label: "Phone",
        value: 0.15,
        displayValue:
          "≈ 15 cm",
        image: assets.phone,
      },
      {
        id: "bed",
        label: "Bed",
        value: 2,
        displayValue:
          "≈ 2 m",
      },
      {
        id: "car",
        label: "Car",
        value: 4.5,
        displayValue:
          "≈ 4.5 m",
        image: assets.car,
      },
      {
        id: "pitch",
        label:
          "Football Pitch",
        value: 105,
        displayValue:
          "≈ 105 m",
        image:
          assets.football,
      },
    ],
  },
  {
    id:
      "history-inventions",
    prompt:
      "INVENTED FIRST → LAST",
    direction: "asc",
    category: "HISTORY",
    difficulty: "medium",
    description:
      "Order these inventions by milestone year.",
    fact:
      "The Wright brothers' first powered flight took place in 1903.",
    items: [
      {
        id: "telephone",
        label: "Telephone",
        value: 1876,
        displayValue: "1876",
        image: assets.history,
      },
      {
        id: "bulb",
        label:
          "Practical Light Bulb",
        value: 1879,
        displayValue: "1879",
        image: assets.history,
      },
      {
        id: "airplane",
        label:
          "Powered Airplane",
        value: 1903,
        displayValue: "1903",
        image:
          assets.airplane,
      },
      {
        id: "television",
        label:
          "Television Demo",
        value: 1926,
        displayValue: "1926",
        image: assets.history,
      },
    ],
  },
  {
    id: "history-space",
    prompt:
      "EARLIEST → LATEST",
    direction: "asc",
    category: "HISTORY",
    difficulty: "medium",
    description:
      "Order these spaceflight milestones.",
    fact:
      "Apollo 11 landed humans on the Moon in 1969.",
    items: [
      {
        id: "sputnik",
        label: "Sputnik 1",
        value: 1957,
        displayValue: "1957",
        image: assets.space,
      },
      {
        id: "gagarin",
        label:
          "Yuri Gagarin",
        value: 1961,
        displayValue: "1961",
        image: assets.space,
      },
      {
        id: "apollo",
        label: "Apollo 11",
        value: 1969,
        displayValue: "1969",
        image: assets.space,
      },
      {
        id: "iss",
        label:
          "ISS Assembly",
        value: 1998,
        displayValue: "1998",
        image: assets.space,
      },
    ],
  },
  {
    id:
      "sports-world-cup-first",
    prompt:
      "FIRST TITLE → LATEST",
    direction: "asc",
    category: "SPORTS",
    difficulty: "hard",
    description:
      "Sort by the year each country first won the men's World Cup.",
    fact:
      "Brazil won its first men's World Cup in 1958.",
    items: [
      {
        id: "uruguay",
        label: "Uruguay",
        value: 1930,
        displayValue: "1930",
        image:
          assets.football,
      },
      {
        id: "italy",
        label: "Italy",
        value: 1934,
        displayValue: "1934",
        image:
          assets.football,
      },
      {
        id: "germany",
        label: "Germany",
        value: 1954,
        displayValue: "1954",
        image:
          assets.football,
      },
      {
        id: "brazil",
        label: "Brazil",
        value: 1958,
        displayValue: "1958",
        image:
          assets.football,
      },
    ],
  },
  {
    id: "random-speed",
    prompt:
      "SLOWEST → FASTEST",
    direction: "asc",
    category: "RANDOM",
    difficulty: "hard",
    description:
      "Approximate top running speed.",
    fact:
      "A cheetah can briefly exceed 100 km/h.",
    items: [
      {
        id: "elephant",
        label: "Elephant",
        value: 40,
        displayValue:
          "≈ 40 km/h",
        image: assets.forest,
      },
      {
        id: "ostrich",
        label: "Ostrich",
        value: 70,
        displayValue:
          "≈ 70 km/h",
        image: assets.forest,
      },
      {
        id: "horse",
        label: "Horse",
        value: 88,
        displayValue:
          "≈ 88 km/h",
        image: assets.sports,
      },
      {
        id: "cheetah",
        label: "Cheetah",
        value: 109,
        displayValue:
          "≈ 109 km/h",
        image: assets.forest,
      },
    ],
  },
  {
    id: "random-sound",
    prompt:
      "QUIETEST → LOUDEST",
    direction: "asc",
    category: "RANDOM",
    difficulty: "final",
    description:
      "Approximate sound level in decibels.",
    fact:
      "Live concerts can reach around 110 dB or more.",
    items: [
      {
        id: "whisper",
        label: "Whisper",
        value: 30,
        displayValue:
          "≈ 30 dB",
      },
      {
        id: "talk",
        label:
          "Conversation",
        value: 60,
        displayValue:
          "≈ 60 dB",
      },
      {
        id: "vacuum",
        label:
          "Vacuum Cleaner",
        value: 70,
        displayValue:
          "≈ 70 dB",
      },
      {
        id: "concert",
        label:
          "Live Concert",
        value: 110,
        displayValue:
          "≈ 110 dB",
        image: assets.music,
      },
    ],
  },
  {
    id: "random-heights",
    prompt:
      "SHORTEST → TALLEST",
    direction: "asc",
    category: "EVERYDAY",
    difficulty: "final",
    description:
      "Sort by approximate height or length.",
    fact:
      "A basketball hoop is 3.05 metres above the floor.",
    items: [
      {
        id: "card",
        label:
          "Credit Card",
        value: 0.054,
        displayValue:
          "5.4 cm",
      },
      {
        id: "phone",
        label: "Phone",
        value: 0.15,
        displayValue:
          "≈ 15 cm",
        image: assets.phone,
      },
      {
        id: "door",
        label: "Door",
        value: 2,
        displayValue:
          "≈ 2 m",
      },
      {
        id: "hoop",
        label:
          "Basketball Hoop",
        value: 3.05,
        displayValue:
          "3.05 m",
        image: assets.sports,
      },
    ],
  },
];