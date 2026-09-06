import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose(): void;
}

export function AboutModal({
  open,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 grid
        place-items-center bg-black/30
        p-5
      "
      onClick={onClose}
    >
      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        className="
          w-full max-w-xl
          border-2 border-black
          bg-[#f7f4ef] p-7
          shadow-[7px_7px_0_#171717]
        "
      >
        <div className="flex items-center justify-between border-b border-[#918976] pb-4">
          <strong>DANFO DISPATCHER</strong>

          <button
            onClick={onClose}
            className="cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mt-6 leading-7 text-[#615a4d]">
          A real-time Lagos transport management
          simulation built for Day 06 of a 30-day
          building challenge.
        </p>

        <p className="mt-4 leading-7 text-[#615a4d]">
          Dispatch danfos, manage commuter queues,
          navigate Lagos traffic, survive random
          incidents and protect your Flow multiplier.
        </p>

        <div className="mt-6 bg-[#ffd000] p-4 text-sm font-black">
          HOW LONG CAN YOU KEEP LAGOS MOVING?
        </div>
      </div>
    </div>
  );
}