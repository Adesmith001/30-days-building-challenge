import { Trash2 } from "lucide-react";

import { hourlyRate } from "../../lib/calculations";
import { formatMoney } from "../../lib/formatting";
import {
  formatNumberInput,
  parseNumberInput,
} from "../../lib/inputFormatting";
import type {
  Attendee,
  Currency,
  WorkSettings,
} from "../../types/meeting";
import { IconButton } from "../ui/IconButton";

interface Props {
  attendee: Attendee;
  settings: WorkSettings;
  currency: Currency;
  onChange: (patch: Partial<Attendee>) => void;
  onRemove: () => void;
}

export function AttendeeRow({
  attendee,
  settings,
  currency,
  onChange,
  onRemove,
}: Props) {
  const hourly =
    hourlyRate(attendee, settings) * attendee.quantity;

  return (
    <div className="grid grid-cols-[90px_1fr] gap-x-3 border-t border-black/20 p-4 md:min-h-16 md:grid-cols-[minmax(220px,1.5fr)_minmax(170px,1fr)_110px_80px_140px_44px] md:gap-0 md:p-0">
      <MobileLabel>ROLE</MobileLabel>

      <input
        value={attendee.role}
        placeholder="Software Engineer"
        onChange={(event) =>
          onChange({ role: event.target.value })
        }
        className="min-w-0 border-b border-black/20 bg-transparent px-2 outline-none md:border-b-0 md:border-r md:px-4"
      />

      <MobileLabel>SALARY</MobileLabel>

      <input
        type="text"
        inputMode="numeric"
        value={formatNumberInput(attendee.salary)}
        onChange={(event) =>
          onChange({
            salary: parseNumberInput(event.target.value),
          })
        }
        placeholder="12,000,000"
        className="min-w-0 border-b border-black/20 bg-transparent px-2 font-mono outline-none md:border-b-0 md:border-r md:px-4 md:text-right"
      />

      <MobileLabel>PERIOD</MobileLabel>

      <select
        value={attendee.salaryPeriod}
        onChange={(event) =>
          onChange({
            salaryPeriod: event.target
              .value as Attendee["salaryPeriod"],
          })
        }
        className="border-b border-black/20 bg-transparent px-2 font-mono text-[10px] outline-none md:border-b-0 md:border-r"
      >
        <option value="annual">ANNUAL</option>
        <option value="monthly">MONTHLY</option>
      </select>

      <MobileLabel>COUNT</MobileLabel>

      <input
        type="number"
        min="1"
        value={attendee.quantity}
        onChange={(event) =>
          onChange({
            quantity: Math.max(
              1,
              Number(event.target.value) || 1,
            ),
          })
        }
        className="border-b border-black/20 bg-transparent px-2 font-mono outline-none md:border-b-0 md:border-r md:text-center"
      />

      <MobileLabel>HOURLY</MobileLabel>

      <div className="flex items-center border-b border-black/20 px-2 font-mono text-xs md:justify-end md:border-b-0 md:border-r md:px-4">
        {formatMoney(hourly, currency)}
      </div>

      <div className="col-start-2 flex justify-end md:col-auto md:items-center md:justify-center">
        <IconButton
          aria-label={`Remove ${attendee.role}`}
          onClick={onRemove}
        >
          <Trash2 size={16} strokeWidth={1.5} />
        </IconButton>
      </div>
    </div>
  );
}

function MobileLabel({
  children,
}: {
  children: string;
}) {
  return (
    <span className="flex items-center font-mono text-[9px] font-semibold tracking-[0.1em] md:hidden">
      {children}
    </span>
  );
}