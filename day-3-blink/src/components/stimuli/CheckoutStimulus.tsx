import {
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import type { Stimulus } from "../../types/game";
import { cn } from "../../lib/utils";

type Props = {
  stimulus: Stimulus;
  reveal?: boolean;
};

const colourValues: Record<string, string> = {
  Blue: "#2563eb",
  Violet: "#7c3aed",
  Green: "#16a34a",
  Orange: "#ea580c",
  Red: "#dc2626",
  Yellow: "#eab308",
  Pink: "#db2777",
  Teal: "#0d9488",
  Indigo: "#4f46e5",
  Cyan: "#0891b2",
  Magenta: "#c026d3",
  Crimson: "#be123c",
  Coral: "#f97316",
  Maroon: "#9f1239",
  Navy: "#1e3a8a",
  Mint: "#10b981",
  Lime: "#65a30d",
  Gold: "#ca8a04",
  Silver: "#64748b",
  Charcoal: "#374151",
  Ivory: "#fffff0",
  Turquoise: "#14b8a6",
  Lavender: "#a78bfa",
  Pearl: "#e2e8f0",
  Plum: "#7e22ce",
};

export function CheckoutStimulus({
  stimulus,
  reveal = false,
}: Props) {
  const { data, question } = stimulus;
  const highlight = reveal && [
    "total",
    "buttonColour",
  ].includes(question.focusKey);
  const buttonColour = String(data.buttonColour);

  return (
    <div className="w-full max-w-3xl border border-slate-300 bg-white p-6 md:p-10">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-slate-500">
            CHECKOUT
          </p>

          <h2 className="mt-2 text-3xl font-semibold">
            Your order
          </h2>
        </div>

        <ShoppingBag className="size-7" />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_240px]">
        <div>
          <div className="flex gap-5">
            <div className="size-24 bg-slate-100" />

            <div className="flex-1">
              <h3 className="text-xl font-semibold">
                {data.item}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Standard · Black
              </p>

              <div className="mt-6 flex w-fit items-center border border-slate-300">
                <button
                  type="button"
                  className="grid size-10 place-items-center"
                >
                  <Minus className="size-4" />
                </button>

                <span className="w-10 text-center font-mono">
                  {data.quantity}
                </span>

                <button
                  type="button"
                  className="grid size-10 place-items-center"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-slate-300 p-5">
          <p className="font-mono text-xs tracking-[0.18em] text-slate-500">
            ORDER TOTAL
          </p>

          <p
            className={cn(
              "mt-4 text-3xl font-semibold",
              highlight && "ring-4 ring-blue-500",
            )}
          >
            {data.total}
          </p>

          <button
            type="button"
            className="mt-8 w-full px-4 py-4 text-sm font-semibold text-white"
            style={{
              backgroundColor: colourValues[buttonColour] ?? "#2563eb",
            }}
          >
            Pay now
          </button>
        </div>
      </div>
    </div>
  );
}