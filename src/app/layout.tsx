'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClientLayout } from './ClientLayout';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fidelita - Plataforma de Fidelización Inteligente",
  description: "La plataforma que conecta asociaciones, comercios y socios en un ecosistema único de beneficios mutuos. Fidelización moderna y eficaz.",
  keywords: ["fidelización", "loyalty", "comercios", "asociaciones", "socios", "beneficios"],
  authors: [{ name: "Fidelita Team" }],
  creator: "Fidelita",
  publisher: "Fidelita",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://fidelita.com"),
  openGraph: {
    title: "Fidelita - Plataforma de Fidelización Inteligente",
    description: "Conecta asociaciones, comercios y socios en un ecosistema único de beneficios mutuos.",
    url: "https://fidelita.com",
    siteName: "Fidelita",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fidelita - Plataforma de Fidelización Inteligente",
    description: "Conecta asociaciones, comercios y socios en un ecosistema único de beneficios mutuos.",
    creator: "@fidelita",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}