"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowRight,
  RotateCcw,
} from "lucide-react";

import { db } from "@/lib/storage/db";
import { deriveTimerState } from "@/lib/time/derive";
import { formatClock } from "@/lib/time/format";
import { localDateKey } from "@/lib/utils";
import { useNow } from "@/hooks/use-now";

function greeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning.";
  if (hour < 18) return "Good afternoon.";
  return "Good evening.";
}

export default function HomePage() {
  const now = useNow(1000);

  const active = useLiveQuery(async () => {
    return db.sessions
      .filter((session) =>
        ["active", "paused", "break"].includes(
          session.status,
        ),
      )
      .first();
  });

  const plan = useLiveQuery(() =>
    db.dailyPlans
      .where("date")
      .equals(localDateKey())
      .first(),
  );

  const lastSession = useLiveQuery(() =>
    db.sessions
      .filter(
        (session) =>
          session.status === "completed",
      )
      .reverse()
      .sortBy("endedAt")
      .then((rows) => rows.at(0)),
  );

  if (active) {
    const timer = deriveTimerState(active, now);

    return (
      <main className="min-h-dvh p-5 md:p-10 lg:p-14">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
          Session in progress
        </p>

        <div className="mt-14 max-w-5xl">
          <h1 className="editorial text-balance text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
            {active.outcome}
          </h1>

          <div className="mt-12 border-y py-6">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
              Next
            </p>

            <p className="text-xl">
              {active.currentNextAction}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="mono text-4xl">
                {active.mode === "open"
                  ? formatClock(
                      timer.activeElapsedMs,
                    )
                  : timer.remainingMs !== null &&
                      timer.remainingMs >= 0
                    ? formatClock(
                        timer.remainingMs,
                      )
                    : `+${formatClock(
                        timer.overtimeMs,
                      )}`}
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                {active.status}
              </p>
            </div>

            <Link
              href={`/focus/${active.id}`}
              className="flex items-center gap-8 bg-[var(--foreground)] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--background)]"
            >
              Return to focus
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh p-5 md:p-10 lg:p-14">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
        {greeting()}
      </p>

      <section className="mt-12 max-w-5xl">
        <h1 className="editorial text-balance text-5xl leading-[0.92] md:text-7xl lg:text-8xl">
          What needs
          <br />
          your full attention?
        </h1>

        <Link
          href="/new"
          className="mt-10 inline-flex items-center gap-12 bg-[var(--foreground)] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--background)]"
        >
          Start session
          <ArrowRight size={16} />
        </Link>
      </section>

      <section className="mt-24 grid gap-14 xl:grid-cols-2">
        <div>
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em]">
              Today
            </h2>

            <Link
              href="/today"
              className="text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]"
            >
              Edit
            </Link>
          </div>

          <div>
            {plan?.items.length ? (
              plan.items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[44px_1fr] border-b py-5"
                >
                  <span className="mono text-xs text-[var(--muted)]">
                    0{index + 1}
                  </span>

                  <p>{item.outcome}</p>
                </div>
              ))
            ) : (
              <p className="border-b py-6 text-sm text-[var(--muted)]">
                Nothing planned yet. Keep it selective.
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="border-b pb-4 text-xs font-bold uppercase tracking-[0.18em]">
            Last session
          </h2>

          {lastSession ? (
            <Link
              href={`/sessions/${lastSession.id}`}
              className="group grid grid-cols-[1fr_auto] gap-8 border-b py-5"
            >
              <div>
                <p className="text-lg">
                  {lastSession.outcome}
                </p>

                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
                  {lastSession.resultStatus?.replace(
                    "_",
                    " ",
                  )}
                </p>
              </div>

              <RotateCcw
                size={16}
                className="transition-transform group-hover:-rotate-45"
              />
            </Link>
          ) : (
            <p className="border-b py-6 text-sm text-[var(--muted)]">
              Your first closed session will appear here.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}