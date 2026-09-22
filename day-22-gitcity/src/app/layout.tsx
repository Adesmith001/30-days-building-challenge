import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitCity — Your Code. Your Skyline.",
  description: "Turn a year of GitHub activity into an explorable 3D city.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
