"use client";

import {
  Check,
  Clock3,
  GitCommit,
} from "lucide-react";
import type { ReleaseSession } from "@/types/release";
import { Button } from "@/components/ui/button";
import { useReleaseStore } from "@/stores/release-store";
import { deriveReleaseState } from "@/lib/analysis/readiness";

export function VerifyView({
  session,
}: {
  session: ReleaseSession;
}) {
  const start = useReleaseStore(
    (store) => store.startVerification,
  );

  const verify = useReleaseStore(
    (store) => store.verifyItem,
  );

  const state = deriveReleaseState(session.gates);

  const completed = session.verification.filter(
    (item) => item.status === "pass",
  ).length;

  const verified =
    completed === session.verification.length;

  if (!session.verificationStartedAt) {
    return (
      <div className="mx-auto max-w-4xl p-5 md:p-8 lg:p-10">
        <p className="font-mono text-[10px] tracking-[0.12em] text-neutral-400">
          AFTER DEPLOY
        </p>

        <h1 className="mt-3 text-5xl font-semibold tracking-[-0.065em]">
          VERIFY
          <br />
          THE RELEASE.
        </h1>

        <div className="mt-8 border border-neutral-200 p-5 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <GitCommit
              size={16}
              className="text-neutral-400"
            />

            <div>
              <p className="font-mono text-xs">
                {session.headSha ?? "LOCAL DIFF"}
              </p>

              <p className="mt-1 text-xs text-neutral-400">
                Expected deployed revision
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 space-y-3">
          {session.verification.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border-b border-neutral-200 py-3 text-sm dark:border-neutral-800"
            >
              <span className="size-3 rounded-full border border-neutral-300 dark:border-neutral-700" />
              {item.title}
            </div>
          ))}
        </div>

        <Button
          className="mt-7"
          disabled={
            ![
              "READY_TO_SHIP",
              "READY_WITH_WAIVERS",
            ].includes(state)
          }
          onClick={start}
        >
          START VERIFICATION →
        </Button>

        {![
          "READY_TO_SHIP",
          "READY_WITH_WAIVERS",
        ].includes(state) && (
          <p className="mt-3 text-xs text-neutral-400">
            Required release gates must first be satisfied
            or explicitly waived.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-5 md:p-8 lg:p-10">
      {verified ? (
        <>
          <p className="font-mono text-[10px] tracking-[0.12em] text-emerald-600">
            POST-DEPLOY COMPLETE
          </p>

          <h1 className="mt-3 text-6xl font-semibold tracking-[-0.07em] md:text-7xl">
            RELEASE
            <br />
            VERIFIED.
          </h1>

          <div className="mt-10 grid grid-cols-2 gap-px border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 md:grid-cols-4">
            <Metric label="DEPLOYED" value={session.headSha?.slice(0, 7) ?? "LOCAL"} />
            <Metric
              label="POST-DEPLOY"
              value={`${completed} / ${session.verification.length}`}
            />
            <Metric
              label="WAIVERS"
              value={
                session.gates.filter(
                  (gate) => gate.status === "waived",
                ).length
              }
            />
            <Metric label="ROLLOUT" value="VERIFIED" />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400">
            <Clock3 size={13} />
            POST-DEPLOY VERIFICATION
          </div>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">
            {completed} / {session.verification.length}
            <br />
            CHECKS COMPLETE.
          </h1>

          <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
            {session.verification.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-5 items-center justify-center rounded-full border ${
                      item.status === "pass"
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-neutral-300 dark:border-neutral-700"
                    }`}
                  >
                    {item.status === "pass" && (
                      <Check size={12} />
                    )}
                  </span>

                  <span className="text-sm font-semibold">
                    {item.title}
                  </span>
                </div>

                {item.status === "pending" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      verify(
                        item.id,
                        "Verified during post-deploy review.",
                      )
                    }
                  >
                    MARK VERIFIED
                  </Button>
                )}
              </div>
            ))}
          </div>

          <p className="mt-5 max-w-xl text-xs leading-5 text-neutral-400">
            Endpoint and human checks provide evidence.
            They do not prove that every aspect of the
            release is healthy.
          </p>
        </>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white p-4 dark:bg-neutral-950">
      <p className="font-mono text-[9px] text-neutral-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold">
        {value}
      </p>
    </div>
  );
}