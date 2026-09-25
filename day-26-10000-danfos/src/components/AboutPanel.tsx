import { useSimulationStore } from "../store/useSimulationStore";
import { PanelShell } from "./EnginePanel";

export function AboutPanel() {
  const panel = useSimulationStore(
    (state) => state.panel,
  );

  const setPanel = useSimulationStore(
    (state) => state.setPanel,
  );

  if (panel !== "about") return null;

  return (
    <PanelShell
      title="HOW IT WORKS"
      onClose={() => setPanel(null)}
    >
      <h2 className="text-4xl font-black uppercase leading-[0.88] tracking-[-0.055em]">
        Three rules.
        <br />
        One road.
      </h2>

      <AboutRule
        title="SEPARATION"
        copy="Don't get too close."
      />

      <AboutRule
        title="ALIGNMENT"
        copy="Follow local traffic flow."
      />

      <AboutRule
        title="ROAD"
        copy="Stay on the route graph."
      />

      <div className="mt-7 border-t border-white/10 pt-6">
        <p className="text-[9px] font-black tracking-[0.16em] text-[#f1c40f]">
          WHY THE GRID?
        </p>

        <p className="mt-3 text-xs leading-5 text-white/45">
          A Danfo does not need to inspect traffic
          on the other side of the city. GRID divides
          the world into cells and searches only the
          current and surrounding cells.
        </p>
      </div>

      <div className="mt-7 border-t border-white/10 pt-6">
        <p className="text-[9px] font-black tracking-[0.16em]">
          ARCHITECTURE
        </p>

        <pre className="mt-4 overflow-x-auto font-mono text-[9px] leading-6 text-white/45">
{`UI
↓
SIMULATION WORKER
↓
TYPED ARRAYS
↓
GRID / NAIVE / QUADTREE
↓
STEERING + ROUTING
↓
RENDER BUFFER
↓
INSTANCED THREE.JS`}
        </pre>

        <p className="mt-4 text-[9px] leading-4 text-white/30">
          React never stores 10,000 vehicle positions
          in component state.
        </p>
      </div>

      <div className="mt-7 border-t border-white/10 pt-6 text-[9px] leading-5 text-white/30">
        A Lagos-inspired simulation. Road geometry,
        vehicle speeds, congestion and traffic volumes
        are synthetic and designed for this experiment.
      </div>
    </PanelShell>
  );
}

function AboutRule({
  title,
  copy,
}: {
  title: string;
  copy: string;
}) {
  return (
    <div className="mt-5 border-l border-[#f1c40f]/60 pl-4">
      <p className="text-[9px] font-black tracking-[0.14em]">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-white/35">
        {copy}
      </p>
    </div>
  );
}
