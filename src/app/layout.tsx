// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AMU Monitoring - Prototype",
  description: "UI and data-capture template for an AMU monitoring system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-background text-foreground bg-[linear-gradient(180deg,#071026_0%,#061428_100%)]`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// Reusable Header Component
const Header = () => (
  <header className="flex items-center justify-between border-b border-white/5 px-5 py-4">
    <div className="flex items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
        <rect width="24" height="24" rx="5" fill="#00a3ff" />
        <path d="M6 12c1.333-2 4-4 6-4s4.667 2 6 4c-1.333 2-4 4-6 4s-4.667-2-6-4z" fill="white" opacity="0.95" />
      </svg>
      <h1 className="text-lg font-semibold">AMU Monitoring — Prototype</h1>
      <div className="ml-2 text-sm text-muted">India — Aquaculture module</div>
    </div>
    <div className="text-sm text-muted">Offline-ready • Data stored locally</div>
  </header>
);

// Reusable Footer Component
const Footer = () => (
  <footer className="p-5 text-center text-sm text-muted">
    Prototype — not for production. Use this as a UI + data-capture template for an AMU monitoring system.
  </footer>
);```
