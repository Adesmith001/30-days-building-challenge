import type {
  SortPuzzle,
} from "../types/game";

import {
  assets,
} from "./assets";

export const nigeriaPuzzles:
  SortPuzzle[] = [
  {
    id: "ng-states-created",
    prompt:
      "CREATED FIRST → LAST",
    direction: "asc",
    category: "NIGERIA",
    difficulty: "medium",
    description:
      "Order these states by year of creation.",
    fact:
      "Ekiti State was created in 1996.",
    items: [
      {
        id: "lagos",
        label: "Lagos",
        value: 1967,
        displayValue: "1967",
        image: assets.lagos,
      },
      {
        id: "ogun",
        label: "Ogun",
        value: 1976,
        displayValue: "1976",
        image: assets.lagos,
      },
      {
        id: "akwa-ibom",
        label: "Akwa Ibom",
        value: 1987,
        displayValue: "1987",
        image: assets.beach,
      },
      {
        id: "ekiti",
        label: "Ekiti",
        value: 1996,
        displayValue: "1996",
        image: assets.forest,
      },
    ],
  },
  {
    id: "ng-nollywood",
    prompt:
      "RELEASED FIRST → LAST",
    direction: "asc",
    category: "NIGERIA",
    difficulty: "medium",
    description:
      "Sort these Nigerian films by release year.",
    fact:
      "The Wedding Party became a major Nigerian box-office hit in 2016.",
    items: [
      {
        id: "living",
        label:
          "Living in Bondage",
        value: 1992,
        displayValue: "1992",
        image: assets.cinema,
      },
      {
        id: "osuofia",
        label:
          "Osuofia in London",
        value: 2003,
        displayValue: "2003",
        image: assets.cinema,
      },
      {
        id: "wedding",
        label:
          "The Wedding Party",
        value: 2016,
        displayValue: "2016",
        image: assets.cinema,
      },
      {
        id: "kob",
        label:
          "King of Boys",
        value: 2018,
        displayValue: "2018",
        image: assets.cinema,
      },
    ],
  },
  {
    id:
      "ng-afrobeats-albums",
    prompt:
      "RELEASED FIRST → LAST",
    direction: "asc",
    category: "NIGERIA",
    difficulty: "hard",
    description:
      "Order these Nigerian music projects.",
    fact:
      "Rema's Rave & Roses arrived in 2022.",
    items: [
      {
        id: "superstar",
        label:
          "Superstar · Wizkid",
        value: 2011,
        displayValue: "2011",
        image: assets.music,
      },
      {
        id: "african-giant",
        label:
          "African Giant · Burna Boy",
        value: 2019,
        displayValue: "2019",
        image: assets.music,
      },
      {
        id: "broken-ears",
        label:
          "For Broken Ears · Tems",
        value: 2020,
        displayValue: "2020",
        image: assets.music,
      },
      {
        id: "rave",
        label:
          "Rave & Roses · Rema",
        value: 2022,
        displayValue: "2022",
        image: assets.music,
      },
    ],
  },
  {
    id:
      "ng-afrobeats-songs",
    prompt:
      "RELEASED FIRST → LAST",
    direction: "asc",
    category: "NIGERIA",
    difficulty: "hard",
    description:
      "Sort these Nigerian hit songs by release year.",
    fact:
      "Calm Down was released in 2022.",
    items: [
      {
        id: "fall",
        label:
          "Fall · Davido",
        value: 2017,
        displayValue: "2017",
        image: assets.music,
      },
      {
        id: "ye",
        label:
          "Ye · Burna Boy",
        value: 2018,
        displayValue: "2018",
        image: assets.music,
      },
      {
        id: "essence",
        label:
          "Essence · Wizkid",
        value: 2020,
        displayValue: "2020",
        image: assets.music,
      },
      {
        id: "calm",
        label:
          "Calm Down · Rema",
        value: 2022,
        displayValue: "2022",
        image: assets.music,
      },
    ],
  },
  {
    id:
      "ng-city-air-distance",
    prompt:
      "NEAREST → FARTHEST",
    direction: "asc",
    category: "NIGERIA",
    difficulty: "final",
    description:
      "Approximate straight-line distance from Lagos.",
    fact:
      "Abuja is roughly 540 km from Lagos in a straight line.",
    items: [
      {
        id: "ibadan",
        label: "Ibadan",
        value: 115,
        displayValue:
          "≈ 115 km",
        image: assets.lagos,
      },
      {
        id: "benin",
        label:
          "Benin City",
        value: 250,
        displayValue:
          "≈ 250 km",
        image: assets.city,
      },
      {
        id: "abuja",
        label: "Abuja",
        value: 540,
        displayValue:
          "≈ 540 km",
        image: assets.city,
      },
      {
        id: "kano",
        label: "Kano",
        value: 835,
        displayValue:
          "≈ 835 km",
        image: assets.city,
      },
    ],
  },
];