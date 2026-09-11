import {
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import type {
  Category,
  SessionItem,
} from "../types";
import { ItemMenu } from "./ItemMenu";

interface IdeaCardProps {
  item: SessionItem;
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

export function IdeaCard({
  item,
  onMove,
  onEdit,
  onDelete,
}: IdeaCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.title);

  function save() {
    const next = draft.trim();

    if (next && next !== item.title) {
      onEdit(item.id, next);
    }

    setEditing(false);
  }

  return (
    <div className="rounded-xl border border-line bg-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(event) =>
                setDraft(event.target.value)
              }
              onBlur={save}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  save();
                }
              }}
              className="w-full border-0 bg-transparent text-sm font-medium outline-none"
            />
          ) : (
            <p className="font-medium italic text-ink">
              {item.title}
            </p>
          )}

          <p className="mt-3 text-xs text-muted">
            {item.metadata || "Someday / Ongoing"}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Sparkles
            size={15}
            className="text-muted"
          />

          <ItemMenu
            currentCategory={item.category}
            onMove={(category) =>
              onMove(item.id, category)
            }
            onEdit={() => setEditing(true)}
            onDelete={() => onDelete(item.id)}
          />
        </div>
      </div>
    </div>
  );
}