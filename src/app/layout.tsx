import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/services/store";

const playfair = Playfair_Display({
  variable: "--font-serif-editorial",
  subsets: ["latin"],
  display: "swap"
});

const inter = Inter({
  variable: "--font-sans-ui",
  subsets: ["latin"],
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Independent Press of Republic (IPR) — Open Research Network",
  description: "A research-native social network and publishing ecosystem combining academic publishing, open peer review, researcher dossiers, and co-author matchmaking.",
  keywords: ["Research", "Academic Publishing", "Peer Review", "Matchmaking", "Open Science", "IPR"]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-[#0D0C0B] text-[#F4F0E8] font-sans selection:bg-[#C85A32]/30">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
