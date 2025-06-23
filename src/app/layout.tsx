import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/providers/ToastProvider";

export const metadata: Metadata = {
  title: "Fidelya - Programa de Fidelidad",
  description: "Plataforma de gestión de programas de fidelidad para asociaciones y comercios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-body antialiased">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}