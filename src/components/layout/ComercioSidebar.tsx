'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Collapse,
  Badge,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Dashboard,
  Store,
  LocalOffer,
  QrCode,
  Receipt,
  BarChart,
  Settings,
  Notifications,
  Help,
  Logout,
  ChevronLeft,
  ChevronRight,
  ExpandMore,
  TrendingUp,
  Assessment,
  AccountCircle,
  Business,
  AttachMoney,
  People,
  History,
  Campaign,
  Analytics,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';

interface ComercioSidebarProps {
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
  activeSection: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  children?: MenuItem[];
  color?: string;
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
  const { user } = useAuth();
  const { comercio } = useComercios();
  const { activeBeneficios } = useBeneficios();
  const { validaciones, getStats } = useValidaciones();
  const [expandedItems, setExpandedItems] = useState<string[]>(['analytics', 'beneficios']);

  const stats = getStats();
  const validacionesHoy = validaciones.filter(v => {
    const today = new Date();
    const validacionDate = v.fechaHora.toDate();
    return validacionDate.toDateString() === today.toDateString();
  }).length;

  const handleExpandClick = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'resumen',
      label: 'Resumen General',
      icon: <Dashboard />,
      color: '#06b6d4'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <Analytics />,
      color: '#8b5cf6',
      children: [
        {
          id: 'estadisticas',
          label: 'Estadísticas',
          icon: <BarChart />,
          color: '#06b6d4'
        },
        {
          id: 'reportes',
          label: 'Reportes',
          icon: <Assessment />,
          color: '#f59e0b'
        },
        {
          id: 'tendencias',
          label: 'Tendencias',
          icon: <TrendingUp />,
          color: '#10b981'
        }
      ]
    },
    {
      id: 'perfil',
      label: 'Perfil del Comercio',
      icon: <Store />,
      color: '#10b981'
    },
    {
      id: 'beneficios',
      label: 'Gestión de Beneficios',
      icon: <LocalOffer />,
      badge: activeBeneficios.length,
      color: '#f59e0b',
      children: [
        {
          id: 'beneficios-activos',
          label: 'Beneficios Activos',
          icon: <LocalOffer />,
          badge: activeBeneficios.length,
          color: '#10b981'
        },
        {
          id: 'crear-beneficio',
          label: 'Crear Beneficio',
          icon: <Campaign />,
          color: '#8b5cf6'
        }
      ]
    },
    {
      id: 'validaciones',
      label: 'Validaciones',
      icon: <QrCode />,
      badge: validacionesHoy,
      color: '#ec4899',
      children: [
        {
          id: 'qr-validacion',
          label: 'Validar QR',
          icon: <QrCode />,
          color: '#ec4899'
        },
        {
          id: 'historial-validaciones',
          label: 'Historial',
          icon: <History />,
          badge: stats.totalValidaciones,
          color: '#06b6d4'
        }
      ]
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: <People />,
      color: '#06b6d4'
    },
    {
      id: 'ingresos',
      label: 'Ingresos',
      icon: <AttachMoney />,
      color: '#10b981'
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: <Notifications />,
      badge: 2,
      color: '#ec4899'
    }
  ];

  const bottomMenuItems: MenuItem[] = [
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: <Settings />,
      color: '#6b7280'
    },
    {
      id: 'ayuda',
      label: 'Ayuda y Soporte',
      icon: <Help />,
      color: '#10b981'
    },
    {
      id: 'logout',
      label: 'Cerrar Sesión',
      icon: <Logout />,
      color: '#ef4444'
    }
  ];

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isActive = activeSection === item.id;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleExpandClick(item.id);
              } else {
                onMenuClick(item.id);
              }
            }}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              py: 1.5,
              mx: 1,
              mb: 0.5,
              borderRadius: 3,
              ml: level > 0 ? 3 : 1,
              mr: 1,
              bgcolor: isActive ? alpha(item.color || '#06b6d4', 0.1) : 'transparent',
              color: isActive ? (item.color || '#06b6d4') : '#64748b',
              border: isActive ? `2px solid ${alpha(item.color || '#06b6d4', 0.2)}` : '2px solid transparent',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: alpha(item.color || '#06b6d4', 0.08),
                color: item.color || '#06b6d4',
                transform: 'translateX(4px)',
                borderColor: alpha(item.color || '#06b6d4', 0.2),
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: 'inherit',
                transition: 'all 0.3s ease',
              }}
            >
              <Badge 
                badgeContent={item.badge} 
                color="error" 
                invisible={!item.badge}
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.7rem',
                    minWidth: 16,
                    height: 16,
                  }
                }}
              >
                {item.icon}
              </Badge>
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              sx={{ 
                opacity: open ? 1 : 0,
                transition: 'opacity 0.3s ease',
                '& .MuiListItemText-primary': {
                  fontWeight: isActive ? 700 : 600,
                  fontSize: level > 0 ? '0.85rem' : '0.9rem',
                }
              }} 
            />
            {hasChildren && open && (
              <IconButton
                size="small"
                sx={{ 
                  color: 'inherit',
                  transition: 'transform 0.3s ease',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <ExpandMore sx={{ fontSize: 18 }} />
              </IconButton>
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fafbfc',
        background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
        borderRight: '1px solid #f1f5f9',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3,
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.1) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Header */}
      <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: open ? 48 : 40,
                  height: open ? 48 : 40,
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                  transition: 'all 0.3s ease',
                }}
              >
                <Store sx={{ fontSize: open ? 24 : 20 }} />
              </Avatar>
              {open && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.1rem' }}>
                    {comercio?.nombreComercio || 'Mi Comercio'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Panel de Control
                  </Typography>
                </Box>
              )}
            </Box>
          </motion.div>
          
          <Tooltip title={open ? 'Contraer sidebar' : 'Expandir sidebar'}>
            <IconButton
              onClick={onToggle}
              sx={{
                bgcolor: alpha('#06b6d4', 0.1),
                color: '#06b6d4',
                '&:hover': {
                  bgcolor: alpha('#06b6d4', 0.2),
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {open ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* User Profile */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 3,
                bgcolor: alpha('#06b6d4', 0.05),
                border: `1px solid ${alpha('#06b6d4', 0.15)}`,
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={comercio?.logoUrl}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: alpha('#06b6d4', 0.2),
                    color: '#06b6d4',
                  }}
                >
                  <AccountCircle />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>
                    {comercio?.nombre || user?.email?.split('@')[0] || 'Usuario'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                    {comercio?.categoria || 'Comercio'}
                  </Typography>
                </Box>
                <Chip
                  label={comercio?.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  size="small"
                  sx={{
                    bgcolor: comercio?.estado === 'activo' ? alpha('#10b981', 0.1) : alpha('#f59e0b', 0.1),
                    color: comercio?.estado === 'activo' ? '#10b981' : '#f59e0b',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
            </Paper>
          </motion.div>
        )}
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      {/* Main Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 2, position: 'relative', zIndex: 1 }}>
        <List>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      {/* Bottom Navigation */}
      <Box sx={{ p: 2, position: 'relative', zIndex: 1 }}>
        <List>
          {bottomMenuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      {/* Quick Stats */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: alpha('#10b981', 0.05),
                border: `1px solid ${alpha('#10b981', 0.15)}`,
                borderRadius: 4,
              }}
            >
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Validaciones Hoy
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b' }}>
                  {validacionesHoy}
                </Typography>
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
              </Box>
            </Paper>
          </Box>
        </motion.div>
      )}
    </Box>
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
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};
