"use client";

import {
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

export function Modal({
  open,
  title,
  children,
  onClose,
  className,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 z-50
        grid place-items-center
        bg-black/20 p-4
      "
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "w-full max-w-md",
          "rounded-lg border",
          "bg-background p-5",
          "shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
          className,
        )}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div
          className="
            mb-5 flex
            items-center
            justify-between
          "
        >
          <h2
            className="
              text-sm font-medium
              tracking-wide
            "
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-md p-1
              text-muted
              hover:bg-surface-hover
              hover:text-foreground
            "
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {children}
      </section>
    </div>
  );
}
