import type {
  ReasoningStage,
} from "../schemas/ai";

const steps: {
  key: ReasoningStage;
  label: string;
}[] = [
  {
    key: "define",
    label: "DEFINE",
  },

  {
    key: "narrow",
    label: "NARROW",
  },

  {
    key: "resolve",
    label: "RESOLVE",
  },
];

export function BottomRail({
  stage,
}: {
  stage: ReasoningStage;
}) {
  const active =
    stage === "question" ||
    stage === "test"
      ? "narrow"
      : stage;

  return (
    <footer
      className="
        sticky
        bottom-0
        border-t
        border-rule
        bg-paper/95
        px-5
        py-3
        backdrop-blur-sm
        md:px-8
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-[1400px]
          justify-between
          font-mono
          text-[9px]
          tracking-[0.18em]
          text-graphite
          md:text-[10px]
        "
      >
        {steps.map(
          (step) => (
            <span
              key={
                step.key
              }
              className={
                active ===
                step.key
                  ? `
                    border-b-2
                    border-ink
                    pb-1
                    text-ink
                  `
                  : "pb-1"
              }
            >
              {step.key ===
              "define"
                ? "◉"
                : step.key ===
                    "narrow"
                  ? "≋"
                  : "✓"}{" "}
              {step.label}
            </span>
          ),
        )}
      </div>
    </footer>
  );
}