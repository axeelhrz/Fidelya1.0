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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Grid,
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
  History,
  Receipt,
  ArrowBack,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Socio, SocioStats, SocioActivity } from '@/types/socio';
import { HistorialValidacion } from '@/services/validaciones.service';
import { socioService } from '@/services/socio.service';
import { validacionesService } from '@/services/validaciones.service';
import { safeTimestampToDate, safeFormatTimestamp } from '@/lib/utils';
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
    {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
  </div>
);

// Componente de tarjeta de estadística compacta
const CompactStatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon, color, subtitle }) => (
  <Card
    elevation={0}
    sx={{
      border: '1px solid #f1f5f9',
      borderRadius: 3,
      p: 2,
      background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar
        sx={{
          bgcolor: alpha(color, 0.1),
          color: color,
          width: 36,
          height: 36,
        }}
      >
        {icon}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  </Card>
);

// Componente de información compacta
const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}> = ({ icon, label, value, color = '#94a3b8' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
    <Box sx={{ color, fontSize: 18 }}>
      {icon}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

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
  const [validaciones, setValidaciones] = useState<HistorialValidacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Cargar datos del perfil
  const loadProfileData = React.useCallback(async () => {
    if (!socio) return;
    
    setLoading(true);
    try {
      const [statsData, activitiesData, validacionesData] = await Promise.all([
        socioService.getSocioStats?.(socio.uid) || Promise.resolve(null),
        socioService.getSocioActivity?.() || Promise.resolve([]),
        validacionesService.getHistorialValidaciones(socio.uid, 20),
      ]);
      
      setStats(statsData);
      setActivities(activitiesData);
      setValidaciones(validacionesData.validaciones);
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
      await socioService.uploadProfileImage?.(socio.uid, file);
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
      const exportData = await socioService.exportSocioData?.(socio.uid);
      
      if (exportData) {
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
      }
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
      suspendido: { color: '#ef4444', bgcolor: alpha('#ef4444', 0.1), label: 'Suspendido', icon: <ErrorIcon /> },
    };

    const { color, bgcolor, label, icon } = config[estado as keyof typeof config] || config.inactivo;

    return (
      <Chip
        label={label}
        icon={React.cloneElement(icon, { sx: { fontSize: '0.8rem !important' } })}
        size="small"
        sx={{
          bgcolor,
          color,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 24,
          '& .MuiChip-icon': {
            fontSize: '0.8rem',
          }
        }}
      />
    );
  };

  const getValidationStatusChip = (estado: string) => {
    const config = {
      exitoso: { color: '#10b981', bgcolor: alpha('#10b981', 0.1), label: 'Exitoso' },
      fallido: { color: '#ef4444', bgcolor: alpha('#ef4444', 0.1), label: 'Fallido' },
      pendiente: { color: '#f59e0b', bgcolor: alpha('#f59e0b', 0.1), label: 'Pendiente' },
    };

    const { color, bgcolor, label } = config[estado as keyof typeof config] || config.pendiente;

    return (
      <Chip
        label={label}
        size="small"
        sx={{
          bgcolor,
          color,
          fontWeight: 600,
          fontSize: '0.7rem',
          height: 20,
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

  if (!socio || !open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? 8 : 24,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: isMobile ? '100%' : 900,
            maxHeight: isMobile ? '100%' : '90vh',
            backgroundColor: 'white',
            borderRadius: isMobile ? 0 : 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Header Compacto */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
              color: 'white',
              p: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Elementos decorativos */}
            <Box
              sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: alpha('#ffffff', 0.1),
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                {/* Avatar */}
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={socio.avatar ?? undefined}
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: alpha('#ffffff', 0.2),
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      border: '3px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {socio.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </Avatar>
                  
                  <Tooltip title="Cambiar imagen">
                    <IconButton
                      component="label"
                      disabled={uploading}
                      sx={{
                        position: 'absolute',
                        bottom: -4,
                        right: -4,
                        bgcolor: 'white',
                        color: '#6366f1',
                        width: 24,
                        height: 24,
                        '&:hover': {
                          bgcolor: '#f8fafc',
                        },
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                    >
                      <Camera sx={{ fontSize: 12 }} />
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
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, wordBreak: 'break-word' }}>
                    {socio.nombre}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, wordBreak: 'break-all', fontSize: '0.85rem' }}>
                    {socio.email}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {getStatusChip(socio.estado)}
                    <Chip
                      label={`${engagementLevel.label} (${engagementScore}%)`}
                      size="small"
                      sx={{
                        bgcolor: alpha(engagementLevel.color, 0.2),
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 24,
                      }}
                    />
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
                    size="small"
                    sx={{
                      color: 'white',
                      bgcolor: alpha('#ffffff', 0.1),
                      '&:hover': {
                        bgcolor: alpha('#ffffff', 0.2),
                      }
                    }}
                  >
                    <Refresh sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                
                {onEdit && (
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => onEdit(socio)}
                      size="small"
                      sx={{
                        color: 'white',
                        bgcolor: alpha('#ffffff', 0.1),
                        '&:hover': {
                          bgcolor: alpha('#ffffff', 0.2),
                        }
                      }}
                    >
                      <Edit sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                )}
                
                <Tooltip title="Exportar datos">
                  <IconButton
                    onClick={handleExportData}
                    size="small"
                    sx={{
                      color: 'white',
                      bgcolor: alpha('#ffffff', 0.1),
                      '&:hover': {
                        bgcolor: alpha('#ffffff', 0.2),
                      }
                    }}
                  >
                    <Download sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Cerrar">
                  <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                      color: 'white',
                      bgcolor: alpha('#ffffff', 0.1),
                      '&:hover': {
                        bgcolor: alpha('#ffffff', 0.2),
                      }
                    }}
                  >
                    <Close sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          {/* Tabs Compactos */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fafbfc' }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: 2,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  minHeight: 40,
                  py: 1,
                },
                '& .Mui-selected': {
                  color: '#6366f1',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#6366f1',
                  height: 2,
                },
              }}
            >
              <Tab icon={<Person sx={{ fontSize: 16 }} />} label="Info" iconPosition="start" />
              <Tab icon={<Analytics sx={{ fontSize: 16 }} />} label="Stats" iconPosition="start" />
              <Tab icon={<History sx={{ fontSize: 16 }} />} label="Historial" iconPosition="start" />
              <Tab icon={<Settings sx={{ fontSize: 16 }} />} label="Config" iconPosition="start" />
            </Tabs>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {loading && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress sx={{ borderRadius: 1 }} />
              </Box>
            )}

            {/* Tab 1: Información Personal */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={2}>
                {/* Información básica */}
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 3, p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountCircle sx={{ color: '#6366f1', fontSize: 20 }} />
                      Información Personal
                    </Typography>
                    
                    <Stack spacing={1}>
                      <InfoItem
                        icon={<Person />}
                        label="Nombre completo"
                        value={socio.nombre}
                      />

                      <InfoItem
                        icon={<Email />}
                        label="Correo electrónico"
                        value={socio.email}
                      />

                      {socio.telefono && (
                        <InfoItem
                          icon={<Phone />}
                          label="Teléfono"
                          value={socio.telefono}
                        />
                      )}

                      {socio.dni && (
                        <InfoItem
                          icon={<BadgeIcon />}
                          label="DNI"
                          value={socio.dni}
                        />
                      )}

                      {socio.direccion && (
                        <InfoItem
                          icon={<LocationOn />}
                          label="Dirección"
                          value={socio.direccion}
                        />
                      )}

                      {socio.fechaNacimiento && (
                        <InfoItem
                          icon={<Cake />}
                          label="Fecha de nacimiento"
                          value={safeFormatTimestamp(socio.fechaNacimiento, 'dd MMMM yyyy', { locale: es })}
                        />
                      )}
                    </Stack>
                  </Card>
                </Grid>

                {/* Información de membresía */}
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 3, p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Business sx={{ color: '#6366f1', fontSize: 20 }} />
                      Membresía
                    </Typography>
                    
                    <Stack spacing={1}>
                      <InfoItem
                        icon={<CalendarToday />}
                        label="Fecha de registro"
                        value={safeFormatTimestamp(socio.creadoEn, 'dd MMMM yyyy', { locale: es })}
                      />

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                        <CheckCircle sx={{ color: '#94a3b8', fontSize: 18 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>
                            Estado actual
                          </Typography>
                          <Box sx={{ mt: 0.5 }}>
                            {getStatusChip(socio.estado)}
                          </Box>
                        </Box>
                      </Box>

                      {socio.numeroSocio && (
                        <InfoItem
                          icon={<BadgeIcon />}
                          label="Número de socio"
                          value={`#${socio.numeroSocio}`}
                        />
                      )}

                      <InfoItem
                        icon={<MonetizationOn />}
                        label="Cuota mensual"
                        value={`$${socio.montoCuota || 0}`}
                      />

                      {socio.ultimoAcceso && (
                        <InfoItem
                          icon={<Schedule />}
                          label="Último acceso"
                          value={safeFormatTimestamp(socio.ultimoAcceso, 'dd MMM yyyy, HH:mm', { locale: es })}
                        />
                      )}

                      {/* Engagement score */}
                      <Box sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Speed sx={{ color: '#94a3b8', fontSize: 18 }} />
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                            Nivel de engagement
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={engagementScore}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: alpha(engagementLevel.color, 0.1),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: engagementLevel.color,
                                borderRadius: 3,
                              }
                            }}
                          />
                          <Typography variant="caption" sx={{ color: engagementLevel.color, fontWeight: 700, minWidth: 'fit-content' }}>
                            {engagementScore}%
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: engagementLevel.color, fontWeight: 600 }}>
                          {engagementLevel.label}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 2: Estadísticas */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <CompactStatCard
                    title="Beneficios Usados"
                    value={stats?.beneficiosUsados || 0}
                    icon={<LocalOffer sx={{ fontSize: 20 }} />}
                    color="#8b5cf6"
                    subtitle="Total utilizados"
                  />
                </Grid>
                
                <Grid item xs={6} sm={4}>
                  <CompactStatCard
                    title="Ahorro Total"
                    value={`$${stats?.ahorroTotal || 0}`}
                    icon={<MonetizationOn sx={{ fontSize: 20 }} />}
                    color="#10b981"
                    subtitle="Dinero ahorrado"
                  />
                </Grid>
                
                <Grid item xs={6} sm={4}>
                  <CompactStatCard
                    title="Comercios"
                    value={stats?.comerciosVisitados || 0}
                    icon={<Store sx={{ fontSize: 20 }} />}
                    color="#6366f1"
                    subtitle="Únicos visitados"
                  />
                </Grid>
                
                <Grid item xs={6} sm={4}>
                  <CompactStatCard
                    title="Validaciones"
                    value={validaciones.filter(v => v.estado === 'exitosa').length}
                    icon={<CheckCircle sx={{ fontSize: 20 }} />}
                    color="#10b981"
                    subtitle="Exitosas"
                  />
                </Grid>
                
                <Grid item xs={6} sm={4}>
                  <CompactStatCard
                    title="Racha"
                    value={`${stats?.racha || 0} días`}
                    icon={<Loyalty sx={{ fontSize: 20 }} />}
                    color="#f59e0b"
                    subtitle="Consecutivos"
                  />
                </Grid>

                <Grid item xs={6} sm={4}>
                  <CompactStatCard
                    title="Promedio"
                    value={`$${Math.round((stats?.ahorroTotal || 0) / Math.max(1, stats?.tiempoComoSocio || 1) * 30)}`}
                    icon={<TrendingUp sx={{ fontSize: 20 }} />}
                    color="#ec4899"
                    subtitle="Mensual"
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 3: Historial de Validaciones */}
            <TabPanel value={tabValue} index={2}>
              <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 3 }}>
                <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Receipt sx={{ color: '#6366f1', fontSize: 20 }} />
                    Historial de Validaciones
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Refresh sx={{ fontSize: 16 }} />}
                    onClick={loadProfileData}
                    disabled={loading}
                    sx={{
                      borderColor: '#e2e8f0',
                      color: '#64748b',
                      fontSize: '0.75rem',
                      py: 0.5,
                      px: 1.5,
                      '&:hover': {
                        borderColor: '#6366f1',
                        color: '#6366f1',
                      }
                    }}
                  >
                    Actualizar
                  </Button>
                </Box>

                {validaciones.length > 0 ? (
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {validaciones.slice(0, 10).map((validacion, index) => (
                      <Box 
                        key={validacion.id} 
                        sx={{ 
                          p: 2, 
                          borderBottom: index < validaciones.length - 1 ? '1px solid #f1f5f9' : 'none',
                          '&:hover': { bgcolor: '#fafbfc' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                            {validacion.beneficioTitulo}
                          </Typography>
                          {getValidationStatusChip(validacion.estado)}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {validacion.comercioNombre}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                            {validacion.tipoDescuento === 'porcentaje' 
                              ? `${validacion.descuento}%` 
                              : `$${validacion.descuento}`
                            }
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            {format(validacion.fechaValidacion, 'dd MMM', { locale: es })}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Receipt sx={{ fontSize: 32, color: '#e2e8f0', mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b', mb: 0.5 }}>
                      No hay validaciones
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      Las validaciones aparecerán aquí
                    </Typography>
                  </Box>
                )}
              </Card>
            </TabPanel>

            {/* Tab 4: Configuración */}
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={2}>
                {/* Configuración de notificaciones */}
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 3, p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Notifications sx={{ color: '#6366f1', fontSize: 20 }} />
                      Notificaciones
                    </Typography>
                    
                    <Stack spacing={1}>
                      {[
                        {
                          key: 'notificaciones',
                          label: 'Notificaciones generales',
                          icon: <NotificationsActive />,
                          enabled: socio.configuracion?.notificaciones ?? true,
                        },
                        {
                          key: 'notificacionesEmail',
                          label: 'Notificaciones por email',
                          icon: <Mail />,
                          enabled: socio.configuracion?.notificacionesEmail ?? true,
                        },
                        {
                          key: 'notificacionesSMS',
                          label: 'Notificaciones por SMS',
                          icon: <Sms />,
                          enabled: socio.configuracion?.notificacionesSMS ?? false,
                        },
                      ].map((config) => (
                        <Box key={config.key} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.5 }}>
                          <Box sx={{ color: config.enabled ? '#10b981' : '#6b7280', fontSize: 18 }}>
                            {config.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>
                              {config.label}
                            </Typography>
                          </Box>
                          <Chip
                            label={config.enabled ? 'On' : 'Off'}
                            size="small"
                            sx={{
                              bgcolor: config.enabled ? alpha('#10b981', 0.1) : alpha('#6b7280', 0.1),
                              color: config.enabled ? '#10b981' : '#6b7280',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </Card>
                </Grid>

                {/* Configuración de privacidad */}
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 3, p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Security sx={{ color: '#6366f1', fontSize: 20 }} />
                      Privacidad
                    </Typography>
                    
                    <Stack spacing={1}>
                      {[
                        {
                          key: 'perfilPublico',
                          label: 'Perfil público',
                          icon: <Visibility />,
                          enabled: socio.configuracion?.perfilPublico ?? false,
                        },
                        {
                          key: 'mostrarEstadisticas',
                          label: 'Mostrar estadísticas',
                          icon: <BarChart />,
                          enabled: socio.configuracion?.mostrarEstadisticas ?? true,
                        },
                        {
                          key: 'compartirDatos',
                          label: 'Compartir datos',
                          icon: <Share />,
                          enabled: socio.configuracion?.compartirDatos ?? false,
                        },
                      ].map((config) => (
                        <Box key={config.key} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.5 }}>
                          <Box sx={{ color: config.enabled ? '#6366f1' : '#6b7280', fontSize: 18 }}>
                            {config.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>
                              {config.label}
                            </Typography>
                          </Box>
                          <Chip
                            label={config.enabled ? 'On' : 'Off'}
                            size="small"
                            sx={{
                              bgcolor: config.enabled ? alpha('#6366f1', 0.1) : alpha('#6b7280', 0.1),
                              color: config.enabled ? '#6366f1' : '#6b7280',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
