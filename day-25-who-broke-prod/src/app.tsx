import { Landing } from "@/components/landing/landing";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Library } from "@/components/landing/library";
import { History } from "@/components/landing/history";
import { About } from "@/components/landing/about";
import { AlertScreen } from "@/components/incident/alert-screen";
import { IncidentShell } from "@/components/incident/incident-shell";
import { RecoveryScreen } from "@/components/result/recovery-screen";
import { RootCauseScreen } from "@/components/result/root-cause-screen";
import { PostmortemScreen } from "@/components/result/postmortem-screen";
import { ScoreScreen } from "@/components/result/score-screen";
import { ShiftComplete } from "@/components/result/shift-complete";
import { useGameStore } from "@/store/use-game-store";

export default function App() {
  const view = useGameStore(
    (state) => state.view,
  );

  const run = useGameStore(
    (state) => state.run,
  );

  if (view === "how") {
    return <HowItWorks />;
  }

  if (view === "library") {
    return <Library />;
  }

  if (view === "history") {
    return <History />;
  }

  if (view === "about") {
    return <About />;
  }

  if (view === "shift-complete") {
    return <ShiftComplete />;
  }

  if (view !== "incident" || !run) {
    return <Landing />;
  }

  switch (run.status) {
    case "alert":
      return <AlertScreen />;

    case "investigating":
    case "mitigating":
    case "verifying":
      return <IncidentShell />;

    case "recovered":
      return <RecoveryScreen />;

    case "root-cause":
      return <RootCauseScreen />;

    case "postmortem":
      return <PostmortemScreen />;

    case "score":
      return <ScoreScreen />;

    default:
      return <IncidentShell />;
  }
}
