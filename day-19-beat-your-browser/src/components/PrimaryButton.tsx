import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

interface Props
  extends
    ButtonHTMLAttributes<HTMLButtonElement> {
  children:
    ReactNode;

  tone?:
    | "lime"
    | "cyan"
    | "neutral";
}

export function PrimaryButton({
  children,
  tone = "lime",
  className = "",
  ...props
}: Props) {
  const tones = {
    lime:
      "border-lime bg-lime text-canvas hover:bg-emerald-400",

    cyan:
      "border-cyan bg-cyan text-canvas hover:bg-sky-300",

    neutral:
      "border-line bg-cell text-ink hover:border-muted",
  };

  return (
    <button
      {...props}
      className={`
        border
        px-4
        py-3
        text-xs
        font-semibold
        tracking-[.09em]
        transition
        active:translate-y-px
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${tones[tone]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}