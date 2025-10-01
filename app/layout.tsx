import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Adoption Score - How AI Native Are You?",
  description: "Discover your AI adoption level through an adaptive assessment. Find out how deeply you've integrated AI into your life and work.",
  openGraph: {
    title: "AI Adoption Score - How AI Native Are You?",
    description: "Discover your AI adoption level through an adaptive assessment.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Adoption Score - How AI Native Are You?",
    description: "Discover your AI adoption level through an adaptive assessment.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
