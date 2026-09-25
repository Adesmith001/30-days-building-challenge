import { layouts } from "../data/layouts";
import { useSimulationStore } from "../store/useSimulationStore";
import { PanelShell } from "./EnginePanel";

const populations = [500, 1000, 2500, 5000, 10000];

export function MorePanel() {
  const panel = useSimulationStore(
    (state) => state.panel,
  );

  const setPanel = useSimulationStore(
    (state) => state.setPanel,
  );

  const population = useSimulationStore(
    (state) => state.population,
  );

  const setPopulation = useSimulationStore(
    (state) => state.setPopulation,
  );

  const layoutId = useSimulationStore(
    (state) => state.layoutId,
  );

  const setLayout = useSimulationStore(
    (state) => state.setLayout,
  );

  const night = useSimulationStore(
    (state) => state.night,
  );

  const sound = useSimulationStore(
    (state) => state.sound,
  );

  const trafficLights = useSimulationStore(
    (state) => state.trafficLights,
  );

  const recording = useSimulationStore(
    (state) => state.recording,
  );

  const replaying = useSimulationStore(
    (state) => state.replaying,
  );

  const toggleNight = useSimulationStore(
    (state) => state.toggleNight,
  );

  const toggleSound = useSimulationStore(
    (state) => state.toggleSound,
  );

  const toggleLights = useSimulationStore(
    (state) => state.toggleTrafficLights,
  );

  const toggleOverlay = useSimulationStore(
    (state) => state.toggleOverlay,
  );

  const randomIncident = useSimulationStore(
    (state) => state.randomIncident,
  );

  const clearBlocks = useSimulationStore(
    (state) => state.clearBlocks,
  );

  const setTouring = useSimulationStore(
    (state) => state.setTouring,
  );

  const setPhotoMode = useSimulationStore(
    (state) => state.setPhotoMode,
  );

  const toggleRecording = useSimulationStore(
    (state) => state.toggleRecording,
  );

  const requestReplay = useSimulationStore(
    (state) => state.requestReplay,
  );

  if (panel !== "more") return null;

  return (
    <PanelShell
      title="CITY CONTROLS"
      onClose={() => setPanel(null)}
    >
      <Section title="TRAFFIC">
        <div className="grid grid-cols-5 gap-1">
          {populations.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setPopulation(value)}
              className={`py-3 text-[8px] font-bold ${
                population === value
                  ? "bg-[#f1c40f] text-black"
                  : "bg-white/5 text-white/45"
              }`}
            >
              {value >= 1000
                ? `${value / 1000}K`
                : value}
            </button>
          ))}
        </div>
      </Section>

      <Section title="CITY LAYOUT">
        <select
          value={layoutId}
          onChange={(event) =>
            setLayout(event.target.value)
          }
          className="w-full border border-white/10 bg-[#11120f] px-3 py-3 text-[9px] font-semibold text-white outline-none"
        >
          {layouts.map((layout) => (
            <option
              key={layout.id}
              value={layout.id}
            >
              {layout.name} — {layout.subtitle}
            </option>
          ))}
        </select>
      </Section>

      <Section title="VISUALIZERS">
        <div className="grid grid-cols-2 gap-2">
          <SmallButton
            onClick={() =>
              toggleOverlay("heatmap")
            }
          >
            TRAFFIC HEAT
          </SmallButton>

          <SmallButton
            onClick={() => toggleOverlay("flow")}
          >
            FLOW FIELD
          </SmallButton>

          <SmallButton onClick={toggleLights}>
            LIGHTS {trafficLights ? "ON" : "OFF"}
          </SmallButton>

          <SmallButton onClick={toggleNight}>
            {night ? "DAY MODE" : "NIGHT MODE"}
          </SmallButton>
        </div>
      </Section>

      <Section title="INCIDENTS">
        <div className="grid grid-cols-2 gap-2">
          <SmallButton onClick={randomIncident}>
            RANDOM INCIDENT
          </SmallButton>

          <SmallButton onClick={clearBlocks}>
            OPEN ALL ROADS
          </SmallButton>
        </div>
      </Section>

      <Section title="REPLAY">
        <div className="grid grid-cols-2 gap-2">
          <SmallButton onClick={toggleRecording}>
            {recording ? "STOP RECORDING" : "RECORD 8S"}
          </SmallButton>

          <SmallButton
            onClick={requestReplay}
            disabled={replaying}
          >
            {replaying ? "REPLAYING..." : "PLAY REPLAY"}
          </SmallButton>
        </div>
      </Section>

      <Section title="EXPERIENCE">
        <div className="grid grid-cols-2 gap-2">
          <SmallButton onClick={() => setTouring(true)}>
            TOUR CITY
          </SmallButton>

          <SmallButton
            onClick={() => setPanel("missions")}
          >
            CITY RUN
          </SmallButton>

          <SmallButton onClick={toggleSound}>
            SOUND {sound ? "ON" : "OFF"}
          </SmallButton>

          <SmallButton
            onClick={() => setPhotoMode(true)}
          >
            PHOTO MODE
          </SmallButton>

          <SmallButton
            onClick={() => setPanel("share")}
          >
            SHARE RESULT
          </SmallButton>

          <SmallButton
            onClick={() => setPanel("about")}
          >
            ABOUT ENGINE
          </SmallButton>
        </div>
      </Section>
    </PanelShell>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-white/[0.07] py-4 first:pt-0 last:border-0">
      <p className="mb-3 text-[8px] font-bold tracking-[0.16em] text-white/30">
        {title}
      </p>

      {children}
    </section>
  );
}

function SmallButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="border border-white/10 px-2 py-3 text-[8px] font-bold tracking-[0.1em] text-white/45 transition hover:border-white/30 hover:text-white disabled:opacity-30"
    >
      {children}
    </button>
  );
}
