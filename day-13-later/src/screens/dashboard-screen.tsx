import {
  isThisWeek,
} from "date-fns";

import { Plus } from "lucide-react";

import { AppShell } from "../components/app-shell";
import { CommitmentCard } from "../components/commitment-card";
import { Countdown } from "../components/countdown";
import { EmptyState } from "../components/empty-state";

import type {
  Commitment,
} from "../types/commitment";

type Props = {
  commitments: Commitment[];
  onHome: () => void;
  onAdd: () => void;
  onOpen: (
    commitment: Commitment,
  ) => void;
};

export function DashboardScreen({
  commitments,
  onHome,
  onAdd,
  onOpen,
}: Props) {
  if (commitments.length === 0) {
    return (
      <AppShell
        onLogoClick={onHome}
      >
        <div className="mx-auto w-full max-w-[700px] px-5">
          <EmptyState
            onAdd={onAdd}
          />
        </div>
      </AppShell>
    );
  }

  const completedThisWeek =
    commitments.filter(
      (item) =>
        item.completedAt &&
        isThisWeek(
          new Date(
            item.completedAt,
          ),
        ),
    );

  const postponed =
    commitments.reduce(
      (total, item) =>
        total +
        item.postponements,
      0,
    );

  const completedOnTime =
    completedThisWeek.filter(
      (item) =>
        item.completedAt! <=
        item.scheduledFor,
    ).length;

  const onTimePercentage =
    completedThisWeek.length > 0
      ? Math.round(
          (completedOnTime /
            completedThisWeek.length) *
            100,
        )
      : 0;

  const active =
    commitments
      .filter(
        (item) =>
          item.status !==
          "completed",
      )
      .sort(
        (a, b) =>
          a.scheduledFor -
          b.scheduledFor,
      );

  return (
    <AppShell
      onLogoClick={onHome}
      right={
        <button
          onClick={onAdd}
          className={[
            "flex items-center",
            "gap-1.5 text-[12px]",
            "font-medium",
          ].join(" ")}
        >
          <Plus className="h-3.5 w-3.5" />
          Add something
        </button>
      }
    >
      <div
        className={[
          "mx-auto w-full",
          "max-w-[700px]",
          "px-5 py-14 sm:py-16",
        ].join(" ")}
      >
        <h1
          className={[
            "text-[30px]",
            "font-semibold",
            "tracking-[-0.04em]",
          ].join(" ")}
        >
          Later.
        </h1>

        <p className="mt-1 text-[14px] text-[#71717a]">
          Things you said you'd do.
        </p>

        {active[0] && (
          <div className="mt-9 rounded-2xl bg-[#111111] px-5 py-5 text-white">
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#a1a1aa]">
              Next up
            </p>
            <p className="mt-3 truncate text-[18px] font-medium">
              {active[0].title}
            </p>
            <p className="mt-2 text-[32px] font-semibold tracking-[-0.04em]">
              <Countdown timestamp={active[0].scheduledFor} showSeconds />
            </p>
          </div>
        )}

        {active.length === 0 ? (
          <div className="mt-14">
            <EmptyState
              onAdd={onAdd}
            />
          </div>
        ) : (
          <div className="mt-9 space-y-2">
            {active.map(
              (commitment) => (
                <CommitmentCard
                  key={
                    commitment.id
                  }
                  commitment={
                    commitment
                  }
                  onClick={() =>
                    onOpen(
                      commitment,
                    )
                  }
                />
              ),
            )}
          </div>
        )}

        <div
          className={[
            "mt-16 border-t",
            "border-[#e4e4e7]",
            "pt-6",
          ].join(" ")}
        >
          <p
            className={[
              "text-[11px]",
              "font-medium",
              "uppercase",
              "tracking-[0.08em]",
              "text-[#a1a1aa]",
            ].join(" ")}
          >
            This week
          </p>

          <div
            className={[
              "mt-4 grid",
              "grid-cols-3 gap-6",
            ].join(" ")}
          >
            <Stat
              value={
                completedThisWeek.length
              }
              label="completed"
            />

            <Stat
              value={postponed}
              label="postponed"
            />

            <Stat
              value={`${onTimePercentage}%`}
              label="kept on time"
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div>
      <p className="text-[20px] font-medium">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-[#a1a1aa]">
        {label}
      </p>
    </div>
  );
}
