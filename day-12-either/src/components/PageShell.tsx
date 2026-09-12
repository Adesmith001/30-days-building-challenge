import type { ReactNode } from "react";
import { AppHeader, Footer } from "./Chrome";

type Props = { children: ReactNode; header?: ReactNode; footer?: boolean; className?: string };

export function PageShell({ children, header, footer = true, className = "" }: Props) {
  return (
    <div className={`flex min-h-screen flex-col bg-[#fafafa] dark:bg-[#0b0b0b] ${className}`}>
      {header ?? <AppHeader />}
      {children}
      {footer && <Footer />}
    </div>
  );
}

export function CenteredMain({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <main className={`mx-auto w-full max-w-[1080px] flex-1 px-4 py-12 md:px-8 md:py-16 ${className}`}>{children}</main>;
}
