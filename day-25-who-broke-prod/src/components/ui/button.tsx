import type {
  ButtonHTMLAttributes,
  PropsWithChildren,
} from "react";
import { cn } from "@/lib/cn";

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "ghost";
}

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: PropsWithChildren<Props>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 border px-4 py-2 text-xs font-semibold tracking-[0.12em] transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
        "disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" &&
          "border-blue-400 bg-blue-400 text-black hover:bg-blue-300",
        variant === "secondary" &&
          "border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-500",
        variant === "danger" &&
          "border-red-800 bg-red-950/50 text-red-200 hover:border-red-600",
        variant === "ghost" &&
          "border-transparent bg-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white",
        className,
      )}
    >
      {children}
    </button>
  );
}
