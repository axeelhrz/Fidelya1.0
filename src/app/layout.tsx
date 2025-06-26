import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/providers/ToastProvider";

export const metadata: Metadata = {
  title: "Fidelya - El futuro de los programas de fidelidad",
  description: "Conecta asociaciones, comercios y socios en un ecosistema inteligente potenciado por IA para maximizar la fidelización y el crecimiento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body 
        className="antialiased"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}