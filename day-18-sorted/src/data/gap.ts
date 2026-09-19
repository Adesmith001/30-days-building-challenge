import {
  assets,
} from "./assets";

export interface GapItem {
  label: string;
  value: number;
  displayValue: string;
}

export interface GapPuzzle {
  id: string;
  prompt: string;
  anchors: GapItem[];
  target: GapItem;
  image?: string;
  fact: string;
}

export const gapPuzzles:
  GapPuzzle[] = [
  {
    id: "gap-number",
    prompt:
      "LOWEST → HIGHEST",
    anchors: [
      {
        label: "10",
        value: 10,
        displayValue: "10",
      },
      {
        label: "30",
        value: 30,
        displayValue: "30",
      },
      {
        label: "70",
        value: 70,
        displayValue: "70",
      },
      {
        label: "100",
        value: 100,
        displayValue: "100",
      },
    ],
    target: {
      label: "52",
      value: 52,
      displayValue: "52",
    },
    fact:
      "52 belongs between 30 and 70.",
  },
  {
    id: "gap-planets",
    prompt:
      "CLOSEST TO SUN → FARTHEST",
    image: assets.space,
    anchors: [
      {
        label: "Mercury",
        value: 57.9,
        displayValue:
          "57.9M km",
      },
      {
        label: "Earth",
        value: 149.6,
        displayValue:
          "149.6M km",
      },
      {
        label: "Mars",
        value: 227.9,
        displayValue:
          "227.9M km",
      },
      {
        label: "Jupiter",
        value: 778.5,
        displayValue:
          "778.5M km",
      },
    ],
    target: {
      label: "Venus",
      value: 108.2,
      displayValue:
        "108.2M km",
    },
    fact:
      "Venus sits between Mercury and Earth in distance from the Sun.",
  },
  {
    id: "gap-internet",
    prompt:
      "OLDEST → NEWEST",
    image: assets.social,
    anchors: [
      {
        label: "YouTube",
        value: 2005,
        displayValue: "2005",
      },
      {
        label: "WhatsApp",
        value: 2009,
        displayValue: "2009",
      },
      {
        label: "TikTok",
        value: 2016,
        displayValue: "2016",
      },
      {
        label: "ChatGPT",
        value: 2022,
        displayValue: "2022",
      },
    ],
    target: {
      label: "Instagram",
      value: 2010,
      displayValue: "2010",
    },
    fact:
      "Instagram launched after WhatsApp and before TikTok.",
  },
  {
    id: "gap-mountains",
    prompt:
      "LOWEST → HIGHEST",
    image:
      assets.mountain,
    anchors: [
      {
        label:
          "Ben Nevis",
        value: 1345,
        displayValue:
          "1,345 m",
      },
      {
        label:
          "Mount Fuji",
        value: 3776,
        displayValue:
          "3,776 m",
      },
      {
        label:
          "Kilimanjaro",
        value: 5895,
        displayValue:
          "5,895 m",
      },
      {
        label:
          "Everest",
        value: 8849,
        displayValue:
          "8,849 m",
      },
    ],
    target: {
      label:
        "Mont Blanc",
      value: 4806,
      displayValue:
        "≈ 4,806 m",
    },
    fact:
      "Mont Blanc is higher than Fuji but lower than Kilimanjaro.",
  },
  {
    id: "gap-movies",
    prompt:
      "RELEASED FIRST → LAST",
    image: assets.cinema,
    anchors: [
      {
        label: "Toy Story",
        value: 1995,
        displayValue: "1995",
      },
      {
        label:
          "Finding Nemo",
        value: 2003,
        displayValue: "2003",
      },
      {
        label: "WALL-E",
        value: 2008,
        displayValue: "2008",
      },
      {
        label:
          "Inside Out",
        value: 2015,
        displayValue: "2015",
      },
    ],
    target: {
      label: "Up",
      value: 2009,
      displayValue: "2009",
    },
    fact:
      "Up released in 2009, after WALL-E and before Inside Out.",
  },
];