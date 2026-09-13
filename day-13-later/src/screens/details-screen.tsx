import { useState } from "react";

import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Countdown } from "../components/countdown";

import {
  formatFullDate,
  toDateTimeLocalValue,
} from "../lib/time";

import type {
  Commitment,
} from "../types/commitment";

type Props = {
  commitment: Commitment;
  onBack: () => void;
  onHome: () => void;
  onPostpone: () => void;
  onUpdate: (title: string, scheduledFor: number) => void;
  onDelete: () => void;
};

export function DetailsScreen({
  commitment,
  onBack,
  onHome,
  onPostpone,
  onUpdate,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(commitment.title);
  const [scheduledFor, setScheduledFor] = useState(
    toDateTimeLocalValue(new Date(commitment.scheduledFor)),
  );

  function startEditing() {
    setTitle(commitment.title);
    setScheduledFor(toDateTimeLocalValue(new Date(commitment.scheduledFor)));
    setEditing(true);
  }

  function saveChanges() {
    const timestamp = new Date(scheduledFor).getTime();
    if (!title.trim() || Number.isNaN(timestamp)) return;
    onUpdate(title.trim(), timestamp);
    setEditing(false);
  }

  function deleteThisCommitment() {
    if (window.confirm("Delete this commitment?")) onDelete();
  }

  return (
    <AppShell
      onLogoClick={onHome}
      right={
        <button
          className={[
            "flex items-center",
            "gap-1 text-[12px]",
            "text-[#71717a]",
          ].join(" ")}
          onClick={onBack}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
      }
    >
      <div
        className={[
          "mx-auto w-full",
          "max-w-[620px]",
          "px-5 py-14",
        ].join(" ")}
      >
        <div
          className={[
            "flex items-start",
            "justify-between gap-8",
          ].join(" ")}
        >
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="space-y-3">
                <input
                  aria-label="Commitment title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-lg border border-[#e4e4e7] px-3 py-2 text-[16px] outline-none focus:border-black"
                />
                <input
                  aria-label="Commitment date and time"
                  type="datetime-local"
                  min={toDateTimeLocalValue(new Date())}
                  value={scheduledFor}
                  onChange={(event) => setScheduledFor(event.target.value)}
                  className="w-full rounded-lg border border-[#e4e4e7] px-3 py-2 text-[13px] outline-none focus:border-black"
                />
                <div className="flex gap-2">
                  <Button onClick={saveChanges}>Save changes</Button>
                  <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <h1
                className={[
                  "text-[28px]",
                  "font-semibold",
                  "tracking-[-0.04em]",
                ].join(" ")}
              >
                {commitment.title}
              </h1>
            )}

            <p className="mt-2 text-[12px] text-[#71717a]">
              Everything you promised
              yourself about this.
            </p>
          </div>

          <div className="flex items-start gap-2">
            {!editing && commitment.status !== "completed" && (
              <button
                type="button"
                aria-label="Edit commitment"
                title="Edit commitment"
                onClick={startEditing}
                className="rounded-md p-2 text-[#71717a] transition-colors hover:bg-[#f4f4f5] hover:text-[#111111]"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <span
            className={[
              "rounded-md",
              "bg-[#f4f4f5]",
              "px-2 py-1",
              "text-[10px]",
              "font-medium",
              "uppercase",
              "tracking-[0.06em]",
              "text-[#71717a]",
            ].join(" ")}
          >
            {commitment.status}
            </span>
          </div>
        </div>

        <div
          className={[
            "mt-10 divide-y",
            "divide-[#e4e4e7]",
            "border-y",
            "border-[#e4e4e7]",
          ].join(" ")}
        >
          <DetailRow
            label="Created"
            value={formatFullDate(
              commitment.createdAt,
            )}
          />

          <DetailRow
            label="Originally promised"
            value={formatFullDate(
              commitment.originalScheduledFor,
            )}
          />

          <DetailRow
            label="Postponed"
            value={`${commitment.postponements} ${
              commitment.postponements ===
              1
                ? "time"
                : "times"
            }`}
          />

          <DetailRow
            label="Current promise"
            value={formatFullDate(
              commitment.scheduledFor,
            )}
          />

          {commitment.status !== "completed" && (
            <div className="grid gap-2 py-5 sm:grid-cols-[180px_1fr]">
              <p className="text-[12px] text-[#71717a]">Countdown</p>
              <p className="text-[13px] font-medium">
                <Countdown timestamp={commitment.scheduledFor} showSeconds />
              </p>
            </div>
          )}

          {commitment.completedAt && (
            <DetailRow
              label="Completed"
              value={formatFullDate(
                commitment.completedAt,
              )}
            />
          )}
        </div>

        {commitment.history.length >
          0 && (
          <div className="mt-10">
            <p
              className={[
                "text-[11px]",
                "font-medium",
                "uppercase",
                "tracking-[0.08em]",
                "text-[#a1a1aa]",
              ].join(" ")}
            >
              Promise history
            </p>

            <div className="mt-4 space-y-4">
              {commitment.history.map(
                (entry, index) => (
                  <div
                    key={`${entry.changedAt}-${index}`}
                    className="text-[12px]"
                  >
                    <p className="text-[#71717a]">
                      Changed from
                    </p>

                    <p className="mt-1">
                      {formatFullDate(
                        entry.from,
                      )}
                    </p>

                    <p className="mt-1 text-[#a1a1aa]">
                      →{" "}
                      {formatFullDate(
                        entry.to,
                      )}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {commitment.status !== "completed" && !editing && (
          <Button
            className="mt-10"
            onClick={onPostpone}
          >
            Not yet. Reschedule.
          </Button>
        )}

        <button
          type="button"
          aria-label="Delete commitment"
          title="Delete commitment"
          onClick={deleteThisCommitment}
          className="mt-3 rounded-md p-2 text-[#a1a1aa] transition-colors hover:bg-[#fef2f2] hover:text-[#b91c1c]"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </AppShell>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className={[
        "grid gap-2 py-5",
        "sm:grid-cols-[180px_1fr]",
      ].join(" ")}
    >
      <p className="text-[12px] text-[#71717a]">
        {label}
      </p>

      <p className="text-[13px]">
        {value}
      </p>
    </div>
  );
}
