import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShipCheck — Before you ship, prove it's ready.",
  description:
    "Repository-aware release preflight generated from the code you changed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}