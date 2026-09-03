import {
  Bolt,
  Settings,
} from "lucide-react";
import { formatScore } from "../lib/utils";

type Props = {
  round?: number;
  score?: number;
  streak?: number;
  gameplay?: boolean;
  onSettings?: () => void;
};

export function GameHeader({
  round = 1,
  score = 0,
  streak = 0,
  gameplay = false,
  onSettings,
}: Props) {
  if (!gameplay) {
    return (
      <header className="border-b border-slate-300">
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-3 items-center px-5 md:px-10">
          <div>
            <span className="border border-slate-300 px-3 py-2 font-mono text-xs">
              03 / 30
            </span>
          </div>

          <p className="text-center text-3xl font-bold tracking-tight md:text-4xl">
            BLINK
          </p>

          <nav className="flex justify-end gap-6 font-mono text-xs">
            <a
              href="#about"
              className="hidden md:block"
            >
              ABOUT
            </a>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="hidden md:block"
            >
              SOURCE ↗
            </a>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-slate-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 md:px-10">
        <p className="text-2xl font-bold">
          BLINK
        </p>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="border border-slate-300 px-3 py-2 font-mono text-xs">
            ROUND {String(round).padStart(2, "0")} / 10
          </div>

          <div className="hidden border border-slate-300 px-3 py-2 font-mono text-xs sm:block">
            SCORE{" "}
            <span className="ml-2 text-base">
              {formatScore(score)}
            </span>
          </div>

          <div className="hidden items-center gap-2 border border-slate-300 px-3 py-2 font-mono text-xs md:flex">
            <Bolt className="size-4 text-blue-700" />
            STREAK ×{streak}
          </div>

          <button
            type="button"
            onClick={onSettings}
            className="grid size-10 place-items-center"
            aria-label="Open settings"
          >
            <Settings className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}