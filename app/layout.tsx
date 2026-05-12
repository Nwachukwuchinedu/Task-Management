import type { Metadata } from "next";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
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
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="antialiased bg-background text-text-main">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export { metadata };
