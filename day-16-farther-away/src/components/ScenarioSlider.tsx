interface Props {
  label: string;

  value: number;
  min: number;
  max: number;
  step: number;

  display: string;

  left?: string;
  right?: string;

  onChange:
    (value: number) => void;
}

export default function ScenarioSlider({
  label,
  value,
  min,
  max,
  step,
  display,
  left,
  right,
  onChange,
}: Props) {
  return (
    <div
      className="
        border-y
        border-line
        py-5
      "
    >
      <div
        className="
          mb-4
          flex
          items-end
          justify-between
          gap-4
        "
      >
        <span
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.1em]
            text-muted
          "
        >
          {label}
        </span>

        <span
          className="
            font-mono
            text-lg
          "
        >
          {display}
        </span>
      </div>

      <input
        className="
          range
          w-full
        "
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(
            Number(
              event.target.value,
            ),
          )
        }
      />

      <div
        className="
          mt-2
          flex
          justify-between
          font-mono
          text-[10px]
          text-muted
        "
      >
        <span>
          {left ?? min}
        </span>

        <span>
          {right ?? max}
        </span>
      </div>
    </div>
  );
}