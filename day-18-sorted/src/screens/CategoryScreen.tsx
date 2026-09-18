import {
  AppShell,
} from "../components/AppShell";

import {
  categories,
  puzzles,
} from "../data/puzzles";

import type {
  PuzzleCategory,
} from "../types/game";

export function CategoryScreen({
  onPick,
  onHome,
}: {
  onPick: (
    category:
      PuzzleCategory,
  ) => void;
  onHome: () => void;
}) {
  return (
    <AppShell
      hideNav
      onNavigate={() =>
        onHome()
      }
    >
      <div>
        <span
          className="
            font-display
            text-xs
            font-bold
            tracking-widest
            text-emerald-300
          "
        >
          CATEGORY MODE
        </span>

        <h1
          className="
            mt-2
            font-display
            text-4xl
            font-bold
          "
        >
          PICK YOUR LANE.
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-slate-400
          "
        >
          Ten rounds where
          possible. Smaller
          categories repeat only
          across separate runs,
          never inside one run.
        </p>

        <div
          className="
            mt-6
            grid
            grid-cols-2
            gap-3
          "
        >
          {categories.map(
            (category) => {
              const count =
                puzzles.filter(
                  (puzzle) =>
                    puzzle.category ===
                    category,
                ).length;

              return (
                <button
                  key={
                    category
                  }
                  onClick={() =>
                    onPick(
                      category,
                    )
                  }
                  className="
                    min-h-28
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-4
                    text-left
                    transition
                    hover:border-gold/50
                    hover:bg-white/10
                  "
                >
                  <span
                    className="
                      font-display
                      text-lg
                      font-bold
                      text-gold
                    "
                  >
                    {
                      category
                    }
                  </span>

                  <span
                    className="
                      mt-2
                      block
                      text-xs
                      text-slate-400
                    "
                  >
                    {count}
                    {" "}
                    curated puzzles
                  </span>
                </button>
              );
            },
          )}
        </div>

        <button
          onClick={
            onHome
          }
          className="
            mt-5
            w-full
            py-3
            text-sm
            font-semibold
            text-slate-400
            hover:text-white
          "
        >
          ← BACK
        </button>
      </div>
    </AppShell>
  );
}