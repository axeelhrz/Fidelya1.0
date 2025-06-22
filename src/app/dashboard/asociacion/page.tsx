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
  useTheme,
  alpha,
  Avatar,
  Fab,
  Zoom,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Upload,
  Download,
  TrendingUp,
  Settings,
  Notifications,
  CalendarToday,
  BarChart,
  PersonAdd,
  Dashboard,
  Speed,
  Security,
  ArrowBack,
  Analytics,
  Timeline,
  Group,
  Email,
  Print,
  Share,
  CloudDownload,
  Assessment,
  Insights,
  AutoGraph,
} from '@mui/icons-material';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useSocios } from '@/hooks/useSocios';
import { useAuth } from '@/hooks/useAuth';
import { Socio, SocioFormData } from '@/types/socio';
import { AdvancedAnalytics } from '@/components/asociacion/AdvancedAnalytics';
import { EnhancedMemberManagement } from '@/components/asociacion/EnhancedMemberManagement';
import { ActivityFeed } from '@/components/asociacion/ActivityFeed';
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
  badge?: number;
}> = ({ title, description, icon, onClick, color, delay, badge }) => {
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
          border: '1px solid #f1f5f9',
          borderRadius: 5,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: alpha(color, 0.3),
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 60px -10px ${alpha(color, 0.25)}`,
            '& .action-icon': {
              transform: 'scale(1.15) rotate(5deg)',
              bgcolor: alpha(color, 0.2),
            },
            '& .action-glow': {
              opacity: 0.8,
            }
          },
        }}
      >
        {/* Glow effect */}
        <Box
          className="action-glow"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.6)}, ${color})`,
            opacity: 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />
        
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Badge badgeContent={badge} color="error" invisible={!badge}>
              <Avatar
                className="action-icon"
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 4,
                  bgcolor: alpha(color, 0.12),
                  color: color,
                  flexShrink: 0,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 8px 32px ${alpha(color, 0.2)}`,
                }}
              >
                {icon}
              </Avatar>
            </Badge>
            
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 0.5,
                  color: '#0f172a',
                  letterSpacing: '-0.01em',
                  fontSize: '1.1rem'
                }}
              >
                {title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#64748b', 
                  lineHeight: 1.5,
                  fontWeight: 500,
                  fontSize: '0.9rem'
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
              width: 80,
              height: 80,
              border: '6px solid #e2e8f0',
              borderRadius: '50%',
              borderTopColor: '#6366f1',
              borderRightColor: '#8b5cf6',
              animation: 'spin 1.5s linear infinite',
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
              width: 80,
              height: 80,
              border: '6px solid transparent',
              borderRadius: '50%',
              borderTopColor: alpha('#6366f1', 0.3),
              animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
              mx: 'auto',
              '@keyframes ping': {
                '75%, 100%': {
                  transform: 'scale(1.2)',
                  opacity: 0,
                },
              },
            }}
          />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mb: 2 }}>
          Cargando Dashboard Ejecutivo
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
            Necesitas permisos de asociación para acceder a este dashboard ejecutivo. 
            Contacta al administrador del sistema.
          </Typography>
          
          <Button
            component={Link}
            href="/auth/login"
            variant="contained"
            size="large"
            sx={{
              py: 2,
              px: 6,
              borderRadius: 4,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1.1rem',
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
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

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
        toast.success('Miembro actualizado correctamente');
      } else {
        await addSocio(data);
        toast.success('Miembro agregado correctamente');
      }
      setSocioDialog({ open: false });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar el miembro');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.socio) return;
    
    setActionLoading(true);
    try {
      await deleteSocio(deleteDialog.socio.uid);
      toast.success('Miembro eliminado correctamente');
      setDeleteDialog({ open: false });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar el miembro');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCsvImport = async (sociosData: SocioFormData[]) => {
    setActionLoading(true);
    try {
      await addMultipleSocios(sociosData);
      toast.success(`${sociosData.length} miembros importados correctamente`);
      setCsvImportOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al importar los miembros');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    toast.info(`Acción "${action}" aplicada a ${selectedIds.length} miembros`);
  };

  const exportToCsv = () => {
    if (socios.length === 0) {
      toast.error('No hay miembros para exportar');
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
    link.setAttribute('download', `miembros_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Archivo CSV descargado correctamente');
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Preparando tu centro de control ejecutivo..." />;
  }

  const quickActions = [
    {
      title: 'Importación Masiva',
      description: 'Carga inteligente desde CSV con validación automática',
      icon: <Upload sx={{ fontSize: 36 }} />,
      onClick: () => setCsvImportOpen(true),
      color: '#3b82f6',
      delay: 0.1
    },
    {
      title: 'Exportación Avanzada',
      description: 'Descarga completa con filtros personalizados',
      icon: <CloudDownload sx={{ fontSize: 36 }} />,
      onClick: exportToCsv,
      color: '#10b981',
      delay: 0.2
    },
    {
      title: 'Analytics Profundo',
      description: 'Reportes ejecutivos y métricas de rendimiento',
      icon: <Assessment sx={{ fontSize: 36 }} />,
      onClick: () => toast.info('Análisis avanzado disponible en la sección Analytics'),
      color: '#8b5cf6',
      delay: 0.3
    },
    {
      title: 'Insights IA',
      description: 'Predicciones y recomendaciones inteligentes',
      icon: <AutoGraph sx={{ fontSize: 36 }} />,
      onClick: () => toast.info('Próximamente: Insights impulsados por IA'),
      color: '#f59e0b',
      delay: 0.4
    }
  ];

  const speedDialActions = [
    {
      icon: <PersonAdd />,
      name: 'Nuevo Miembro',
      onClick: handleAddSocio,
    },
    {
      icon: <Upload />,
      name: 'Importar CSV',
      onClick: () => setCsvImportOpen(true),
    },
    {
      icon: <Download />,
      name: 'Exportar Datos',
      onClick: exportToCsv,
    },
    {
      icon: <Email />,
      name: 'Enviar Comunicación',
      onClick: () => toast.info('Próximamente: Sistema de comunicación masiva'),
    },
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
      {/* Enhanced Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.4,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.3) 1px, transparent 0)
          `,
          backgroundSize: '800px 800px, 600px 600px, 20px 20px'
        }}
      />
      
      <Container maxWidth="xl" sx={{ position: 'relative', py: 4 }}>
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Box sx={{ mb: 8 }}>
            {/* Back Button */}
            <IconButton
              component={Link}
              href="/"
              sx={{ 
                position: 'absolute',
                top: 24,
                left: 24,
                bgcolor: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                '&:hover': { 
                  bgcolor: '#f8fafc',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ArrowBack />
            </IconButton>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, alignItems: { lg: 'center' }, justifyContent: 'space-between', gap: 6 }}>
              {/* Enhanced Title Section */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 88,
                      height: 88,
                      borderRadius: 5,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                      boxShadow: '0 20px 60px rgba(99, 102, 241, 0.4)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -2,
                        borderRadius: 5,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
                        zIndex: -1,
                        opacity: 0.3,
                        filter: 'blur(8px)',
                      }
                    }}
                  >
                    <Dashboard sx={{ fontSize: 44 }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: '2.8rem', md: '3.8rem' },
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 20%, #6366f1 60%, #8b5cf6 80%, #ec4899 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.04em',
                        lineHeight: 0.85,
                        mb: 1,
                      }}
                    >
                      Centro Ejecutivo
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#64748b',
                        fontWeight: 600,
                        fontSize: '1.3rem',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      Dashboard de Asociación Premium
                    </Typography>
                  </Box>
                </Box>
                
                {/* Enhanced Welcome Message */}
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: alpha('#6366f1', 0.05),
                    border: `2px solid ${alpha('#6366f1', 0.15)}`,
                    borderRadius: 5,
                    p: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: '#10b981',
                        borderRadius: '50%',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                          '50%': { opacity: 0.5, transform: 'scale(1.1)' },
                        },
                      }}
                    />
                    <Typography variant="body1" sx={{ color: '#475569', fontWeight: 700, fontSize: '1.1rem' }}>
                      <Box component="span" sx={{ fontWeight: 900 }}>Bienvenido de vuelta,</Box> {user?.email}
                    </Typography>
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CalendarToday sx={{ fontSize: 18, color: '#94a3b8' }} />
                      <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 700 }}>
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

              {/* Enhanced Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Stack direction="row" spacing={3}>
                  <Tooltip title="Notificaciones">
                    <IconButton
                      onClick={() => toast.info('Sistema de notificaciones próximamente')}
                      sx={{
                        bgcolor: 'white',
                        border: '2px solid #e2e8f0',
                        width: 56,
                        height: 56,
                        '&:hover': {
                          borderColor: '#6366f1',
                          bgcolor: alpha('#6366f1', 0.03),
                          color: '#6366f1',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}
                    >
                      <Badge badgeContent={3} color="error">
                        <Notifications sx={{ fontSize: 24 }} />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  
                  <Button
                    onClick={handleAddSocio}
                    variant="contained"
                    startIcon={<PersonAdd />}
                    size="large"
                    sx={{
                      py: 2,
                      px: 5,
                      borderRadius: 4,
                      textTransform: 'none',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #db2777 100%)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 15px 50px rgba(99, 102, 241, 0.5)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Nuevo Miembro
                  </Button>
                </Stack>
              </motion.div>
            </Box>
          </Box>
        </motion.div>

        {/* Advanced Analytics Section */}
        <AdvancedAnalytics socios={socios} stats={stats} loading={loading} />

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: alpha('#8b5cf6', 0.15),
                  color: '#8b5cf6',
                  borderRadius: 3,
                }}
              >
                <Speed sx={{ fontSize: 24 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.5 }}>
                  Acciones Ejecutivas
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500 }}>
                  Herramientas avanzadas para gestión profesional
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={4}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
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

        {/* Main Content Grid */}
        <Grid container spacing={6}>
          {/* Member Management - Takes 2/3 of the space */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <EnhancedMemberManagement
                socios={socios}
                loading={loading}
                onAdd={handleAddSocio}
                onEdit={handleEditSocio}
                onDelete={handleDeleteSocio}
                onBulkAction={handleBulkAction}
              />
            </motion.div>
          </Grid>

          {/* Activity Feed - Takes 1/3 of the space */}
          <Grid item xs={12} lg={4}>
            <ActivityFeed loading={loading} />
          </Grid>
        </Grid>

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

        {/* Enhanced Speed Dial */}
        <SpeedDial
          ariaLabel="Acciones rápidas"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            '& .MuiFab-primary': {
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              width: 64,
              height: 64,
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                transform: 'scale(1.1)',
                boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
              },
              transition: 'all 0.3s ease'
            }
          }}
          icon={<SpeedDialIcon />}
          onClose={() => setSpeedDialOpen(false)}
          onOpen={() => setSpeedDialOpen(true)}
          open={speedDialOpen}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => {
                action.onClick();
                setSpeedDialOpen(false);
              }}
              sx={{
                '& .MuiFab-primary': {
                  bgcolor: 'white',
                  color: '#6366f1',
                  border: '2px solid #e2e8f0',
                  '&:hover': {
                    bgcolor: alpha('#6366f1', 0.1),
                    borderColor: '#6366f1',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease'
                }
              }}
            />
          ))}
        </SpeedDial>
      </Container>
    </Box>
  );
}
