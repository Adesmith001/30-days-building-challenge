import { X } from "lucide-react";

type Props = {
  open: boolean;
  sound: boolean;
  onSoundChange: (value: boolean) => void;
  onClose: () => void;
};

export function SettingsModal({
  open,
  sound,
  onSoundChange,
  onClose,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-5">
      <div className="w-full max-w-md border border-slate-300 bg-[#f8f7f5] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Settings
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center"
            aria-label="Close settings"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between border-y border-slate-300 py-5">
          <div>
            <p className="font-medium">
              Sound
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Subtle game feedback.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSoundChange(!sound)}
            className={[
              "relative h-7 w-12 rounded-full transition",
              sound
                ? "bg-blue-700"
                : "bg-slate-300",
            ].join(" ")}
          >
            <span
              className={[
                "absolute top-1 size-5 rounded-full bg-white transition",
                sound ? "left-6" : "left-1",
              ].join(" ")}
            />
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full bg-neutral-900 py-4 font-mono text-xs text-white"
        >
          DONE
        </button>
      </div>
    </div>
  );
}