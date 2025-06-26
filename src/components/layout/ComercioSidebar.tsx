'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Chip,
  useTheme,
  alpha,
  Badge,
  Tooltip,
  Paper,
  Stack,
} from '@mui/material';
import {
  Dashboard,
  BarChart,
  Store,
  LocalOffer,
  QrCode,
  Receipt,
  Notifications,
  Settings,
  Help,
  Logout,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';

interface ComercioSidebarProps {
  open: boolean;
  onToggle: () => void;
  onMenuClick?: (section: string) => void;
  activeSection?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  color: string;
  gradient?: string;
  description?: string;
  route?: string;
}

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 80;

export const ComercioSidebar: React.FC<ComercioSidebarProps> = ({
  open,
  onToggle,
  onMenuClick,
  activeSection
}) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { comercio } = useComercios();
  const { activeBeneficios } = useBeneficios();
  const { validaciones, getStats } = useValidaciones();

  const stats = getStats();
  const validacionesHoy = validaciones.filter(v => {
    const today = new Date();
    const validacionDate = v.fechaHora.toDate();
    return validacionDate.toDateString() === today.toDateString();
  }).length;

  const menuItems: MenuItem[] = [
    {
      id: 'resumen',
      label: 'Dashboard',
      icon: <Dashboard />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      description: 'Vista general',
      route: '/dashboard/comercio',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart />,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      description: 'Métricas y reportes',
      route: '/dashboard/comercio/analytics',
    },
    {
      id: 'perfil',
      label: 'Mi Comercio',
      icon: <Store />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      description: 'Perfil y configuración',
    },
    {
      id: 'beneficios',
      label: 'Beneficios',
      icon: <LocalOffer />,
      badge: activeBeneficios.length,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      description: 'Gestionar ofertas',
    },
    {
      id: 'qr-validacion',
      label: 'Validar QR',
      icon: <QrCode />,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      description: 'Escanear códigos',
    },
    {
      id: 'historial-validaciones',
      label: 'Validaciones',
      icon: <Receipt />,
      badge: validacionesHoy > 0 ? validacionesHoy : undefined,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      description: 'Historial completo',
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: <Notifications />,
      badge: '2',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      description: 'Alertas y avisos',
    },
  ];

  const bottomMenuItems: MenuItem[] = [
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: <Settings />,
      color: '#64748b',
      gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      description: 'Ajustes del sistema',
    },
    {
      id: 'ayuda',
      label: 'Ayuda',
      icon: <Help />,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      description: 'Soporte técnico',
    },
  ];

  const handleMenuClick = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route);
    } else if (onMenuClick) {
      onMenuClick(item.id);
    }
  };

  const isActive = (item: MenuItem) => {
    if (item.route) {
      return pathname === item.route;
    }
    return activeSection === item.id;
  };

  const renderMenuItem = (item: MenuItem, isBottom: boolean = false) => {
    const active = isActive(item);

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: open ? 1.02 : 1.1 }}
        whileTap={{ scale: 0.98 }}
      >
        <ListItem disablePadding sx={{ mb: 1 }}>
          <Tooltip
            title={!open ? item.label : ''}
            placement="right"
            arrow
          >
            <ListItemButton
              onClick={() => handleMenuClick(item)}
              sx={{
                minHeight: 56,
                justifyContent: open ? 'initial' : 'center',
                px: open ? 3 : 2,
                mx: 1,
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                background: active ? item.gradient : 'transparent',
                color: active ? 'white' : '#64748b',
                border: active ? 'none' : '1px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: active ? item.gradient : alpha(item.color, 0.08),
                  color: active ? 'white' : item.color,
                  transform: 'translateX(4px)',
                  boxShadow: active 
                    ? `0 8px 32px ${alpha(item.color, 0.4)}` 
                    : `0 4px 20px ${alpha(item.color, 0.15)}`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: active ? 'none' : `linear-gradient(135deg, ${alpha(item.color, 0.1)} 0%, transparent 100%)`,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover::before': {
                  opacity: active ? 0 : 1,
                },
              }}
            >
              {/* Glow effect for active item */}
              {active && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    position: 'absolute',
                    inset: -2,
                    background: item.gradient,
                    borderRadius: 16,
                    filter: 'blur(8px)',
                    zIndex: -1,
                  }}
                />
              )}

              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'inherit',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Badge 
                  badgeContent={item.badge} 
                  color="error"
                  invisible={!item.badge}
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.7rem',
                      minWidth: 18,
                      height: 18,
                      fontWeight: 700,
                      background: active ? 'rgba(255,255,255,0.9)' : '#ef4444',
                      color: active ? item.color : 'white',
                      border: active ? `2px solid ${alpha('#ffffff', 0.3)}` : 'none',
                    }
                  }}
                >
                  <motion.div
                    animate={active ? { 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0] 
                    } : {}}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatType: "reverse" 
                    }}
                  >
                    {item.icon}
                  </motion.div>
                </Badge>
              </ListItemIcon>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <ListItemText 
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: active ? 700 : 600,
                            fontSize: '0.9rem',
                            lineHeight: 1.2,
                          }}
                        >
                          {item.label}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{
                            color: active ? alpha('#ffffff', 0.8) : alpha('#64748b', 0.7),
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            lineHeight: 1.1,
                            mt: 0.5,
                            display: 'block',
                          }}
                        >
                          {item.description}
                        </Typography>
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </motion.div>
    );
  };

  const sidebarContent = (
    <>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated background pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.4,
            background: `
              radial-gradient(circle at 20% 20%, ${alpha('#6366f1', 0.1)} 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, ${alpha('#06b6d4', 0.1)} 0%, transparent 50%),
              radial-gradient(circle at 1px 1px, ${alpha('#e2e8f0', 0.8)} 1px, transparent 0)
            `,
            backgroundSize: '400px 400px, 300px 300px, 20px 20px',
            animation: 'float 20s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
              '33%': { transform: 'translate(10px, -10px) rotate(1deg)' },
              '66%': { transform: 'translate(-5px, 5px) rotate(-1deg)' },
            },
          }}
        />

        {/* Header */}
        <Box sx={{ p: open ? 3 : 2, position: 'relative', zIndex: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Avatar
                        src={comercio?.logoUrl}
                        sx={{
                          width: 48,
                          height: 48,
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          border: '3px solid rgba(255,255,255,0.9)',
                          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                        }}
                      >
                        <Store sx={{ fontSize: 24 }} />
                      </Avatar>
                    </motion.div>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 900, 
                          color: '#0f172a', 
                          fontSize: '1.1rem',
                          lineHeight: 1.2,
                        }}
                      >
                        {comercio?.nombreComercio || 'Mi Comercio'}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#64748b', 
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      >
                        Panel de Control
                      </Typography>
                    </Box>
                  </Stack>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Tooltip title={open ? 'Contraer' : 'Expandir'}>
                <IconButton
                  onClick={onToggle}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    width: 40,
                    height: 40,
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                      boxShadow: '0 6px 25px rgba(99, 102, 241, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {open ? <ChevronLeft /> : <ChevronRight />}
                </IconButton>
              </Tooltip>
            </motion.div>
          </Stack>

          {/* Status Card */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    mt: 3,
                    p: 3,
                    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Animated background */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      width: 100,
                      height: 100,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      borderRadius: '50%',
                      opacity: 0.1,
                      animation: 'pulse 3s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)', opacity: 0.1 },
                        '50%': { transform: 'scale(1.1)', opacity: 0.2 },
                      },
                    }}
                  />
                  
                  <Stack direction="column" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                        }}
                      >
                        <BarChart />
                      </Avatar>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 700, 
                          color: '#1e293b', 
                          fontSize: '0.9rem',
                        }}
                      >
                        Estado: Activo
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        icon={<TrendingUp sx={{ fontSize: 14 }} />}
                        label={`${validacionesHoy} hoy`}
                        size="small"
                        sx={{
                          bgcolor: alpha('#10b981', 0.1),
                          color: '#059669',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          height: 24,
                          '& .MuiChip-icon': {
                            fontSize: 14,
                          }
                        }}
                      />
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: '#10b981',
                          borderRadius: '50%',
                          animation: 'blink 2s ease-in-out infinite',
                          '@keyframes blink': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.3 },
                          },
                        }}
                      />
                    </Stack>
                  </Stack>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Divider sx={{ mx: 2, opacity: 0.3 }} />

        {/* Main Navigation */}
        <Box sx={{ flex: 1, overflow: 'auto', py: 2, position: 'relative', zIndex: 1 }}>
          <List sx={{ px: 1 }}>
            {menuItems.map(item => renderMenuItem(item))}
          </List>
        </Box>

        <Divider sx={{ mx: 2, opacity: 0.3 }} />

        {/* Bottom Navigation */}
        <Box sx={{ p: 2, position: 'relative', zIndex: 1 }}>
          <List sx={{ px: 1 }}>
            {bottomMenuItems.map(item => renderMenuItem(item, true))}
            
            {/* Logout Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ListItem disablePadding sx={{ mt: 2 }}>
                <Tooltip title={!open ? 'Cerrar Sesión' : ''} placement="right" arrow>
                  <ListItemButton
                    onClick={() => {/* Handle logout */}}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: open ? 3 : 2,
                      mx: 1,
                      borderRadius: 3,
                      color: '#ef4444',
                      border: '1px solid',
                      borderColor: alpha('#ef4444', 0.2),
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: alpha('#ef4444', 0.1),
                        borderColor: '#ef4444',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: 'inherit',
                      }}
                    >
                      <Logout />
                    </ListItemIcon>
                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <ListItemText 
                            primary={
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, fontSize: '0.9rem' }}
                              >
                                Cerrar Sesión
                              </Typography>
                            }
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </motion.div>
          </List>
        </Box>

        {/* Quick Stats Footer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -30,
                      left: -30,
                      width: 60,
                      height: 60,
                      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                      borderRadius: '50%',
                      opacity: 0.1,
                    }}
                  />
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#06b6d4', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.1em',
                      fontSize: '0.7rem',
                    }}
                  >
                    Resumen Rápido
                  </Typography>
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>
                        {stats.totalValidaciones}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                        Total validaciones
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>
                        {activeBeneficios.length}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                        Beneficios activos
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </>
  );

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          border: 'none',
          boxShadow: '0 0 40px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};