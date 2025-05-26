import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import localFont from 'next/font/local';
import { ThemeProvider } from "@/components/theme-provider";
import { AIChatbot } from "@/components/ai-chatbot";
import "./globals.css";

// Configuración de fuentes
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const satoshi = localFont({
  src: [
    {
      path: '../fonts/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: "--font-satoshi",
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
      <body className={`${spaceGrotesk.variable} ${satoshi.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <AIChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}