import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ClientLayout } from './ClientLayout';
import { initializeNotificationSystem } from '@/lib/notification-init';

// Configuración optimizada de fuentes
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  preload: true,
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false, // Solo se carga cuando se necesita
});

export const metadata: Metadata = {
  title: 'Fidelita - Sistema de Gestión de Socios',
  description: 'Plataforma integral para la gestión de socios, comercios y beneficios',
  keywords: ['fidelidad', 'socios', 'comercios', 'beneficios', 'gestión'],
  authors: [{ name: 'Fidelita Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6366f1' },
    { media: '(prefers-color-scheme: dark)', color: '#4f46e5' }
  ],
};

// Inicializar sistema de notificaciones en el servidor
initializeNotificationSystem();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} ${plusJakarta.variable} ${playfair.variable} font-sans antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}