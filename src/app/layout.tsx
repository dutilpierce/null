import type { Metadata } from "next";
import { Barlow_Condensed, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { ScanlineOverlay } from "@/components/ScanlineOverlay";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getPublicSiteUrl } from "@/lib/env";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

function metadataBase(): URL {
  try {
    return new URL(getPublicSiteUrl());
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  title: {
    default: "NULL//DIVISION",
    template: "%s // NULL//DIVISION",
  },
  description: "Autonomous clothing system. Limited iterations. No restocks.",
  metadataBase: metadataBase(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[#050505] font-[family-name:var(--font-sans)] text-[#F5F5F5]">
        <div className="noise-layer" aria-hidden />
        <ScanlineOverlay />
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
