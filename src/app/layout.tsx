import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Casino Escolar - Gestión Inteligente de Alimentación Escolar",
  description: "Plataforma digital para la gestión de alimentación escolar. Nutrición, organización y bienestar para la comunidad educativa.",
  keywords: "casino escolar, alimentación escolar, gestión educativa, nutrición, menús escolares, bienestar estudiantil",
  authors: [{ name: "Casino Escolar" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#f8fafc",
  openGraph: {
    title: "Casino Escolar - Gestión Inteligente de Alimentación Escolar",
    description: "Plataforma digital para la gestión de alimentación escolar. Nutrición, organización y bienestar para la comunidad educativa.",
    type: "website",
    locale: "es_ES",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${playfairDisplay.variable} antialiased font-inter bg-education-gradient text-education-primary`}
      >
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}