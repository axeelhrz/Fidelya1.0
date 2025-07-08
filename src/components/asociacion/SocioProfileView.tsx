'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  Button,
  Avatar,
  Chip,
  IconButton,
  Stack,
  LinearProgress,
  Tooltip,
  Tab,
  Tabs,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  CalendarToday,
  LocationOn,
  Edit,
  Close,
  Camera,
  TrendingUp,
  TrendingDown,
  Timeline,
  Settings,
  Notifications,
  Security,
  Download,
  Share,
  Refresh,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Info,
  Badge as BadgeIcon,
  Analytics,
  Favorite,
  Store,
  LocalOffer,
  AccountCircle,
  Cake,
  Business,
  Group,
  Schedule,
  MonetizationOn,
  Loyalty,
  BarChart,
  Speed,
  Visibility,
  Mail,
  Sms,
  PushPin,
  NotificationsActive,
  Language,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Socio, SocioStats, SocioActivity } from '@/types/socio';
import { socioService } from '@/services/socio.service';
import toast from 'react-hot-toast';

interface SocioProfileViewProps {
  socio: Socio;
  open: boolean;
  onClose: () => void;
  onEdit?: (socio: Socio) => void;
  onRefresh?: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`profile-tabpanel-${index}`}
    aria-labelledby={`profile-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

// Componente de tarjeta de estadística
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: number;
  subtitle?: string;
}> = ({ title, value, icon, color, change, subtitle }) => (
  <Card
    elevation={0}
    sx={{
      border: '1px solid #f1f5f9',
      borderRadius: 4,
      p: 3,
      background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
      transition: 'all 0.2s ease',
      flex: 1,
      minWidth: { xs: '100%', sm: '250px' },
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Avatar
        sx={{
          bgcolor: alpha(color, 0.1),
          color: color,
          width: 48,
          height: 48,
        }}
      >
        {icon}
      </Avatar>
      {change !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {change >= 0 ? (
            <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />
          ) : (
            <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />
          )}
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: change >= 0 ? '#10b981' : '#ef4444',
            }}
          >
            {change > 0 ? '+' : ''}{change}%
          </Typography>
        </Box>
      )}
    </Box>
    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </Typography>
    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.5, display: 'block' }}>
        {subtitle}
      </Typography>
    )}
  </Card>
);

// Componente de actividad
const ActivityItem: React.FC<{
  activity: SocioActivity;
  isLast: boolean;
}> = ({ activity, isLast }) => {
  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'beneficio': return <LocalOffer sx={{ fontSize: 16 }} />;
      case 'validacion': return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'registro': return <Person sx={{ fontSize: 16 }} />;
      case 'actualizacion': return <Edit sx={{ fontSize: 16 }} />;
      case 'configuracion': return <Settings sx={{ fontSize: 16 }} />;
      default: return <Info sx={{ fontSize: 16 }} />;
    }
  };

  const getActivityColor = (tipo: string) => {
    switch (tipo) {
      case 'beneficio': return '#8b5cf6';
      case 'validacion': return '#10b981';
      case 'registro': return '#6366f1';
      case 'actualizacion': return '#f59e0b';
      case 'configuracion': return '#64748b';
      default: return '#94a3b8';
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, position: 'relative' }}>
      {/* Timeline line */}
      {!isLast && (
        <Box
          sx={{
            position: 'absolute',
            left: 16,
            top: 40,
            bottom: -16,
            width: 2,
            bgcolor: '#f1f5f9',
          }}
        />
      )}
      
      {/* Activity icon */}
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: alpha(getActivityColor(activity.tipo), 0.1),
          color: getActivityColor(activity.tipo),
        }}
      >
        {getActivityIcon(activity.tipo)}
      </Avatar>
      
      {/* Activity content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mb: 0.5 }}>
          {activity.titulo}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
          {activity.descripcion}
        </Typography>
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          {format(activity.fecha.toDate(), 'dd MMM yyyy, HH:mm', { locale: es })}
        </Typography>
        
        {/* Metadata */}
        {activity.metadata && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {activity.metadata.comercioNombre && (
              <Chip
                label={activity.metadata.comercioNombre}
                size="small"
                sx={{
                  bgcolor: alpha('#6366f1', 0.1),
                  color: '#6366f1',
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
            )}
            {activity.metadata.montoDescuento && (
              <Chip
                label={`$${activity.metadata.montoDescuento}`}
                size="small"
                sx={{
                  bgcolor: alpha('#10b981', 0.1),
                  color: '#10b981',
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const SocioProfileView: React.FC<SocioProfileViewProps> = ({
  socio,
  open,
  onClose,
  onEdit,
  onRefresh,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState<SocioStats | null>(null);
  const [activities, setActivities] = useState<SocioActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Cargar datos del perfil
  const loadProfileData = React.useCallback(async () => {
    if (!socio) return;
    
    setLoading(true);
    try {
      const [statsData, activitiesData] = await Promise.all([
        socioService.getSocioStats(socio.uid),
        socioService.getSocioActivity(socio.uid, { limit: 20 }),
      ]);
      
      setStats(statsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast.error('Error al cargar los datos del perfil');
    } finally {
      setLoading(false);
    }
  }, [socio]);

  useEffect(() => {
    if (open && socio) {
      loadProfileData();
    }
  }, [open, socio, loadProfileData]);

  const handleImageUpload = async (file: File) => {
    if (!socio) return;
    
    setUploading(true);
    try {
      await socioService.uploadProfileImage(socio.uid, file);
      toast.success('Imagen de perfil actualizada');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleExportData = async () => {
    if (!socio) return;
    
    try {
      const exportData = await socioService.exportSocioData(socio.uid);
      
      // Crear y descargar archivo JSON
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `perfil_${socio.nombre.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Datos exportados correctamente');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Error al exportar los datos');
    }
  };

  const getStatusChip = (estado: string) => {
    const config = {
      activo: { color: '#10b981', bgcolor: alpha('#10b981', 0.1), label: 'Activo', icon: <CheckCircle /> },
      vencido: { color: '#ef4444', bgcolor: alpha('#ef4444', 0.1), label: 'Vencido', icon: <Warning /> },
      inactivo: { color: '#6b7280', bgcolor: alpha('#6b7280', 0.1), label: 'Inactivo', icon: <ErrorIcon /> },
      pendiente: { color: '#f59e0b', bgcolor: alpha('#f59e0b', 0.1), label: 'Pendiente', icon: <Schedule /> },
    };

    const { color, bgcolor, label, icon } = config[estado as keyof typeof config] || config.inactivo;

    return (
      <Chip
        label={label}
        icon={React.cloneElement(icon, { sx: { fontSize: '0.9rem !important' } })}
        sx={{
          bgcolor,
          color,
          fontWeight: 600,
          fontSize: '0.875rem',
          height: 32,
          borderRadius: 3,
          '& .MuiChip-icon': {
            fontSize: '0.9rem',
          }
        }}
      />
    );
  };

  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { label: 'Muy Alto', color: '#10b981' };
    if (score >= 60) return { label: 'Alto', color: '#f59e0b' };
    if (score >= 40) return { label: 'Medio', color: '#6366f1' };
    return { label: 'Bajo', color: '#ef4444' };
  };

  const calculateEngagementScore = () => {
    if (!stats) return 50;
    
    let score = 50;
    if (socio.estado === 'activo') score += 20;
    if (stats.beneficiosUsados && stats.beneficiosUsados > 0) score += 15;
    if (stats.comerciosVisitados && stats.comerciosVisitados > 3) score += 10;
    if (stats.racha && stats.racha > 7) score += 5;
    
    return Math.min(100, Math.max(0, score));
  };

  const engagementScore = calculateEngagementScore();
  const engagementLevel = getEngagementLevel(engagementScore);

  if (!socio) return null;

  return (
    <AnimatePresence>
      {open && (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 1, md: 3 },
          }}
          onClick={onClose}
        >
          <Card
            component={motion.div}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', md: 1200 },
              maxHeight: { xs: '100%', md: '90vh' },
              borderRadius: { xs: 0, md: 6 },
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                color: 'white',
                p: { xs: 3, md: 4 },
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  bgcolor: alpha('#ffffff', 0.1),
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: alpha('#ffffff', 0.1),
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', gap: 3, flex: 1 }}>
                  {/* Avatar */}
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={socio.avatar}
                      sx={{
                        width: { xs: 80, md: 100 },
                        height: { xs: 80, md: 100 },
                        bgcolor: alpha('#ffffff', 0.2),
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        fontWeight: 700,
                        border: '4px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {socio.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </Avatar>
                    
                    {/* Upload button */}
                    <Tooltip title="Cambiar imagen">
                      <IconButton
                        component="label"
                        disabled={uploading}
                        sx={{
                          position: 'absolute',
                          bottom: -8,
                          right: -8,
                          bgcolor: 'white',
                          color: '#6366f1',
                          width: 32,
                          height: 32,
                          '&:hover': {
                            bgcolor: '#f8fafc',
                          },
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                      >
                        <Camera sx={{ fontSize: 16 }} />
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, wordBreak: 'break-word' }}>
                      {socio.nombre}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, wordBreak: 'break-all' }}>
                      {socio.email}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {getStatusChip(socio.estado)}
                      <Chip
                        label={`${engagementLevel.label} (${engagementScore}%)`}
                        sx={{
                          bgcolor: alpha(engagementLevel.color, 0.2),
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          height: 32,
                          borderRadius: 3,
                        }}
                      />
                    </Box>

                    {/* Quick stats - Using Flexbox instead of Grid */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 2, 
                        mt: 1,
                        '& > *': {
                          flex: { xs: '1 1 calc(50% - 8px)', sm: '1 1 calc(25% - 12px)' },
                          minWidth: '120px',
                        }
                      }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          {stats?.tiempoComoSocio || 0}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          días como socio
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          {stats?.beneficiosUsados || 0}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          beneficios usados
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          ${stats?.ahorroTotal || 0}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          ahorro total
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          {stats?.racha || 0}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          días de racha
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Actualizar">
                    <IconButton
                      onClick={() => {
                        loadProfileData();
                        if (onRefresh) onRefresh();
                      }}
                      disabled={loading}
                      sx={{
                        color: 'white',
                        bgcolor: alpha('#ffffff', 0.1),
                        '&:hover': {
                          bgcolor: alpha('#ffffff', 0.2),
                        }
                      }}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  
                  {onEdit && (
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => onEdit(socio)}
                        sx={{
                          color: 'white',
                          bgcolor: alpha('#ffffff', 0.1),
                          '&:hover': {
                            bgcolor: alpha('#ffffff', 0.2),
                          }
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  <Tooltip title="Exportar datos">
                    <IconButton
                      onClick={handleExportData}
                      sx={{
                        color: 'white',
                        bgcolor: alpha('#ffffff', 0.1),
                        '&:hover': {
                          bgcolor: alpha('#ffffff', 0.2),
                        }
                      }}
                    >
                      <Download />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Cerrar">
                    <IconButton
                      onClick={onClose}
                      sx={{
                        color: 'white',
                        bgcolor: alpha('#ffffff', 0.1),
                        '&:hover': {
                          bgcolor: alpha('#ffffff', 0.2),
                        }
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fafbfc' }}>
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                variant={isMobile ? 'scrollable' : 'standard'}
                scrollButtons="auto"
                sx={{
                  px: { xs: 2, md: 4 },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    minHeight: 48,
                  },
                  '& .Mui-selected': {
                    color: '#6366f1',
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#6366f1',
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  },
                }}
              >
                <Tab icon={<Person />} label="Información" />
                <Tab icon={<Analytics />} label="Estadísticas" />
                <Tab icon={<Timeline />} label="Actividad" />
                <Tab icon={<Settings />} label="Configuración" />
              </Tabs>
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 4 } }}>
              {loading && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress sx={{ borderRadius: 2 }} />
                </Box>
              )}

              {/* Tab 1: Información Personal */}
              <TabPanel value={tabValue} index={0}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                  }}
                >
                  {/* Información básica */}
                  <Box sx={{ flex: 1 }}>
                    <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 4, p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountCircle sx={{ color: '#6366f1' }} />
                        Información Personal
                      </Typography>
                      
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Person sx={{ color: '#94a3b8', fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              Nombre completo
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {socio.nombre}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Email sx={{ color: '#94a3b8', fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              Correo electrónico
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {socio.email}
                            </Typography>
                          </Box>
                        </Box>

                        {socio.telefono && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Phone sx={{ color: '#94a3b8', fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                Teléfono
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 600 }}>
                                {socio.telefono}
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        {socio.dni && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <BadgeIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                DNI
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 600 }}>
                                {socio.dni}
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        {socio.direccion && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LocationOn sx={{ color: '#94a3b8', fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                Dirección
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 600 }}>
                                {socio.direccion}
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        {socio.fechaNacimiento && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Cake sx={{ color: '#94a3b8', fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                Fecha de nacimiento
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 600 }}>
                                {format(socio.fechaNacimiento.toDate(), 'dd MMMM yyyy', { locale: es })}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Stack>
                    </Card>
                  </Box>

                  {/* Información de membresía */}
                  <Box sx={{ flex: 1 }}>
                    <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 4, p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Business sx={{ color: '#6366f1' }} />
                        Información de Membresía
                      </Typography>
                      
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CalendarToday sx={{ color: '#94a3b8', fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              Fecha de registro
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {format(socio.creadoEn.toDate(), 'dd MMMM yyyy', { locale: es })}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CheckCircle sx={{ color: '#94a3b8', fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              Estado actual
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                              {getStatusChip(socio.estado)}
                            </Box>
                          </Box>
                        </Box>

                        {socio.ultimoAcceso && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Schedule sx={{ color: '#94a3b8', fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                Último acceso
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 600 }}>
                                {format(socio.ultimoAcceso.toDate(), 'dd MMM yyyy, HH:mm', { locale: es })}
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Group sx={{ color: '#94a3b8', fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              Asociación
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {socio.asociacion || 'No especificada'}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Engagement score */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Speed sx={{ color: '#94a3b8', fontSize: 20 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              Nivel de engagement
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                              <LinearProgress
                                variant="determinate"
                                value={engagementScore}
                                sx={{
                                  flex: 1,
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: alpha(engagementLevel.color, 0.1),
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: engagementLevel.color,
                                    borderRadius: 4,
                                  }
                                }}
                              />
                              <Typography variant="body2" sx={{ color: engagementLevel.color, fontWeight: 700, minWidth: 'fit-content' }}>
                                {engagementScore}%
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: engagementLevel.color, fontWeight: 600 }}>
                              {engagementLevel.label}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Card>
                  </Box>
                </Box>
              </TabPanel>

              {/* Tab 2: Estadísticas */}
              <TabPanel value={tabValue} index={1}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: 3,
                    '& > *': {
                      flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' },
                      minWidth: '250px',
                    }
                  }}
                >
                  <StatCard
                    title="Beneficios Usados"
                    value={stats?.beneficiosUsados || 0}
                    icon={<LocalOffer />}
                    color="#8b5cf6"
                    subtitle="Total de beneficios utilizados"
                  />
                  
                  <StatCard
                    title="Ahorro Total"
                    value={`$${stats?.ahorroTotal || 0}`}
                    icon={<MonetizationOn />}
                    color="#10b981"
                    subtitle="Dinero ahorrado con beneficios"
                  />
                  
                  <StatCard
                    title="Comercios Visitados"
                    value={stats?.comerciosVisitados || 0}
                    icon={<Store />}
                    color="#6366f1"
                    subtitle="Comercios únicos visitados"
                  />
                  
                  <StatCard
                    title="Racha Actual"
                    value={`${stats?.racha || 0} días`}
                    icon={<Loyalty />}
                    color="#f59e0b"
                    subtitle="Días consecutivos con actividad"
                  />
                </Box>
              </TabPanel>

              {/* Tab 3: Actividad */}
              <TabPanel value={tabValue} index={2}>
                <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 4, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Timeline sx={{ color: '#6366f1' }} />
                      Actividad Reciente
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Refresh />}
                      onClick={loadProfileData}
                      disabled={loading}
                      sx={{
                        borderColor: '#e2e8f0',
                        color: '#64748b',
                        '&:hover': {
                          borderColor: '#6366f1',
                          color: '#6366f1',
                        }
                      }}
                    >
                      Actualizar
                    </Button>
                  </Box>

                  {activities.length > 0 ? (
                    <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                      <Stack spacing={3}>
                        {activities.map((activity, index) => (
                          <ActivityItem
                            key={activity.id}
                            activity={activity}
                            isLast={index === activities.length - 1}
                          />
                        ))}
                      </Stack>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Timeline sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                        No hay actividad registrada
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        La actividad del socio aparecerá aquí cuando comience a usar beneficios
                      </Typography>
                    </Box>
                  )}
                </Card>
              </TabPanel>

              {/* Tab 4: Configuración */}
              <TabPanel value={tabValue} index={3}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 3,
                  }}
                >
                  {/* First row - Notifications and Privacy */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: 3,
                    }}
                  >
                    {/* Configuración de notificaciones */}
                    <Box sx={{ flex: 1 }}>
                      <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 4, p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Notifications sx={{ color: '#6366f1' }} />
                          Configuración de Notificaciones
                        </Typography>
                        
                        <Stack spacing={3}>
                          {[
                            {
                              key: 'notificaciones',
                              label: 'Notificaciones generales',
                              description: 'Recibir notificaciones del sistema',
                              icon: <NotificationsActive />,
                              enabled: socio.configuracion?.notificaciones ?? true,
                            },
                            {
                              key: 'notificacionesPush',
                              label: 'Notificaciones push',
                              description: 'Notificaciones en tiempo real',
                              icon: <PushPin />,
                              enabled: socio.configuracion?.notificacionesPush ?? true,
                            },
                            {
                              key: 'notificacionesEmail',
                              label: 'Notificaciones por email',
                              description: 'Recibir emails informativos',
                              icon: <Mail />,
                              enabled: socio.configuracion?.notificacionesEmail ?? true,
                            },
                            {
                              key: 'notificacionesSMS',
                              label: 'Notificaciones por SMS',
                              description: 'Mensajes de texto importantes',
                              icon: <Sms />,
                              enabled: socio.configuracion?.notificacionesSMS ?? false,
                            },
                          ].map((config) => (
                            <Box key={config.key} sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 2, bgcolor: '#fafbfc', borderRadius: 3 }}>
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: config.enabled ? alpha('#10b981', 0.1) : alpha('#6b7280', 0.1),
                                  color: config.enabled ? '#10b981' : '#6b7280',
                                }}
                              >
                                {config.icon}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mb: 0.5 }}>
                                  {config.label}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748b' }}>
                                  {config.description}
                                </Typography>
                              </Box>
                              <Chip
                                label={config.enabled ? 'Habilitado' : 'Deshabilitado'}
                                size="small"
                                sx={{
                                  bgcolor: config.enabled ? alpha('#10b981', 0.1) : alpha('#6b7280', 0.1),
                                  color: config.enabled ? '#10b981' : '#6b7280',
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                          ))}
                        </Stack>
                      </Card>
                    </Box>

                    {/* Configuración de privacidad */}
                    <Box sx={{ flex: 1 }}>
                      <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 4, p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Security sx={{ color: '#6366f1' }} />
                          Configuración de Privacidad
                        </Typography>
                        
                        <Stack spacing={3}>
                          {[
                            {
                              key: 'perfilPublico',
                              label: 'Perfil público',
                              description: 'Permitir que otros vean el perfil',
                              icon: <Visibility />,
                              enabled: socio.configuracion?.perfilPublico ?? false,
                            },
                            {
                              key: 'mostrarEstadisticas',
                              label: 'Mostrar estadísticas',
                              description: 'Compartir estadísticas de uso',
                              icon: <BarChart />,
                              enabled: socio.configuracion?.mostrarEstadisticas ?? true,
                            },
                            {
                              key: 'mostrarActividad',
                              label: 'Mostrar actividad',
                              description: 'Mostrar actividad reciente',
                              icon: <Timeline />,
                              enabled: socio.configuracion?.mostrarActividad ?? true,
                            },
                            {
                              key: 'compartirDatos',
                              label: 'Compartir datos',
                              description: 'Permitir análisis de datos',
                              icon: <Share />,
                              enabled: socio.configuracion?.compartirDatos ?? false,
                            },
                          ].map((config) => (
                            <Box key={config.key} sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 2, bgcolor: '#fafbfc', borderRadius: 3 }}>
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: config.enabled ? alpha('#6366f1', 0.1) : alpha('#6b7280', 0.1),
                                  color: config.enabled ? '#6366f1' : '#6b7280',
                                }}
                              >
                                {config.icon}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mb: 0.5 }}>
                                  {config.label}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748b' }}>
                                  {config.description}
                                </Typography>
                              </Box>
                              <Chip
                                label={config.enabled ? 'Habilitado' : 'Deshabilitado'}
                                size="small"
                                sx={{
                                  bgcolor: config.enabled ? alpha('#6366f1', 0.1) : alpha('#6b7280', 0.1),
                                  color: config.enabled ? '#6366f1' : '#6b7280',
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                          ))}
                        </Stack>
                      </Card>
                    </Box>
                  </Box>

                  {/* Second row - Appearance and Preferences */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: 3,
                    }}
                  >
                    {/* Configuración de apariencia */}
                    <Box sx={{ flex: 1 }}>
                      <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 4, p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Settings sx={{ color: '#6366f1' }} />
                          Configuración de Apariencia
                        </Typography>
                        
                        <Stack spacing={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 2, bgcolor: '#fafbfc', borderRadius: 3 }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: alpha('#8b5cf6', 0.1),
                                color: '#8b5cf6',
                              }}
                            >
                              <Settings />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mb: 0.5 }}>
                                Tema
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {socio.configuracion?.tema || 'light'}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 2, bgcolor: '#fafbfc', borderRadius: 3 }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: alpha('#f59e0b', 0.1),
                                color: '#f59e0b',
                              }}
                            >
                              <Language />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mb: 0.5 }}>
                                Idioma
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {socio.configuracion?.idioma === 'es' ? 'Español' : 'Inglés'}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 2, bgcolor: '#fafbfc', borderRadius: 3 }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: alpha('#10b981', 0.1),
                                color: '#10b981',
                              }}
                            >
                              <MonetizationOn />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mb: 0.5 }}>
                                Moneda
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {socio.configuracion?.moneda || 'ARS'}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 2, bgcolor: '#fafbfc', borderRadius: 3 }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: alpha('#06b6d4', 0.1),
                                color: '#06b6d4',
                              }}
                            >
                              <Schedule />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mb: 0.5 }}>
                                Zona horaria
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {socio.configuracion?.timezone || 'America/Argentina/Buenos_Aires'}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Card>
                    </Box>

                    {/* Preferencias */}
                    <Box sx={{ flex: 1 }}>
                      <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 4, p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Favorite sx={{ color: '#6366f1' }} />
                          Preferencias
                        </Typography>
                        
                        <Stack spacing={3}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mb: 2 }}>
                              Beneficios Favoritos
                            </Typography>
                            {socio.configuracion?.beneficiosFavoritos && socio.configuracion.beneficiosFavoritos.length > 0 ? (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {socio.configuracion.beneficiosFavoritos.map((beneficio, index) => (
                                  <Chip
                                    key={index}
                                    label={beneficio}
                                    size="small"
                                    sx={{
                                      bgcolor: alpha('#ec4899', 0.1),
                                      color: '#ec4899',
                                      fontWeight: 600,
                                    }}
                                  />
                                ))}
                              </Box>
                            ) : (
                              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                No hay beneficios favoritos configurados
                              </Typography>
                            )}
                          </Box>

                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mb: 2 }}>
                              Comercios Favoritos
                            </Typography>
                            {socio.configuracion?.comerciosFavoritos && socio.configuracion.comerciosFavoritos.length > 0 ? (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {socio.configuracion.comerciosFavoritos.map((comercio, index) => (
                                  <Chip
                                    key={index}
                                    label={comercio}
                                    size="small"
                                    sx={{
                                      bgcolor: alpha('#6366f1', 0.1),
                                      color: '#6366f1',
                                      fontWeight: 600,
                                    }}
                                  />
                                ))}
                              </Box>
                            ) : (
                              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                No hay comercios favoritos configurados
                              </Typography>
                            )}
                          </Box>

                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mb: 2 }}>
                              Categorías Favoritas
                            </Typography>
                            {socio.configuracion?.categoriasFavoritas && socio.configuracion.categoriasFavoritas.length > 0 ? (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {socio.configuracion.categoriasFavoritas.map((categoria, index) => (
                                  <Chip
                                    key={index}
                                    label={categoria}
                                    size="small"
                                    sx={{
                                      bgcolor: alpha('#10b981', 0.1),
                                      color: '#10b981',
                                      fontWeight: 600,
                                    }}
                                  />
                                ))}
                              </Box>
                            ) : (
                              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                No hay categorías favoritas configuradas
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </Card>
                    </Box>
                  </Box>
                </Box>
              </TabPanel>
            </Box>
          </Card>
        </Box>
      )}
    </AnimatePresence>
  );
};
