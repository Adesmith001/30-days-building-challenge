import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Props =
  ButtonHTMLAttributes<
    HTMLButtonElement
  > & {
    children: ReactNode;
    subtle?: boolean;
  };

export function PrimaryButton({
  children,
  subtle,
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={`
        min-h-14
        w-full
        rounded-2xl
        px-5
        font-display
        text-sm
        font-bold
        tracking-wide
        transition
        disabled:cursor-not-allowed
        disabled:opacity-35
        ${
          subtle
            ? `
              border
              border-line
              bg-night-2
              text-white
              hover:bg-[#18254b]
            `
            : `
              tactile-button
              bg-gold
              text-ink
              hover:bg-gold-2
            `
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}