import type { AnswerOption } from "../types/game";

type Props = {
  options: AnswerOption[];
  selected: string | null;
  disabled: boolean;
  onSelect: (option: AnswerOption) => void;
};

export function AnswerGrid({
  options,
  selected,
  disabled,
  onSelect,
}: Props) {
  const letters = ["A", "B", "C", "D"];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {options.map((option, index) => (
        <button
          key={option.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(option)}
          className={[
            "flex min-h-32 items-center justify-between border p-6 text-left transition",
            selected === option.label
              ? "border-blue-700 bg-blue-50"
              : "border-slate-300 bg-white hover:border-neutral-900",
            disabled ? "cursor-default" : "",
          ].join(" ")}
        >
          <span className="font-mono text-xs text-slate-500">
            {letters[index]}
          </span>

          <span className="font-mono text-2xl md:text-3xl">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}