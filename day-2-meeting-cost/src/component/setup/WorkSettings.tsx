import type {
  Currency,
  WorkSettings as Settings,
} from "../../types/meeting";

interface Props {
  settings: Settings;
  currency: Currency;
  onSettingsChange: (patch: Partial<Settings>) => void;
  onCurrencyChange: (currency: Currency) => void;
}

export function WorkSettings({
  settings,
  currency,
  onSettingsChange,
  onCurrencyChange,
}: Props) {
  return (
    <section className="grid grid-cols-2 border border-black/20 md:grid-cols-4">
      <Field label="CURRENCY">
        <select
          value={currency}
          onChange={(event) =>
            onCurrencyChange(
              event.target.value as Currency,
            )
          }
          className="w-full bg-transparent font-mono text-xs outline-none"
        >
          <option value="NGN">NGN — ₦</option>
          <option value="USD">USD — $</option>
          <option value="GBP">GBP — £</option>
          <option value="EUR">EUR — €</option>
        </select>
      </Field>

      <NumberField
        label="DAYS / WEEK"
        value={settings.daysPerWeek}
        max={7}
        onChange={(daysPerWeek) =>
          onSettingsChange({ daysPerWeek })
        }
      />

      <NumberField
        label="HOURS / DAY"
        value={settings.hoursPerDay}
        max={24}
        onChange={(hoursPerDay) =>
          onSettingsChange({ hoursPerDay })
        }
      />

      <NumberField
        label="WEEKS / YEAR"
        value={settings.weeksPerYear}
        max={53}
        onChange={(weeksPerYear) =>
          onSettingsChange({ weeksPerYear })
        }
      />
    </section>
  );
}

function NumberField({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        min="1"
        max={max}
        value={value}
        onChange={(event) =>
          onChange(
            Math.max(1, Number(event.target.value)),
          )
        }
        className="w-full bg-transparent font-mono outline-none"
      />
    </Field>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="border-r border-b border-black/20 p-4 last:border-r-0 md:border-b-0">
      <span className="mb-3 block font-mono text-[9px] font-semibold tracking-[0.1em]">
        {label}
      </span>

      {children}
    </label>
  );
}