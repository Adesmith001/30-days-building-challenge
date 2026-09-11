import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Category } from "../types";
import { categoryLabels } from "../lib/utils";

interface ItemMenuProps {
  currentCategory: Category;
  onMove: (category: Category) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const moveTargets: Category[] = [
  "now",
  "soon",
  "later",
  "ideas",
  "let_go",
];

export function ItemMenu({
  currentCategory,
  onMove,
  onEdit,
  onDelete,
}: ItemMenuProps) {
  const [open, setOpen] = useState(false);
  const [moving, setMoving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setMoving(false);
      }
    }

    document.addEventListener("mousedown", close);

    return () =>
      document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Task options"
        onClick={() => {
          setOpen((value) => !value);
          setMoving(false);
        }}
        className="rounded-md p-1.5 text-muted transition-colors hover:bg-soft hover:text-ink"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-30 w-44 overflow-hidden rounded-xl border border-line-dark/70 bg-panel p-1.5 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.1)]">
          {!moving ? (
            <>
              <button
                type="button"
                onClick={() => setMoving(true)}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-soft"
              >
                Move
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onEdit();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-soft"
              >
                <Pencil size={14} />
                Edit
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onDelete();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMoving(false)}
                className="mb-1 w-full rounded-lg px-3 py-2 text-left text-xs text-muted hover:bg-soft"
              >
                ← Back
              </button>

              {moveTargets
                .filter(
                  (category) =>
                    category !== currentCategory,
                )
                .map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onMove(category);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-soft"
                  >
                    {categoryLabels[category]}
                  </button>
                ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}