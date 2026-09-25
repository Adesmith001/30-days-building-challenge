import type { PropsWithChildren } from "react";
import { cn } from "@/lib/cn";

interface Props {
  tone?:
    | "neutral"
    | "red"
    | "amber"
    | "green"
    | "blue";
}

export function Badge({
  tone = "neutral",
  children,
}: PropsWithChildren<Props>) {
  return (
    <span
      className={cn(
        "inline-flex border px-2 py-1 font-mono text-[10px] font-medium tracking-wider",
        tone === "neutral" &&
          "border-zinc-700 text-zinc-400",
        tone === "red" &&
          "border-red-900 bg-red-950/30 text-red-300",
        tone === "amber" &&
          "border-amber-900 bg-amber-950/20 text-amber-300",
        tone === "green" &&
          "border-emerald-900 bg-emerald-950/20 text-emerald-300",
        tone === "blue" &&
          "border-blue-900 bg-blue-950/20 text-blue-300",
      )}
    >
      {children}
    </span>
  );
}
