"use client";

import {
  useState,
} from "react";

import {
  Download,
  FileText,
  GitBranch,
  MoreHorizontal,
  Pencil,
  ScanSearch,
  Trash2,
} from "lucide-react";

interface Props {
  disabled?: boolean;

  onRename: () => void;
  onReview: () => void;
  onDiagram: () => void;
  onExport: () => void;
  onDelete: () => void;

  onAssumptions:
    () => void;

  onDecisions:
    () => void;

  onRisks:
    () => void;

  onContradictions:
    () => void;
}

export function ConversationMenu({
  disabled,
  onRename,
  onReview,
  onDiagram,
  onExport,
  onDelete,
  onAssumptions,
  onDecisions,
  onRisks,
  onContradictions,
}: Props) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const actions = [
    {
      label: "RENAME",
      icon: Pencil,
      action: onRename,
    },

    {
      label:
        "GENERATE REVIEW",
      icon: FileText,
      action: onReview,
    },

    {
      label:
        "GENERATE DIAGRAM",
      icon: GitBranch,
      action: onDiagram,
    },

    {
      label:
        "VIEW ASSUMPTIONS",
      icon: ScanSearch,
      action:
        onAssumptions,
    },

    {
      label:
        "VIEW DECISIONS",
      icon: ScanSearch,
      action:
        onDecisions,
    },

    {
      label: "VIEW RISKS",
      icon: ScanSearch,
      action:
        onRisks,
    },

    {
      label:
        "VIEW CONFLICTS",
      icon: ScanSearch,
      action:
        onContradictions,
    },

    {
      label:
        "EXPORT MARKDOWN",
      icon: Download,
      action: onExport,
    },

    {
      label: "DELETE",
      icon: Trash2,
      action: onDelete,
      destructive: true,
    },
  ];

  return (
    <div
      className="relative"
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          setOpen(
            (value) =>
              !value,
          )
        }
        className="
          grid size-8
          place-items-center
          rounded-md
          hover:bg-surface-hover
          disabled:opacity-40
        "
        aria-label="Conversation menu"
      >
        <MoreHorizontal
          size={17}
        />
      </button>

      {open && (
        <div
          className="
            absolute right-0
            top-10 z-30
            w-52
            rounded-lg border
            bg-background
            p-1.5
            shadow-[0_10px_35px_rgba(0,0,0,0.09)]
          "
        >
          {actions.map(
            ({
              label,
              icon: Icon,
              action,
              destructive,
            }) => (
              <button
                type="button"
                key={label}
                onClick={() => {
                  setOpen(
                    false,
                  );

                  action();
                }}
                className={[
                  "flex w-full",
                  "items-center",
                  "gap-2",
                  "rounded-md",
                  "px-2 py-2",
                  "text-left",
                  "text-[11px]",
                  "tracking-wide",
                  "hover:bg-surface-hover",

                  destructive
                    ? "text-destructive"
                    : "",
                ].join(" ")}
              >
                <Icon
                  size={13}
                />

                {label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
