'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Typography, Box } from '@mui/material';
import { Store } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComercioSidebar } from '@/components/layout/ComercioSidebar';
import { ProfileForm } from '@/components/comercio/perfil/ProfileForm';

const LoadingScreen: React.FC = () => (
  <Box 
    sx={{ 
      minHeight: '60vh',
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
        <Box
          sx={{
            width: 60,
            height: 60,
            border: '4px solid #e2e8f0',
            borderRadius: '50%',
            borderTopColor: '#06b6d4',
            animation: 'spin 1s linear infinite',
            mx: 'auto',
            mb: 3,
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
          Cargando perfil...
        </Typography>
      </Box>
    </motion.div>
  </Box>
);

const AccessDeniedScreen: React.FC = () => (
  <Container maxWidth="md" sx={{ py: 8 }}>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Store sx={{ fontSize: 80, color: '#ef4444', mb: 3 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 2 }}>
          Acceso Restringido
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Necesitas permisos de comercio para acceder a esta sección.
        </Typography>
      </Box>
    </motion.div>
  </Container>
);

export default function ComercioPerfilPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <DashboardLayout sidebarComponent={ComercioSidebar}>
        <LoadingScreen />
      </DashboardLayout>
    );
  }

  if (!user || user.role !== 'comercio') {
    return (
      <DashboardLayout sidebarComponent={ComercioSidebar}>
        <AccessDeniedScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarComponent={ComercioSidebar}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 900, 
                color: '#0f172a',
                mb: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Mi Comercio
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#64748b', 
                fontWeight: 500,
                maxWidth: 600 
              }}
            >
              Gestiona la información de tu comercio, actualiza tu perfil público y configura cómo te ven los socios en la red de Fidelitá.
            </Typography>
          </Box>

          {/* Profile Form */}
          <ProfileForm />
        </motion.div>
      </Container>
    </DashboardLayout>
  );
}
