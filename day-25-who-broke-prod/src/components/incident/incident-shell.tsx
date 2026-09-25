import { useEffect } from "react";
import { IncidentHud } from "./hud";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { TimelineRail } from "./timeline-rail";
import { PanelRouter } from "./panel-router";
import { MitigationBanner } from "./mitigation-banner";
import { CommandPalette } from "./command-palette";
import { Hints } from "./hints";
import { useGameStore } from "@/store/use-game-store";

export function IncidentShell() {
  const run = useGameStore(
    (state) => state.run,
  );

  const tickMitigation = useGameStore(
    (state) => state.tickMitigation,
  );

  useEffect(() => {
    if (
      run?.status !== "mitigating" ||
      run.paused
    ) {
      return;
    }

    const timer = window.setInterval(
      tickMitigation,
      650,
    );

    return () =>
      window.clearInterval(timer);
  }, [
    run?.status,
    run?.paused,
    tickMitigation,
  ]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#090b0d] text-zinc-100">
      <Sidebar />

      <div className="min-w-0 flex-1 overflow-y-auto">
        <IncidentHud />
        <MitigationBanner />

        <main className="mx-auto max-w-[1400px] p-4 pb-24 md:p-6 lg:pb-8">
          <PanelRouter />
        </main>
      </div>

      <TimelineRail />
      <MobileNav />
      <Hints />
      <CommandPalette />
    </div>
  );
}
