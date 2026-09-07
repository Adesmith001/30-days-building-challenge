import {
  clampPrice,
  formatNaira,
  parseNaira,
} from "../lib/currency";
import type { PriceItem } from "../types/game";
import { Button } from "./Button";

interface Props {
  item: PriceItem;
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  onLock: () => void;
}

export function PriceInput({
  item,
  value,
  disabled = false,
  onChange,
  onLock,
}: Props) {
  function update(next: number) {
    onChange(
      clampPrice(
        Math.round(next / item.step) * item.step,
        item.minPrice,
        item.maxPrice,
      ),
    );
  }

  function handleInput(raw: string) {
    const next = parseNaira(raw);

    onChange(
      clampPrice(
        next,
        item.minPrice,
        item.maxPrice,
      ),
    );
  }

  return (
    <section
      className="
        mt-7 rounded-2xl border border-[#b8c5ba]
        bg-white p-4 shadow-sm sm:p-5
      "
    >
      <div
        className="
          text-center font-mono text-[10px]
          font-bold uppercase tracking-[0.15em]
          text-[#737c74]
        "
      >
        Your Estimated Price
      </div>

      <input
        type="text"
        inputMode="numeric"
        value={formatNaira(value)}
        disabled={disabled}
        onChange={(event) =>
          handleInput(event.target.value)
        }
        className="
          mt-1 w-full bg-transparent text-center
          font-mono text-[32px] font-black
          tracking-[-0.04em] outline-none
          sm:text-[38px]
        "
        aria-label="Your estimated price"
      />

      <input
        type="range"
        min={item.minPrice}
        max={item.maxPrice}
        step={item.step}
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="
          mt-3 h-2 w-full cursor-pointer
          accent-[#075d38]
        "
      />

      <div
        className="
          mt-1 flex justify-between font-mono
          text-[9px] font-bold text-[#7b837c]
        "
      >
        <span>{formatNaira(item.minPrice)}</span>
        <span>SLIDE TO TUNE</span>
        <span>{formatNaira(item.maxPrice)}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          disabled={disabled}
          onClick={() => update(value - item.step)}
        >
          − {formatNaira(item.step)}
        </Button>

        <Button
          variant="secondary"
          disabled={disabled}
          onClick={() => update(value + item.step)}
        >
          + {formatNaira(item.step)}
        </Button>
      </div>

      <Button
        className="mt-4 w-full"
        disabled={disabled}
        onClick={onLock}
      >
        LOCK PRICE →
      </Button>

      <div
        className="
          mt-4 text-center font-mono text-[9px]
          font-bold tracking-[0.14em]
          text-[#7a827a]
        "
      >
        ← SWIPE CARD TO SKIP →
      </div>
    </section>
  );
}