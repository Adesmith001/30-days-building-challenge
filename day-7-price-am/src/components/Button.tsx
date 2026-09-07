import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const variants = {
    primary:
      "border-[#064f30] bg-[#075d38] text-white hover:bg-[#064b2e]",
    secondary:
      "border-[#bfc8bf] bg-[#fbfaf8] text-[#171717] hover:bg-white",
    danger:
      "border-[#b64225] bg-[#fff1eb] text-[#8d2918]",
  };

  return (
    <button
      className={[
        "min-h-13 rounded-lg border px-5",
        "font-mono text-xs font-bold uppercase",
        "tracking-[0.16em] transition",
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