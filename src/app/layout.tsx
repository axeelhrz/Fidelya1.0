import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// Configuración de fuentes
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Axel Hernández | Desarrollo de plataformas digitales de alto impacto",
  description: "Desarrollo plataformas que venden más y mejor. Soluciones digitales pensadas para convertir visitantes en clientes.",
  keywords: ["desarrollo web", "diseño web", "conversión", "plataformas digitales", "Next.js", "React"],
  authors: [{ name: "Axel Hernández" }],
  creator: "Axel Hernández",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://axel.dev",
    siteName: "Axel Hernández",
    title: "Axel Hernández | Desarrollo de plataformas digitales de alto impacto",
    description: "Desarrollo plataformas que venden más y mejor. Soluciones digitales pensadas para convertir visitantes en clientes.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Axel Hernández",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Axel Hernández | Desarrollo de plataformas digitales de alto impacto",
    description: "Desarrollo plataformas que venden más y mejor. Soluciones digitales pensadas para convertir visitantes en clientes.",
    images: ["/og-image.jpg"],
    creator: "@axelhernandez",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {/* Temporalmente comentado hasta resolver problemas de build */}
          {/* <AIChatbot /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}