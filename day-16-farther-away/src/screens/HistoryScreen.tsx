import {
  Trash2,
} from "lucide-react";

import {
  calculateComparison,
} from "../lib/calculations";

import {
  formatNairaCompact,
} from "../lib/currency";

import type {
  SavedComparison,
} from "../types/comparison";

interface Props {
  items: SavedComparison[];

  onOpen:
    (item: SavedComparison) => void;

  onRemove:
    (id: string) => void;
}

export default function HistoryScreen({
  items,
  onOpen,
  onRemove,
}: Props) {
  return (
    <main
      className="
        mx-auto
        max-w-6xl
        px-5
        py-12
        md:px-10
        md:py-16
      "
    >
      <div
        className="
          border-b
          border-line
          pb-8
        "
      >
        <p
          className="
            font-mono
            text-xs
            text-muted
          "
        >
          COMPARISON ARCHIVE //
          LOCAL ONLY
        </p>

        <h1
          className="
            mt-4
            font-serif
            text-5xl
          "
        >
          SAVED COMPARISONS
        </h1>

        <p
          className="
            mt-3
            text-sm
            text-muted
          "
        >
          Stored in this browser.
          Reopen a comparison and
          keep testing the
          trade-off.
        </p>
      </div>

      {items.length === 0 ? (
        <div
          className="
            py-20
            text-center
          "
        >
          <p
            className="
              font-serif
              text-3xl
            "
          >
            Nothing saved yet.
          </p>

          <p
            className="
              mt-2
              text-sm
              text-muted
            "
          >
            Save a result from the
            comparison screen and
            it will appear here.
          </p>
        </div>
      ) : (
        <div
          className="
            divide-y
            divide-line
          "
        >
          {items.map(
            (item) => {
              const metrics =
                calculateComparison(
                  item.draft,
                );

              return (
                <article
                  key={item.id}
                  className="
                    grid
                    gap-5
                    py-6
                    md:grid-cols-[1.3fr_1fr_auto]
                    md:items-center
                  "
                >
                  <div>
                    <p
                      className="
                        font-mono
                        text-[10px]
                        uppercase
                        text-muted
                      "
                    >
                      {new Date(
                        item.savedAt,
                      ).toLocaleDateString(
                        "en-NG",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </p>

                    <h2
                      className="
                        mt-1
                        font-serif
                        text-2xl
                        uppercase
                      "
                    >
                      {
                        item.draft
                          .homeA
                          .name
                      }

                      {" "}

                      <span
                        className="
                          font-mono
                          text-xs
                          text-muted
                        "
                      >
                        VS
                      </span>

                      {" "}

                      {
                        item.draft
                          .homeB
                          .name
                      }
                    </h2>
                  </div>

                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-5
                      font-mono
                      text-xs
                    "
                  >
                    <div>
                      <p className="text-muted">
                        CASH Δ
                      </p>

                      <p
                        className="
                          mt-1
                          text-savings
                        "
                      >
                        {formatNairaCompact(
                          Math.abs(
                            metrics.cashSavingsB,
                          ),
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted">
                        TIME Δ
                      </p>

                      <p
                        className="
                          mt-1
                          text-time
                        "
                      >
                        {Math.abs(
                          Math.round(
                            metrics.extraHoursB,
                          ),
                        )}
                        H
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      flex
                      gap-2
                    "
                  >
                    <button
                      onClick={() =>
                        onOpen(item)
                      }
                      className="
                        border
                        border-ink
                        px-4
                        py-2
                        font-mono
                        text-[10px]
                        hover:bg-ink
                        hover:text-paper
                      "
                    >
                      OPEN
                    </button>

                    <button
                      aria-label="Delete comparison"
                      onClick={() =>
                        onRemove(
                          item.id,
                        )
                      }
                      className="
                        border
                        border-line
                        px-3
                        py-2
                        text-muted
                        hover:border-ink
                        hover:text-ink
                      "
                    >
                      <Trash2
                        size={14}
                      />
                    </button>
                  </div>
                </article>
              );
            },
          )}
        </div>
      )}
    </main>
  );
}