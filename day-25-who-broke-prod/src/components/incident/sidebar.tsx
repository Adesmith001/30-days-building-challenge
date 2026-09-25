import {
  Activity,
  Boxes,
  Braces,
  Clock3,
  Database,
  FileText,
  Flag,
  GitCommitHorizontal,
  ListTree,
  Network,
  ScrollText,
  ServerCog,
  SquareTerminal,
  Target,
  Waypoints,
  Zap,
} from "lucide-react";
import type { Panel } from "@/types";
import { cn } from "@/lib/cn";
import { useGameStore } from "@/store/use-game-store";

const items: Array<{
  id: Panel;
  label: string;
  icon: typeof Activity;
}> = [
  {
    id: "overview",
    label: "OVERVIEW",
    icon: Boxes,
  },
  {
    id: "metrics",
    label: "METRICS",
    icon: Activity,
  },
  {
    id: "logs",
    label: "LOGS",
    icon: FileText,
  },
  {
    id: "traces",
    label: "TRACES",
    icon: Waypoints,
  },
  {
    id: "deploys",
    label: "DEPLOYS",
    icon: GitCommitHorizontal,
  },
  {
    id: "database",
    label: "DATABASE",
    icon: Database,
  },
  {
    id: "cache",
    label: "CACHE",
    icon: ServerCog,
  },
  {
    id: "queues",
    label: "QUEUES",
    icon: ListTree,
  },
  {
    id: "flags",
    label: "FLAGS",
    icon: Flag,
  },
  {
    id: "dependencies",
    label: "DEPENDENCIES",
    icon: Network,
  },
  {
    id: "timeline",
    label: "TIMELINE",
    icon: Clock3,
  },
  {
    id: "evidence",
    label: "EVIDENCE",
    icon: Braces,
  },
  {
    id: "hypothesis",
    label: "HYPOTHESIS",
    icon: Target,
  },
  {
    id: "actions",
    label: "ACTIONS",
    icon: Zap,
  },
  {
    id: "terminal",
    label: "TERMINAL",
    icon: SquareTerminal,
  },
];

export function Sidebar() {
  const run = useGameStore(
    (state) => state.run,
  );

  const openPanel = useGameStore(
    (state) => state.openPanel,
  );

  if (!run) return null;

  return (
    <aside className="hidden h-screen w-[188px] shrink-0 flex-col border-r border-zinc-800 bg-[#090b0d] lg:flex">
      <div className="flex h-14 items-center border-b border-zinc-800 px-4">
        <span className="text-[10px] font-semibold tracking-[0.16em] text-zinc-400">
          WHO BROKE PROD?
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() =>
                openPanel(item.id)
              }
              className={cn(
                "flex w-full items-center gap-3 border-l-2 px-4 py-2.5 text-left text-[10px] tracking-[0.12em] transition",
                run.panel === item.id
                  ? "border-blue-400 bg-blue-950/20 text-zinc-100"
                  : "border-transparent text-zinc-600 hover:bg-zinc-900 hover:text-zinc-300",
              )}
            >
              <Icon size={13} />
              {item.label}

              {item.id === "evidence" &&
                run.evidence.length > 0 && (
                  <span className="ml-auto font-mono text-blue-300">
                    {
                      run.evidence
                        .length
                    }
                  </span>
                )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-4 font-mono text-[9px] leading-5 text-zinc-700">
        CMD / CTRL + K
        <br />
        COMMAND PALETTE
      </div>
    </aside>
  );
}
