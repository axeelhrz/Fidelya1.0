import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from './components/ThemeRegistry';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MenuQR - Gestión de Menú Digital",
  description: "Aplicación para gestionar menús digitales con QR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeRegistry>
        {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
