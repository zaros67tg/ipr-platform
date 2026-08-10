import type { Metadata } from "next";
import { EB_Garamond, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/services/store";
import { LenisProvider } from "@/components/shell/LenisProvider";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
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
      className={`${ebGaramond.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="min-h-full bg-black text-white font-ui selection:bg-white selection:text-black">
        <AppProvider>
          <LenisProvider>
            {children}
          </LenisProvider>
        </AppProvider>
      </body>
    </html>
  );
}
