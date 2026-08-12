import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/services/store";
import { LenisProvider } from "@/components/shell/LenisProvider";
import { GlobalCursor } from "@/components/shell/GlobalCursor";

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
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <head>
        {/* KaTeX CDN for Math Rendering */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIBMW3Zksd/cgGfpO2lE8t2u15d31Jq5/Z11X6q9E1L2EaaA7n97Y1M"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full bg-black text-white cursor-none selection:bg-white selection:text-black">
        <AppProvider>
          <LenisProvider>
            <GlobalCursor />
            {children}
          </LenisProvider>
        </AppProvider>
      </body>
    </html>
  );
}
