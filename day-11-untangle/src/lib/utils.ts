import type {
  Category,
  Session,
  SessionItem,
} from "../types";

export const categoryLabels: Record<Category, string> = {
  now: "Do now",
  soon: "Do soon",
  later: "Can wait",
  ideas: "Ideas",
  let_go: "Let it go",
};

export function createId() {
  return crypto.randomUUID();
}

export function formatSessionDate(value: string) {
  const date = new Date(value);
  const now = new Date();

  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (sameDay) {
    return `Today, ${time}`;
  }

  if (isYesterday) {
    return `Yesterday, ${time}`;
  }

  return date.toLocaleDateString([], {
    month: "long",
    day: "numeric",
  });
}

export function getActiveItems(session: Session) {
  return session.items.filter(
    (item) => !item.completed && !item.released,
  );
}

export function getNextItem(session: Session) {
  const active = getActiveItems(session);

  const recommended = active.find(
    (item) => item.id === session.nextAction.itemId,
  );

  if (recommended) {
    return recommended;
  }

  return (
    active.find((item) => item.category === "now") ??
    active.find((item) => item.category === "soon") ??
    active.find((item) => item.kind === "task") ??
    null
  );
}

export function countProgress(items: SessionItem[]) {
  const clearable = items.filter(
    (item) =>
      item.kind === "task" ||
      item.category === "let_go",
  );

  const cleared = clearable.filter(
    (item) => item.completed || item.released,
  );

  return {
    total: clearable.length,
    cleared: cleared.length,
  };
}

export function truncateText(
  text: string,
  maxLength = 62,
) {
  const clean = text.replace(/\s+/g, " ").trim();

  if (clean.length <= maxLength) {
    return clean;
  }

  return `${clean.slice(0, maxLength).trim()}...`;
}