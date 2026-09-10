/* eslint-disable react-hooks/set-state-in-effect */
import {
  useEffect,
  useState,
} from "react";

import type {
  DesignSystem,
  HistoryRecord,
} from "../types/ui-analysis";

const STORAGE_KEY = "ui-xray-history";

export function useAnalysisHistory() {
  const [records, setRecords] =
    useState<HistoryRecord[]>([]);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(STORAGE_KEY);

      if (!stored) return;

      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setRecords(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function commit(next: HistoryRecord[]) {
    setRecords(next);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next),
    );
  }

  function save(
    name: string,
    system: DesignSystem,
  ) {
    const record: HistoryRecord = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      system,
    };

    commit(
      [record, ...records].slice(0, 15),
    );

    return record;
  }

  function remove(id: string) {
    commit(
      records.filter(
        (record) => record.id !== id,
      ),
    );
  }

  return {
    records,
    save,
    remove,
  };
}