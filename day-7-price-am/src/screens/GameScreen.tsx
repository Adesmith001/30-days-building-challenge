/* eslint-disable react-hooks/set-state-in-effect */
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { DeckLayers } from "../components/DeckLayer";
import { GameHUD } from "../components/GameHUD";
import { PriceCard } from "../components/PriceCard";
import { PriceInput } from "../components/PriceInput";
import { ResultCard } from "../components/ResultCard";
import { useGame } from "../hooks/useGame";
import type {
  PriceItem,
  RoundResult,
} from "../types/game";

interface Props {
  onComplete: (results: RoundResult[]) => void;
}

function defaultGuess(item: PriceItem) {
  const middle = (item.minPrice + item.maxPrice) / 2;

  return (
    Math.round(middle / item.step) * item.step
  );
}

export function GameScreen({
  onComplete,
}: Props) {
  const game = useGame();

  const [guess, setGuess] = useState(() =>
    defaultGuess(game.currentItem),
  );

  const [skipFlash, setSkipFlash] =
    useState<string | null>(null);

  const completedRef = useRef(false);

  useEffect(() => {
    setGuess(defaultGuess(game.currentItem));
  }, [game.currentItem]);

  useEffect(() => {
    if (
      game.phase === "complete" &&
      !completedRef.current
    ) {
      completedRef.current = true;
      onComplete(game.results);
    }
  }, [game.phase, game.results, onComplete]);

  function skip() {
    const didSkip = game.skipCurrent();

    if (!didSkip) return;

    setSkipFlash(
      `PASSED - ${Math.max(game.skipsLeft - 1, 0)} PASS LEFT`,
    );

    window.setTimeout(() => {
      setSkipFlash(null);
    }, 1300);
  }

  return (
    <main className="mx-auto max-w-[920px] px-4 pt-7 sm:px-5">
      <GameHUD
        card={Math.min(game.index + 1, 10)}
        total={10}
        score={game.score}
        streak={game.streak}
        skipsLeft={game.skipsLeft}
      />

      {skipFlash && (
        <div
          className="
            mx-auto mb-5 w-fit rounded-full
            border border-[#eaa356] bg-[#fff0dd]
            px-4 py-2 font-mono text-[10px]
            font-bold tracking-[0.12em]
            text-[#945205]
          "
        >
          ⏩ {skipFlash}
        </div>
      )}

      {game.phase !== "complete" && (
        <div className="mx-auto max-w-[520px]">
          {game.phase === "result" &&
          game.currentResult ? (
            <ResultCard
              result={game.currentResult}
              onNext={game.nextCard}
            />
          ) : (
            <>
              <div className="relative">
                <DeckLayers />

                <PriceCard
                  key={game.currentItem.id}
                  item={game.currentItem}
                  canSkip={game.skipsLeft > 0}
                  disabled={game.phase !== "question"}
                  exitDirection={
                    game.phase === "transition"
                      ? game.currentResult?.direction
                      : undefined
                  }
                  onSkip={skip}
                  onNoSkips={() => {
                    setSkipFlash("NO PASS LEFT");

                    window.setTimeout(
                      () => setSkipFlash(null),
                      1300,
                    );
                  }}
                  onAutoComplete={game.revealResult}
                />
              </div>

              <PriceInput
                item={game.currentItem}
                value={guess}
                disabled={game.phase !== "question"}
                onChange={setGuess}
                onLock={() => game.lockGuess(guess)}
              />
            </>
          )}
        </div>
      )}

      <div
        className="
          mx-auto mt-10 max-w-[520px] border-t
          border-[#d5dad4] pt-5 text-center
          font-mono text-[9px] font-bold
          tracking-[0.14em] text-[#737c74]
        "
      >
        NAIJA PRICE CHECK - MARKET, FOOD, GADGETS, RENT
      </div>
    </main>
  );
}
