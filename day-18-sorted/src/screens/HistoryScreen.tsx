import {
  AppShell,
} from "../components/AppShell";

import {
  formatTime,
} from "../lib/scoring";

import {
  loadHistory,
} from "../lib/storage";

export function HistoryScreen({
  onHome,
  onNavigate,
}: {
  onHome: () => void;
  onNavigate: (
    target:
      | "home"
      | "daily"
      | "history",
  ) => void;
}) {
  const history =
    loadHistory();

  return (
    <AppShell
      active="history"
      onNavigate={
        onNavigate
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
          RUNS
        </span>

        <h1
          className="
            mt-2
            font-display
            text-4xl
            font-bold
          "
        >
          YOUR ARCHIVE.
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-slate-400
          "
        >
          The latest 30
          runs stay on
          this device.
        </p>

        <div
          className="
            mt-6
            space-y-3
          "
        >
          {history.length ===
            0 && (
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-white/15
                p-8
                text-center
                text-sm
                text-slate-500
              "
            >
              No runs yet.
              Your first result
              will land here.
            </div>
          )}

          {history.map(
            (run) => (
              <article
                key={run.id}
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-4
                "
              >
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  "
                >
                  <div>
                    <span
                      className="
                        font-display
                        text-[10px]
                        font-bold
                        tracking-widest
                        text-slate-500
                      "
                    >
                      {
                        new Date(
                          run.date,
                        )
                          .toLocaleDateString(
                            undefined,
                            {
                              month:
                                "short",
                              day:
                                "numeric",
                            },
                          )
                          .toUpperCase()
                      }
                      {" · "}
                      {
                        run.mode
                          .toUpperCase()
                      }
                    </span>

                    <div
                      className="
                        mt-1
                        font-display
                        text-3xl
                        font-bold
                        text-gold
                      "
                    >
                      {
                        run.score
                          .toLocaleString()
                      }
                    </div>
                  </div>

                  <span
                    className="
                      rounded-full
                      border
                      border-white/10
                      px-3
                      py-1
                      font-display
                      text-[10px]
                      font-bold
                      text-emerald-300
                    "
                  >
                    {run.rank}
                  </span>
                </div>

                <div
                  className="
                    mt-3
                    grid
                    grid-cols-3
                    gap-2
                    text-xs
                    text-slate-400
                  "
                >
                  <span>
                    <strong
                      className="
                        block
                        text-white
                      "
                    >
                      {
                        run
                          .perfectOrders
                      }
                    </strong>
                    PERFECT
                  </span>

                  <span>
                    <strong
                      className="
                        block
                        text-white
                      "
                    >
                      {
                        run
                          .exactPositions
                      }
                    </strong>
                    EXACT
                  </span>

                  <span>
                    <strong
                      className="
                        block
                        text-white
                      "
                    >
                      {
                        formatTime(
                          run
                            .fastestPerfectMs,
                        )
                      }
                    </strong>
                    FASTEST
                  </span>
                </div>
              </article>
            ),
          )}
        </div>

        <button
          onClick={
            onHome
          }
          className="
            mt-6
            w-full
            py-3
            text-xs
            font-bold
            text-slate-500
            hover:text-white
          "
        >
          BACK HOME
        </button>
      </div>
    </AppShell>
  );
}