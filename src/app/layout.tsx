import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Casino Escolar - Gestión de Pedidos Escolares",
  description: "Plataforma digital para gestionar pedidos de almuerzos y colaciones escolares de forma rápida, segura y organizada.",
  keywords: "casino escolar, pedidos escolares, almuerzos, colaciones, gestión educativa",
  authors: [{ name: "Casino Escolar" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${inter.variable} ${dmSans.variable} antialiased font-inter bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}