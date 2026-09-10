import {
  ArrowUpRight,
  Trash2,
} from "lucide-react";

import type {
  HistoryRecord,
} from "../types/ui-analysis";

interface Props {
  records: HistoryRecord[];
  onOpen: (record: HistoryRecord) => void;
  onRemove: (id: string) => void;
  onNew: () => void;
}

export function HistoryScreen({
  records,
  onOpen,
  onRemove,
  onNew,
}: Props) {
  if (!records.length) {
    return (
      <main className="flex min-h-[calc(100vh-44px)] items-center justify-center px-5">
        <div className="text-center">
          <div className="font-mono text-[9px] text-muted">
            X-RAYS
          </div>

          <h1 className="mt-3 font-sans text-3xl font-semibold tracking-[-0.04em]">
            NOTHING X-RAYED YET.
          </h1>

          <p className="mt-3 text-sm text-muted">
            Analyzed interfaces will appear
            here.
          </p>

          <button
            onClick={onNew}
            className="mt-6 bg-ink px-5 py-2.5 font-mono text-[10px] font-semibold text-white hover:bg-accent"
          >
            ANALYZE UI →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-44px)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="border-b border-line pb-5">
          <div className="font-mono text-[9px] text-accent">
            LOCAL HISTORY
          </div>

          <h1 className="mt-2 font-sans text-3xl font-semibold tracking-[-0.04em]">
            X-RAYS
          </h1>

          <p className="mt-2 text-sm text-muted">
            Structured results stay in this
            browser. Screenshots are not saved.
          </p>
        </div>

        <div className="mt-6 border border-line bg-panel">
          {records.map((record) => (
            <div
              key={record.id}
              className="grid grid-cols-[1fr_auto] gap-4 border-b border-line p-4 last:border-b-0"
            >
              <button
                onClick={() =>
                  onOpen(record)
                }
                className="min-w-0 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="truncate font-mono text-[10px] font-semibold">
                    {record.name}
                  </span>

                  <ArrowUpRight
                    size={11}
                    className="text-muted"
                  />
                </div>

                <div className="mt-2 font-mono text-[8px] text-muted">
                  {record.system.confidence}%
                  CONFIDENCE
                  {" · "}
                  {
                    record.system.colors
                      .length
                  }{" "}
                  COLORS
                  {" · "}
                  {
                    record.system.components
                      .length
                  }{" "}
                  COMPONENTS
                </div>

                <div className="mt-1 font-mono text-[8px] text-ghost">
                  {new Date(
                    record.createdAt,
                  ).toLocaleString()}
                </div>
              </button>

              <button
                onClick={() =>
                  onRemove(record.id)
                }
                className="size-8 border border-line text-muted hover:bg-subtle hover:text-danger"
              >
                <Trash2
                  size={13}
                  className="mx-auto"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}