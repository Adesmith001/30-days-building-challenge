import type { Metadata } from "next";

import "@/app/globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "Deep Work OS",
    template: "%s — Deep Work OS",
  },
  description:
    "Protect the work. A local-first operating environment for deep work sessions.",
  applicationName: "Deep Work OS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}