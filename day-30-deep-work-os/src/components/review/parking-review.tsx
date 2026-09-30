"use client";

import type { ParkedItem } from "@/types";

export function ParkingReview({ items }: { items: ParkedItem[] }) {
  return (
    <div className="border-t">
      {items.map((item) => (
        <div key={item.id} className="flex items-start justify-between gap-6 border-b py-4">
          <p className={item.resolved ? "text-sm text-[var(--muted)] line-through" : "text-sm"}>{item.text}</p>
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{item.resolved ? "Resolved" : "Parked"}</span>
        </div>
      ))}
      {!items.length && <p className="py-6 text-sm text-[var(--muted)]">Nothing was parked.</p>}
    </div>
  );
}
