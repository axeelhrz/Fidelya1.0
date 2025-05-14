import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import ThemeProvider from "@/components/layout/ThemeProvider";
import "./globals.css";

// Import fonts
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReelGenius | AI-Powered Viral Video Generator",
  description: "Generate viral Reels and TikToks automatically with AI. Turn your ideas into engaging videos in seconds.",
  keywords: "AI video generator, TikTok creator, Reels maker, viral videos, content creation, social media",
  authors: [{ name: "ReelGenius Team" }],
  openGraph: {
    title: "ReelGenius | AI-Powered Viral Video Generator",
    description: "Generate viral Reels and TikToks automatically with AI. Turn your ideas into engaging videos in seconds.",
    url: "https://reelgenius.com",
    siteName: "ReelGenius",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ReelGenius - AI Video Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="antialiased">
        <ThemeProvider>
     {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
