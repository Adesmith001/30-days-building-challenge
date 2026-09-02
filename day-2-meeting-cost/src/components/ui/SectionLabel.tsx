import type { ReactNode } from "react";

export function SectionLabel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-neutral-600">
      {children}
    </span>
  );
}