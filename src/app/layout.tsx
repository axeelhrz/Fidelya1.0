import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientLayout } from './ClientLayout';
import { initializeNotificationSystem } from '@/lib/notification-init';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fidelita - Sistema de Gestión de Socios',
  description: 'Plataforma integral para la gestión de socios, comercios y beneficios',
};

// Inicializar sistema de notificaciones en el servidor
initializeNotificationSystem();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}