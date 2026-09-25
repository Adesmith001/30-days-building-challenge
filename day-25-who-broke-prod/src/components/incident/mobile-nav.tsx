import {
  Activity,
  Boxes,
  Menu,
  Network,
  Zap,
} from "lucide-react";
import type { Panel } from "@/types";
import { useGameStore } from "@/store/use-game-store";

const mobileItems: Array<{
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
    label: "SIGNALS",
    icon: Activity,
  },
  {
    id: "dependencies",
    label: "SYSTEM",
    icon: Network,
  },
  {
    id: "actions",
    label: "ACTIONS",
    icon: Zap,
  },
  {
    id: "evidence",
    label: "MORE",
    icon: Menu,
  },
];

export function MobileNav() {
  const openPanel = useGameStore(
    (state) => state.openPanel,
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-zinc-800 bg-[#090b0d] lg:hidden">
      {mobileItems.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() =>
              openPanel(item.id)
            }
            className="flex min-h-16 flex-col items-center justify-center gap-1 text-zinc-500 hover:text-white"
          >
            <Icon size={16} />
            <span className="text-[8px] tracking-wider">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
