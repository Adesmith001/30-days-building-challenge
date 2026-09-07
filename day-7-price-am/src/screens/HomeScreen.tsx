import { getRank } from "../lib/ranks";
import type { MarketRecords } from "../types/game";
import { Button } from "../components/Button";
import { SpecimenCard } from "../components/SpecimenCard";

interface Props {
  records: MarketRecords;
  onStart: () => void;
  onRecords: () => void;
}

export function HomeScreen({
  records,
  onStart,
  onRecords,
}: Props) {
  const rank = getRank(records.bestScore);

  return (
    <main className="mx-auto max-w-[920px] px-5 pt-12">
      <div className="text-center">
        <div
          className="
            inline-flex rounded border
            border-[#cad1c9] bg-[#f6f5f1]
            px-4 py-2 font-mono text-[10px]
            font-bold tracking-[0.14em]
            text-[#174f37]
          "
        >
          ● NIGERIAN PRICE CARD GAME
        </div>

        <h1
          className="
            mx-auto mt-5 max-w-2xl text-4xl
            font-black leading-[1.05] tracking-[-0.05em]
            sm:text-5xl
          "
        >
          HOW WELL DO YOU KNOW MARKET?
        </h1>

        <p className="mt-4 text-[#4f5650]">
          Ten cards. Ten prices. Surely you know what
          these things cost.
        </p>
      </div>

      <SpecimenCard />

      <div className="mx-auto mt-10 max-w-[500px]">
        <Button className="w-full" onClick={onStart}>
          DEAL THE CARDS →
        </Button>

        <div
          className="
            mt-3 flex justify-center gap-3 font-mono
            text-[9px] font-bold tracking-[0.14em]
          "
        >
          <span>10 CARDS</span>
          <span>·</span>
          <span>SCORE ATTACK</span>
          <span>·</span>
          <span>~2 MIN</span>
        </div>

        <button
          onClick={onRecords}
          className="
            mt-8 grid w-full grid-cols-2
            rounded-xl border border-[#ded8cf]
            bg-[#f5f3ef] text-left
          "
        >
          <div className="p-5">
            <div
              className="
                font-mono text-[9px] font-bold
                tracking-[0.13em] text-[#747c74]
              "
            >
              PERSONAL BEST
            </div>

            <div className="mt-1 font-mono text-3xl font-black">
              {records.bestScore.toLocaleString("en-NG")}
            </div>
          </div>

          <div
            className="
              border-l border-[#d8d9d4] p-5 text-right
            "
          >
            <div
              className="
                font-mono text-[9px] font-bold
                tracking-[0.13em] text-[#747c74]
              "
            >
              CURRENT TITLE
            </div>

            <div
              className="
                mt-2 inline-block rounded border
                border-[#c2c7c1] bg-white px-3 py-2
                font-mono text-[9px] font-bold
                tracking-[0.1em]
              "
            >
              ● {rank.name}
            </div>
          </div>
        </button>
      </div>
    </main>
  );
}