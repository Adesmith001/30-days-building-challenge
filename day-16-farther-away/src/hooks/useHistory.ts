import { useState } from "react";

import {
  readHistory,
  writeHistory,
} from "../lib/storage";

import type {
  ComparisonDraft,
  ComparisonPrefs,
  SavedComparison,
} from "../types/comparison";

export function useHistory() {
  const [items, setItems] =
    useState<SavedComparison[]>(
      () => readHistory(),
    );

  const save = (
    draft: ComparisonDraft,
    prefs: ComparisonPrefs,
  ) => {
    const item: SavedComparison = {
      id: crypto.randomUUID(),
      draft,
      prefs,
      savedAt:
        new Date().toISOString(),
    };

    const next = [
      item,
      ...items,
    ].slice(0, 20);

    setItems(next);
    writeHistory(next);

    return item;
  };

  const remove = (id: string) => {
    const next =
      items.filter(
        (item) =>
          item.id !== id,
      );

    setItems(next);
    writeHistory(next);
  };

  return {
    items,
    save,
    remove,
  };
}