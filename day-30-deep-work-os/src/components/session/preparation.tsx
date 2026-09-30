/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
} from "lucide-react";

const items = [
  "Water ready",
  "Phone away",
  "Needed tabs open",
  "Notifications quiet",
  "Materials ready",
];

export function Preparation({
  onReady,
}: {
  onReady: () => void;
}) {
  const [selected, setSelected] =
    useState<string[]>([]);

  function toggle(item: string) {
    setSelected((current) =>
      current.includes(item)
        ? current.filter(
            (value) => value !== item,
          )
        : [...current, item],
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
        Optional preparation
      </p>

      <h1 className="editorial mt-5 text-6xl leading-[0.9] md:text-8xl">
        Clear
        <br />
        the deck.
      </h1>

      <div className="mt-14 border-t">
        {items.map((item) => {
          const checked =
            selected.includes(item);

          return (
            <button
              key={item}
              onClick={() => toggle(item)}
              className="flex w-full items-center gap-4 border-b py-4 text-left"
            >
              <span className="grid size-5 place-items-center border">
                {checked && <Check size={12} />}
              </span>

              <span className="text-sm font-semibold uppercase tracking-[0.1em]">
                {item}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-[var(--muted)]">
        This isn't scored.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <button
          onClick={onReady}
          className="flex min-w-56 items-center justify-between bg-[var(--foreground)] px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--background)]"
        >
          I'm ready
          <ArrowRight size={15} />
        </button>

        <button
          onClick={onReady}
          className="px-5 py-4 text-xs font-bold uppercase tracking-[0.16em]"
        >
          Skip prep
        </button>
      </div>
    </div>
  );
}