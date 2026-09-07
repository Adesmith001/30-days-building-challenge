import { Button } from "../components/Button";

interface Props {
  onTutorial: () => void;
  onRecords: () => void;
  onPlay: () => void;
}

export function AboutScreen({
  onTutorial,
  onRecords,
  onPlay,
}: Props) {
  return (
    <main className="mx-auto max-w-[720px] px-5 pt-12">
      <div
        className="
          rounded-2xl border border-[#bbc6bc]
          bg-white p-7 shadow-lg sm:p-9
        "
      >
        <div
          className="
            font-mono text-[10px] font-bold
            tracking-[0.14em] text-[#075d38]
          "
        >
          * PRICE AM - DAY 07 / 30
        </div>

        <h1
          className="
            mt-5 text-5xl font-black
            tracking-[-0.06em]
          "
        >
          ABOUT PRICE AM
        </h1>

        <p className="mt-5 leading-7 text-[#555e57]">
          Price Am is a Nigerian price-guessing card
          game. Guess food, market items, gadgets,
          home essentials and Lagos wahala prices.
          Lock your answer and see if your price sense
          still dey active.
        </p>

        <div
          className="
            mt-8 border-y border-[#d7dbd5]
            py-6
          "
        >
          <h2 className="text-xl font-black">
            PRICE DISCLAIMER
          </h2>

          <p className="mt-3 leading-7 text-[#59615b]">
            Prices are representative game values from
            Nigerian online and market checks. Actual
            seller prices move fast, so treat them as
            gameplay benchmarks, not final quotation.
          </p>
        </div>

        <div className="mt-7">
          <h2 className="text-xl font-black">
            HOW E WORKS
          </h2>

          <p className="mt-3 leading-7 text-[#59615b]">
            Close guesses build your streak. Wild
            guesses reset am. Passing earns zero points
            but keeps the streak, and every run gives
            you three passes.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button onClick={onPlay}>
            START GAME
          </Button>

          <Button
            variant="secondary"
            onClick={onTutorial}
          >
            SHOW ME HOW
          </Button>
        </div>

        <Button
          variant="secondary"
          className="mt-3 w-full"
          onClick={onRecords}
        >
          MY MARKET RECORD
        </Button>
      </div>
    </main>
  );
}
