import type { Metadata } from "next";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const metadata: Metadata = {
  title: "Nova | Visual Task Management",
  description: "Plan projects, organize tasks, and collaborate visually with a modern workflow system built for fast-moving teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

export { metadata };
