import { ChevronRight } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
};

export function OptionRow({
  title,
  description,
  selected = false,
  onClick,
}: Props) {
  return (
    <button
      className={[
        "group flex w-full items-center",
        "justify-between rounded-xl border",
        "bg-white px-5 py-4 text-left",
        "transition-all duration-150",
        selected
          ? "border-[#111111]"
          : "border-[#e4e4e7] hover:border-[#a1a1aa]",
      ].join(" ")}
      onClick={onClick}
    >
      <div>
        <p className="text-[14px] font-medium">
          {title}
        </p>

        {description && (
          <p className="mt-1 text-[11px] text-[#a1a1aa]">
            {description}
          </p>
        )}
      </div>

      <ChevronRight
        className={[
          "h-4 w-4 transition-transform",
          "text-[#a1a1aa]",
          "group-hover:translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
}