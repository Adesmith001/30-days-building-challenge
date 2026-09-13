import type { Commitment } from "../types/commitment";
import { STORAGE_KEY } from "./constants";

export function loadCommitments(): Commitment[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored) as Commitment[];
  } catch {
    return [];
  }
}

export function saveCommitments(
  commitments: Commitment[],
) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(commitments),
  );
}