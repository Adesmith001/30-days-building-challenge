import { useMemo, useState } from "react";

import {
  createDefaultAttendees,
  createEmptyAttendee,
  DEFAULT_WORK_SETTINGS,
} from "../constants/defaults";

import {
  meetingCost,
} from "../lib/calculations";

import { createId } from "../lib/ids";

import {
  clearStoredHistory,
  loadHistory,
  saveHistory,
} from "../lib/storage";

import type {
  AppScreen,
  Attendee,
  AttendeeDraft,
  Currency,
  EfficiencyAnswers,
  MeetingRecord,
  WorkSettings,
} from "../types/meeting";

import { useTicker } from "./useTicker";

export function useMeeting() {
  const [screen, setScreen] = useState<AppScreen>("setup");
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [settings, setSettings] =
    useState<WorkSettings>(DEFAULT_WORK_SETTINGS);
  const [setupAttendees, setSetupAttendees] =
    useState(createDefaultAttendees);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [meetingId, setMeetingId] = useState("");
  const [startedISO, setStartedISO] = useState("");
  const [runningSince, setRunningSince] =
    useState<number | null>(null);
  const [accumulatedMs, setAccumulatedMs] = useState(0);
  const [lastMeeting, setLastMeeting] =
    useState<MeetingRecord | null>(null);
  const [history, setHistory] =
    useState<MeetingRecord[]>(loadHistory);

  const running = screen === "live" && runningSince !== null;
  const now = useTicker(running);

  const elapsedMs = useMemo(() => {
    if (runningSince === null) return accumulatedMs;

    return accumulatedMs + Math.max(0, now - runningSince);
  }, [accumulatedMs, now, runningSince]);

  const totalCost = useMemo(
    () => meetingCost(attendees, elapsedMs, settings),
    [attendees, elapsedMs, settings],
  );

  function elapsedNow() {
    if (runningSince === null) return accumulatedMs;

    return accumulatedMs + Date.now() - runningSince;
  }

  function updateSetup(id: string, patch: Partial<Attendee>) {
    setSetupAttendees((current) =>
      current.map((person) =>
        person.id === id ? { ...person, ...patch } : person,
      ),
    );
  }

  function start() {
    const valid = setupAttendees.filter(
      (person) => person.role.trim() && person.salary > 0,
    );

    if (!valid.length) return;

    setMeetingId(createId());
    setStartedISO(new Date().toISOString());
    setAccumulatedMs(0);
    setRunningSince(Date.now());

    setAttendees(
      valid.map((person) => ({
        ...person,
        joinedAtMs: 0,
        leftAtMs: null,
        active: true,
      })),
    );

    setScreen("live");
  }

  function pause() {
    if (runningSince === null) return;

    setAccumulatedMs(elapsedNow());
    setRunningSince(null);
  }

  function resume() {
    if (runningSince !== null) return;

    setRunningSince(Date.now());
  }

  function addLate(draft: AttendeeDraft) {
    setAttendees((current) => [
      ...current,
      {
        ...draft,
        id: createId(),
        joinedAtMs: elapsedNow(),
        leftAtMs: null,
        active: true,
      },
    ]);
  }

  function leave(id: string) {
    const leftAtMs = elapsedNow();

    setAttendees((current) =>
      current.map((person) =>
        person.id === id
          ? { ...person, active: false, leftAtMs }
          : person,
      ),
    );
  }

  function end() {
    const durationMs = elapsedNow();
    const finalCost = meetingCost(attendees, durationMs, settings);

    const record: MeetingRecord = {
      id: meetingId || createId(),
      name: name.trim() || "Untitled Meeting",
      startedAtISO: startedISO,
      endedAtISO: new Date().toISOString(),
      durationMs,
      attendees,
      totalCost: finalCost,
      currency,
      workSettings: settings,
    };

    setAccumulatedMs(durationMs);
    setRunningSince(null);
    setLastMeeting(record);

    setHistory((current) => {
      const next = [record, ...current];
      saveHistory(next);
      return next;
    });

    setScreen("summary");
  }

  function updateEfficiency(answers: EfficiencyAnswers) {
    if (!lastMeeting) return;

    const updated = { ...lastMeeting, efficiency: answers };
    setLastMeeting(updated);

    setHistory((current) => {
      const next = current.map((meeting) =>
        meeting.id === updated.id ? updated : meeting,
      );

      saveHistory(next);
      return next;
    });
  }

  function newMeeting() {
    setRunningSince(null);
    setAccumulatedMs(0);
    setAttendees([]);
    setLastMeeting(null);
    setScreen("setup");
  }

  function clearHistory() {
    clearStoredHistory();
    setHistory([]);
  }

  return {
    screen, setScreen, name, setName,
    currency, setCurrency, settings, setSettings,
    setupAttendees, updateSetup,
    addSetup: () =>
      setSetupAttendees((items) => [...items, createEmptyAttendee()]),
    removeSetup: (id: string) =>
      setSetupAttendees((items) => items.filter((item) => item.id !== id)),
    attendees, elapsedMs, totalCost,
    paused: runningSince === null,
    history, lastMeeting,
    start, pause, resume, addLate, leave, end,
    updateEfficiency, newMeeting, clearHistory,
  };
}