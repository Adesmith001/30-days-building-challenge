"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ReleaseStateBadge } from "@/components/ui/status";
import { deriveReleaseState } from "@/lib/analysis/readiness";
import { useReleaseStore } from "@/stores/release-store";

export default function HistoryPage() {
  const sessions = useReleaseStore(
    (state) => state.sessions,
  );

  const setSession = useReleaseStore(
    (state) => state.setSession,
  );

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      <header className="flex h-16 items-center justify-between border-b border-neutral-200 px-5 dark:border-neutral-800 md:px-8">
        <Logo />

        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-neutral-500"
        >
          <ArrowLeft size={13} />
          NEW CHECK
        </Link>
      </header>

      <section className="mx-auto max-w-5xl p-5 md:p-10">
        <p className="font-mono text-[10px] tracking-[0.12em] text-neutral-400">
          LOCAL HISTORY
        </p>

        <h1 className="mt-2 text-5xl font-semibold tracking-[-0.065em]">
          RECENT
          <br />
          RELEASES.
        </h1>

        {!sessions.length ? (
          <div className="mt-10 border-y border-neutral-200 py-8 text-sm text-neutral-500 dark:border-neutral-800">
            No release sessions yet.
          </div>
        ) : (
          <div className="mt-10 divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href="/release"
                onClick={() => setSession(session)}
                className="grid gap-4 py-5 md:grid-cols-[1fr_auto_auto] md:items-center"
              >
                <div>
                  <p className="font-semibold">
                    {session.title}
                  </p>

                  <p className="mt-1 font-mono text-[10px] text-neutral-400">
                    {session.repository}
                    {session.source.prNumber
                      ? ` · PR #${session.source.prNumber}`
                      : ""}
                  </p>
                </div>

                <ReleaseStateBadge
                  state={deriveReleaseState(
                    session.gates,
                  )}
                />

                <ArrowRight
                  size={15}
                  className="text-neutral-400"
                />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}