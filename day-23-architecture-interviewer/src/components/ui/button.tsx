import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "icon";
}

const variants: Record<
  Variant,
  string
> = {
  primary:
    "bg-foreground text-background hover:opacity-90",

  secondary:
    "border border-border bg-surface hover:bg-surface-hover",

  ghost:
    "bg-transparent hover:bg-surface-hover",

  destructive:
    "bg-destructive text-white hover:opacity-90",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  icon: "size-9",
};

export const Button =
  forwardRef<
    HTMLButtonElement,
    ButtonProps
  >(
    function Button(
      {
        className,
        variant = "secondary",
        size = "md",
        type = "button",
        ...props
      },
      ref,
    ) {
      return (
        <button
          ref={ref}
          type={type}
          className={cn(
            "inline-flex items-center justify-center",
            "gap-2 rounded-md",
            "font-medium transition-colors",
            "disabled:pointer-events-none",
            "disabled:opacity-50",
            variants[variant],
            sizes[size],
            className,
          )}
          {...props}
        />
      );
    },
  );
