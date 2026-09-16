export type CompareTab =
  | "overview"
  | "money"
  | "time"
  | "break-even"
  | "what-if";

const tabs: {
  id: CompareTab;
  label: string;
}[] = [
  {
    id: "overview",
    label: "OVERVIEW",
  },
  {
    id: "money",
    label: "MONEY",
  },
  {
    id: "time",
    label: "TIME",
  },
  {
    id: "break-even",
    label: "BREAK-EVEN",
  },
  {
    id: "what-if",
    label: "WHAT IF",
  },
];

export default function CompareNav({
  active,
  onChange,
}: {
  active: CompareTab;

  onChange:
    (tab: CompareTab) => void;
}) {
  return (
    <nav
      className="
        border-b
        border-line
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-7xl
          gap-6
          overflow-x-auto
          px-5
          md:px-10
        "
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              onChange(tab.id)
            }
            className={`
              whitespace-nowrap
              border-b-2
              py-4
              text-[11px]
              font-semibold
              tracking-[0.08em]
              ${
                active === tab.id
                  ? "border-ink text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }
            `}
          >
            {active === tab.id && (
              <span
                className="
                  mr-2
                  inline-block
                  h-1.5
                  w-1.5
                  bg-ink
                "
              />
            )}

            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}