'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComercioSidebar } from '@/components/layout/ComercioSidebar';
import { ProfileForm } from '@/components/comercio/perfil/ProfileForm';
import { ImageUploader } from '@/components/comercio/perfil/ImageUploader';
import { QRSection } from '@/components/comercio/perfil/QRSection';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { 
  Store, 
  Upload, 
  Settings, 
  Save, 
  RefreshCw,
  Shield,
  Bell,
  QrCode
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ComercioPerfilPage() {
  const { signOut } = useAuth();
  const { comerciosVinculados, loading, updateComercio, generateQRCode } = useComercios();
  const comercio = comerciosVinculados && comerciosVinculados.length > 0 ? comerciosVinculados[0] : null;
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'datos';

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'banner') => {
    if (!comercio) return;

    setUploadingImage(true);
    try {
      // Here you would implement the image upload logic
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`${type === 'logo' ? 'Logo' : 'Banner'} actualizado exitosamente`);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const tabs = [
    {
      id: 'datos',
      label: 'Datos del Comercio',
      icon: Store,
      description: 'Información básica y contacto'
    },
    {
      id: 'imagenes',
      label: 'Logo y Banner',
      icon: Upload,
      description: 'Imágenes representativas'
    },
    {
      id: 'qr',
      label: 'Código QR',
      icon: QrCode,
      description: 'Gestión del código QR'
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: Settings,
      description: 'Preferencias y notificaciones'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout
        activeSection="perfil"
        sidebarComponent={(props) => (
          <ComercioSidebar
            {...props}
            onLogoutClick={handleLogout}
          />
        )}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
              <RefreshCw size={32} className="text-blue-500 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cargando perfil...
            </h3>
            <p className="text-gray-500">Obteniendo información del comercio</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeSection="perfil"
      sidebarComponent={(props) => (
        <ComercioSidebar
          {...props}
          onLogoutClick={handleLogout}
        />
      )}
    >
      <motion.div
        className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Mi Perfil
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Gestiona la información de tu comercio
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw size={16} />}
                onClick={() => window.location.reload()}
              >
                Actualizar
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('tab', tab.id);
                  window.history.pushState({}, '', url.toString());
                  window.location.reload();
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {activeTab === 'datos' && (
            <ProfileForm />
          )}

          {activeTab === 'imagenes' && (
            <ImageUploader
              comercio={comercio}
              onImageUpload={handleImageUpload}
              uploading={uploadingImage}
            />
          )}

          {activeTab === 'qr' && (
            <QRSection
              comercio={comercio}
              onGenerateQR={generateQRCode}
            />
          )}

          {activeTab === 'configuracion' && (
            <div className="p-8">
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Configuración del Comercio
                </h3>

                <div className="space-y-6">
                  {/* Notifications */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Notificaciones</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Notificaciones por email
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked={comercio?.configuracion?.notificacionesEmail ?? true}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Notificaciones por WhatsApp
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked={comercio?.configuracion?.notificacionesWhatsApp ?? false}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Validation Settings */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Validaciones</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Auto-validación
                          </span>
                          <p className="text-xs text-gray-500">
                            Validar automáticamente los beneficios sin confirmación manual
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={comercio?.configuracion?.autoValidacion ?? false}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Requiere aprobación
                          </span>
                          <p className="text-xs text-gray-500">
                            Solicitar aprobación antes de aplicar beneficios
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={comercio?.configuracion?.requiereAprobacion ?? true}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}