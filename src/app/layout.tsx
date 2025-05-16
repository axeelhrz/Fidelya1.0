import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// Configuración de fuentes
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
      <body className={`${inter.variable} ${plusJakartaSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
