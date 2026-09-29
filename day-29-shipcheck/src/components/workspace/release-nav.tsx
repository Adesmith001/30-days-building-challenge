"use client";

import {
  Boxes,
  ClipboardCheck,
  FileCode2,
  PackageCheck,
  Radar,
  Route,
} from "lucide-react";
import type { WorkspaceView } from "@/stores/release-store";
import { cn } from "@/lib/cn";

const items: Array<{
  id: WorkspaceView;
  label: string;
  icon: typeof Radar;
}> = [
  {
    id: "overview",
    label: "OVERVIEW",
    icon: Radar,
  },
  {
    id: "changes",
    label: "CHANGES",
    icon: FileCode2,
  },
  {
    id: "gates",
    label: "GATES",
    icon: ClipboardCheck,
  },
  {
    id: "rollout",
    label: "ROLLOUT",
    icon: Route,
  },
  {
    id: "verify",
    label: "VERIFY",
    icon: PackageCheck,
  },
  {
    id: "packet",
    label: "PACKET",
    icon: Boxes,
  },
];

interface Props {
  view: WorkspaceView;
  onChange: (view: WorkspaceView) => void;
}

export function ReleaseNav({
  view,
  onChange,
}: Props) {
  return (
    <>
      <aside className="hidden w-52 shrink-0 border-r border-neutral-200 bg-[#f7f7f4] p-3 dark:border-neutral-800 dark:bg-neutral-950 md:block">
        <nav className="space-y-1">
          {items.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              active={item.id === view}
              onClick={() => onChange(item.id)}
            />
          ))}
        </nav>

        <div className="mt-7 border-t border-neutral-200 pt-5 font-mono text-[9px] leading-5 text-neutral-400 dark:border-neutral-800">
          <p>G GATES</p>
          <p>C CHANGES</p>
          <p>R ROLLOUT</p>
          <p>V VERIFY</p>
          <p>E EXPORT</p>
          <p>⌘K COMMANDS</p>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 md:hidden">
        {items.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              "flex h-16 flex-col items-center justify-center gap-1 text-[9px] font-semibold",
              item.id === view
                ? "text-blue-600"
                : "text-neutral-400",
            )}
          >
            <item.icon size={17} />
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: (typeof items)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-9 w-full items-center gap-3 rounded-md px-3 text-left text-xs font-semibold",
        active
          ? "bg-white text-neutral-950 dark:bg-neutral-800 dark:text-white"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-900 dark:hover:text-white",
      )}
    >
      <item.icon size={14} />
      {item.label}
    </button>
  );
}