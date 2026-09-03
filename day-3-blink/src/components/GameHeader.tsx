import {
  Bolt,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";
import { formatScore } from "../lib/utils";

type Props = {
  round?: number;
  score?: number;
  streak?: number;
  gameplay?: boolean;
  onSettings?: () => void;
  onRecords?: () => void;
  onAbout?: () => void;
};

export function GameHeader({
  round = 1,
  score = 0,
  streak = 0,
  gameplay = false,
  onSettings,
  onRecords,
  onAbout,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

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

          <nav className="relative flex justify-end gap-6 font-mono text-xs">
            <button
              type="button"
              onClick={onRecords}
              className="hidden md:block"
            >
              RECORDS
            </button>

            <button
              type="button"
              onClick={onAbout}
              className="hidden md:block"
            >
              ABOUT
            </button>

            <a
              href="https://github.com/Adesmith001/30-days-building-challenge"
              target="_blank"
              rel="noreferrer"
              className="hidden md:block"
            >
              SOURCE ↗
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid size-10 place-items-center md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 z-10 w-48 border border-slate-300 bg-[#f8f7f5] p-2 shadow-lg md:hidden">
                <button
                  type="button"
                  onClick={() => {
                    onRecords?.();
                    setMenuOpen(false);
                  }}
                  className="block w-full px-3 py-3 text-left"
                >
                  RECORDS
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onAbout?.();
                    setMenuOpen(false);
                  }}
                  className="block w-full px-3 py-3 text-left"
                >
                  ABOUT
                </button>

                <a
                  href="https://github.com/Adesmith001/30-days-building-challenge"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-3"
                >
                  SOURCE ↗
                </a>
              </div>
            )}
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