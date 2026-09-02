import { X } from "lucide-react";

import { IconButton } from "../ui/IconButton";
import { SectionLabel } from "../ui/SectionLabel";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AboutPanel({
  open,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
      onMouseDown={onClose}
    >
      <aside
        className="h-full w-full max-w-lg overflow-y-auto border-l border-black bg-[#f7f7f7] p-7 md:p-10"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between">
          <div>
            <SectionLabel>DAY 02 / 30</SectionLabel>

            <h2 className="mt-2 text-4xl font-bold tracking-[-0.06em]">
              MEETING COST
            </h2>
          </div>

          <IconButton onClick={onClose}>
            <X size={18} />
          </IconButton>
        </header>

        <p className="mt-8 text-xl leading-8 tracking-[-0.02em]">
          A live calculator showing how much money a
          meeting consumes as it happens.
        </p>

        <AboutSection title="HOW IT WORKS">
          Salary values are converted into approximate
          employee costs based on configurable working
          hours. Meeting time comes from real timestamps
          rather than incrementing a counter.
        </AboutSection>

        <AboutSection title="PRIVACY">
          Salary and meeting data stay in the browser.
          Completed meeting history is stored using
          LocalStorage.
        </AboutSection>

        <AboutSection title="KEYBOARD SHORTCUTS">
          <div className="grid grid-cols-[80px_1fr] gap-3 font-mono text-xs">
            <kbd className="border border-black px-2 py-1">
              SPACE
            </kbd>
            <span>Pause / resume</span>

            <kbd className="border border-black px-2 py-1">
              E
            </kbd>
            <span>End meeting</span>

            <kbd className="border border-black px-2 py-1">
              F
            </kbd>
            <span>Focus mode</span>

            <kbd className="border border-black px-2 py-1">
              H
            </kbd>
            <span>History</span>
          </div>
        </AboutSection>

        <AboutSection title="BUILT WITH">
          <span className="font-mono text-sm">
            React · TypeScript · Tailwind CSS · Motion
          </span>
        </AboutSection>
      </aside>
    </div>
  );
}

function AboutSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-9 border-t border-black/20 pt-6">
      <SectionLabel>{title}</SectionLabel>

      <div className="mt-4 leading-7 text-neutral-600">
        {children}
      </div>
    </section>
  );
}