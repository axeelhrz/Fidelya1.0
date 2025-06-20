'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/hooks/useRole';
import { Box, Typography, Paper, Button, Container } from '@mui/material';
import { BusinessCenter, ArrowBack, Security } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface AdminRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export default function AdminRoute({ children, fallbackPath = '/dashboard' }: AdminRouteProps) {
  const { user, loading } = useAuth();
  const { role, loading: roleLoading } = useRole();
  const router = useRouter();

  // Mostrar loading mientras se verifica la autenticación y el rol
  if (loading || roleLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #F2EDEA 0%, #ffffff 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(93, 79, 176, 0.1)',
            }}
          >
            <BusinessCenter sx={{ fontSize: 48, color: '#5D4FB0', mb: 2 }} />
            <Typography variant="h6" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
              Verificando permisos...
            </Typography>
          </Paper>
        </motion.div>
      </Box>
    );
  }

  // Si no está autenticado o no es admin, mostrar página de acceso denegado
  if (!user || role !== 'admin') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #F2EDEA 0%, #ffffff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                p: 6,
                borderRadius: 4,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              <Security sx={{ fontSize: 64, color: '#ef4444', mb: 3 }} />
              
              <Typography 
                variant="h4" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600,
                  color: '#2E2E2E',
                  mb: 2,
                }}
              >
                Acceso Restringido
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 300,
                  color: 'rgba(46, 46, 46, 0.7)',
                  mb: 3,
                }}
              >
                Panel Ejecutivo - Solo Administradores
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 300,
                  color: 'rgba(46, 46, 46, 0.6)',
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Esta sección está reservada exclusivamente para usuarios con rol de administrador. 
                Si crees que deberías tener acceso, contacta con el administrador del sistema.
              </Typography>

              <Box display="flex" gap={2} justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<ArrowBack />}
                  onClick={() => router.push(fallbackPath)}
                  sx={{
                    background: 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
                    color: 'white',
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #A593F3 0%, #5D4FB0 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(93, 79, 176, 0.3)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  Volver al Dashboard
                </Button>
              </Box>

              <Box sx={{ mt: 4, p: 2, background: 'rgba(93, 79, 176, 0.05)', borderRadius: 2 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 300,
                    color: 'rgba(46, 46, 46, 0.6)',
                  }}
                >
                  Usuario actual: {user?.displayName || 'No identificado'} | 
                  Rol: {role === 'psychologist' ? 'Psicólogo' : role === 'patient' ? 'Paciente' : 'Sin rol asignado'}
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    );
  }

  // Si es admin, renderizar el contenido
  return <>{children}</>;
}
