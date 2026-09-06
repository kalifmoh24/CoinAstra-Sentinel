import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoinAstra Sentinel — Know Before You Sign",
  description: "The security intelligence layer for crypto. Deterministic risk scoring with evidence-backed AI explanation.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <Nav />
        <main>{children}</main>
        <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} CoinAstra · Sentinel Phase 1 MVP · coinastra.io
        </footer>
      </body>
    </html>
  );
}
