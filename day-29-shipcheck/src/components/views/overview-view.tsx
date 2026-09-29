"use client";

import {
  ArrowRight,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReleaseSession } from "@/types/release";
import {
  deriveReleaseState,
  satisfiedGateCount,
} from "@/lib/analysis/readiness";
import {
  GateStatusBadge,
  ReleaseStateBadge,
} from "@/components/ui/status";
import { Button } from "@/components/ui/button";
import { useReleaseStore } from "@/stores/release-store";

export function OverviewView({
  session,
}: {
  session: ReleaseSession;
}) {
  const state = deriveReleaseState(session.gates);
  const counts = satisfiedGateCount(session.gates);

  const setView = useReleaseStore(
    (store) => store.setView,
  );

  const refreshDemoCi = useReleaseStore(
    (store) => store.refreshDemoCi,
  );

  const simulatePrChange = useReleaseStore(
    (store) => store.simulatePrChange,
  );

  const areas = [
    ...new Set(
      session.changedFiles.flatMap((file) => file.areas),
    ),
  ];

  const attention = session.gates.filter((gate) =>
    ["fail", "blocked", "pending"].includes(gate.status),
  );

  const additions = session.changedFiles.reduce(
    (total, file) => total + file.additions,
    0,
  );

  const deletions = session.changedFiles.reduce(
    (total, file) => total + file.deletions,
    0,
  );

  return (
    <div className="mx-auto max-w-6xl p-5 md:p-8 lg:p-10">
      <div className="border-b border-neutral-200 pb-8 dark:border-neutral-800">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.12em] text-neutral-400">
              {session.source.prNumber
                ? `PR #${session.source.prNumber}`
                : "RELEASE"}
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.055em] md:text-5xl">
              {session.title}
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              {session.repository}
            </p>
          </div>

          <ReleaseStateBadge state={state} />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-px border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 md:grid-cols-4">
          <Metric
            label="FILES"
            value={session.changedFiles.length}
          />
          <Metric label="ADDITIONS" value={`+${additions}`} />
          <Metric label="DELETIONS" value={`-${deletions}`} />
          <Metric
            label="REQUIRED GATES"
            value={`${counts.satisfied} / ${counts.total}`}
          />
        </div>
      </div>

      <section className="py-8">
        <SectionLabel>AFFECTED AREAS</SectionLabel>

        <div className="mt-4 flex flex-wrap gap-2">
          {areas.map((area, index) => (
            <motion.button
              key={area}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: Math.min(index * 0.04, 0.3),
              }}
              onClick={() => setView("changes")}
              className="border border-neutral-300 bg-white px-3 py-2 font-mono text-[10px] font-semibold hover:border-blue-500 hover:text-blue-600 dark:border-neutral-700 dark:bg-neutral-900"
            >
              {area}
            </motion.button>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-200 py-8 dark:border-neutral-800">
        <div className="flex items-end justify-between gap-4">
          <div>
            <SectionLabel>ATTENTION</SectionLabel>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              {attention.length} ITEMS NEED ATTENTION.
            </h2>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setView("gates")}
          >
            OPEN GATES
            <ArrowRight size={13} />
          </Button>
        </div>

        <div className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {attention.slice(0, 5).map((gate) => (
            <button
              key={gate.id}
              onClick={() => setView("gates")}
              className="flex w-full items-center justify-between gap-5 py-4 text-left"
            >
              <div>
                <p className="text-sm font-semibold">
                  {gate.title}
                </p>

                <p className="mt-1 max-w-xl text-xs leading-5 text-neutral-500">
                  {gate.why}
                </p>
              </div>

              <GateStatusBadge status={gate.status} />
            </button>
          ))}
        </div>
      </section>

      {session.ci.some(
        (check) => check.status === "fail",
      ) && (
        <section className="border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/20">
          <SectionLabel>BLOCKER</SectionLabel>

          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-red-900 dark:text-red-200">
            SHIP BLOCKED.
          </h2>

          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            A required automated CI check is failing.
            Automated gates cannot be manually marked as
            passed.
          </p>

          {session.source.kind === "demo" && (
            <Button
              className="mt-5"
              onClick={refreshDemoCi}
            >
              <RefreshCw size={14} />
              REFRESH DEMO CI
            </Button>
          )}
        </section>
      )}

      {session.source.kind === "demo" &&
        !session.outdated && (
          <section className="mt-8 border-t border-neutral-200 pt-8 dark:border-neutral-800">
            <SectionLabel>REANALYSIS DEMO</SectionLabel>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-5 border border-neutral-200 p-5 dark:border-neutral-800">
              <div>
                <h3 className="font-semibold">
                  Simulate a new commit landing on the PR.
                </h3>

                <p className="mt-1 text-sm text-neutral-500">
                  This demonstrates stale-analysis detection
                  and change impact delta.
                </p>
              </div>

              <Button
                variant="secondary"
                onClick={simulatePrChange}
              >
                <ExternalLink size={14} />
                SIMULATE PR CHANGE
              </Button>
            </div>
          </section>
        )}

      {session.delta && (
        <section className="mt-8 border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/20">
          <SectionLabel>WHAT CHANGED SINCE THE CHECK?</SectionLabel>

          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
            AUTH AREA NOW AFFECTED.
          </h3>

          <div className="mt-5 grid gap-3 text-sm md:grid-cols-3">
            <Delta
              label="NEW FILE"
              value={session.delta.addedFiles[0]}
            />

            <Delta
              label="NEW AREA"
              value={session.delta.newAreas.join(", ")}
            />

            <Delta
              label="NEW GATES"
              value={session.delta.addedGateIds.length}
            />
          </div>
        </section>
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
      <p className="font-mono text-[9px] tracking-[0.12em] text-neutral-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
        {value}
      </p>
    </div>
  );
}

function Delta({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="border border-blue-200 bg-white p-4 dark:border-blue-900 dark:bg-neutral-950">
      <p className="font-mono text-[9px] text-blue-500">
        {label}
      </p>

      <p className="mt-2 font-mono text-xs">
        {value}
      </p>
    </div>
  );
}

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="font-mono text-[10px] font-semibold tracking-[0.12em] text-neutral-400">
      {children}
    </p>
  );
}