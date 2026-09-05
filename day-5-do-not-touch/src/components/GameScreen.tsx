import type {
  CatchOutcome,
  LevelConfig,
} from "../types/game";
import { Arena } from "./Arena";
import { Footer } from "./Footer";
import { GameHUD } from "./GameHUD";
import { Header } from "./Header";

interface Props {
  level: LevelConfig;
  score: number;
  streak: number;
  bossHits: number;
  onMiss: () => void;
  onCatch: () => CatchOutcome;
  onReset: () => void;
}

export function GameScreen({
  level,
  score,
  streak,
  bossHits,
  onMiss,
  onCatch,
  onReset,
}: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f6f3]">
      <Header />

      <main className="mx-auto flex w-full max-w-[1040px] flex-1 flex-col px-5 md:px-7">
        <GameHUD
          level={level.id}
          score={score}
          streak={streak}
        />

        <div className="flex flex-1 flex-col justify-center py-8">
          <div className="mb-3 flex justify-between px-1 font-mono text-[9px] tracking-[0.14em] text-[#697084]">
            <span>{level.protocol}</span>

            {level.id === 10 && (
              <span className="text-[#1248ff]">
                BUTTON DON RESOLVE{" "}
                {"●".repeat(3 - bossHits)}
                {"○".repeat(bossHits)}
              </span>
            )}
          </div>

          <Arena
            level={level}
            bossHits={bossHits}
            onMiss={onMiss}
            onCatch={onCatch}
          />

          <div className="mt-4 flex justify-between font-mono text-[9px] tracking-[0.12em] text-[#70768a]">
            <span>
              STATUS: SYSTEM READY · LATENCY: &lt;12MS
            </span>

            <span className="hidden md:block">
              EYE SHARP: ON
            </span>
          </div>
        </div>
      </main>

      <Footer onReset={onReset} />
    </div>
  );
}