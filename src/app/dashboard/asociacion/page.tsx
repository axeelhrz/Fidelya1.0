'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton,
  Paper,
  Grid,
  Divider,
  useTheme,
  alpha,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Upload,
  Download,
  Sparkles,
  TrendingUp,
  Users,
  Settings,
  Notifications,
  CalendarToday,
  BarChart,
  PersonAdd,
  Dashboard,
  Business,
  Speed,
  Security,
  ArrowBack,
} from '@mui/icons-material';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useSocios } from '@/hooks/useSocios';
import { useAuth } from '@/hooks/useAuth';
import { Socio, SocioFormData } from '@/types/socio';
import { AsociacionDashboardSummary } from '@/components/asociacion/AsociacionDashboardSummary';
import { SociosTable } from '@/components/asociacion/SociosTable';
import { SocioDialog } from '@/components/asociacion/SocioDialog';
import { DeleteConfirmDialog } from '@/components/asociacion/DeleteConfirmDialog';
import { CsvImport } from '@/components/asociacion/CsvImport';

const QuickActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
  delay: number;
}> = ({ title, description, icon, onClick, color, delay }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        elevation={0}
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          border: '2px solid #f1f5f9',
          borderRadius: 4,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: color,
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 40px ${alpha(color, 0.2)}`,
            '& .action-icon': {
              transform: 'scale(1.1)',
              bgcolor: alpha(color, 0.15),
            },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.6)})`,
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: 1,
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              className="action-icon"
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                bgcolor: alpha(color, 0.1),
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.3s ease',
              }}
            >
              {icon}
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 0.5,
                  color: '#0f172a',
                  letterSpacing: '-0.01em'
                }}
              >
                {title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#64748b', 
                  lineHeight: 1.5,
                  fontWeight: 500
                }}
              >
                {description}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <Box 
    sx={{ 
      minHeight: '100vh',
      bgcolor: '#fafbfc',
      background: 'linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%)',
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
              width: 64,
              height: 64,
              border: '4px solid #e2e8f0',
              borderRadius: '50%',
              borderTopColor: '#6366f1',
              animation: 'spin 1s linear infinite',
              mx: 'auto',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              width: 64,
              height: 64,
              border: '4px solid transparent',
              borderRadius: '50%',
              borderTopColor: '#8b5cf6',
              animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
              mx: 'auto',
              '@keyframes ping': {
                '75%, 100%': {
                  transform: 'scale(1.1)',
                  opacity: 0,
                },
              },
            }}
          />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Cargando Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
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
      bgcolor: '#fafbfc',
      background: 'linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%)',
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
              width: 80,
              height: 80,
              bgcolor: alpha('#ef4444', 0.1),
              color: '#ef4444',
              mx: 'auto',
              mb: 3,
            }}
          >
            <Security sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', mb: 2 }}>
            Acceso Restringido
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 4, maxWidth: 400, mx: 'auto' }}>
            Necesitas permisos de asociación para acceder a este dashboard. 
            Contacta al administrador del sistema.
          </Typography>
          
          <Button
            component={Link}
            href="/auth/login"
            variant="contained"
            size="large"
            sx={{
              py: 2,
              px: 4,
              borderRadius: 4,
              textTransform: 'none',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(239, 68, 68, 0.4)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </motion.div>
    </Container>
  </Box>
);

export default function AsociacionDashboard() {
  const theme = useTheme();
  const { user, loading: authLoading } = useAuth();
  const { 
    socios, 
    loading, 
    stats, 
    addSocio, 
    updateSocio, 
    deleteSocio, 
    addMultipleSocios 
  } = useSocios();

  const [socioDialog, setSocioDialog] = useState<{
    open: boolean;
    socio?: Socio | null;
  }>({ open: false });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    socio?: Socio | null;
  }>({ open: false });

  const [csvImportOpen, setCsvImportOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <AccessDeniedScreen />;
  }

  const handleAddSocio = () => {
    setSocioDialog({ open: true, socio: null });
  };

  const handleEditSocio = (socio: Socio) => {
    setSocioDialog({ open: true, socio });
  };

  const handleDeleteSocio = (socio: Socio) => {
    setDeleteDialog({ open: true, socio });
  };

  const handleSaveSocio = async (data: SocioFormData) => {
    setActionLoading(true);
    try {
      if (socioDialog.socio) {
        await updateSocio(socioDialog.socio.uid, data);
        toast.success('Socio actualizado correctamente');
      } else {
        await addSocio(data);
        toast.success('Socio agregado correctamente');
      }
      setSocioDialog({ open: false });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar el socio');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.socio) return;
    
    setActionLoading(true);
    try {
      await deleteSocio(deleteDialog.socio.uid);
      toast.success('Socio eliminado correctamente');
      setDeleteDialog({ open: false });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar el socio');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCsvImport = async (sociosData: SocioFormData[]) => {
    setActionLoading(true);
    try {
      await addMultipleSocios(sociosData);
      toast.success(`${sociosData.length} socios importados correctamente`);
      setCsvImportOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al importar los socios');
    } finally {
      setActionLoading(false);
    }
  };

  const exportToCsv = () => {
    if (socios.length === 0) {
      toast.error('No hay socios para exportar');
      return;
    }

    const csvData = socios.map(socio => ({
      nombre: socio.nombre,
      email: socio.email,
      estado: socio.estado,
      telefono: socio.telefono || '',
      dni: socio.dni || '',
      fechaAlta: socio.creadoEn.toDate().toLocaleDateString('es-ES')
    }));

    const headers = ['nombre', 'email', 'estado', 'telefono', 'dni', 'fechaAlta'];
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `socios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Archivo CSV descargado correctamente');
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Preparando tu espacio de trabajo..." />;
  }

  const quickActions = [
    {
      title: 'Importar Socios',
      description: 'Carga masiva desde archivo CSV',
      icon: <Upload sx={{ fontSize: 32 }} />,
      onClick: () => setCsvImportOpen(true),
      color: '#3b82f6',
      delay: 0.1
    },
    {
      title: 'Exportar Datos',
      description: 'Descarga base de datos completa',
      icon: <Download sx={{ fontSize: 32 }} />,
      onClick: exportToCsv,
      color: '#10b981',
      delay: 0.2
    },
    {
      title: 'Análisis Avanzado',
      description: 'Reportes y métricas detalladas',
      icon: <BarChart sx={{ fontSize: 32 }} />,
      onClick: () => toast.info('Próximamente disponible'),
      color: '#8b5cf6',
      delay: 0.3
    }
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: '#fafbfc',
        background: 'linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3,
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      />
      
      <Container maxWidth="xl" sx={{ position: 'relative', py: 4 }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Box sx={{ mb: 6 }}>
            {/* Back Button */}
            <IconButton
              component={Link}
              href="/"
              sx={{ 
                position: 'absolute',
                top: 24,
                left: 24,
                bgcolor: 'white',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                '&:hover': { 
                  bgcolor: '#f8fafc',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowBack />
            </IconButton>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, alignItems: { lg: 'center' }, justifyContent: 'space-between', gap: 4 }}>
              {/* Title Section */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      boxShadow: '0 12px 40px rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    <Dashboard sx={{ fontSize: 36 }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: '2.5rem', md: '3.2rem' },
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #6366f1 70%, #8b5cf6 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.03em',
                        lineHeight: 0.9,
                      }}
                    >
                      Centro de Control
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#64748b',
                        fontWeight: 500,
                        fontSize: '1.15rem',
                        mt: 1,
                        letterSpacing: '-0.01em'
                      }}
                    >
                      Dashboard Ejecutivo de Asociación
                    </Typography>
                  </Box>
                </Box>
                
                {/* Welcome Message */}
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: alpha('#6366f1', 0.05),
                    border: `1px solid ${alpha('#6366f1', 0.15)}`,
                    borderRadius: 4,
                    p: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: '#10b981',
                        borderRadius: '50%',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0.5 },
                        },
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600 }}>
                      <Box component="span" sx={{ fontWeight: 700 }}>Bienvenido de vuelta,</Box> {user?.email}
                    </Typography>
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday sx={{ fontSize: 14, color: '#94a3b8' }} />
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                        {new Date().toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Stack direction="row" spacing={2}>
                  <IconButton
                    onClick={() => toast.info('Notificaciones próximamente')}
                    sx={{
                      bgcolor: 'white',
                      border: '2px solid #e2e8f0',
                      '&:hover': {
                        borderColor: '#6366f1',
                        bgcolor: alpha('#6366f1', 0.03),
                        color: '#6366f1',
                      },
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <Notifications />
                    <Chip
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: 12,
                        height: 12,
                        bgcolor: '#ef4444',
                        color: 'white',
                        fontSize: '0.6rem',
                        minWidth: 'unset',
                        '& .MuiChip-label': { px: 0 }
                      }}
                    />
                  </IconButton>
                  
                  <Button
                    onClick={handleAddSocio}
                    variant="contained"
                    startIcon={<PersonAdd />}
                    size="large"
                    sx={{
                      py: 2,
                      px: 4,
                      borderRadius: 4,
                      textTransform: 'none',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Nuevo Socio
                  </Button>
                </Stack>
              </motion.div>
            </Box>
          </Box>
        </motion.div>

        {/* Dashboard Summary */}
        <AsociacionDashboardSummary stats={stats} loading={loading} />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', mb: 1 }}>
              Acciones Rápidas
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
              Herramientas esenciales para la gestión eficiente
            </Typography>
            
            <Grid container spacing={4}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <QuickActionCard
                    title={action.title}
                    description={action.description}
                    icon={action.icon}
                    onClick={action.onClick}
                    color={action.color}
                    delay={action.delay}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Main Content - Socios Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <SociosTable
            socios={socios}
            loading={loading}
            onAdd={handleAddSocio}
            onEdit={handleEditSocio}
            onDelete={handleDeleteSocio}
          />
        </motion.div>

        {/* Dialogs */}
        <SocioDialog
          open={socioDialog.open}
          onClose={() => setSocioDialog({ open: false })}
          onSave={handleSaveSocio}
          socio={socioDialog.socio}
          loading={actionLoading}
        />

        <DeleteConfirmDialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false })}
          onConfirm={handleConfirmDelete}
          socio={deleteDialog.socio}
          loading={actionLoading}
        />

        <CsvImport
          open={csvImportOpen}
          onClose={() => setCsvImportOpen(false)}
          onImport={handleCsvImport}
          loading={actionLoading}
        />
      </Container>
    </Box>
  );
}