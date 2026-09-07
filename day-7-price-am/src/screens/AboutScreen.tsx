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
          ● ARCHIVE NOTES · DAY 07 / 30
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
          game. Work through ten everyday products,
          services and expenses, estimate the price,
          lock it in and see how close your market
          instinct really is.
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
            Prices are representative game values and
            may vary by location, seller and time. They
            should not be treated as authoritative
            financial or commercial information.
          </p>
        </div>

        <div className="mt-7">
          <h2 className="text-xl font-black">
            THE RULES
          </h2>

          <p className="mt-3 leading-7 text-[#59615b]">
            Close guesses build your streak. Bad
            guesses reset it. A skip earns zero points
            but preserves the streak, and every run
            includes three skip tokens.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button onClick={onPlay}>
            DEAL THE CARDS →
          </Button>

          <Button
            variant="secondary"
            onClick={onTutorial}
          >
            HOW TO PLAY
          </Button>
        </div>

        <Button
          variant="secondary"
          className="mt-3 w-full"
          onClick={onRecords}
        >
          YOUR MARKET RECORD
        </Button>
      </div>
    </main>
  );
}