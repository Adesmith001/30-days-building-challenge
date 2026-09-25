import { Check } from "lucide-react";
import { useSimulationStore } from "../store/useSimulationStore";
import { PanelShell } from "./EnginePanel";

const missions = [
  ["bend-flow", "BEND THE FLOW", "Push traffic with the pointer."],
  ["ten-k", "FILL THE CITY", "Reach 10,000 active agents."],
  ["grid", "REVEAL THE GRID", "Expose the local search cells."],
  ["inspect", "FOLLOW ONE DANFO", "Inspect an individual agent."],
  ["naive", "BREAK THE SEARCH", "Compare against brute force."],
  ["roadblock", "BREAK THE ROAD", "Close a road and force rerouting."],
  ["benchmark", "RUN THE ENGINES", "Complete a local benchmark."],
  ["photo", "TAKE THE SHOT", "Enter photo mode."],
] as const;

export function MissionPanel() {
  const panel = useSimulationStore(
    (state) => state.panel,
  );

  const setPanel = useSimulationStore(
    (state) => state.setPanel,
  );

  const completed = useSimulationStore(
    (state) => state.missions,
  );

  if (panel !== "missions") return null;

  const count = missions.filter(
    ([id]) => completed[id],
  ).length;

  return (
    <PanelShell
      title={`CITY RUN · ${count}/${missions.length} DISCOVERIES`}
      onClose={() => setPanel(null)}
    >
      <p className="mb-5 text-xs leading-5 text-white/35">
        No points. No leaderboard. Just progressively
        stranger things to do to the traffic engine.
      </p>

      <div>
        {missions.map(([id, title, description]) => (
          <div
            key={id}
            className="flex gap-3 border-b border-white/[0.07] py-4"
          >
            <div
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border ${
                completed[id]
                  ? "border-[#f1c40f] bg-[#f1c40f] text-black"
                  : "border-white/15 text-transparent"
              }`}
            >
              <Check size={12} />
            </div>

            <div>
              <p className="text-[9px] font-black tracking-[0.14em]">
                {title}
              </p>

              <p className="mt-1 text-[9px] leading-4 text-white/30">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
