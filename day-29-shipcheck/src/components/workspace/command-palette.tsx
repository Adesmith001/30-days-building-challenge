"use client";

import { useEffect, useState } from "react";
import {
  Boxes,
  ClipboardCheck,
  FileCode2,
  Radar,
  Route,
  ShieldCheck,
  X,
} from "lucide-react";
import type { WorkspaceView } from "@/stores/release-store";

interface Props {
  onNavigate: (view: WorkspaceView) => void;
}

export function CommandPalette({
  onNavigate,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }

    window.addEventListener("keydown", handler);

    return () =>
      window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  const commands: Array<{
    label: string;
    view: WorkspaceView;
    icon: typeof Radar;
  }> = [
    {
      label: "Open overview",
      view: "overview",
      icon: Radar,
    },
    {
      label: "Open changed files",
      view: "changes",
      icon: FileCode2,
    },
    {
      label: "Open release gates",
      view: "gates",
      icon: ClipboardCheck,
    },
    {
      label: "Open rollout plan",
      view: "rollout",
      icon: Route,
    },
    {
      label: "Verify release",
      view: "verify",
      icon: ShieldCheck,
    },
    {
      label: "Export release packet",
      view: "packet",
      icon: Boxes,
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-center bg-black/30 p-4 pt-[14vh]">
      <div className="h-fit w-full max-w-lg border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex h-12 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
          <span className="text-xs font-semibold">
            COMMANDS
          </span>

          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-2">
          {commands.map((command) => (
            <button
              key={command.view}
              onClick={() => {
                onNavigate(command.view);
                setOpen(false);
              }}
              className="flex h-11 w-full items-center gap-3 px-3 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <command.icon
                size={15}
                className="text-neutral-400"
              />

              {command.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}