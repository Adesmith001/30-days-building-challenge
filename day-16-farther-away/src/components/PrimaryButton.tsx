import type {
  ButtonHTMLAttributes,
} from "react";

export default function PrimaryButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`
        border border-ink
        bg-ink
        px-5 py-3
        font-mono
        text-xs
        uppercase
        tracking-[0.08em]
        text-paper
        transition
        hover:border-cobalt
        hover:bg-cobalt
        disabled:cursor-not-allowed
        disabled:opacity-40
        ${className}
      `}
    />
  );
}