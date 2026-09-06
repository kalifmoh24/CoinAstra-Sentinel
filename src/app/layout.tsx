import type { Metadata, Viewport } from "next";
import { Nav } from "@/components/Nav";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

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
    { media: "(prefers-color-scheme: dark)", color: "#05070d" },
    { media: "(prefers-color-scheme: light)", color: "#05070d" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <Nav />
        <main className="pb-20 sm:pb-0">{children}</main>
        <footer className="mb-16 border-t border-white/5 py-8 text-center text-xs text-slate-600 sm:mb-0">
          © {new Date().getFullYear()} CoinAstra · Sentinel Phase 2 · coinastra.io
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
