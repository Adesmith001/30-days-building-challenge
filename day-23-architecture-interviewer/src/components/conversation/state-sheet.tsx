"use client";

import {
  X,
} from "lucide-react";

import type {
  InterviewState,
} from "@/types/interview";

type Mode =
  | "assumptions"
  | "decisions"
  | "risks"
  | "contradictions";

interface Props {
  open: boolean;
  mode: Mode;
  state: InterviewState;
  onClose: () => void;
}

function statusLabel(
  value: string,
) {
  return value
    .replaceAll("_", " ")
    .toUpperCase();
}

export function StateSheet({
  open,
  mode,
  state,
  onClose,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <aside
      className="
        fixed right-0 top-0
        z-40 h-dvh
        w-[min(380px,92vw)]
        border-l
        bg-background
        p-5
        shadow-[-8px_0_24px_rgba(0,0,0,0.04)]
      "
    >
      <div
        className="
          flex items-center
          justify-between
        "
      >
        <h2
          className="
            text-xs
            font-semibold
            tracking-[0.12em]
          "
        >
          {mode.toUpperCase()}
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="
            rounded-md p-1
            text-muted
            hover:bg-surface-hover
          "
        >
          <X size={16} />
        </button>
      </div>

      <div
        className="
          mt-8 space-y-6
          overflow-y-auto
          pb-10
        "
      >
        {mode ===
          "assumptions" &&
          state.assumptions.map(
            (item) => (
              <div
                key={item.id}
              >
                <p
                  className="
                    text-sm
                    leading-6
                  "
                >
                  {item.statement}
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    tracking-wide
                    text-muted
                  "
                >
                  {statusLabel(
                    item.status,
                  )}
                </p>

                {item.evidence && (
                  <p
                    className="
                      mt-2
                      text-xs
                      leading-5
                      text-muted
                    "
                  >
                    {item.evidence}
                  </p>
                )}
              </div>
            ),
          )}

        {mode ===
          "decisions" &&
          state.decisions.map(
            (item) => (
              <div
                key={item.id}
              >
                <p
                  className="
                    text-sm
                    font-medium
                  "
                >
                  {item.decision}
                </p>

                {item.reason && (
                  <p
                    className="
                      mt-2
                      text-xs
                      leading-5
                      text-muted
                    "
                  >
                    Reason:{" "}
                    {item.reason}
                  </p>
                )}

                {item.tradeoff && (
                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-muted
                    "
                  >
                    Trade-off:{" "}
                    {item.tradeoff}
                  </p>
                )}
              </div>
            ),
          )}

        {mode ===
          "risks" &&
          state.risks.map(
            (item) => (
              <div
                key={item.id}
              >
                <p
                  className="
                    text-sm
                    font-medium
                  "
                >
                  {item.title}
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-5
                    text-muted
                  "
                >
                  {item.description}
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    tracking-wide
                    text-muted
                  "
                >
                  {item.resolved
                    ? "RESOLVED"
                    : `${item.severity.toUpperCase()} RISK`}
                </p>
              </div>
            ),
          )}

        {mode ===
          "contradictions" &&
          state.contradictions.map(
            (item) => (
              <div
                key={item.id}
                className="
                  border-l-2
                  pl-3
                "
              >
                <p
                  className="
                    text-xs
                    leading-5
                    text-muted
                  "
                >
                  Earlier:
                  {" "}
                  {item.earlierStatement}
                </p>

                <p
                  className="
                    mt-2 text-xs
                    leading-5
                    text-muted
                  "
                >
                  Later:
                  {" "}
                  {item.laterStatement}
                </p>

                <p
                  className="
                    mt-3 text-sm
                    leading-6
                  "
                >
                  {item.question}
                </p>
              </div>
            ),
          )}

        {(
          mode ===
            "assumptions"
            ? state.assumptions
            : mode ===
                "decisions"
              ? state.decisions
              : mode ===
                  "risks"
                ? state.risks
                : state.contradictions
        ).length === 0 && (
          <p
            className="
              text-sm
              text-muted
            "
          >
            Nothing captured yet.
          </p>
        )}
      </div>
    </aside>
  );
}
