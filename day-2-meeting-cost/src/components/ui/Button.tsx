import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "../../lib/cn";

type Variant =
  | "primary"
  | "outline"
  | "ghost"
  | "danger";

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    "border-black bg-black text-white hover:bg-neutral-800",
  outline:
    "border-black bg-transparent text-black hover:bg-black hover:text-white",
  ghost:
    "border-transparent bg-transparent text-neutral-600 hover:text-black",
  danger:
    "border-black bg-transparent text-black hover:bg-black hover:text-white",
};

export function Button({
  children,
  className,
  variant = "outline",
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center",
        "gap-2 border px-5 font-mono text-[11px]",
        "font-semibold tracking-[0.1em]",
        "transition-colors disabled:cursor-not-allowed",
        "disabled:opacity-40",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}