'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  QrCode,
  Zap, 
  Shield, 
  CheckCircle, 
  Info,
  Target,
  Award,
  Clock,
  History,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Smartphone,
  Eye,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { useAuth } from '@/hooks/useAuth';

// Sidebar personalizado que maneja el logout
const SocioSidebarWithLogout: React.FC<{
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
  activeSection: string;
  onLogoutClick: () => void;
}> = (props) => {
  return (
    <SocioSidebar
      open={props.open}
      onToggle={props.onToggle}
      onMenuClick={props.onMenuClick}
      onLogoutClick={props.onLogoutClick}
      activeSection={props.activeSection}
    />
  );
};

export default function SocioValidarPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  
  // Estados para el modal de logout
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [validationResult, setValidationResult] = useState<ValidacionResponse | null>(null);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [scannerLoading, setScannerLoading] = useState(false);

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión. Inténtalo de nuevo.');
    } finally {
      setLoggingOut(false);
      setLogoutModalOpen(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  const handleQRScan = async (qrData: string) => {
    setScannerLoading(true);
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
      
      if (result.resultado === 'habilitado') {
        toast.success('¡Validación exitosa!');
      } else {
        toast.error('Validación fallida');
      }
    } catch (error) {
      console.error('Error validating QR:', error);
      toast.error('Error al validar el código QR');
    } finally {
      setScannerLoading(false);
    }
  };

  // Estadísticas calculadas
  const calculatedStats = {
    validacionesHoy: mockRecentValidations.filter(v => {
      const today = new Date();
      const validationDate = v.timestamp;
      return validationDate.toDateString() === today.toDateString();
    }).length,
    validacionesExitosas: mockRecentValidations.filter(v => v.status === 'success').length,
    ahorroTotal: mockRecentValidations.reduce((total, v) => total + v.ahorro, 0),
    ultimaValidacion: mockRecentValidations.length > 0 ? mockRecentValidations[0].timestamp : null
  };

  return (
    <>
      <DashboardLayout
        activeSection="validar"
        sidebarComponent={(props) => (
          <SocioSidebarWithLogout
            {...props}
            onLogoutClick={handleLogoutClick}
          />
        )}
      >
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Validación en Desarrollo
            </h2>
            <p className="text-gray-500">
              Esta funcionalidad estará disponible próximamente.
            </p>
          </div>
        </div>
      </DashboardLayout>

      {/* Modal de Logout */}
      <LogoutModal
        isOpen={logoutModalOpen}
        isLoading={loggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
}