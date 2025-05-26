import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
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
          <ThemeProvider theme={theme}>
            <CssBaseline />
        {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
