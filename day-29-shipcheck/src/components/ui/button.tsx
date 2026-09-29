import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "quiet";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 border font-medium",
        "transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        "focus-visible:outline-2 focus-visible:outline-blue-600",
        variant === "primary" &&
          "border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white",
        variant === "secondary" &&
          "border-neutral-300 bg-white text-neutral-950 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800",
        variant === "danger" &&
          "border-red-300 bg-red-50 text-red-800 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
        variant === "quiet" &&
          "border-transparent bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white",
        size === "sm" && "h-8 rounded-md px-3 text-xs",
        size === "md" && "h-10 rounded-md px-4 text-sm",
        size === "lg" && "h-12 rounded-md px-5 text-sm",
        className,
      )}
      {...props}
    />
  );
}