import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClose: () => void;
}

export function Modal({
  children,
  onClose,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-lg border border-black bg-[#f7f7f7] p-7"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}