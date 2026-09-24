import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import {
  ThemeProvider,
} from "@/components/providers/theme-provider";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: siteUrl,

  title: {
    default:
      "Architecture Interviewer",

    template:
      "%s Â· Architecture Interviewer",
  },

  description:
    "Defend your design against an AI architecture interviewer.",

  icons: {
    icon: [
      {
        url: "/brand/architecture-mark.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/brand/architecture-mark.svg",
  },

  openGraph: {
    title: "Architecture Interviewer",
    description: "Defend your design against an AI architecture interviewer.",
    images: [
      {
        url: "/brand/architecture-og.svg",
        width: 1200,
        height: 630,
        alt: "Architecture Interviewer — defend your design.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Architecture Interviewer",
    description: "Defend your design against an AI architecture interviewer.",
    images: ["/brand/architecture-og.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={[
          geist.variable,
          geistMono.variable,
          "antialiased",
        ].join(" ")}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
