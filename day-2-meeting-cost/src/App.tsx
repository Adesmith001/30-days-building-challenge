import {
  AnimatePresence,
  motion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import { AboutPanel } from "./components/about/AboutPanel";
import { HistoryScreen } from "./components/history/HistoryScreen";
import { Header } from "./components/layout/Header";
import { LiveScreen } from "./components/live/LiveScreen";
import { SetupScreen } from "./components/setup/SetupScreen";
import { SummaryScreen } from "./components/summary/SummaryScreen";

import { MILESTONES } from "./constants/milestones";
import { useFullscreen } from "./hooks/useFullscreen";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useMeeting } from "./hooks/useMeeting";

export default function App() {
  const meeting = useMeeting();
  const fullscreen = useFullscreen();

  const [aboutOpen, setAboutOpen] = useState(false);
  const [milestone, setMilestone] =
    useState<string | null>(null);

  const crossed = useRef(new Set<number>());

  useEffect(() => {
    if (meeting.screen !== "live") return;

    const next = MILESTONES.filter(
      (item) =>
        meeting.totalCost >= item.value &&
        !crossed.current.has(item.value),
    );

    if (!next.length) return;

    next.forEach((item) =>
      crossed.current.add(item.value),
    );

    const latest = next.at(-1);

    setMilestone(latest?.message ?? null);

    const timeout = window.setTimeout(
      () => setMilestone(null),
      2800,
    );

    return () => window.clearTimeout(timeout);
  }, [meeting.screen, meeting.totalCost]);

  useKeyboardShortcuts({
    screen: meeting.screen,
    paused: meeting.paused,
    onPause: meeting.pause,
    onResume: meeting.resume,
    onEnd: meeting.end,
    onFocus: fullscreen.toggle,
    onHistory: () => meeting.setScreen("history"),
  });

  const showHeader =
    meeting.screen !== "live" || !fullscreen.fullscreen;

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-sans text-[#111]">
      {showHeader && meeting.screen !== "live" && (
        <Header
          onAbout={() => setAboutOpen(true)}
          onHistory={() =>
            meeting.setScreen("history")
          }
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={meeting.screen}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {meeting.screen === "setup" && (
            <SetupScreen
              name={meeting.name}
              attendees={meeting.setupAttendees}
              settings={meeting.settings}
              currency={meeting.currency}
              onNameChange={meeting.setName}
              onAttendeeChange={meeting.updateSetup}
              onAdd={meeting.addSetup}
              onRemove={meeting.removeSetup}
              onSettingsChange={(patch) =>
                meeting.setSettings((current) => ({
                  ...current,
                  ...patch,
                }))
              }
              onCurrencyChange={meeting.setCurrency}
              onStart={() => {
                crossed.current.clear();
                meeting.start();
              }}
            />
          )}

          {meeting.screen === "live" && (
            <LiveScreen
              attendees={meeting.attendees}
              elapsedMs={meeting.elapsedMs}
              totalCost={meeting.totalCost}
              settings={meeting.settings}
              currency={meeting.currency}
              paused={meeting.paused}
              fullscreen={fullscreen.fullscreen}
              milestone={milestone}
              onPause={meeting.pause}
              onResume={meeting.resume}
              onAdd={meeting.addLate}
              onLeave={meeting.leave}
              onFocus={fullscreen.toggle}
              onEnd={meeting.end}
            />
          )}

          {meeting.screen === "summary" &&
            meeting.lastMeeting && (
              <SummaryScreen
                meeting={meeting.lastMeeting}
                history={meeting.history}
                onEfficiencyChange={
                  meeting.updateEfficiency
                }
                onNewMeeting={meeting.newMeeting}
              />
            )}

          {meeting.screen === "history" && (
            <HistoryScreen
              history={meeting.history}
              currency={meeting.currency}
              onBack={() =>
                meeting.setScreen("setup")
              }
              onClear={meeting.clearHistory}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <AboutPanel
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </div>
  );
}