import {
  Bolt,
  Eye,
  Gauge,
  Timer,
} from "lucide-react";

type Props = {
  active: "stimulus" | "rounds" | "latency" | "streak";
};

const items = [
  {
    id: "stimulus",
    label: "STIMULUS",
    icon: Eye,
  },
  {
    id: "rounds",
    label: "ROUNDS",
    icon: Timer,
  },
  {
    id: "latency",
    label: "LATENCY",
    icon: Gauge,
  },
  {
    id: "streak",
    label: "STREAK",
    icon: Bolt,
  },
] as const;

export function GameSidebar({
  active,
}: Props) {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-300 lg:block">
      <div className="p-7">
        <p className="font-mono text-xs tracking-[0.2em] text-slate-500">
          GAME HUD
        </p>

        <p className="mt-3 font-mono text-lg text-slate-400">
          V.1.0.4
        </p>
      </div>

      <div className="space-y-2 px-4">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = item.id === active;

          return (
            <div
              key={item.id}
              className={[
                "flex items-center gap-4 px-4 py-4 font-mono text-xs",
                selected
                  ? "bg-violet-600 text-white"
                  : "text-slate-700",
              ].join(" ")}
            >
              <Icon className="size-5" />
              {item.label}
            </div>
          );
        })}
      </div>
    </aside>
  );
}