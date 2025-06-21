import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from '@/lib/theme';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Centro Psicológico - Dashboard CEO",
  description: "Sistema de gestión integral para centros psicológicos - Plataforma profesional para administración clínica",
  keywords: "centro psicológico, dashboard, gestión clínica, administración, salud mental",
  authors: [{ name: "Centro Psicológico" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2463EB',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-inter antialiased`}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}