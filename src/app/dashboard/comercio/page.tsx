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
    default:
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <DashboardHeader />
          
          {/* Stats Cards */}
          <Box sx={{ mb: 6 }}>
            <StatsCards />
          </Box>

          {/* Main Content Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                lg: '2fr 1fr'
              },
              gap: 6,
              mb: 6
            }}
          >
            {/* Left Column - Charts */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <ValidationsChart />
              <TopBenefits />
            </Box>

            {/* Right Column - Alerts & Quick Actions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Alerts />
              <QuickActions />
            </Box>
          </Box>

          {/* Recent Validations */}
          <RecentValidations />
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