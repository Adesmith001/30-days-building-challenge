import {
  useEffect,
  useState,
} from "react";
import {
  Activity,
  FileText,
  Search,
  Target,
  Waypoints,
  Zap,
} from "lucide-react";
import type { Panel } from "@/types";
import { useGameStore } from "@/store/use-game-store";

const commands: Array<{
  label: string;
  panel: Panel;
  icon: typeof Activity;
}> = [
  {
    label: "Open Metrics",
    panel: "metrics",
    icon: Activity,
  },
  {
    label: "Open Logs",
    panel: "logs",
    icon: FileText,
  },
  {
    label: "Open Traces",
    panel: "traces",
    icon: Waypoints,
  },
  {
    label: "Form Hypothesis",
    panel: "hypothesis",
    icon: Target,
  },
  {
    label: "Take Action",
    panel: "actions",
    icon: Zap,
  },
];

export function CommandPalette() {
  const [open, setOpen] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const openPanel = useGameStore(
    (state) => state.openPanel,
  );

  useEffect(() => {
    function onKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        (event.metaKey ||
          event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setOpen(
          (current) => !current,
        );
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      onKeyDown,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onKeyDown,
      );
  }, []);

  if (!open) return null;

  const filtered = commands.filter(
    (command) =>
      command.label
        .toLowerCase()
        .includes(query.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-[80] flex justify-center bg-black/70 px-4 pt-[15vh]">
      <div className="h-fit w-full max-w-xl border border-zinc-700 bg-[#0b0d0f] shadow-2xl">
        <label className="flex items-center gap-3 border-b border-zinc-800 px-4">
          <Search
            size={15}
            className="text-zinc-600"
          />

          <input
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value,
              )
            }
            placeholder="Search incident tools…"
            className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-zinc-700"
          />
        </label>

        <div className="p-2">
          {filtered.map((command) => {
            const Icon = command.icon;

            return (
              <button
                key={command.label}
                onClick={() => {
                  openPanel(
                    command.panel,
                  );
                  setOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 px-3 py-3 text-left text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white"
              >
                <Icon size={14} />
                {command.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
