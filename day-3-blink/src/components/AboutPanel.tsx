import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AboutPanel({ open, onClose }: Props) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        className="scrollbar-none h-full w-full max-w-lg overflow-y-auto border-l-4 border-blue-700 bg-[#f8f7f5] p-7 shadow-2xl md:p-10"
        style={{ scrollbarWidth: "none" }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-slate-500">
              DAY 03 / 30
            </p>
            <h2
              id="about-title"
              className="mt-2 text-4xl font-bold tracking-tight"
            >
              BLINK
            </h2>
            <div className="mt-4 h-1 w-16 bg-blue-700" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center"
            aria-label="Close about panel"
          >
            <X className="size-5" />
          </button>
        </header>

        <p className="mt-8 text-xl leading-8">
          A fast visual memory test for the details your attention catches in an instant.
        </p>

        <div className="mt-8 grid grid-cols-3 border-y border-slate-300 py-4 font-mono text-xs">
          <div>
            <span className="block text-slate-500">ROUNDS</span>
            <span className="mt-1 block text-lg text-neutral-900">10</span>
          </div>
          <div>
            <span className="block text-slate-500">MODES</span>
            <span className="mt-1 block text-lg text-neutral-900">02</span>
          </div>
          <div>
            <span className="block text-slate-500">TRACKS</span>
            <span className="mt-1 block text-lg text-neutral-900">04</span>
          </div>
        </div>

        <AboutSection title="HOW IT WORKS">
          Study a short visual scene, then answer a question about what you saw. Every round gets faster when you are correct and slower when you miss.
        </AboutSection>

        <AboutSection title="SCORING">
          Speed and accuracy work together. Correct answers build your streak, while shorter successful exposures improve your visual threshold.
        </AboutSection>

        <AboutSection title="RECORDS">
          Completed sessions stay in this browser. Review your scores, category accuracy, fastest latency, and every round&apos;s exposure time from the Records view.
        </AboutSection>

        <AboutSection title="CONTROLS">
          <div className="grid grid-cols-[80px_1fr] gap-3 font-mono text-xs">
            <kbd className="border border-black px-2 py-1">1–4</kbd>
            <span>Answer an option</span>
            <kbd className="border border-black px-2 py-1">CLICK</kbd>
            <span>Select an answer or continue</span>
          </div>
        </AboutSection>

        <AboutSection title="PRIVACY">
          Gameplay data and records remain local to this browser. Nothing is sent to a server.
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
      <p className="font-mono text-xs tracking-[0.18em] text-slate-500">
        {title}
      </p>
      <div className="mt-4 leading-7 text-neutral-600">{children}</div>
    </section>
  );
}