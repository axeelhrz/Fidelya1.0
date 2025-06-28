'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { NotificationsList } from '@/components/socio/NotificationsList';

// Mock notifications
const mockNotifications = [
  {
    id: '1',
    title: 'Nuevo beneficio disponible',
    message: 'Tienda Fashion tiene un 20% de descuento especial para ti. Válido hasta fin de mes.',
    type: 'info' as const,
    priority: 'medium' as const,
    status: 'unread' as const,
    category: 'membership' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    actionUrl: '/dashboard/socio/beneficios',
    actionLabel: 'Ver Beneficio',
    read: false
  },
  {
    id: '2',
    title: 'Recordatorio de vencimiento',
    message: 'Tu membresía vence en 30 días. Renueva para seguir disfrutando de todos los beneficios exclusivos.',
    type: 'warning' as const,
    priority: 'high' as const,
    status: 'unread' as const,
    category: 'payment' as const,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    actionUrl: '/dashboard/socio/perfil',
    actionLabel: 'Renovar Ahora',
    read: false
  },
  {
    id: '3',
    title: 'Beneficio usado exitosamente',
    message: 'Has usado tu descuento del 15% en Café Central. Ahorraste $450 en tu compra.',
    type: 'success' as const,
    priority: 'low' as const,
    status: 'read' as const,
    category: 'general' as const,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true
  },
  {
    id: '4',
    title: 'Evento especial próximamente',
    message: 'No te pierdas el evento de descuentos especiales del próximo fin de semana. Hasta 50% OFF en comercios seleccionados.',
    type: 'announcement' as const,
    priority: 'medium' as const,
    status: 'read' as const,
    category: 'event' as const,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true
  }
];

export default function SocioNotificacionesPage() {
  const handleMarkAsRead = (id: string) => {
    console.log('Marking notification as read:', id);
    // Aquí iría la lógica para marcar como leída
  };

  const handleMarkAllAsRead = () => {
    console.log('Marking all notifications as read');
    // Aquí iría la lógica para marcar todas como leídas
  };

  return (
    <DashboardLayout
      activeSection="notificaciones"
      sidebarComponent={SocioSidebar}
    >
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notificaciones</h1>
          <p className="text-gray-600">
            Mantente al día con las últimas noticias, ofertas y actualizaciones de tu cuenta.
          </p>
        </motion.div>

        <NotificationsList
          notifications={mockNotifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      </div>
    </DashboardLayout>
  );
}
