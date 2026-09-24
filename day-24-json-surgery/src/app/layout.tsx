import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "JSON Surgery",
  description: "A local-first JSON transformation workbench.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
