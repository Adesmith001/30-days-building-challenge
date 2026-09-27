interface Props {
  label: string
  value: number
  min: number
  max: number
  step?: number
  left: string
  right: string
  onChange(value: number): void
}

export function RangeRow({
  label,
  value,
  min,
  max,
  step = 0.01,
  left,
  right,
  onChange,
}: Props) {
  return (
    <label className="block border-b border-white/8 py-5">
      <span className="mb-4 block text-[10px] tracking-[0.18em] text-white/52">
        {label}
      </span>

      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        aria-label={label}
        aria-valuenow={value}
        onChange={(event) => {
          onChange(
            Number(
              event.target.value,
            ),
          )
        }}
        className="w-full"
      />

      <span className="mt-2 flex justify-between text-[9px] tracking-[0.14em] text-white/36">
        <span>{left}</span>
        <span>{right}</span>
      </span>
    </label>
  )
}