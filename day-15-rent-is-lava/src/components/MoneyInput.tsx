import {
  formatNumber,
  parseMoney,
} from "../lib/currency"

interface Props {
  label: string
  help?: string
  value: number
  onChange: (value: number) => void
}

export function MoneyInput({
  label,
  help,
  value,
  onChange,
}: Props) {
  return (
    <div className="group grid gap-4 border-t border-rule py-6 md:grid-cols-[1fr_1.2fr] md:items-center md:py-7">
      <div>
        <label className="flex items-center gap-2 font-mono text-[10px] font-medium tracking-[0.15em] text-graphite">
          <span className="h-3 w-1 bg-rule transition-colors group-focus-within:bg-ink" />
          {label}
        </label>

        {help && (
          <p className="mt-1 pl-3 font-body text-xs text-muted">
            {help}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <span className="font-mono text-xl text-muted">
          ₦
        </span>

        <input
          inputMode="numeric"
          value={value > 0 ? formatNumber(value) : ""}
          onChange={(event) =>
            onChange(parseMoney(event.target.value))
          }
          className="w-full bg-transparent text-right font-mono text-2xl font-medium tracking-[-0.04em] outline-none md:max-w-md md:text-3xl"
        />
      </div>
    </div>
  )
}
