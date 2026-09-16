interface Props {
  label: string;
  value: number;

  onChange:
    (value: number) => void;

  min?: number;
  max?: number;
  suffix?: string;
}

export default function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max,
  suffix,
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
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(event) =>
            onChange(
              Number(
                event.target.value,
              ),
            )
          }
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

        {suffix && (
          <span
            className="
              pb-1
              font-mono
              text-xs
              text-muted
            "
          >
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}