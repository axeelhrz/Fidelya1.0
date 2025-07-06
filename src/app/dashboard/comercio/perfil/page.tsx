'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Typography, Box, Stack, Breadcrumbs, Link, alpha } from '@mui/material';
import { Store, Home, NavigateNext } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComercioSidebar } from '@/components/layout/ComercioSidebar';
import { ProfileForm } from '@/components/comercio/perfil/ProfileForm';
import { ImageUploader } from '@/components/comercio/perfil/ImageUploader';
import { QRSection } from '@/components/comercio/perfil/QRSection';

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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Store sx={{ fontSize: 60, color: '#06b6d4', mb: 3 }} />
        </motion.div>
        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
          Cargando perfil del comercio...
        </Typography>
        <Typography variant="body2" sx={{ color: '#9ca3af', mt: 1 }}>
          Preparando toda la información
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
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Store sx={{ fontSize: 80, color: '#ef4444', mb: 3 }} />
        </motion.div>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 2 }}>
          Acceso Restringido
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
          Necesitas permisos de comercio para acceder a esta sección.
        </Typography>
        <Box
          sx={{
            p: 4,
            bgcolor: alpha('#ef4444', 0.05),
            border: '1px solid',
            borderColor: alpha('#ef4444', 0.2),
            borderRadius: 3,
            maxWidth: 400,
            mx: 'auto',
          }}
        >
          <Typography variant="body2" sx={{ color: '#dc2626' }}>
            Si crees que esto es un error, contacta al administrador del sistema.
          </Typography>
        </Box>
      </Box>
    </motion.div>
  </Container>
);

export default function ComercioPerfilPage() {
  const { user, loading: authLoading } = useAuth();
  const { comercio, loading: comercioLoading } = useComercios();

  const loading = authLoading || comercioLoading;

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
          {/* Breadcrumbs */}
          <Box sx={{ mb: 4 }}>
            <Breadcrumbs
              separator={<NavigateNext fontSize="small" />}
              sx={{
                '& .MuiBreadcrumbs-separator': {
                  color: '#9ca3af',
                },
              }}
            >
              <Link
                color="inherit"
                href="/dashboard/comercio"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: '#6b7280',
                  '&:hover': {
                    color: '#374151',
                  },
                }}
              >
                <Home sx={{ mr: 0.5, fontSize: 16 }} />
                Dashboard
              </Link>
              <Typography
                color="text.primary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                <Store sx={{ mr: 0.5, fontSize: 16 }} />
                Mi Perfil
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
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
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#64748b', 
                  fontWeight: 500,
                  maxWidth: 600,
                  mb: 2,
                }}
              >
                Gestiona la información de tu comercio, actualiza tu perfil público y configura cómo te ven los socios en la red de Fidelitá.
              </Typography>
            </motion.div>

            {/* Status Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 3 }}>
                <Box
                  sx={{
                    px: 3,
                    py: 1.5,
                    bgcolor: comercio?.visible ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
                    border: '1px solid',
                    borderColor: comercio?.visible ? alpha('#10b981', 0.3) : alpha('#ef4444', 0.3),
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {comercio?.visible ? (
                    <>
                      <Box sx={{ width: 8, height: 8, bgcolor: '#10b981', borderRadius: '50%' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#047857' }}>
                        Visible para socios
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Box sx={{ width: 8, height: 8, bgcolor: '#ef4444', borderRadius: '50%' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#dc2626' }}>
                        Oculto para socios
                      </Typography>
                    </>
                  )}
                </Box>

                <Box
                  sx={{
                    px: 3,
                    py: 1.5,
                    bgcolor: alpha('#6366f1', 0.1),
                    border: '1px solid',
                    borderColor: alpha('#6366f1', 0.3),
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box sx={{ width: 8, height: 8, bgcolor: '#6366f1', borderRadius: '50%' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#5b21b6' }}>
                    {comercio?.categoria || 'Sin categoría'}
                  </Typography>
                </Box>

                {comercio?.asociacionesVinculadas && comercio.asociacionesVinculadas.length > 0 && (
                  <Box
                    sx={{
                      px: 3,
                      py: 1.5,
                      bgcolor: alpha('#06b6d4', 0.1),
                      border: '1px solid',
                      borderColor: alpha('#06b6d4', 0.3),
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box sx={{ width: 8, height: 8, bgcolor: '#06b6d4', borderRadius: '50%' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0891b2' }}>
                      {comercio.asociacionesVinculadas.length} asociación{comercio.asociacionesVinculadas.length !== 1 ? 'es' : ''} vinculada{comercio.asociacionesVinculadas.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </motion.div>
          </Box>

          {/* Content Sections */}
          <Stack spacing={6}>
            {/* Images Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ImageUploader />
            </motion.div>

            {/* Profile Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ProfileForm />
            </motion.div>

            {/* QR Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <QRSection />
            </motion.div>
          </Stack>
        </motion.div>
      </Container>
    </DashboardLayout>
  );
}