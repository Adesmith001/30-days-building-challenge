import { useEffect } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AboutPanel({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex justify-end bg-[#171717]/45"
      onMouseDown={onClose}
      role="presentation"
    >
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="h-full w-full max-w-lg overflow-y-auto border-l border-[#171717] bg-[#f8f6f3] p-7 md:p-10"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
      >
        <header className="flex items-start justify-between">
          <div>
            <div className="font-mono text-xs font-semibold tracking-[0.16em] text-[#1248ff]">
              DAY 05 / 30
            </div>

            <h2
              id="about-title"
              className="mt-2 text-4xl font-black tracking-[-0.06em]"
            >
              NO TOUCH AM
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close about panel"
            className="border border-[#171717] p-2 transition-colors hover:bg-[#171717] hover:text-white"
          >
            <X size={18} />
          </button>
        </header>

        <p className="mt-8 text-xl leading-8 tracking-[-0.02em]">
          Ten levels of button chase with Nigerian flavour. Button no wan
          cooperate, so calm down and catch am.
        </p>

        <AboutSection title="HOW E DEY WORK">
          Move your cursor catch the real button. E go dodge, teleport, shrink,
          and bring decoys as the levels dey increase.
        </AboutSection>

        <AboutSection title="RULE WEY DEY">
          Speed no be everything. Touch the real button, avoid the decoys, and
          no let impatience spoil your streak.
        </AboutSection>

        <AboutSection title="YOUR DATA">
          Your scores stay for this browser. Personal bests save for here and
          never comot from the lab.
        </AboutSection>

        <AboutSection title="NA WETIN BUILD AM">
          <span className="font-mono text-sm">
            React · TypeScript · Tailwind CSS · Motion
          </span>
        </AboutSection>
      </motion.aside>
    </motion.div>
  );
}

function AboutSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-9 border-t border-[#171717]/20 pt-6">
      <div className="font-mono text-xs font-semibold tracking-[0.16em] text-[#1248ff]">
        {title}
      </div>

      <div className="mt-4 leading-7 text-[#626775]">{children}</div>
    </section>
  );
}
