import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function VisuallyHidden({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "absolute size-px overflow-hidden",
        "whitespace-nowrap border-0 p-0",
        "[clip:rect(0,0,0,0)]",
        className,
      )}
      {...props}
    />
  );
}