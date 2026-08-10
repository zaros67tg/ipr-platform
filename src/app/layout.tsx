import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/services/store";
import { LenisProvider } from "@/components/shell/LenisProvider";
import { GlobalCursor } from "@/components/shell/GlobalCursor";
import { ThemeProvider } from "@/components/shell/ThemeProvider";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Independent Press of Republic — Open Research Network",
  description: "A research-native editorial platform combining open publishing, peer review, researcher matchmaking, and intellectual discourse.",
  keywords: ["Research", "Academic Publishing", "Peer Review", "Matchmaking", "Open Science", "IPR"],
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
      className={`${cormorant.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full cursor-none selection:bg-current selection:text-background">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AppProvider>
            <LenisProvider>
              <GlobalCursor />
              {children}
            </LenisProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
