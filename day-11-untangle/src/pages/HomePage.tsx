import {
  AlertCircle,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { ProcessingState } from "../components/ProcessingState";
import { ThoughtComposer } from "../components/ThoughtComposer";
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

          <ThoughtComposer
            text={text}
            textareaRef={textareaRef}
            canSubmit={canSubmit}
            onTextChange={setText}
            onSubmit={() => void submit()}
            onTryExample={() => {
              setText(example);
              setStatus("idle");
              requestAnimationFrame(() =>
                textareaRef.current?.focus(),
              );
            }}
          />
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
