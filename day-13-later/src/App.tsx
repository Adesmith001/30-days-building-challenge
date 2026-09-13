import {
  useState,
} from "react";

import { useCommitments } from "./hooks/use-commitments";

import { CompletedScreen } from "./screens/completed-screen";
import { DashboardScreen } from "./screens/dashboard-screen";
import { DetailsScreen } from "./screens/details-screen";
import { DueScreen } from "./screens/due-screen";
import { HomeScreen } from "./screens/home-screen";
import { NewCommitmentScreen } from "./screens/new-commitment-screen";
import { PostponeScreen } from "./screens/postpone-screen";

type Screen =
  | "home"
  | "new"
  | "dashboard"
  | "due"
  | "postpone"
  | "details"
  | "completed";

export default function App() {
  const {
    commitments,
    createCommitment,
    completeCommitment,
    postponeCommitment,
    updateCommitment,
    deleteCommitment,
    getCommitment,
  } = useCommitments();

  const [screen, setScreen] =
    useState<Screen>(() =>
      commitments.some(
        (item) =>
          item.status !== "completed",
      )
        ? "dashboard"
        : "home",
    );

  const [draftTask, setDraftTask] =
    useState("");

  const [
    selectedId,
    setSelectedId,
  ] = useState<string | null>(
    null,
  );

  const selected =
    selectedId
      ? getCommitment(selectedId)
      : undefined;

  function goHome() {
    setSelectedId(null);
    setDraftTask("");
    setScreen("home");
  }

  function startNew(
    task = "",
  ) {
    setDraftTask(task);

    if (task) {
      setScreen("new");
      return;
    }

    setScreen("home");
  }

  function handleCreated(
    title: string,
    scheduledFor: number,
  ) {
    const item =
      createCommitment(
        title,
        scheduledFor,
      );

    setSelectedId(item.id);
    setDraftTask("");
    setScreen("dashboard");
  }

  function handleOpen(
    id: string,
  ) {
    const item =
      getCommitment(id);

    if (!item) {
      return;
    }

    setSelectedId(id);

    if (item.status === "due") {
      setScreen("due");
      return;
    }

    setScreen("details");
  }

  function handleComplete() {
    if (!selected) {
      return;
    }

    completeCommitment(
      selected.id,
    );

    setScreen("completed");
  }

  function handlePostpone(
    scheduledFor: number,
  ) {
    if (!selected) {
      return;
    }

    postponeCommitment(
      selected.id,
      scheduledFor,
    );

    setScreen("dashboard");
  }

  function handleUpdate(title: string, scheduledFor: number) {
    if (!selected) return;
    updateCommitment(selected.id, title, scheduledFor);
  }

  function handleDelete() {
    if (!selected) return;
    deleteCommitment(selected.id);
    goHome();
  }

  if (screen === "home") {
    return (
      <HomeScreen
        hasCommitments={
          commitments.length > 0
        }
        onContinue={(task) =>
          startNew(task)
        }
        onViewCommitments={() =>
          setScreen("dashboard")
        }
      />
    );
  }

  if (screen === "new") {
    return (
      <NewCommitmentScreen
        task={draftTask}
        onBack={goHome}
        onCreate={handleCreated}
      />
    );
  }

  if (screen === "dashboard") {
    return (
      <DashboardScreen
        commitments={
          commitments
        }
        onHome={goHome}
        onAdd={goHome}
        onOpen={(item) =>
          handleOpen(item.id)
        }
      />
    );
  }

  if (!selected) {
    return (
      <DashboardScreen
        commitments={
          commitments
        }
        onHome={goHome}
        onAdd={goHome}
        onOpen={(item) =>
          handleOpen(item.id)
        }
      />
    );
  }

  if (screen === "due") {
    return (
      <DueScreen
        commitment={selected}
        onHome={goHome}
        onDone={
          handleComplete
        }
        onPostpone={() =>
          setScreen("postpone")
        }
        onDetails={() =>
          setScreen("details")
        }
      />
    );
  }

  if (screen === "postpone") {
    return (
      <PostponeScreen
        commitment={selected}
        onCancel={() =>
          setScreen(
            selected.status ===
              "due"
              ? "due"
              : "details",
          )
        }
        onPostpone={
          handlePostpone
        }
      />
    );
  }

  if (screen === "details") {
    return (
      <DetailsScreen
        commitment={selected}
        onHome={goHome}
        onBack={() =>
          setScreen("dashboard")
        }
        onPostpone={() =>
          setScreen("postpone")
        }
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <CompletedScreen
      commitment={selected}
      onHome={goHome}
      onNext={goHome}
    />
  );
}
