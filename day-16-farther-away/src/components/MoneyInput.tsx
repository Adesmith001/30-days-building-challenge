import {
  digitsOnly,
  formatInputMoney,
} from "../lib/currency";

interface Props {
  label: string;
  value: number;

  onChange:
    (value: number) => void;

  hint?: string;
}

export default function MoneyInput({
  label,
  value,
  onChange,
  hint,
}: Props) {
  return (
    <label
      className="
        block
        border-b
        border-ink
        pb-3
      "
    >
      <span
        className="
          mb-2
          block
          text-[11px]
          font-semibold
          uppercase
          tracking-[0.1em]
          text-muted
        "
      >
        {label}
      </span>

      <div
        className="
          flex
          items-end
          gap-2
        "
      >
        <span
          className="
            font-mono
            text-xl
          "
        >
          ₦
        </span>

        <input
          inputMode="numeric"
          value={
            formatInputMoney(value)
          }
          onChange={(event) =>
            onChange(
              Number(
                digitsOnly(
                  event.target.value,
                ),
              ),
            )
          }
          placeholder="0"
          className="
            min-w-0
            flex-1
            bg-transparent
            font-mono
            text-2xl
            outline-none
            md:text-3xl
          "
        />

        {hint && (
          <span
            className="
              pb-1
              font-mono
              text-xs
              text-muted
            "
          >
            {hint}
          </span>
        )}
      </div>
    </label>
  );
}