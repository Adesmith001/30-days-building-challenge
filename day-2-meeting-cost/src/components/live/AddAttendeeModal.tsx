import { X } from "lucide-react";
import { useState } from "react";

import type {
  AttendeeDraft,
  SalaryPeriod,
} from "../../types/meeting";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { Modal } from "../ui/Modal";
import { SectionLabel } from "../ui/SectionLabel";

interface Props {
  onClose: () => void;
  onAdd: (attendee: AttendeeDraft) => void;
}

export function AddAttendeeModal({
  onClose,
  onAdd,
}: Props) {
  const [draft, setDraft] = useState<AttendeeDraft>({
    role: "",
    salary: 0,
    salaryPeriod: "annual",
    quantity: 1,
  });

  function submit() {
    if (!draft.role.trim() || draft.salary <= 0) {
      return;
    }

    onAdd(draft);
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <header className="mb-8 flex items-start justify-between">
        <div>
          <SectionLabel>LIVE MEETING</SectionLabel>

          <h2 className="mt-2 text-3xl font-bold tracking-[-0.05em]">
            ADD PERSON
          </h2>
        </div>

        <IconButton onClick={onClose}>
          <X size={18} />
        </IconButton>
      </header>

      <Field label="ROLE / NAME">
        <input
          autoFocus
          placeholder="CTO"
          value={draft.role}
          onChange={(event) =>
            setDraft({
              ...draft,
              role: event.target.value,
            })
          }
        />
      </Field>

      <Field label="SALARY">
        <input
          type="number"
          min="0"
          placeholder="30000000"
          value={draft.salary || ""}
          onChange={(event) =>
            setDraft({
              ...draft,
              salary: Number(event.target.value) || 0,
            })
          }
        />
      </Field>

      <div className="grid grid-cols-2 gap-6">
        <Field label="PERIOD">
          <select
            value={draft.salaryPeriod}
            onChange={(event) =>
              setDraft({
                ...draft,
                salaryPeriod:
                  event.target.value as SalaryPeriod,
              })
            }
          >
            <option value="annual">ANNUAL</option>
            <option value="monthly">MONTHLY</option>
          </select>
        </Field>

        <Field label="COUNT">
          <input
            type="number"
            min="1"
            value={draft.quantity}
            onChange={(event) =>
              setDraft({
                ...draft,
                quantity: Math.max(
                  1,
                  Number(event.target.value) || 1,
                ),
              })
            }
          />
        </Field>
      </div>

      <Button
        variant="primary"
        className="mt-4 w-full"
        onClick={submit}
      >
        ADD TO MEETING →
      </Button>
    </Modal>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactElement<{
    className?: string;
  }>;
}) {
  return (
    <label className="mb-6 block font-mono text-[9px] font-semibold tracking-[0.1em]">
      {label}

      <div className="[&>input]:mt-2 [&>input]:h-11 [&>input]:w-full [&>input]:border-b [&>input]:border-black/40 [&>input]:bg-transparent [&>input]:font-mono [&>input]:outline-none [&>select]:mt-2 [&>select]:h-11 [&>select]:w-full [&>select]:border-b [&>select]:border-black/40 [&>select]:bg-transparent [&>select]:font-mono [&>select]:outline-none">
        {children}
      </div>
    </label>
  );
}