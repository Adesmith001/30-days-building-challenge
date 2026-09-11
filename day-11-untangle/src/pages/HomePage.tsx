import {
  AlertCircle,
  Command,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { ProcessingState } from "../components/ProcessingState";
import { untangleText } from "../lib/api";
import { saveSession } from "../lib/storage";
import { createId } from "../lib/utils";
import type { Session } from "../types";

const example =
  "I need to finish the report before Friday, Sarah is waiting for my reply, I still haven't booked the dentist, I want to learn Spanish at some point, need groceries, maybe redesign my portfolio, and I'm worried I haven't applied for enough jobs.";

type Status =
  | "idle"
  | "processing"
  | "error";

export function HomePage() {
  const navigate = useNavigate();
  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const [text, setText] = useState("");
  const [status, setStatus] =
    useState<Status>("idle");
  const [error, setError] = useState("");
  const [supportMessage, setSupportMessage] =
    useState("");

  const canSubmit = text.trim().length >= 3;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  async function submit() {
    if (!canSubmit || status === "processing") {
      return;
    }

    setError("");
    setSupportMessage("");
    setStatus("processing");

    try {
      const result = await untangleText(text.trim());

      if (result.safety.requiresSupport) {
        setSupportMessage(
          result.safety.message ||
            "This sounds more important than a task list. Consider reaching out to someone you trust or an appropriate local support service.",
        );
        setStatus("idle");
        return;
      }

      const now = new Date().toISOString();

      const session: Session = {
        id: createId(),
        createdAt: now,
        updatedAt: now,
        rawText: text.trim(),
        summary: result.summary,
        nextAction: result.nextAction,
        items: result.items.map((item) => ({
          ...item,
          completed: false,
          released: false,
        })),
      };

      saveSession(session);
      navigate(`/session/${session.id}`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Couldn't untangle that.",
      );
      setStatus("error");
    }
  }

  if (status === "processing") {
    return (
      <div className="flex min-h-screen flex-col bg-canvas">
        <AppHeader />
        <ProcessingState text={text} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <AppHeader />

      <main className="flex flex-1 items-center px-4 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-[760px]">
          <div className="mb-8">
            <h1 className="max-w-[690px] text-[32px] font-semibold leading-[1.15] tracking-[-0.035em] text-black sm:text-[36px]">
              What&apos;s taking up space in your head?
            </h1>

            <p className="mt-2 text-[15px] text-zinc-600">
              Dump everything here. Tasks, ideas,
              worries, reminders. We&apos;ll untangle it.
            </p>
          </div>

          {supportMessage && (
            <div className="mb-5 rounded-xl border border-line bg-panel p-5">
              <p className="font-medium text-ink">
                This needs more than organizing.
              </p>

              <p className="mt-2 text-sm leading-6 text-muted">
                {supportMessage}
              </p>

              <p className="mt-2 text-sm leading-6 text-muted">
                If you may be in immediate danger, contact
                local emergency services or someone who can
                be with you now.
              </p>
            </div>
          )}

          {status === "error" && (
            <div
              role="alert"
              className="fixed right-4 top-4 z-50 flex w-[min(380px,calc(100vw-2rem))] items-start gap-3 rounded-xl border border-line bg-panel p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
            >
              <AlertCircle
                size={18}
                className="mt-0.5 text-muted"
              />

              <div className="flex-1">
                <p className="font-medium text-ink">
                  Couldn&apos;t untangle that.
                </p>

                <p className="mt-1 text-sm text-muted">
                  {error} Your thoughts are still here —
                  nothing was lost.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="text-sm font-medium text-ink underline underline-offset-4"
              >
                Edit
              </button>
            </div>
          )}

          <div className="rounded-xl border border-line-dark/75 bg-panel p-5 shadow-[0_1px_2px_rgba(0,0,0,0.025)] transition focus-within:border-black sm:p-6">
            <textarea
              ref={textareaRef}
              value={text}
              maxLength={2000}
              rows={8}
              onChange={(event) =>
                setText(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  (event.metaKey || event.ctrlKey) &&
                  event.key === "Enter"
                ) {
                  event.preventDefault();
                  void submit();
                }
              }}
              placeholder="I need to finish my assignment, reply to Sarah, buy groceries, figure out what I'm doing this weekend, and I've been thinking about..."
              className="min-h-[230px] w-full resize-none border-0 bg-transparent text-[18px] leading-8 text-black outline-none placeholder:text-zinc-400"
            />

            <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs text-muted sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-line-dark" />
                <span>
                  Don&apos;t organize it. That&apos;s our job.
                </span>
              </div>

              <span className="font-mono text-xs">
                {text.length.toLocaleString()} / 2,000
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => void submit()}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-black px-5 py-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Untangle my thoughts →
            <span className="hidden items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-[11px] text-zinc-400 sm:flex">
              <Command size={11} />
              Enter
            </span>
          </button>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => {
                setText(example);
                setStatus("idle");
                requestAnimationFrame(() =>
                  textareaRef.current?.focus(),
                );
              }}
              className="text-sm text-zinc-600 transition hover:text-black"
            >
              Not sure what to write?{" "}
              <span className="underline underline-offset-4">
                Try an example
              </span>
            </button>
          </div>
        </div>
      </main>

      <footer className="mx-auto flex w-full max-w-[760px] flex-col gap-2 px-4 py-7 text-xs text-zinc-500 sm:flex-row sm:justify-between">
        <span>Cognitive canvas idle</span>
        <span>
          AI processing via Groq · Sessions saved locally
        </span>
      </footer>
    </div>
  );
}
