import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant =
  | "primary"
  | "secondary"
  | "text";

type Props =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: Variant;
  };

const variants: Record<
  Variant,
  string
> = {
  primary:
    "bg-[#111111] text-white hover:bg-[#27272a]",
  secondary:
    "border border-[#e4e4e7] bg-transparent text-[#111111] hover:border-[#d4d4d8] hover:bg-white",
  text:
    "bg-transparent text-[#71717a] hover:text-[#111111]",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={[
        "inline-flex min-h-11 items-center justify-center",
        "rounded-lg px-5 text-[14px] font-medium",
        "transition-all duration-150",
        "disabled:cursor-not-allowed",
        "disabled:opacity-40",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}