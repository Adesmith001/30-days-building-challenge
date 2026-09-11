import {
  ArrowLeft,
  Check,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  getSession,
  saveSession,
} from "../lib/storage";
import { getNextItem } from "../lib/utils";
import type { Session } from "../types";

export function FocusPage() {
  const { sessionId, itemId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] =
    useState<Session | null>(() =>
      sessionId ? getSession(sessionId) : null,
    );

  const [done, setDone] = useState(false);

  const item = session?.items.find(
    (entry) => entry.id === itemId,
  );

  function goBack() {
    if (sessionId) {
      navigate(`/session/${sessionId}`);
    } else {
      navigate("/");
    }
  }

  function complete() {
    if (!session || !item) return;

    const updated: Session = {
      ...session,
      updatedAt: new Date().toISOString(),
      items: session.items.map((entry) =>
        entry.id === item.id
          ? { ...entry, completed: true }
          : entry,
      ),
    };

    saveSession(updated);
    setSession(updated);
    setDone(true);
  }

  function next() {
    if (!session) return;

    const nextItem = getNextItem(session);

    if (!nextItem) {
      navigate(`/session/${session.id}`);
      return;
    }

    setDone(false);

    navigate(
      `/focus/${session.id}/${nextItem.id}`,
      { replace: true },
    );
  }

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key === "Enter"
      ) {
        event.preventDefault();

        if (!done) {
          complete();
        } else {
          next();
        }
      }

      if (event.key === "Escape") {
        goBack();
      }
    }

    window.addEventListener("keydown", shortcut);

    return () =>
      window.removeEventListener(
        "keydown",
        shortcut,
      );
  });

  if (!session || !item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas p-6 text-center">
        <button
          onClick={goBack}
          className="text-sm underline"
        >
          Return to your board
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex min-h-screen flex-col bg-canvas">
        <header className="flex items-center justify-between p-6 sm:p-10">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm text-muted hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to list
          </button>

          <span className="text-xl font-medium text-zinc-300">
            Untangle
          </span>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 pb-24 text-center">
          <div className="max-w-[600px]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
              <Check size={22} />
            </div>

            <h1 className="mt-7 text-[36px] font-semibold tracking-[-0.035em]">
              Done.
            </h1>

            <p className="mt-3 text-lg text-muted">
              One less thing taking up space.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={next}
                className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
              >
                What&apos;s next? →
              </button>

              <button
                onClick={goBack}
                className="px-5 py-3 text-sm text-muted hover:text-black"
              >
                Back to board
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const remaining = session.items.filter(
    (entry) =>
      !entry.completed &&
      !entry.released &&
      entry.id !== item.id,
  ).length;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="flex items-center justify-between p-6 sm:p-10">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm text-muted hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to list
        </button>

        <span className="text-xl font-medium text-zinc-300">
          Untangle
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-20 text-center">
        <div className="max-w-[680px]">
          <div className="mb-5 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />

            <span className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
              One thing.
            </span>
          </div>

          <h1 className="text-[34px] font-semibold leading-tight tracking-[-0.04em] sm:text-[44px]">
            {item.title}
          </h1>

          <p className="mx-auto mt-5 max-w-[500px] text-[17px] leading-7 text-muted">
            Forget the other {remaining}{" "}
            {remaining === 1 ? "thing" : "things"} for now.
            Give this your undivided attention.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={complete}
              className="flex min-w-[140px] items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              <Check size={17} />
              Done
            </button>

            <button
              onClick={goBack}
              className="rounded-xl border border-line-dark bg-panel px-5 py-3 text-sm hover:bg-soft"
            >
              Take a break
            </button>
          </div>
        </div>
      </main>

      <footer className="pb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-soft px-3 py-1.5 font-mono text-[10px] text-muted">
          ⌘ Enter when done · Esc to exit
        </span>
      </footer>
    </div>
  );
}