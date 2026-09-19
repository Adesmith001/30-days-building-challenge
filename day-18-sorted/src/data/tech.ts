import type {
  SortPuzzle,
} from "../types/game";

import {
  assets,
} from "./assets";

export const techPuzzles:
  SortPuzzle[] = [
  {
    id: "tech-social-launch",
    prompt:
      "OLDEST → NEWEST",
    direction: "asc",
    category: "TECH",
    difficulty: "easy",
    description:
      "Put these platforms in launch order.",
    fact:
      "WhatsApp launched one year before Instagram.",
    items: [
      {
        id: "whatsapp",
        label: "WhatsApp",
        value: 2009,
        displayValue: "2009",
      },
      {
        id: "instagram",
        label: "Instagram",
        value: 2010,
        displayValue: "2010",
      },
      {
        id: "tiktok",
        label: "TikTok",
        value: 2016,
        displayValue: "2016",
      },
      {
        id: "chatgpt",
        label: "ChatGPT",
        value: 2022,
        displayValue: "2022",
      },
    ],
  },
  {
    id: "tech-apple-devices",
    prompt:
      "RELEASED FIRST → LAST",
    direction: "asc",
    category: "TECH",
    difficulty: "easy",
    description:
      "Order these Apple product launches.",
    fact:
      "The iPod arrived six years before the first iPhone.",
    items: [
      {
        id: "ipod",
        label: "iPod",
        value: 2001,
        displayValue: "2001",
        image: assets.phone,
      },
      {
        id: "iphone",
        label: "iPhone",
        value: 2007,
        displayValue: "2007",
        image: assets.phone,
      },
      {
        id: "ipad",
        label: "iPad",
        value: 2010,
        displayValue: "2010",
        image: assets.phone,
      },
      {
        id: "watch",
        label: "Apple Watch",
        value: 2015,
        displayValue: "2015",
        image: assets.phone,
      },
    ],
  },
  {
    id: "tech-playstation",
    prompt:
      "OLDEST → NEWEST",
    direction: "asc",
    category: "TECH",
    difficulty: "medium",
    description:
      "Sort the PlayStation generations by launch year.",
    fact:
      "PlayStation 2 followed the original PlayStation by six years.",
    items: [
      {
        id: "ps1",
        label: "PlayStation",
        value: 1994,
        displayValue: "1994",
        image: assets.gaming,
      },
      {
        id: "ps2",
        label: "PlayStation 2",
        value: 2000,
        displayValue: "2000",
        image: assets.gaming,
      },
      {
        id: "ps4",
        label: "PlayStation 4",
        value: 2013,
        displayValue: "2013",
        image: assets.gaming,
      },
      {
        id: "ps5",
        label: "PlayStation 5",
        value: 2020,
        displayValue: "2020",
        image: assets.gaming,
      },
    ],
  },
  {
    id: "tech-web-services",
    prompt:
      "OLDEST → NEWEST",
    direction: "asc",
    category: "INTERNET",
    difficulty: "medium",
    description:
      "Order these internet services by launch year.",
    fact:
      "Wikipedia launched in 2001, four years before YouTube.",
    items: [
      {
        id: "google",
        label: "Google",
        value: 1998,
        displayValue: "1998",
        image: assets.social,
      },
      {
        id: "wikipedia",
        label: "Wikipedia",
        value: 2001,
        displayValue: "2001",
        image: assets.social,
      },
      {
        id: "youtube",
        label: "YouTube",
        value: 2005,
        displayValue: "2005",
        image: assets.social,
      },
      {
        id: "spotify",
        label: "Spotify",
        value: 2008,
        displayValue: "2008",
        image: assets.social,
      },
    ],
  },
  {
    id: "tech-storage",
    prompt:
      "SMALLEST → LARGEST",
    direction: "asc",
    category: "TECH",
    difficulty: "hard",
    description:
      "Sort by typical storage capacity.",
    fact:
      "A single-layer Blu-ray stores roughly 25 GB.",
    items: [
      {
        id: "floppy",
        label: "Floppy Disk",
        value: 1.44,
        displayValue: "1.44 MB",
      },
      {
        id: "cd",
        label: "CD",
        value: 700,
        displayValue: "700 MB",
      },
      {
        id: "dvd",
        label: "DVD",
        value: 4700,
        displayValue: "4.7 GB",
      },
      {
        id: "bluray",
        label: "Blu-ray",
        value: 25000,
        displayValue: "25 GB",
      },
    ],
  },
];