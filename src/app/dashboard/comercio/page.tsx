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
  Security,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComercioSidebar } from '@/components/layout/ComercioSidebar';
import { DashboardHeader } from '@/components/comercio/DashboardHeader';
import { StatsCards } from '@/components/comercio/StatsCards';
import { ValidationsChart } from '@/components/comercio/ValidationsChart';
import { TopBenefits } from '@/components/comercio/TopBenefits';
import { Alerts } from '@/components/comercio/Alerts';
import { RecentValidations } from '@/components/comercio/RecentValidations';
import { QuickActions } from '@/components/comercio/QuickActions';

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <Box 
    sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
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
              width: 100,
              height: 100,
              border: '8px solid #e2e8f0',
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
        <Typography variant="h3" sx={{ 
          fontWeight: 900, 
          color: '#0f172a', 
          mb: 2,
          background: 'linear-gradient(135deg, #0f172a 0%, #06b6d4 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
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
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
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
              width: 120,
              height: 120,
              bgcolor: alpha('#ef4444', 0.1),
              color: '#ef4444',
              mx: 'auto',
              mb: 4,
              border: '4px solid',
              borderColor: alpha('#ef4444', 0.2),
            }}
          >
            <Security sx={{ fontSize: 60 }} />
          </Avatar>
          
          <Typography variant="h3" sx={{ 
            fontWeight: 900, 
            color: '#0f172a', 
            mb: 2,
            background: 'linear-gradient(135deg, #0f172a 0%, #ef4444 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
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
    default:
      return (
        <Box sx={{ 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          pb: 8
        }}>
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <DashboardHeader />
            
            {/* Stats Cards Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box sx={{ mb: 8 }}>
                <StatsCards />
              </Box>
            </motion.div>

            {/* Main Content - Professional Layout */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: 6,
              mb: 8
            }}>
              {/* Primary Content Column */}
              <Box sx={{ 
                flex: { lg: '2 1 0%' },
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}>
                {/* Charts Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <ValidationsChart />
                </motion.div>

                {/* Top Benefits Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <TopBenefits />
                </motion.div>
              </Box>

              {/* Secondary Content Column */}
              <Box sx={{ 
                flex: { lg: '1 1 0%' },
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                minWidth: { lg: '320px' }
              }}>
                {/* Alerts Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Alerts />
                </motion.div>

                {/* Quick Actions Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <QuickActions />
                </motion.div>
              </Box>
            </Box>

            {/* Recent Validations - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <RecentValidations />
            </motion.div>
          </Container>
        </Box>
      );
  }
};

export default function ComercioDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { loading: comercioLoading } = useComercios();
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
          transition={{ 
            duration: 0.4,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          <ComercioSection section={activeSection} />
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
}
