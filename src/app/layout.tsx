// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // A great default font
import "./globals.css";

// Configure the font
const inter = Inter({ subsets: ["latin"] });

// Set up metadata for your application (good for SEO)
export const metadata: Metadata = {
  title: "SmallBiz ERP",
  description: "ERP Frontend for a small company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/*
        The <body> tag is essential. The inter.className applies the font.
        Your `children` (which will be your pages and other layouts)
        are rendered inside the body.
      */}
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}