import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeRegistry from './components/ThemeRegistry';
import { AuthProvider } from '../contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MenuQR - Menú Digital',
  description: 'Sistema de menú digital con código QR',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeRegistry>
          <AuthProvider>
          {children}
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}