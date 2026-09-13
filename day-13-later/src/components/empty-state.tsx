import { Button } from "./ui/button";

type Props = {
  onAdd: () => void;
};

export function EmptyState({
  onAdd,
}: Props) {
  return (
    <div
      className={[
        "flex min-h-[55vh]",
        "flex-col items-center",
        "justify-center",
        "text-center",
      ].join(" ")}
    >
      <h2
        className={[
          "text-[22px]",
          "font-medium",
          "tracking-[-0.03em]",
        ].join(" ")}
      >
        Nothing waiting for later.
      </h2>

      <p className="mt-2 text-[13px] text-[#71717a]">
        Suspiciously productive.
      </p>

      <Button
        className="mt-7"
        onClick={onAdd}
      >
        + Add something
      </Button>
    </div>
  );
}