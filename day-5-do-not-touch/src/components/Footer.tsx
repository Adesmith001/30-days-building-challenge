interface Props {
  onReset: () => void;
}

export function Footer({ onReset }: Props) {
  const showRules = () => {
    window.alert(
      "Rule 01: Touch the real button.\nRule 02: Decoy go count as miss.\nRule 03: This button fit dey vex person.",
    );
  };

  const telemetry = () => {
    window.alert(
      "Telemetry archive no dey available. The specimen deny everything.",
    );
  };

  return (
    <footer className="mt-auto flex min-h-14 items-center justify-between border-t border-[#d5d7df] px-6 py-4 font-mono text-[10px] tracking-[0.14em] text-[#62697e]">
      <span className="hidden md:block">
        DAY 05 / 30 BUILDS IN 30 DAYS · SMALL ARCADE
        PALAVA
      </span>

      <span className="md:hidden">DAY 05 / 30</span>

      <div className="flex items-center gap-5">
        <button
          onClick={showRules}
          className="hover:text-[#1248ff]"
        >
          RULES
        </button>

        <button
          onClick={onReset}
          className="hover:text-[#1248ff]"
        >
          RESET AM
        </button>

        <button
          onClick={telemetry}
          className="hidden underline underline-offset-4 hover:text-[#1248ff] sm:block"
        >
          TELEMETRY FILE
        </button>
      </div>
    </footer>
  );
}