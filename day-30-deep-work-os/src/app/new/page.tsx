/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { motion } from "motion/react";

import {
  SessionForm,
  type SessionFormValue,
} from "@/components/session/session-form";

import { Preparation } from "@/components/session/preparation";
import { SessionContract } from "@/components/session/session-contract";

import {
  createSession,
  markPreparing,
  startSession,
} from "@/lib/session/operations";

import { useSettingsStore } from "@/stores/settings-store";

type Step =
  | "form"
  | "contract"
  | "prepare"
  | "transition";

export default function NewSessionPage() {
  const router = useRouter();

  const defaultDuration =
    useSettingsStore(
      (state) => state.defaultDuration,
    );

  const [step, setStep] =
    useState<Step>("form");

  const [sessionId, setSessionId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<SessionFormValue>({
      outcome: "",
      definitionOfDone: "",
      firstAction: "",
      notDoing: "",
      duration: defaultDuration,
      mode: "timed",
      resources: [],
    });

  async function confirmContract() {
    const session = await createSession({
      outcome: form.outcome,
      definitionOfDone:
        form.definitionOfDone,
      firstAction: form.firstAction,
      notDoing: form.notDoing,
      resources: form.resources,
      mode: form.mode,
      plannedDurationSeconds:
        form.mode === "timed"
          ? form.duration * 60
          : null,
    });

    setSessionId(session.id);

    await markPreparing(session.id);

    setStep("prepare");
  }

  async function begin() {
    if (!sessionId) return;

    setStep("transition");

    window.setTimeout(async () => {
      await startSession(sessionId);

      router.replace(
        `/focus/${sessionId}`,
      );
    }, 950);
  }

  useEffect(() => {
    const draft = localStorage.getItem(
      "deep-work-session-draft",
    );

    if (!draft) return;

    try {
      setForm(JSON.parse(draft));
    } catch {
      // Ignore bad draft.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "deep-work-session-draft",
      JSON.stringify(form),
    );
  }, [form]);

  if (step === "transition") {
    return (
      <main className="grid min-h-dvh place-items-center bg-[var(--foreground)] text-[var(--background)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">
            Outcome locked.
          </p>

          <p className="editorial text-7xl md:text-9xl">
            Begin.
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh px-5 py-10 md:px-10 md:py-14">
      <div className="mb-14 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
        <span>30 / 30</span>
        <span>Deep Work OS</span>
        <span>{step}</span>
      </div>

      {step === "form" && (
        <SessionForm
          value={form}
          onChange={setForm}
          onContinue={() =>
            setStep("contract")
          }
        />
      )}

      {step === "contract" && (
        <SessionContract
          value={form}
          onBack={() => setStep("form")}
          onConfirm={confirmContract}
        />
      )}

      {step === "prepare" && (
        <Preparation onReady={begin} />
      )}
    </main>
  );
}