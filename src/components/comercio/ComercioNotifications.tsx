'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Avatar,
  alpha,
  Paper,
  Chip,
  IconButton,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Menu,
  ListItemIcon,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  NotificationsOff,
  Settings,
  Add,
  Email,
  Sms,
  WhatsApp,
  Schedule,
  TrendingUp,
  LocalOffer,
  People,
  CheckCircle,
  Warning,
  Info,
  Error,
  Delete,
  Edit,
  MoreVert,
  Send,
  Campaign,
  AccessTime,
  Group,
  Receipt,
  Star,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

// Types for notifications
interface ComercioNotification {
  id: string;
  tipo: 'validacion' | 'beneficio_vencido' | 'limite_alcanzado' | 'nuevo_socio' | 'sistema';
  titulo: string;
  mensaje: string;
  fechaCreacion: Date;
  leida: boolean;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  datos?: any;
}

interface NotificationRule {
  id: string;
  nombre: string;
  tipo: 'validacion_exitosa' | 'validacion_fallida' | 'beneficio_usado' | 'limite_alcanzado' | 'beneficio_vencido';
  activa: boolean;
  condiciones: {
    cantidad?: number;
    periodo?: string;
    beneficioId?: string;
  };
  acciones: {
    email: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  mensaje: string;
}

// Validation schema for notification rules
const notificationRuleSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  tipo: z.enum(['validacion_exitosa', 'validacion_fallida', 'beneficio_usado', 'limite_alcanzado', 'beneficio_vencido']),
  condiciones: z.object({
    cantidad: z.number().min(1).optional(),
    periodo: z.string().optional(),
    beneficioId: z.string().optional(),
  }),
  acciones: z.object({
    email: z.boolean(),
    whatsapp: z.boolean(),
    push: z.boolean(),
  }),
  mensaje: z.string().min(1, 'El mensaje es requerido'),
});

type NotificationRuleFormData = z.infer<typeof notificationRuleSchema>;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notifications-tabpanel-${index}`}
      aria-labelledby={`notifications-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const ComercioNotifications: React.FC = () => {
  const { comercio } = useComercios();
  const { beneficios } = useBeneficios();
  const { validaciones } = useValidaciones();
  
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState<ComercioNotification[]>([]);
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([]);
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRule, setSelectedRule] = useState<NotificationRule | null>(null);
  
  // Global notification settings
  const [globalSettings, setGlobalSettings] = useState({
    notificacionesActivas: true,
    emailActivo: true,
    whatsappActivo: false,
    pushActivo: true,
    horaInicio: '09:00',
    horaFin: '18:00',
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<NotificationRuleFormData>({
    resolver: zodResolver(notificationRuleSchema),
    defaultValues: {
      nombre: '',
      tipo: 'validacion_exitosa',
      condiciones: {},
      acciones: {
        email: true,
        whatsapp: false,
        push: true,
      },
      mensaje: '',
    }
  });

  const selectedTipo = watch('tipo');

  // Generate mock notifications based on real data
  useEffect(() => {
    if (!comercio) return;

    const mockNotifications: ComercioNotification[] = [
      {
        id: '1',
        tipo: 'validacion',
        titulo: 'Nueva validación exitosa',
        mensaje: 'Un socio ha utilizado tu beneficio "Descuento 20%" hace 5 minutos',
        fechaCreacion: new Date(Date.now() - 5 * 60 * 1000),
        leida: false,
        prioridad: 'media',
      },
      {
        id: '2',
        tipo: 'beneficio_vencido',
        titulo: 'Beneficio próximo a vencer',
        mensaje: 'Tu beneficio "2x1 en productos" vence en 3 días',
        fechaCreacion: new Date(Date.now() - 2 * 60 * 60 * 1000),
        leida: false,
        prioridad: 'alta',
      },
      {
        id: '3',
        tipo: 'limite_alcanzado',
        titulo: 'Límite de beneficio alcanzado',
        mensaje: 'El beneficio "Envío gratis" ha alcanzado su límite de usos',
        fechaCreacion: new Date(Date.now() - 4 * 60 * 60 * 1000),
        leida: true,
        prioridad: 'alta',
      },
      {
        id: '4',
        tipo: 'nuevo_socio',
        titulo: 'Nuevo socio interesado',
        mensaje: '3 nuevos socios han visto tus beneficios hoy',
        fechaCreacion: new Date(Date.now() - 6 * 60 * 60 * 1000),
        leida: true,
        prioridad: 'baja',
      },
      {
        id: '5',
        tipo: 'sistema',
        titulo: 'Actualización del sistema',
        mensaje: 'Nueva funcionalidad disponible: Análisis de tendencias',
        fechaCreacion: new Date(Date.now() - 24 * 60 * 60 * 1000),
        leida: true,
        prioridad: 'media',
      },
    ];

    setNotifications(mockNotifications);

    // Mock notification rules
    const mockRules: NotificationRule[] = [
      {
        id: '1',
        nombre: 'Validaciones exitosas diarias',
        tipo: 'validacion_exitosa',
        activa: true,
        condiciones: { cantidad: 10, periodo: 'diario' },
        acciones: { email: true, whatsapp: false, push: true },
        mensaje: 'Has alcanzado {cantidad} validaciones exitosas hoy. ¡Excelente trabajo!',
      },
      {
        id: '2',
        nombre: 'Beneficio próximo a vencer',
        tipo: 'beneficio_vencido',
        activa: true,
        condiciones: { periodo: '3_dias' },
        acciones: { email: true, whatsapp: true, push: true },
        mensaje: 'Tu beneficio "{beneficio}" vence en 3 días. Considera renovarlo.',
      },
      {
        id: '3',
        nombre: 'Límite de beneficio alcanzado',
        tipo: 'limite_alcanzado',
        activa: true,
        condiciones: {},
        acciones: { email: true, whatsapp: false, push: true },
        mensaje: 'El beneficio "{beneficio}" ha alcanzado su límite de usos.',
      },
    ];

    setNotificationRules(mockRules);
  }, [comercio]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, leida: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, leida: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case 'validacion': return <Receipt />;
      case 'beneficio_vencido': return <Schedule />;
      case 'limite_alcanzado': return <Warning />;
      case 'nuevo_socio': return <People />;
      case 'sistema': return <Info />;
      default: return <Notifications />;
    }
  };

  const getNotificationColor = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente': return '#ef4444';
      case 'alta': return '#f59e0b';
      case 'media': return '#06b6d4';
      case 'baja': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityLabel = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente': return 'Urgente';
      case 'alta': return 'Alta';
      case 'media': return 'Media';
      case 'baja': return 'Baja';
      default: return prioridad;
    }
  };

  const handleOpenRuleDialog = (rule?: NotificationRule) => {
    if (rule) {
      setEditingRule(rule);
      reset({
        nombre: rule.nombre,
        tipo: rule.tipo,
        condiciones: rule.condiciones,
        acciones: rule.acciones,
        mensaje: rule.mensaje,
      });
    } else {
      setEditingRule(null);
      reset({
        nombre: '',
        tipo: 'validacion_exitosa',
        condiciones: {},
        acciones: { email: true, whatsapp: false, push: true },
        mensaje: '',
      });
    }
    setRuleDialogOpen(true);
  };

  const handleCloseRuleDialog = () => {
    setRuleDialogOpen(false);
    setEditingRule(null);
    reset();
  };

  const onSubmitRule = async (data: NotificationRuleFormData) => {
    try {
      if (editingRule) {
        setNotificationRules(prev => 
          prev.map(rule => 
            rule.id === editingRule.id 
              ? { ...rule, ...data, activa: rule.activa }
              : rule
          )
        );
        toast.success('Regla actualizada correctamente');
      } else {
        const newRule: NotificationRule = {
          id: Date.now().toString(),
          ...data,
          activa: true,
        };
        setNotificationRules(prev => [...prev, newRule]);
        toast.success('Regla creada correctamente');
      }
      handleCloseRuleDialog();
    } catch (error) {
      toast.error('Error al guardar la regla');
    }
  };

  const toggleRuleStatus = (ruleId: string) => {
    setNotificationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, activa: !rule.activa } : rule
      )
    );
  };

  const deleteRule = (ruleId: string) => {
    setNotificationRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast.success('Regla eliminada correctamente');
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, rule: NotificationRule) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRule(rule);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRule(null);
  };

  const unreadCount = notifications.filter(n => !n.leida).length;

  const getRuleTypeLabel = (tipo: string) => {
    switch (tipo) {
      case 'validacion_exitosa': return 'Validación exitosa';
      case 'validacion_fallida': return 'Validación fallida';
      case 'beneficio_usado': return 'Beneficio usado';
      case 'limite_alcanzado': return 'Límite alcanzado';
      case 'beneficio_vencido': return 'Beneficio vencido';
      default: return tipo;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Centro de Notificaciones
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Gestiona las notificaciones y alertas de tu comercio
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Badge badgeContent={unreadCount} color="error">
            <Avatar
              sx={{
                bgcolor: alpha('#06b6d4', 0.1),
                color: '#06b6d4',
                width: 48,
                height: 48,
              }}
            >
              <Notifications />
            </Avatar>
          </Badge>
          <FormControlLabel
            control={
              <Switch
                checked={globalSettings.notificacionesActivas}
                onChange={(e) => setGlobalSettings(prev => ({ 
                  ...prev, 
                  notificacionesActivas: e.target.checked 
                }))}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#06b6d4',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#06b6d4',
                  },
                }}
              />
            }
            label="Notificaciones activas"
            sx={{ color: '#374151', fontWeight: 600 }}
          />
        </Stack>
      </Stack>

      {/* Navigation Tabs */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          background: 'white',
          border: '1px solid #f1f5f9',
          borderRadius: 3,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#64748b',
              '&.Mui-selected': {
                color: '#06b6d4',
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#06b6d4',
              height: 3,
              borderRadius: '3px 3px 0 0',
            }
          }}
        >
          <Tab
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Notifications />
                <span>Notificaciones</span>
                {unreadCount > 0 && (
                  <Chip
                    label={unreadCount}
                    size="small"
                    sx={{
                      bgcolor: '#ef4444',
                      color: 'white',
                      height: 20,
                      fontSize: '0.7rem',
                    }}
                  />
                )}
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Settings />
                <span>Reglas</span>
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Campaign />
                <span>Configuración</span>
              </Stack>
            }
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        {/* Notifications List */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Card
              elevation={0}
              sx={{
                background: 'white',
                border: '1px solid #f1f5f9',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      Notificaciones Recientes
                    </Typography>
                    {unreadCount > 0 && (
                      <Button
                        size="small"
                        onClick={markAllAsRead}
                        sx={{
                          color: '#06b6d4',
                          '&:hover': {
                            bgcolor: alpha('#06b6d4', 0.1),
                          }
                        }}
                      >
                        Marcar todas como leídas
                      </Button>
                    )}
                  </Stack>
                </Box>

                <List sx={{ p: 0 }}>
                  <AnimatePresence>
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ListItem
                          sx={{
                            borderBottom: '1px solid #f8fafc',
                            bgcolor: notification.leida ? 'transparent' : alpha('#06b6d4', 0.05),
                            '&:hover': {
                              bgcolor: alpha('#06b6d4', 0.08),
                            },
                            cursor: 'pointer',
                          }}
                          onClick={() => !notification.leida && markAsRead(notification.id)}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor: alpha(getNotificationColor(notification.prioridad), 0.1),
                                color: getNotificationColor(notification.prioridad),
                              }}
                            >
                              {getNotificationIcon(notification.tipo)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: notification.leida ? 500 : 700,
                                    color: '#1e293b',
                                  }}
                                >
                                  {notification.titulo}
                                </Typography>
                                <Chip
                                  label={getPriorityLabel(notification.prioridad)}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(getNotificationColor(notification.prioridad), 0.1),
                                    color: getNotificationColor(notification.prioridad),
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                  }}
                                />
                                {!notification.leida && (
                                  <Box
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: '50%',
                                      bgcolor: '#06b6d4',
                                    }}
                                  />
                                )}
                              </Stack>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: '#64748b',
                                    mb: 1,
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {notification.mensaje}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: '#94a3b8',
                                    fontWeight: 500,
                                  }}
                                >
                                  {format(notification.fechaCreacion, 'dd/MM/yyyy HH:mm', { locale: es })}
                                </Typography>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              sx={{ color: '#94a3b8' }}
                            >
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </List>

                {notifications.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: alpha('#06b6d4', 0.1),
                        color: '#06b6d4',
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      <Notifications sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                      No hay notificaciones
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Las notificaciones aparecerán aquí cuando ocurran eventos importantes
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {[
                {
                  title: 'Notificaciones Hoy',
                  value: notifications.filter(n => 
                    n.fechaCreacion.toDateString() === new Date().toDateString()
                  ).length,
                  icon: <NotificationsActive />,
                  color: '#06b6d4',
                },
                {
                  title: 'Sin Leer',
                  value: unreadCount,
                  icon: <Notifications />,
                  color: '#ef4444',
                },
                {
                  title: 'Alta Prioridad',
                  value: notifications.filter(n => 
                    ['alta', 'urgente'].includes(n.prioridad)
                  ).length,
                  icon: <Warning />,
                  color: '#f59e0b',
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      background: 'white',
                      border: '1px solid #f1f5f9',
                      borderRadius: 3,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: alpha(stat.color, 0.1),
                          color: stat.color,
                          width: 48,
                          height: 48,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {stat.title}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </motion.div>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {/* Notification Rules */}
        <Card
          elevation={0}
          sx={{
            background: 'white',
            border: '1px solid #f1f5f9',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                  Reglas de Notificación
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Configura cuándo y cómo recibir notificaciones automáticas
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenRuleDialog()}
                sx={{
                  bgcolor: '#06b6d4',
                  '&:hover': { bgcolor: '#0891b2' },
                }}
              >
                Nueva Regla
              </Button>
            </Stack>

            <Grid container spacing={3}>
              {notificationRules.map((rule, index) => (
                <Grid item xs={12} md={6} key={rule.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        border: '1px solid #f1f5f9',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#06b6d4',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                            {rule.nombre}
                          </Typography>
                          <Chip
                            label={getRuleTypeLabel(rule.tipo)}
                            size="small"
                            sx={{
                              bgcolor: alpha('#06b6d4', 0.1),
                              color: '#06b6d4',
                              fontWeight: 600,
                              mb: 2,
                            }}
                          />
                        </Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Switch
                            checked={rule.activa}
                            onChange={() => toggleRuleStatus(rule.id)}
                            size="small"
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#06b6d4',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#06b6d4',
                              },
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, rule)}
                            sx={{ color: '#64748b' }}
                          >
                            <MoreVert />
                          </IconButton>
                        </Stack>
                      </Stack>

                      <Typography variant="body2" sx={{ color: '#64748b', mb: 2, lineHeight: 1.5 }}>
                        {rule.mensaje}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        {rule.acciones.email && (
                          <Chip
                            icon={<Email />}
                            label="Email"
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: '#10b981', color: '#10b981' }}
                          />
                        )}
                        {rule.acciones.whatsapp && (
                          <Chip
                            icon={<WhatsApp />}
                            label="WhatsApp"
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: '#25d366', color: '#25d366' }}
                          />
                        )}
                        {rule.acciones.push && (
                          <Chip
                            icon={<Notifications />}
                            label="Push"
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: '#06b6d4', color: '#06b6d4' }}
                          />
                        )}
                      </Stack>

                      <Box
                        sx={{
                          p: 2,
                          bgcolor: rule.activa ? alpha('#10b981', 0.1) : alpha('#6b7280', 0.1),
                          borderRadius: 2,
                          border: `1px solid ${rule.activa ? alpha('#10b981', 0.2) : alpha('#6b7280', 0.2)}`,
                        }}
                      >
                        <Typography variant="caption" sx={{ 
                          color: rule.activa ? '#059669' : '#6b7280',
                          fontWeight: 600,
                        }}>
                          {rule.activa ? 'Activa' : 'Inactiva'}
                        </Typography>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {notificationRules.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: alpha('#06b6d4', 0.1),
                    color: '#06b6d4',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <Settings sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                  No hay reglas configuradas
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                  Crea reglas para recibir notificaciones automáticas
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenRuleDialog()}
                  sx={{
                    bgcolor: '#06b6d4',
                    '&:hover': { bgcolor: '#0891b2' },
                  }}
                >
                  Crear Primera Regla
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {/* Global Settings */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                background: 'white',
                border: '1px solid #f1f5f9',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                  Configuración General
                </Typography>

                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={globalSettings.emailActivo}
                        onChange={(e) => setGlobalSettings(prev => ({ 
                          ...prev, 
                          emailActivo: e.target.checked 
                        }))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#06b6d4',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#06b6d4',
                          },
                        }}
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Email sx={{ color: '#10b981' }} />
                        <Typography>Notificaciones por Email</Typography>
                      </Stack>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={globalSettings.whatsappActivo}
                        onChange={(e) => setGlobalSettings(prev => ({ 
                          ...prev, 
                          whatsappActivo: e.target.checked 
                        }))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#06b6d4',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#06b6d4',
                          },
                        }}
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WhatsApp sx={{ color: '#25d366' }} />
                        <Typography>Notificaciones por WhatsApp</Typography>
                      </Stack>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={globalSettings.pushActivo}
                        onChange={(e) => setGlobalSettings(prev => ({ 
                          ...prev, 
                          pushActivo: e.target.checked 
                        }))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#06b6d4',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#06b6d4',
                          },
                        }}
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Notifications sx={{ color: '#06b6d4' }} />
                        <Typography>Notificaciones Push</Typography>
                      </Stack>
                    }
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                background: 'white',
                border: '1px solid #f1f5f9',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                  Horario de Notificaciones
                </Typography>

                <Stack spacing={3}>
                  <TextField
                    label="Hora de inicio"
                    type="time"
                    value={globalSettings.horaInicio}
                    onChange={(e) => setGlobalSettings(prev => ({ 
                      ...prev, 
                      horaInicio: e.target.value 
                    }))}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&.Mui-focused fieldset': {
                          borderColor: '#06b6d4',
                        }
                      }
                    }}
                  />

                  <TextField
                    label="Hora de fin"
                    type="time"
                    value={globalSettings.horaFin}
                    onChange={(e) => setGlobalSettings(prev => ({ 
                      ...prev, 
                      horaFin: e.target.value 
                    }))}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&.Mui-focused fieldset': {
                          borderColor: '#06b6d4',
                        }
                      }
                    }}
                  />

                  <Box
                    sx={{
                      p: 3,
                      bgcolor: alpha('#06b6d4', 0.1),
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: alpha('#06b6d4', 0.2),
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: alpha('#06b6d4', 0.2),
                          color: '#06b6d4',
                          width: 32,
                          height: 32,
                        }}
                      >
                        <AccessTime sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0c4a6e', mb: 1 }}>
                          Horario Activo
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#0c4a6e' }}>
                          Las notificaciones se enviarán entre {globalSettings.horaInicio} y {globalSettings.horaFin}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          handleOpenRuleDialog(selectedRule!);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedRule) {
            deleteRule(selectedRule.id);
          }
          handleMenuClose();
        }} sx={{ color: '#ef4444' }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create/Edit Rule Dialog */}
      <Dialog
        open={ruleDialogOpen}
        onClose={handleCloseRuleDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
          color: 'white',
          fontWeight: 700,
        }}>
          {editingRule ? 'Editar Regla' : 'Crear Nueva Regla'}
        </DialogTitle>
        
        <form onSubmit={handleSubmit(onSubmitRule)}>
          <DialogContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  {...register('nombre')}
                  label="Nombre de la Regla"
                  fullWidth
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': {
                        borderColor: '#06b6d4',
                      }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Evento</InputLabel>
                  <Controller
                    name="tipo"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Tipo de Evento"
                        sx={{
                          borderRadius: 2,
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#06b6d4',
                          }
                        }}
                      >
                        <MenuItem value="validacion_exitosa">Validación exitosa</MenuItem>
                        <MenuItem value="validacion_fallida">Validación fallida</MenuItem>
                        <MenuItem value="beneficio_usado">Beneficio usado</MenuItem>
                        <MenuItem value="limite_alcanzado">Límite alcanzado</MenuItem>
                        <MenuItem value="beneficio_vencido">Beneficio vencido</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Conditions based on type */}
              {['validacion_exitosa', 'validacion_fallida'].includes(selectedTipo) && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('condiciones.cantidad', { valueAsNumber: true })}
                    label="Cantidad mínima"
                    type="number"
                    fullWidth
                    inputProps={{ min: 1 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&.Mui-focused fieldset': {
                          borderColor: '#06b6d4',
                        }
                      }
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
                  Canales de Notificación
                </Typography>
                <Stack spacing={2}>
                  <Controller
                    name="acciones.email"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#06b6d4',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#06b6d4',
                              },
                            }}
                          />
                        }
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Email sx={{ color: '#10b981' }} />
                            <Typography>Email</Typography>
                          </Stack>
                        }
                      />
                    )}
                  />

                  <Controller
                    name="acciones.whatsapp"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#06b6d4',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#06b6d4',
                              },
                            }}
                          />
                        }
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <WhatsApp sx={{ color: '#25d366' }} />
                            <Typography>WhatsApp</Typography>
                          </Stack>
                        }
                      />
                    )}
                  />

                  <Controller
                    name="acciones.push"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#06b6d4',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#06b6d4',
                              },
                            }}
                          />
                        }
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Notifications sx={{ color: '#06b6d4' }} />
                            <Typography>Push</Typography>
                          </Stack>
                        }
                      />
                    )}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  {...register('mensaje')}
                  label="Mensaje de la Notificación"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.mensaje}
                  helperText={errors.mensaje?.message || 'Puedes usar variables como {cantidad}, {beneficio}, etc.'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': {
                        borderColor: '#06b6d4',
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleCloseRuleDialog}
              sx={{
                color: '#64748b',
                '&:hover': {
                  bgcolor: alpha('#64748b', 0.1),
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                bgcolor: '#06b6d4',
                '&:hover': { bgcolor: '#0891b2' },
                minWidth: 120,
              }}
            >
              {isSubmitting ? 'Guardando...' : editingRule ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </motion.div>
  );
};
