import type {
  ReactNode,
} from "react";

interface Props {
  open: boolean;

  onClose:
    () => void;

  children:
    ReactNode;

  width?: string;
}

export function Modal({
  open,
  onClose,
  children,
  width = "max-w-2xl",
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        grid
        place-items-center
        bg-black/20
        p-4
      "
      onMouseDown={
        onClose
      }
    >
      <div
        className={`
          max-h-[88vh]
          w-full
          overflow-y-auto
          border
          border-ink
          bg-paper
          p-6
          md:p-8
          ${width}
        `}
        onMouseDown={(
          event,
        ) =>
          event.stopPropagation()
        }
      >
        <div
          className="
            mb-6
            flex
            justify-end
          "
        >
          <button
            onClick={
              onClose
            }
            className="
              font-mono
              text-[10px]
              tracking-[0.16em]
              hover:underline
            "
          >
            CLOSE ×
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}