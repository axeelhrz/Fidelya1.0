'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { SocioOverviewDashboard } from '@/components/socio/SocioOverviewDashboard';
import { ProfileCard } from '@/components/socio/ProfileCard';
import { AsociacionesList } from '@/components/socio/AsociacionesList';
import { BenefitsTabs } from '@/components/socio/BenefitsTabs';
import { BenefitsCard } from '@/components/socio/BenefitsCard';
import { QRScannerButton } from '@/components/socio/QRScannerButton';
import { ValidationResultModal } from '@/components/socio/ValidationResultModal';
import { NotificationsList } from '@/components/socio/NotificationsList';
import { useAuth } from '@/hooks/useAuth';
import { useBeneficios } from '@/hooks/useBeneficios';
import { ValidacionesService } from '@/services/validaciones.service';
import { ValidacionResponse } from '@/types/validacion';
import { Gift, Zap } from 'lucide-react';

// Función helper para crear timestamps mock que sean compatibles con Firebase

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
    updatedAt: new Date(),
    read: false
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
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false
  }
];

export default function SocioDashboard() {
  const { user } = useAuth();
  const { beneficios, beneficiosUsados } = useBeneficios();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [benefitsTab, setBenefitsTab] = useState<'disponibles' | 'usados'>('disponibles');
  const [validationResult, setValidationResult] = useState<ValidacionResponse | null>(null);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock implementation, replace with real API/service call as needed
  const marcarBeneficioComoUsado = async (): Promise<boolean> => {
    // Aquí deberías llamar a tu servicio real para marcar el beneficio como usado
    // Por ahora, simula éxito tras un pequeño delay
    return new Promise((resolve) => setTimeout(() => resolve(true), 500));
  };

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

  const handleUseBenefit = async (beneficioId: string) => {
    const beneficio = beneficios.find(b => b.id === beneficioId);
    if (!beneficio) return;

    const success = await marcarBeneficioComoUsado();
    if (success) {
      console.log('Beneficio usado exitosamente');
    }
  };

  const handleMarkNotificationAsRead = (id: string) => {
    console.log('Marking notification as read:', id);
    // Aquí iría la lógica para marcar como leída
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  const handleScanQR = () => {
    setActiveSection('validar');
  };

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <SocioOverviewDashboard
            onNavigate={handleNavigate}
            onScanQR={handleScanQR}
          />
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
                disponibles: beneficios.length,
                usados: beneficiosUsados.length,
                ahorroTotal: beneficiosUsados.reduce((total, b) => total + (b.montoDescuento || 0), 0)
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefitsTab === 'disponibles' ? (
                beneficios.length > 0 ? (
                  beneficios.map((beneficio) => (
                    <BenefitsCard
                      key={beneficio.id}
                      beneficio={beneficio}
                      tipo="disponible"
                      onUse={handleUseBenefit}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Gift size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay beneficios disponibles</p>
                  </div>
                )
              ) : (
                beneficiosUsados.length > 0 ? (
                  beneficiosUsados.map((beneficioUso) => (
                    <BenefitsCard
                      key={beneficioUso.id}
                      beneficioUso={beneficioUso}
                      tipo="usado"
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Gift size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No has usado beneficios aún</p>
                  </div>
                )
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