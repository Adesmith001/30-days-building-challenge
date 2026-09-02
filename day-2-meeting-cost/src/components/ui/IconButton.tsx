import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "../../lib/cn";

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function IconButton({
  children,
  className,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex size-9 items-center justify-center",
        "bg-transparent text-neutral-500",
        "transition-colors hover:text-black",
        "focus-visible:outline-2",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}