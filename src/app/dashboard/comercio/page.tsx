'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Avatar,
  alpha,
} from '@mui/material';
import {
  Store,
  Security,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComercioSidebar } from '@/components/layout/ComercioSidebar';
import { ComercioStats } from '@/components/comercio/ComercioStats';
import { ComercioProfile } from '@/components/comercio/ComercioProfile';
import { BeneficiosManagement } from '@/components/comercio/BeneficiosManagement';
import { QRManagement } from '@/components/comercio/QRManagement';
import { ValidacionesHistory } from '@/components/comercio/ValidacionesHistory';
import { ComercioNotifications } from '@/components/comercio/ComercioNotifications';

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <Box 
    sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ position: 'relative', mb: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              border: '6px solid #e2e8f0',
              borderRadius: '50%',
              borderTopColor: '#06b6d4',
              borderRightColor: '#0891b2',
              animation: 'spin 1.5s linear infinite',
              mx: 'auto',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mb: 2 }}>
          Cargando Panel de Control
        </Typography>
        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
          {message}
        </Typography>
      </Box>
    </motion.div>
  </Box>
);

const AccessDeniedScreen: React.FC = () => (
  <Box 
    sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Container maxWidth="sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: alpha('#ef4444', 0.1),
              color: '#ef4444',
              mx: 'auto',
              mb: 4,
            }}
          >
            <Security sx={{ fontSize: 50 }} />
          </Avatar>
          
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 2 }}>
            Acceso Restringido
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 4, maxWidth: 400, mx: 'auto' }}>
            Necesitas permisos de comercio para acceder a este panel de control.
          </Typography>
        </Box>
      </motion.div>
    </Container>
  </Box>
);

// Componente para cada sección del dashboard
const ComercioSection: React.FC<{ 
  section: string;
}> = ({ section }) => {
  
  switch (section) {
    case 'resumen':
    case 'estadisticas':
      return <ComercioStats />;

    case 'perfil':
      return <ComercioProfile />;

    case 'beneficios':
    case 'beneficios-activos':
    case 'crear-beneficio':
      return <BeneficiosManagement />;

    case 'qr-validacion':
      return <QRManagement />;

    case 'validaciones':
    case 'historial-validaciones':
      return <ValidacionesHistory />;

    case 'notificaciones':
      return <ComercioNotifications />;

    case 'reportes':
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    boxShadow: '0 12px 40px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <Store sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 1 }}>
                    Reportes Comerciales
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Análisis detallado de tu negocio
                  </Typography>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
              Reportes Avanzados
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Los reportes detallados estarán disponibles próximamente.
            </Typography>
          </Box>
        </Container>
      );

    case 'tendencias':
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 12px 40px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <Store sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 1 }}>
                    Análisis de Tendencias
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Patrones y predicciones de tu negocio
                  </Typography>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
              Análisis Predictivo
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              El análisis de tendencias estará disponible próximamente.
            </Typography>
          </Box>
        </Container>
      );

    case 'clientes':
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    boxShadow: '0 12px 40px rgba(6, 182, 212, 0.3)',
                  }}
                >
                  <Store sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 1 }}>
                    Gestión de Clientes
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Base de datos de tus clientes
                  </Typography>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
              Base de Clientes
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              La gestión de clientes estará disponible próximamente.
            </Typography>
          </Box>
        </Container>
      );

    case 'ingresos':
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 12px 40px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <Store sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 1 }}>
                    Análisis de Ingresos
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Seguimiento financiero detallado
                  </Typography>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
              Dashboard Financiero
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              El análisis de ingresos estará disponible próximamente.
            </Typography>
          </Box>
        </Container>
      );

    case 'configuracion':
    case 'ayuda':
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
              {section === 'configuracion' ? 'Configuración del Comercio' : 'Ayuda y Soporte'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Esta funcionalidad estará disponible próximamente.
            </Typography>
          </Box>
        </Container>
      );

    default:
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
              Sección en Desarrollo
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Esta funcionalidad estará disponible próximamente.
            </Typography>
          </Box>
        </Container>
      );
  }
};

export default function ComercioDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { comercio, loading: comercioLoading } = useComercios();
  const { loading: beneficiosLoading } = useBeneficios();
  const { loading: validacionesLoading } = useValidaciones();

  const [activeSection, setActiveSection] = useState('resumen');

  const loading = authLoading || comercioLoading || beneficiosLoading || validacionesLoading;

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <AccessDeniedScreen />;
  }

  if (loading) {
    return <LoadingScreen message="Preparando tu panel de control comercial..." />;
  }

  return (
    <DashboardLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
      sidebarComponent={ComercioSidebar}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ComercioSection section={activeSection} />
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
}