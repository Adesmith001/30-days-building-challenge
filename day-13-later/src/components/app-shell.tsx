import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onLogoClick?: () => void;
  right?: ReactNode;
  footer?: boolean;
};

export function AppShell({
  children,
  onLogoClick,
  right,
  footer = true,
}: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f6]">
      <header className="border-b border-[#e9e8e5]">
        <div
          className={[
            "mx-auto flex w-full max-w-[700px]",
            "items-center justify-between",
            "px-5 py-6",
          ].join(" ")}
        >
          <button
            className="text-[18px] font-medium tracking-[-0.03em]"
            onClick={onLogoClick}
          >
            Later.
          </button>

          {right}
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {children}
      </main>

      {footer && (
        <footer className="border-t border-[#e9e8e5]">
          <div
            className={[
              "mx-auto w-full max-w-[700px]",
              "px-5 py-7",
            ].join(" ")}
          >
            <p className="text-[12px] text-[#71717a]">
              Later isn't a real time.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}