import {
  Network,
  Users,
  Zap,
} from "lucide-react";
import { GlobalHeader } from "./GlobalHeader";
import { MiniNetwork } from "./MiniNetwork";

interface Props {
  onStart(): void;
  onAbout(): void;
}

const briefing = [
  {
    number: "01",
    title: "PASSENGERS APPEAR AT STOPS.",
    text:
      "Commuters materialize continuously across Lagos. Watch each queue and passenger patience level.",
    footer: "PATIENCE WINDOW",
    value: "≈45 SEC",
    icon: Users,
  },
  {
    number: "02",
    title: "SEND DANFOS WHERE THEY'RE NEEDED.",
    text:
      "Select a yellow danfo, then click its destination. Traffic changes route costs in real time.",
    footer: "NOMINAL PAYLOAD",
    value: "8 COMMUTERS",
    icon: Network,
  },
  {
    number: "03",
    title: "DON'T LET STOPS OVERFLOW.",
    text:
      "Full terminals damage City Health. Three serious failures and Lagos stops moving.",
    footer: "FAIL CONDITION",
    value: "3 STRIKES",
    icon: Zap,
  },
];

export function Briefing({
  onStart,
  onAbout,
}: Props) {
  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <GlobalHeader
        onAbout={onAbout}
        status="BRIEFING"
      />

      <main className="mx-auto max-w-[1500px] px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#918976] pb-8">
          <div>
            <div className="mb-4 text-xs tracking-[0.2em] text-[#766d5b]">
              ■ FIELD OPERATOR BRIEFING /
              PROTOCOL V2.4-LOS
            </div>

            <h1
              className="
                text-4xl font-black tracking-[-0.05em]
                sm:text-6xl
              "
            >
              MOVE PEOPLE. NOT PROBLEMS.
            </h1>
          </div>

          <div className="border border-[#918976] px-5 py-3 text-xs">
            LAGOS MUNICIPAL GRID REGISTRY
          </div>
        </div>

        <section
          className="
            mt-14 grid border
            border-[#918976]
            lg:grid-cols-3
          "
        >
          {briefing.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                key={item.number}
                className={`
                  min-h-80 p-7
                  ${
                    index !== briefing.length - 1
                      ? "border-b border-[#918976] lg:border-b-0 lg:border-r"
                      : ""
                  }
                `}
              >
                <div className="flex items-center justify-between border-b border-[#9a927f] pb-5">
                  <strong>{item.number}</strong>
                  <Icon size={18} />
                </div>

                <h2 className="mt-6 text-xl font-black">
                  {item.title}
                </h2>

                <p className="mt-4 leading-7 text-[#676052]">
                  {item.text}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-[#aaa18d] pt-5 text-xs">
                  <span>{item.footer}</span>
                  <strong>{item.value}</strong>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-12 border border-[#918976] p-6">
          <div className="mb-5 flex justify-between border-b border-[#a49b87] pb-4 text-xs">
            <span>
              TRANSIT CORRIDOR 01 —
              KINETIC VECTOR MAP
            </span>

            <span>VECTOR: NORTH-SOUTH AXIS</span>
          </div>

          <MiniNetwork />
        </section>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onStart}
            className="
              cursor-pointer border border-black
              bg-[#ffd000] px-10 py-5
              text-lg font-black
              shadow-[4px_4px_0_#171717]
            "
          >
            BEGIN SHIFT →
          </button>
        </div>
      </main>
    </div>
  );
}