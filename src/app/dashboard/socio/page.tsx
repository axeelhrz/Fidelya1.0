'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { ProfileCard } from '@/components/socio/ProfileCard';
import { AsociacionesList } from '@/components/socio/AsociacionesList';
import { BenefitsTabs } from '@/components/socio/BenefitsTabs';
import { BenefitsCard } from '@/components/socio/BenefitsCard';
import { QRScannerButton } from '@/components/socio/QRScannerButton';
import { ValidationResultModal } from '@/components/socio/ValidationResultModal';
import { NotificationsList } from '@/components/socio/NotificationsList';
import { useAuth } from '@/hooks/useAuth';
import { ValidacionesService } from '@/services/validaciones.service';
import { ValidacionResponse } from '@/types/validacion';
import { Gift, TrendingUp, Zap, Bell } from 'lucide-react';

// Datos mock para desarrollo
const mockBeneficios = [
  {
    id: '1',
    titulo: '20% de descuento en toda la tienda',
    descripcion: 'Válido en todos los productos excepto ofertas especiales',
    descuento: 20,
    tipo: 'porcentaje' as const,
    comercioId: 'comercio1',
    comercioNombre: 'Tienda Fashion',
    comercioLogo: '',
    asociacionesDisponibles: ['asociacion1'],
    fechaInicio: { toDate: () => new Date() } as any,
    fechaFin: { toDate: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } as any,
    estado: 'activo' as const,
    usosActuales: 5,
    categoria: 'Retail',
    creadoEn: { toDate: () => new Date() } as any,
    actualizadoEn: { toDate: () => new Date() } as any
  },
  {
    id: '2',
    titulo: 'Café gratis con cualquier compra',
    descripcion: 'Un café americano gratis al comprar cualquier producto de panadería',
    descuento: 0,
    tipo: 'producto_gratis' as const,
    comercioId: 'comercio2',
    comercioNombre: 'Café Central',
    comercioLogo: '',
    asociacionesDisponibles: ['asociacion1'],
    fechaInicio: { toDate: () => new Date() } as any,
    fechaFin: { toDate: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) } as any,
    estado: 'activo' as const,
    usosActuales: 12,
    categoria: 'Restaurantes',
    creadoEn: { toDate: () => new Date() } as any,
    actualizadoEn: { toDate: () => new Date() } as any
  }
];

const mockNotifications = [
  {
    id: '1',
    title: 'Nuevo beneficio disponible',
    message: 'Tienda Fashion tiene un 20% de descuento especial para ti',
    type: 'info' as const,
    priority: 'medium' as const,
    status: 'unread' as const,
    category: 'membership' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Recordatorio de vencimiento',
    message: 'Tu membresía vence en 30 días. Renueva para seguir disfrutando beneficios',
    type: 'warning' as const,
    priority: 'high' as const,
    status: 'unread' as const,
    category: 'payment' as const,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
];

export default function SocioDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [benefitsTab, setBenefitsTab] = useState<'disponibles' | 'usados'>('disponibles');
  const [validationResult, setValidationResult] = useState<ValidacionResponse | null>(null);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQRScan = async (qrData: string) => {
    setLoading(true);
    try {
      const parsedData = ValidacionesService.parseQRData(qrData);
      if (!parsedData) {
        throw new Error('Código QR inválido');
      }

      const result = await ValidacionesService.validarAcceso({
        socioId: user?.uid || '',
        comercioId: parsedData.comercioId,
        beneficioId: parsedData.beneficioId
      });

      setValidationResult(result);
      setValidationModalOpen(true);
    } catch (error) {
      console.error('Error validating QR:', error);
      // Mostrar error
    } finally {
      setLoading(false);
    }
  };

  const handleUseBenefit = (beneficioId: string) => {
    console.log('Using benefit:', beneficioId);
    // Aquí iría la lógica para usar el beneficio
  };

  const handleMarkNotificationAsRead = (id: string) => {
    console.log('Marking notification as read:', id);
    // Aquí iría la lógica para marcar como leída
  };

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="p-6 space-y-6">
            {/* Header de bienvenida */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white"
            >
              <h1 className="text-2xl font-bold mb-2">
                ¡Hola, {user?.nombre || 'Socio'}! 👋
              </h1>
              <p className="text-indigo-100">
                Bienvenido a tu portal de beneficios. Descubre las ofertas especiales que tenemos para ti.
              </p>
            </motion.div>

            {/* Stats rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Gift size={24} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{mockBeneficios.length}</p>
                    <p className="text-sm text-gray-500">Beneficios Disponibles</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">$2,450</p>
                    <p className="text-sm text-gray-500">Total Ahorrado</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Zap size={24} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                    <p className="text-sm text-gray-500">Usados Este Mes</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Acciones rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <QRScannerButton onScan={handleQRScan} loading={loading} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <Bell size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                    <p className="text-sm text-gray-500">2 mensajes nuevos</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSection('notificaciones')}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl transition-colors font-medium"
                >
                  Ver Todas las Notificaciones
                </button>
              </motion.div>
            </div>

            {/* Beneficios destacados */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Beneficios Destacados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockBeneficios.slice(0, 2).map((beneficio) => (
                  <BenefitsCard
                    key={beneficio.id}
                    beneficio={beneficio}
                    tipo="disponible"
                    onUse={handleUseBenefit}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 'perfil':
        return (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProfileCard />
              <AsociacionesList />
            </div>
          </div>
        );

      case 'beneficios':
        return (
          <div className="p-6 space-y-6">
            <BenefitsTabs
              activeTab={benefitsTab}
              onTabChange={setBenefitsTab}
              stats={{
                disponibles: mockBeneficios.length,
                usados: 12,
                ahorroTotal: 2450
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefitsTab === 'disponibles' ? (
                mockBeneficios.map((beneficio) => (
                  <BenefitsCard
                    key={beneficio.id}
                    beneficio={beneficio}
                    tipo="disponible"
                    onUse={handleUseBenefit}
                  />
                ))
              ) : (
                // Aquí mostrarías los beneficios usados
                <div className="col-span-full text-center py-12">
                  <Gift size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No has usado beneficios aún</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'validar':
        return (
          <div className="p-6">
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap size={32} className="text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Validar Beneficio
                </h2>
                
                <p className="text-gray-600 mb-8">
                  Escanea el código QR del comercio para validar tu acceso y usar tus beneficios.
                </p>

                <QRScannerButton onScan={handleQRScan} loading={loading} />

                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Tip:</strong> Solicita al comercio que muestre su código QR único para acceder a tus descuentos.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'notificaciones':
        return (
          <div className="p-6">
            <NotificationsList
              notifications={mockNotifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={() => console.log('Mark all as read')}
            />
          </div>
        );

      default:
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Sección en Desarrollo
              </h2>
              <p className="text-gray-500">
                Esta funcionalidad estará disponible próximamente.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <DashboardLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        sidebarComponent={SocioSidebar}
      >
        {renderDashboardContent()}
      </DashboardLayout>

      <ValidationResultModal
        open={validationModalOpen}
        onClose={() => setValidationModalOpen(false)}
        result={validationResult}
      />
    </>
  );
}