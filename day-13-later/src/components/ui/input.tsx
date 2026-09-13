import type {
  InputHTMLAttributes,
} from "react";

type Props =
  InputHTMLAttributes<HTMLInputElement>;

export function Input({
  className = "",
  ...props
}: Props) {
  return (
    <input
      className={[
        "w-full rounded-xl border",
        "border-[#e4e4e7] bg-white",
        "px-5 py-4 text-[16px]",
        "text-[#111111]",
        "placeholder:text-[#a1a1aa]",
        "outline-none transition-colors",
        "focus:border-[#111111]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}