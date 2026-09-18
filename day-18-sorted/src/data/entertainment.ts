import type {
  SortPuzzle,
} from "../types/game";

import {
  assets,
} from "./assets";

export const entertainmentPuzzles:
  SortPuzzle[] = [
  {
    id: "ent-pixar",
    prompt:
      "RELEASED FIRST → LAST",
    direction: "asc",
    category:
      "ENTERTAINMENT",
    difficulty: "easy",
    description:
      "Order these Pixar films by release year.",
    fact:
      "Toy Story arrived in 1995 as Pixar's first feature film.",
    items: [
      {
        id: "toy-story",
        label: "Toy Story",
        value: 1995,
        displayValue: "1995",
        image: assets.cinema,
      },
      {
        id: "nemo",
        label:
          "Finding Nemo",
        value: 2003,
        displayValue: "2003",
        image: assets.cinema,
      },
      {
        id: "wall-e",
        label: "WALL-E",
        value: 2008,
        displayValue: "2008",
        image: assets.cinema,
      },
      {
        id: "inside-out",
        label: "Inside Out",
        value: 2015,
        displayValue: "2015",
        image: assets.cinema,
      },
    ],
  },
  {
    id: "ent-gta",
    prompt:
      "RELEASED FIRST → LAST",
    direction: "asc",
    category:
      "ENTERTAINMENT",
    difficulty: "medium",
    description:
      "Order these Grand Theft Auto games.",
    fact:
      "GTA V released in 2013, five years after GTA IV.",
    items: [
      {
        id: "gta3",
        label: "GTA III",
        value: 2001,
        displayValue: "2001",
        image: assets.gaming,
      },
      {
        id: "sa",
        label:
          "San Andreas",
        value: 2004,
        displayValue: "2004",
        image: assets.gaming,
      },
      {
        id: "gta4",
        label: "GTA IV",
        value: 2008,
        displayValue: "2008",
        image: assets.gaming,
      },
      {
        id: "gta5",
        label: "GTA V",
        value: 2013,
        displayValue: "2013",
        image: assets.gaming,
      },
    ],
  },
  {
    id: "ent-marvel",
    prompt:
      "RELEASED FIRST → LAST",
    direction: "asc",
    category:
      "ENTERTAINMENT",
    difficulty: "medium",
    description:
      "Sort these MCU releases.",
    fact:
      "Black Panther released in 2018, one year before Endgame.",
    items: [
      {
        id: "iron-man",
        label: "Iron Man",
        value: 2008,
        displayValue: "2008",
        image: assets.cinema,
      },
      {
        id: "avengers",
        label:
          "The Avengers",
        value: 2012,
        displayValue: "2012",
        image: assets.cinema,
      },
      {
        id: "panther",
        label:
          "Black Panther",
        value: 2018,
        displayValue: "2018",
        image: assets.cinema,
      },
      {
        id: "endgame",
        label: "Endgame",
        value: 2019,
        displayValue: "2019",
        image: assets.cinema,
      },
    ],
  },
  {
    id:
      "ent-harry-potter",
    prompt:
      "RELEASED FIRST → LAST",
    direction: "asc",
    category:
      "ENTERTAINMENT",
    difficulty: "hard",
    description:
      "Order these Harry Potter films.",
    fact:
      "Prisoner of Azkaban reached cinemas in 2004.",
    items: [
      {
        id: "stone",
        label:
          "Philosopher's Stone",
        value: 2001,
        displayValue: "2001",
        image: assets.cinema,
      },
      {
        id: "azkaban",
        label:
          "Prisoner of Azkaban",
        value: 2004,
        displayValue: "2004",
        image: assets.cinema,
      },
      {
        id: "half-blood",
        label:
          "Half-Blood Prince",
        value: 2009,
        displayValue: "2009",
        image: assets.cinema,
      },
      {
        id: "hallows2",
        label:
          "Deathly Hallows Pt. 2",
        value: 2011,
        displayValue: "2011",
        image: assets.cinema,
      },
    ],
  },
  {
    id:
      "ent-music-formats",
    prompt:
      "OLDEST → NEWEST",
    direction: "asc",
    category:
      "ENTERTAINMENT",
    difficulty: "hard",
    description:
      "Sort these popular audio formats by introduction.",
    fact:
      "The compact disc entered the consumer market in the early 1980s.",
    items: [
      {
        id: "vinyl",
        label: "LP Record",
        value: 1948,
        displayValue: "1948",
        image: assets.music,
      },
      {
        id: "cassette",
        label:
          "Compact Cassette",
        value: 1963,
        displayValue: "1963",
        image: assets.music,
      },
      {
        id: "cd",
        label:
          "Compact Disc",
        value: 1982,
        displayValue: "1982",
        image: assets.music,
      },
      {
        id: "mp3",
        label: "MP3",
        value: 1993,
        displayValue: "1993",
        image: assets.music,
      },
    ],
  },
];