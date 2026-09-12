import type {
  Category,
  Decision,
  DecisionOption,
} from "../types";

export function createId() {
  if ("randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function shuffle<T>(items: T[]) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [result[index], result[randomIndex]] = [
      result[randomIndex],
      result[index],
    ];
  }

  return result;
}

export function inferCategory(
  title: string,
  options: DecisionOption[],
): Category {
  const text = [
    title,
    ...options.map((option) => option.label),
  ]
    .join(" ")
    .toLowerCase();

  const foodWords = [
    "eat",
    "food",
    "restaurant",
    "rice",
    "pizza",
    "burger",
    "shawarma",
    "suya",
    "dinner",
    "lunch",
    "breakfast",
  ];

  const techWords = [
    "laptop",
    "phone",
    "macbook",
    "software",
    "keyboard",
    "monitor",
    "computer",
    "iphone",
    "android",
    "tech",
  ];

  const workWords = [
    "project",
    "build",
    "startup",
    "work",
    "business",
    "product",
    "feature",
    "idea",
    "career",
  ];

  if (foodWords.some((word) => text.includes(word))) {
    return "Food";
  }

  if (techWords.some((word) => text.includes(word))) {
    return "Tech";
  }

  if (workWords.some((word) => text.includes(word))) {
    return "Work";
  }

  return "General";
}

export function getOptionLabel(
  decision: Decision,
  optionId: string,
) {
  return (
    decision.options.find(
      (option) => option.id === optionId,
    )?.label ?? "Unknown option"
  );
}

export function formatRelativeTime(timestamp?: number) {
  if (!timestamp) {
    return "Recently";
  }

  const difference = Date.now() - timestamp;

  const minutes = Math.floor(difference / 60_000);
  const hours = Math.floor(difference / 3_600_000);
  const days = Math.floor(difference / 86_400_000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(timestamp);
}