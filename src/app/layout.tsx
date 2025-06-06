import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Casino Escolar - Gestión Inteligente de Alimentación Escolar",
  description: "Plataforma digital para la gestión de alimentación escolar. Nutrición, organización y bienestar para la comunidad educativa.",
  keywords: "casino escolar, alimentación escolar, gestión educativa, nutrición, menús escolares",
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
        className={`${inter.variable} ${playfairDisplay.variable} antialiased font-inter`}
      >
        {children}
      </body>
    </html>
  );
}