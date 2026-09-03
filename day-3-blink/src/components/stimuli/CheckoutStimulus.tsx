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

export function CheckoutStimulus({
  stimulus,
  reveal = false,
}: Props) {
  const { data, question } = stimulus;
  const highlight = reveal && question.focusKey === "total";

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
            className="mt-8 w-full bg-blue-700 px-4 py-4 text-sm font-semibold text-white"
          >
            Pay now
          </button>
        </div>
      </div>
    </div>
  );
}