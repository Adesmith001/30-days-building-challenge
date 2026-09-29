"use client";

import { useState } from "react";
import {
  Check,
  LoaderCircle,
  X,
} from "lucide-react";
import type {
  ReleaseSession,
  SmokeCheck,
} from "@/types/release";
import { Button } from "@/components/ui/button";
import { useReleaseStore } from "@/stores/release-store";

export function PreviewPanel({
  session,
}: {
  session: ReleaseSession;
}) {
  const save = useReleaseStore(
    (store) => store.saveSmokeChecks,
  );

  const [url, setUrl] = useState(
    session.previewUrl || "https://example.com",
  );

  const [checks, setChecks] = useState(
    session.smokeChecks,
  );

  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setError("");
    setRunning(true);

    setChecks((current) =>
      current.map((check) => ({
        ...check,
        status: "pending",
      })),
    );

    try {
      const response = await fetch("/api/smoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          baseUrl: url,
          checks: checks.map((check) => ({
            id: check.id,
            path: check.path,
            expectedStatus: check.expectedStatus,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      const result = data.checks as SmokeCheck[];

      setChecks(result);
      save(url, result);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Smoke checks failed.",
      );
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <p className="text-sm leading-6 text-neutral-500">
        Restricted server-side GET checks only. Local,
        private and unsafe network addresses are rejected.
      </p>

      <label className="mt-6 block">
        <span className="font-mono text-[9px] tracking-[0.12em] text-neutral-400">
          PREVIEW URL
        </span>

        <input
          value={url}
          onChange={(event) =>
            setUrl(event.target.value)
          }
          className="mt-2 h-11 w-full border border-neutral-300 bg-transparent px-3 font-mono text-xs outline-none focus:border-blue-500 dark:border-neutral-700"
        />
      </label>

      <div className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
        {checks.map((check) => (
          <div
            key={check.id}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-5 py-4"
          >
            <div>
              <p className="font-mono text-xs">
                {check.path}
              </p>

              <p className="mt-1 text-[10px] text-neutral-400">
                EXPECTED {check.expectedStatus}
              </p>
            </div>

            {check.durationMs ? (
              <span className="font-mono text-[10px] text-neutral-400">
                {check.durationMs}ms
              </span>
            ) : (
              <span />
            )}

            <CheckResult check={check} />
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300">
          {error}
        </div>
      )}

      <Button
        className="mt-5"
        disabled={!url || running}
        onClick={() => void run()}
      >
        {running && (
          <LoaderCircle
            size={14}
            className="animate-spin"
          />
        )}

        {running
          ? "RUNNING CHECKS"
          : "RUN SMOKE CHECKS"}
      </Button>
    </div>
  );
}

function CheckResult({
  check,
}: {
  check: SmokeCheck;
}) {
  if (check.status === "pass") {
    return (
      <span className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
        <Check size={13} />
        {check.actualStatus}
      </span>
    );
  }

  if (check.status === "fail") {
    return (
      <span className="flex items-center gap-2 text-xs font-semibold text-red-600">
        <X size={13} />
        {check.actualStatus}
      </span>
    );
  }

  return (
    <span className="font-mono text-[10px] text-neutral-400">
      WAITING
    </span>
  );
}