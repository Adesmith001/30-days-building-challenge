import Link from "next/link";
import { Check } from "lucide-react";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-semibold tracking-[-0.03em]"
    >
      <span className="flex size-6 items-center justify-center border border-neutral-950 bg-neutral-950 text-white dark:border-neutral-200 dark:bg-neutral-100 dark:text-neutral-950">
        <Check size={14} strokeWidth={2.5} />
      </span>

      <span>SHIPCHECK</span>
    </Link>
  );
}