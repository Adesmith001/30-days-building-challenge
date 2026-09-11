import {
  Check,
  ChevronDown,
  Focus,
  Lightbulb,
  SlidersHorizontal,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "motion/react";
import {
  useMemo,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { IdeaCard } from "../components/IdeaCard";
import { TaskRow } from "../components/TaskRow";
import {
  buildPlan,
  findMostImportant,
  simplifyThoughts,
} from "../lib/api";
import {
  getSession,
  saveSession,
} from "../lib/storage";
import {
  countProgress,
  getActiveItems,
  getNextItem,
} from "../lib/utils";
import type {
  AiItem,
  Category,
  Session,
} from "../types";

export function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] =
    useState<Session | null>(() =>
      id ? getSession(id) : null,
    );

  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState("");
  const [showCompleted, setShowCompleted] =
    useState(false);

  const progress = useMemo(
    () =>
      session
        ? countProgress(session.items)
        : { total: 0, cleared: 0 },
    [session],
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-canvas">
        <AppHeader showNewDump />

        <main className="mx-auto max-w-[900px] px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold">
            This untangle session isn&apos;t here.
          </h1>

          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-lg bg-black px-5 py-3 text-sm text-white"
          >
            Start a new dump
          </button>
        </main>
      </div>
    );
  }

  const currentSession = session;

  const activeItems = getActiveItems(currentSession);
  const nextItem = getNextItem(currentSession);

  const nowItems = activeItems.filter(
    (item) => item.category === "now",
  );
  const soonItems = activeItems.filter(
    (item) => item.category === "soon",
  );
  const laterItems = activeItems.filter(
    (item) => item.category === "later",
  );
  const ideas = activeItems.filter(
    (item) => item.category === "ideas",
  );
  const letGo = activeItems.filter(
    (item) => item.category === "let_go",
  );

  const completed = currentSession.items.filter(
    (item) => item.completed,
  );

  const percent =
    progress.total > 0
      ? Math.round(
          (progress.cleared / progress.total) * 100,
        )
      : 100;

  function commit(next: Session) {
    const value = {
      ...next,
      updatedAt: new Date().toISOString(),
    };

    saveSession(value);
    setSession(value);
  }

  function showToast(message: string) {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2400);
  }

  function completeItem(itemId: string) {
    commit({
      ...currentSession,
      items: currentSession.items.map((item) =>
        item.id === itemId
          ? { ...item, completed: true }
          : item,
      ),
    });

    showToast("One less thing in your head.");
  }

  function moveItem(
    itemId: string,
    category: Category,
  ) {
    commit({
      ...currentSession,
      items: currentSession.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              category,
              kind:
                category === "ideas"
                  ? "idea"
                  : category === "let_go"
                    ? "thought"
                    : "task",
            }
          : item,
      ),
    });
  }

  function editItem(
    itemId: string,
    title: string,
  ) {
    commit({
      ...currentSession,
      items: currentSession.items.map((item) =>
        item.id === itemId
          ? { ...item, title }
          : item,
      ),
    });
  }

  function deleteItem(itemId: string) {
    commit({
      ...currentSession,
      items: currentSession.items.filter(
        (item) => item.id !== itemId,
      ),
    });
  }

  function releaseItem(itemId: string) {
    commit({
      ...currentSession,
      items: currentSession.items.map((item) =>
        item.id === itemId
          ? { ...item, released: true }
          : item,
      ),
    });

    showToast("Released.");
  }

  function apiItems(): AiItem[] {
    return getActiveItems(currentSession).map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      kind: item.kind,
      reason: item.reason,
      metadata: item.metadata,
      estimateMinutes: item.estimateMinutes,
    }));
  }

  async function simplify() {
    if (busy) return;

    setBusy("simplify");

    try {
      const result = await simplifyThoughts(
        currentSession.rawText,
        apiItems(),
      );

      if (result.safety.requiresSupport) {
        showToast(
          "This needs human support rather than task sorting.",
        );
        return;
      }

      const oldCleared = currentSession.items.filter(
        (item) => item.completed || item.released,
      );

      commit({
        ...currentSession,
        summary: result.summary,
        nextAction: result.nextAction,
        items: [
          ...oldCleared,
          ...result.items.map((item) => ({
            ...item,
            completed: false,
            released: false,
          })),
        ],
      });

      showToast("Made it simpler.");
    } catch {
      showToast("Couldn't simplify right now.");
    } finally {
      setBusy("");
    }
  }

  async function createPlan() {
    if (busy) return;

    setBusy("plan");

    try {
      const result = await buildPlan(
        currentSession.rawText,
        apiItems(),
      );

      const updated = {
        ...currentSession,
        plan: result.steps,
        updatedAt: new Date().toISOString(),
      };

      saveSession(updated);
      setSession(updated);
      navigate(`/plan/${currentSession.id}`);
    } catch {
      showToast("Couldn't build the plan.");
    } finally {
      setBusy("");
    }
  }

  async function chooseImportant() {
    if (busy) return;

    setBusy("important");

    try {
      const result = await findMostImportant(
        currentSession.rawText,
        apiItems(),
      );

      commit({
        ...currentSession,
        nextAction: result,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      showToast("Your next move was updated.");
    } catch {
      showToast("Couldn't reassess that right now.");
    } finally {
      setBusy("");
    }
  }

  function taskSection(
    title: string,
    description: string,
    items: typeof currentSession.items,
  ) {
    if (items.length === 0) {
      return null;
    }

    return (
      <section className="mt-9">
        <div className="mb-3 border-b border-line pb-3">
          <h2 className="text-sm font-medium text-ink">
            {title}
          </h2>

          {description && (
            <p className="mt-0.5 text-xs text-muted">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                exit={{
                  opacity: 0,
                  height: 0,
                  marginBottom: 0,
                }}
              >
                <TaskRow
                  item={item}
                  onComplete={completeItem}
                  onMove={moveItem}
                  onEdit={editItem}
                  onDelete={deleteItem}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AppHeader showNewDump />

      <main className="mx-auto w-full max-w-[900px] px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
        <header>
          <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-black sm:text-[34px]">
            Here&apos;s what your brain was trying to
            tell you.
          </h1>

          <p className="mt-2 text-[15px] text-zinc-600">
            {session.summary}
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-line-dark/70 bg-panel p-5 sm:p-6">
          <span className="inline-flex rounded bg-indigo-50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-indigo-600">
            Recommended next
          </span>

          {nextItem ? (
            <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <button
                  onClick={() =>
                    completeItem(nextItem.id)
                  }
                  className="mt-1 h-[18px] w-[18px] shrink-0 rounded-full border border-zinc-400"
                  aria-label="Complete recommended task"
                />

                <div>
                  <p className="text-[17px] font-medium text-ink">
                    {nextItem.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted">
                    {session.nextAction.itemId ===
                    nextItem.id
                      ? session.nextAction.reason
                      : nextItem.reason}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(
                    `/focus/${session.id}/${nextItem.id}`,
                  )
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                <Focus size={15} />
                Focus
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-lg font-medium">
                You&apos;re clear.
              </p>
              <p className="mt-1 text-sm text-muted">
                There isn&apos;t another actionable task
                competing for your attention.
              </p>
            </div>
          )}
        </section>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs text-zinc-600">
            <span>
              {progress.cleared} of {progress.total} cleared
            </span>
            <span className="font-mono">
              {percent}%
            </span>
          </div>

          <div className="h-[3px] overflow-hidden rounded-full bg-line">
            <motion.div
              animate={{ width: `${percent}%` }}
              className="h-full bg-black"
            />
          </div>
        </div>

        {taskSection(
          "Do now",
          "Things worth getting out of the way.",
          nowItems,
        )}

        {taskSection(
          "Do soon",
          "",
          soonItems,
        )}

        {taskSection(
          "Can wait",
          "",
          laterItems,
        )}

        {ideas.length > 0 && (
          <section className="mt-9">
            <div className="mb-3 flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb size={15} />
                <h2 className="text-sm font-medium">
                  Ideas
                </h2>
              </div>

              <span className="font-mono text-[10px] text-muted">
                Incubating
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {ideas.map((item) => (
                <IdeaCard
                  key={item.id}
                  item={item}
                  onMove={moveItem}
                  onEdit={editItem}
                  onDelete={deleteItem}
                />
              ))}
            </div>
          </section>
        )}

        {letGo.length > 0 && (
          <section className="mt-9">
            <div className="mb-3 border-b border-line pb-3">
              <h2 className="text-sm font-medium">
                Let it go
              </h2>
            </div>

            <div className="space-y-2">
              {letGo.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-dashed border-line-dark bg-soft p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm text-zinc-600 line-through decoration-zinc-400">
                      {item.title}
                    </p>

                    <p className="mt-2 text-xs text-muted">
                      {item.reason ||
                        "You don't need to solve this today."}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      releaseItem(item.id)
                    }
                    className="shrink-0 rounded-lg border border-line-dark bg-panel px-3 py-2 text-xs text-zinc-600 hover:text-black"
                  >
                    Release thought
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {completed.length > 0 && (
          <section className="mt-9">
            <button
              onClick={() =>
                setShowCompleted((value) => !value)
              }
              className="flex w-full items-center justify-between border-b border-line pb-3 text-sm"
            >
              <span>
                Completed · {completed.length}
              </span>

              <ChevronDown
                size={16}
                className={
                  showCompleted
                    ? "rotate-180 transition"
                    : "transition"
                }
              />
            </button>

            {showCompleted && (
              <div className="mt-3 space-y-2">
                {completed.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-line bg-panel px-4 py-3 text-sm text-faint"
                  >
                    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black text-white">
                      <Check size={11} />
                    </span>

                    <span className="line-through">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="mt-16 flex flex-col gap-4 rounded-xl border border-line bg-panel p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm">
            <SlidersHorizontal
              size={16}
              className="text-accent"
            />
            <span>Still feels messy?</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => void simplify()}
              disabled={Boolean(busy)}
              className="rounded-full border border-line-dark bg-white px-4 py-2 text-xs font-medium hover:bg-soft disabled:opacity-50"
            >
              {busy === "simplify"
                ? "Simplifying..."
                : "Simplify this"}
            </button>

            <button
              onClick={() => void createPlan()}
              disabled={Boolean(busy)}
              className="rounded-full border border-line-dark bg-white px-4 py-2 text-xs font-medium hover:bg-soft disabled:opacity-50"
            >
              {busy === "plan"
                ? "Planning..."
                : "Make me a plan"}
            </button>

            <button
              onClick={() =>
                void chooseImportant()
              }
              disabled={Boolean(busy)}
              className="rounded-full border border-line-dark bg-white px-4 py-2 text-xs font-medium hover:bg-soft disabled:opacity-50"
            >
              {busy === "important"
                ? "Thinking..."
                : "What's most important?"}
            </button>
          </div>
        </section>

        <footer className="mt-16 text-center text-xs text-zinc-400">
          Untangle · Designed for mental decompression
          and radical clarity
        </footer>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-line-dark bg-white px-4 py-2 text-sm shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}