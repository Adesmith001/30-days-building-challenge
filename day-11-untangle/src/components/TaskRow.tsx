import {
  Check,
} from "lucide-react";
import { useState } from "react";
import type {
  Category,
  SessionItem,
} from "../types";
import { ItemMenu } from "./ItemMenu";

interface TaskRowProps {
  item: SessionItem;
  onComplete: (id: string) => void;
  onMove: (
    id: string,
    category: Category,
  ) => void;
  onEdit: (
    id: string,
    title: string,
  ) => void;
  onDelete: (id: string) => void;
}

export function TaskRow({
  item,
  onComplete,
  onMove,
  onEdit,
  onDelete,
}: TaskRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.title);

  function saveEdit() {
    const value = draft.trim();

    if (value && value !== item.title) {
      onEdit(item.id, value);
    }

    setEditing(false);
  }

  return (
    <div className="flex min-h-[62px] items-center gap-3 rounded-xl border border-line bg-panel px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.025)]">
      <button
        type="button"
        onClick={() => onComplete(item.id)}
        aria-label={`Complete ${item.title}`}
        className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-zinc-400 transition-colors hover:border-ink"
      >
        <Check
          size={11}
          className="opacity-0"
        />
      </button>

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(event) =>
              setDraft(event.target.value)
            }
            onBlur={saveEdit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                saveEdit();
              }

              if (event.key === "Escape") {
                setDraft(item.title);
                setEditing(false);
              }
            }}
            className="w-full border-0 bg-transparent text-[15px] text-ink outline-none"
          />
        ) : (
          <>
            <p className="truncate text-[15px] font-medium text-ink">
              {item.title}
            </p>

            {item.metadata && (
              <p className="mt-0.5 truncate text-xs text-muted">
                {item.metadata}
              </p>
            )}
          </>
        )}
      </div>

      <ItemMenu
        currentCategory={item.category}
        onMove={(category) =>
          onMove(item.id, category)
        }
        onEdit={() => setEditing(true)}
        onDelete={() => onDelete(item.id)}
      />
    </div>
  );
}