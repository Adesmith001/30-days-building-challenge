import {
  useEffect,
} from "react";

export function Toast({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(
      onDismiss,
      7000,
    );

    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div
      role="alert"
      className="fixed bottom-20 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-4 border border-ink bg-ink px-4 py-3 text-white shadow-lg"
    >
      <p className="font-mono text-[10px] tracking-[0.1em]">
        {message}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 border-b border-white font-mono text-[9px] tracking-[0.12em]"
      >
        DISMISS
      </button>
    </div>
  );
}
