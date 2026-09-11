import {
  ArrowLeft,
  Clock3,
  Play,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { getSession } from "../lib/storage";

function formatMinutes(minutes: number) {
  if (minutes < 60) {
    return `~${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (!rest) {
    return `~${hours} hr`;
  }

  return `~${hours} hr ${rest} min`;
}

function icsDate(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

export function PlanPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const session = sessionId
    ? getSession(sessionId)
    : null;

  if (!session || !session.plan?.length) {
    return (
      <div className="min-h-screen bg-canvas">
        <AppHeader showNewDump />

        <main className="mx-auto max-w-[900px] px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold">
            No plan has been generated yet.
          </h1>

          <button
            onClick={() =>
              sessionId
                ? navigate(`/session/${sessionId}`)
                : navigate("/")
            }
            className="mt-6 rounded-lg bg-black px-5 py-3 text-sm text-white"
          >
            Back to categories
          </button>
        </main>
      </div>
    );
  }

  const plan = session.plan;
  const currentSessionId = session.id;

  const total = plan.reduce(
    (sum, step) =>
      sum + Math.max(step.estimateMinutes, 1),
    0,
  );

  function startFocus(itemId: string) {
    navigate(
      `/focus/${currentSessionId}/${itemId}`,
    );
  }

  function exportCalendar() {
    let cursor = new Date();

    const events = plan
      .map((step) => {
        const start = new Date(cursor);
        const end = new Date(
          start.getTime() +
            Math.max(step.estimateMinutes, 5) *
              60_000,
        );

        cursor = end;

        return [
          "BEGIN:VEVENT",
          `UID:${crypto.randomUUID()}@untangle`,
          `DTSTAMP:${icsDate(new Date())}`,
          `DTSTART:${icsDate(start)}`,
          `DTEND:${icsDate(end)}`,
          `SUMMARY:${step.title.replace(/\n/g, " ")}`,
          `DESCRIPTION:${step.reason.replace(/\n/g, " ")}`,
          "END:VEVENT",
        ].join("\r\n");
      })
      .join("\r\n");

    const body = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Untangle//Action Plan//EN",
      events,
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([body], {
      type: "text/calendar;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "untangle-plan.ics";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AppHeader showNewDump />

      <main className="mx-auto w-full max-w-[900px] px-4 pb-20 pt-8 sm:px-6">
        <button
          onClick={() =>
            navigate(`/session/${currentSessionId}`)
          }
          className="flex items-center gap-2 text-sm text-muted hover:text-black"
        >
          <ArrowLeft size={15} />
          Back to categories
        </button>

        <section className="mb-12 mt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between">
            <h1 className="text-[34px] font-semibold tracking-[-0.04em]">
              Here&apos;s your way through it.
            </h1>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-soft px-3 py-1.5 text-xs text-muted">
              <Clock3
                size={14}
                className="text-accent"
              />
              Total estimated time:{" "}
              {formatMinutes(total)}
            </span>
          </div>

          <p className="mt-3 max-w-2xl text-[17px] leading-7 text-muted">
            A chronological sequence to build quiet
            momentum. Focus on one step at a time.
          </p>
        </section>

        <section>
          {plan.map((step, index) => {
            const last =
              index === plan.length - 1;

            return (
              <div
                key={`${step.itemId}-${index}`}
                className="flex items-stretch"
              >
                <div className="mr-5 flex w-8 flex-col items-center">
                  <div
                    className={
                      index === 0
                        ? "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-medium text-white ring-4 ring-canvas"
                        : "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-dark bg-panel text-sm font-medium ring-4 ring-canvas"
                    }
                  >
                    {index + 1}
                  </div>

                  {!last && (
                    <div className="my-1 w-px flex-1 bg-line-dark" />
                  )}
                </div>

                <div
                  className={
                    last
                      ? "flex-1"
                      : "flex-1 pb-10"
                  }
                >
                  <div className="relative rounded-xl border border-line-dark/70 bg-panel p-5">
                    {index === 0 && (
                      <span className="absolute bottom-3 left-0 top-3 w-[2px] rounded-r bg-black" />
                    )}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-medium">
                            {step.title}
                          </h2>

                          <span className="rounded bg-soft px-2 py-1 font-mono text-[10px] text-muted">
                            {formatMinutes(
                              step.estimateMinutes,
                            )}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-muted">
                          {step.reason}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          startFocus(step.itemId)
                        }
                        className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-line-dark bg-soft px-4 py-2 text-sm hover:bg-soft-2"
                      >
                        <Play size={14} />
                        Start focus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <footer className="mt-14 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() =>
                startFocus(plan[0].itemId)
              }
              className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white"
            >
              Start from step 1
            </button>

            <button
              onClick={exportCalendar}
              className="px-4 py-3 text-sm text-muted hover:text-black"
            >
              Export plan to calendar
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Ready for deep flow
          </div>
        </footer>
      </main>
    </div>
  );
}
