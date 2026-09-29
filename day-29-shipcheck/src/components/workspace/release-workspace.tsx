"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, GitCommit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReleaseHeader } from "./release-header";
import { ReleaseNav } from "./release-nav";
import { CommandPalette } from "./command-palette";
import { OverviewView } from "@/components/views/overview-view";
import { ChangesView } from "@/components/views/changes-view";
import { GatesView } from "@/components/views/gates-view";
import { RolloutView } from "@/components/views/rollout-view";
import { VerifyView } from "@/components/views/verify-view";
import { PacketView } from "@/components/views/packet-view";
import { useReleaseStore } from "@/stores/release-store";

export function ReleaseWorkspace() {
  const store = useReleaseStore();

  const session = store.sessions.find(
    (item) => item.id === store.activeId,
  );

  useEffect(() => {
    function keyboard(event: KeyboardEvent) {
      const target = event.target as HTMLElement;

      if (
        target.matches(
          "input, textarea, select, [contenteditable=true]",
        ) ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      ) {
        return;
      }

      const map = {
        g: "gates",
        c: "changes",
        r: "rollout",
        v: "verify",
        e: "packet",
      } as const;

      const view =
        map[event.key.toLowerCase() as keyof typeof map];

      if (view) {
        store.setView(view);
      }
    }

    window.addEventListener("keydown", keyboard);

    return () =>
      window.removeEventListener("keydown", keyboard);
  }, [store]);

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-semibold tracking-[-0.05em]">
            NO ACTIVE
            <br />
            RELEASE.
          </h1>

          <p className="mt-4 text-sm text-neutral-500">
            Start with a GitHub pull request, a pasted
            diff, or the built-in demo release.
          </p>

          <Link href="/">
            <Button className="mt-6">
              CHECK A RELEASE
              <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] dark:bg-[#111110]">
      <ReleaseHeader session={session} />

      {session.outdated && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-200 bg-blue-50 px-5 py-3 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
          <div className="flex items-center gap-3">
            <GitCommit size={16} />

            <div>
              <strong>RELEASE CHANGED.</strong>{" "}
              The pull request has new commits since this
              analysis.
            </div>
          </div>

          <Button
            size="sm"
            onClick={store.reanalyzeDemo}
          >
            ANALYZE LATEST →
          </Button>
        </div>
      )}

      <div className="flex min-h-[calc(100vh-56px)]">
        <ReleaseNav
          view={store.view}
          onChange={store.setView}
        />

        <section className="min-w-0 flex-1 bg-white pb-20 dark:bg-neutral-950 md:pb-0">
          {store.view === "overview" && (
            <OverviewView session={session} />
          )}

          {store.view === "changes" && (
            <ChangesView session={session} />
          )}

          {store.view === "gates" && (
            <GatesView session={session} />
          )}

          {store.view === "rollout" && (
            <RolloutView session={session} />
          )}

          {store.view === "verify" && (
            <VerifyView session={session} />
          )}

          {store.view === "packet" && (
            <PacketView session={session} />
          )}
        </section>
      </div>

      <CommandPalette onNavigate={store.setView} />
    </main>
  );
}