import {
  ArrowRight,
  Search,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import {
  clearSessions,
  getSessions,
} from "../lib/storage";
import {
  formatSessionDate,
  truncateText,
} from "../lib/utils";

export function HistoryPage() {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  const [sessions, setSessions] = useState(
    getSessions,
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }

    window.addEventListener("keydown", shortcut);

    return () =>
      window.removeEventListener(
        "keydown",
        shortcut,
      );
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return sessions;

    return sessions.filter((session) =>
      session.rawText
        .toLowerCase()
        .includes(query),
    );
  }, [search, sessions]);

  function clearHistory() {
    const approved = window.confirm(
      "Clear every saved Untangle session from this browser?",
    );

    if (!approved) return;

    clearSessions();
    setSessions([]);
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AppHeader historyActive showNewDump />

      <main className="mx-auto w-full max-w-[900px] px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-10">
          <h1 className="text-[34px] font-semibold tracking-[-0.04em]">
            History
          </h1>

          <p className="mt-2 text-[17px] text-muted">
            Things you&apos;ve untangled before.
          </p>
        </header>

        {sessions.length === 0 ? (
          <div className="flex min-h-[420px] items-center justify-center text-center">
            <div>
              <h2 className="text-xl font-medium">
                Nothing tangled yet.
              </h2>

              <p className="mt-2 text-sm text-muted">
                Your previous brain dumps will appear
                here.
              </p>

              <button
                onClick={() => navigate("/")}
                className="mt-6 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
              >
                Untangle something →
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative mb-8">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                ref={searchRef}
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Filter past dumps..."
                className="w-full rounded-xl border border-line bg-panel py-3 pl-10 pr-16 text-sm outline-none transition focus:border-black"
              />

              <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line-dark bg-soft px-2 py-1 font-mono text-[10px] text-muted sm:block">
                ⌘ K
              </span>
            </div>

            <div className="space-y-3">
              {filtered.map((session, index) => {
                const completed =
                  session.items.filter(
                    (item) =>
                      item.completed || item.released,
                  ).length;

                const allClear =
                  session.items.length > 0 &&
                  completed === session.items.length;

                return (
                  <button
                    key={session.id}
                    onClick={() =>
                      navigate(
                        `/session/${session.id}`,
                      )
                    }
                    className="group w-full rounded-xl border border-line bg-panel p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.025)] transition hover:border-line-dark"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="font-mono text-[11px] text-muted">
                            {formatSessionDate(
                              session.createdAt,
                            )}
                          </span>

                          {index === 0 && (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                              <span className="text-[11px] font-medium text-accent">
                                Recent
                              </span>
                            </>
                          )}
                        </div>

                        <h2 className="truncate text-lg font-medium">
                          {truncateText(session.rawText)}
                        </h2>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t border-line pt-3 sm:border-0 sm:pt-0">
                        <span
                          className={
                            allClear
                              ? "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700"
                              : "rounded-full bg-soft px-3 py-1.5 text-xs text-muted"
                          }
                        >
                          {session.items.length} thoughts ·{" "}
                          {completed} completed
                          {allClear ? " · All clear" : ""}
                        </span>

                        <ArrowRight
                          size={17}
                          className="text-faint transition group-hover:translate-x-0.5 group-hover:text-black"
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-sm text-muted">
                  Nothing matches &quot;{search}&quot;.
                </p>
              </div>
            )}

            <div className="mt-14 border-t border-line pt-6">
              <button
                onClick={clearHistory}
                className="inline-flex items-center gap-2 text-xs text-muted hover:text-rose-600"
              >
                <Trash2 size={14} />
                Clear local history
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}