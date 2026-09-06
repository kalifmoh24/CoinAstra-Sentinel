import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const geistSans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "CoinAstra Sentinel — Know Before You Sign",
  description:
    "The security intelligence layer for crypto. Deterministic risk scoring with evidence-backed AI explanation.",
  metadataBase: new URL(appUrl),
  applicationName: "CoinAstra Sentinel",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sentinel",
  },
  formatDetection: { telephone: false },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
    { media: "(prefers-color-scheme: light)", color: "#030712" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen overflow-x-hidden font-sans">
        <AppShell>
          <main className="pb-20 lg:pb-0">{children}</main>
          <footer className="mb-16 border-t border-white/5 px-4 py-5 text-xs text-slate-500 lg:mb-0 sm:px-6">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-slate-500">CoinAstra Sentinel © 2025</p>
              <p className="order-first text-center text-slate-600 lg:order-none">
                Security Intelligence for Crypto
              </p>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a href="/api-integrations" className="hover:text-slate-300">
                  Documentation
                </a>
                <a href="/api-integrations" className="hover:text-slate-300">
                  API
                </a>
                <a href="/pricing" className="hover:text-slate-300">
                  Support
                </a>
                <span className="text-slate-600">Privacy</span>
                <span className="text-slate-600">Terms</span>
              </div>
            </div>
          </footer>
        </AppShell>
        <BottomNav />
      </body>
    </html>
  );
}
