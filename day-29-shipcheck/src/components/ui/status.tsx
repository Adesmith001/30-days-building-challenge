import {
  AlertTriangle,
  Check,
  Circle,
  CircleSlash,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type {
  GateStatus,
  ReleaseState,
} from "@/types/release";

export function GateStatusBadge({
  status,
}: {
  status: GateStatus;
}) {
  const icon =
    status === "pass" ? (
      <Check size={12} />
    ) : status === "fail" || status === "blocked" ? (
      <X size={12} />
    ) : status === "waived" ? (
      <CircleSlash size={12} />
    ) : (
      <Circle size={10} />
    );

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[10px] font-semibold tracking-[0.08em]",
        status === "pass" &&
          "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
        (status === "fail" || status === "blocked") &&
          "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
        status === "pending" &&
          "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
        status === "waived" &&
          "border-neutral-300 bg-neutral-100 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
      )}
    >
      {icon}
      {status.toUpperCase()}
    </span>
  );
}

export function ReleaseStateBadge({
  state,
}: {
  state: ReleaseState;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-sm border px-2.5 py-1.5 text-xs font-semibold tracking-[0.07em]",
        state === "READY_TO_SHIP" &&
          "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300",
        state === "READY_WITH_WAIVERS" &&
          "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300",
        state === "NEEDS_REVIEW" &&
          "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
        state === "BLOCKED" &&
          "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300",
      )}
    >
      <AlertTriangle size={13} />
      {state.replaceAll("_", " ")}
    </span>
  );
}