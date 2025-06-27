'use client';

import React, { useState } from 'react';
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
  Collapse,
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
  ExpandMore,
  TrendingUp,
  Assessment,
  AutoGraph,
  History,
  Campaign,
  AccountCircle,
  Business,
  FiberManualRecord,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useNotifications } from '@/hooks/useNotifications';

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
  children?: MenuItem[];
  color: string;
  gradient: string;
  description?: string;
  route?: string;
}

const SIDEBAR_WIDTH = 340;
const SIDEBAR_COLLAPSED_WIDTH = 85;

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
  const { stats: notificationStats } = useNotifications();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const stats = getStats();
  const validacionesHoy = validaciones.filter(v => {
    const today = new Date();
    const validacionDate = v.fechaHora.toDate();
    return validacionDate.toDateString() === today.toDateString();
  }).length;

  const handleExpandClick = (itemId: string) => {
    if (!open) return; // No expandir en modo colapsado
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'resumen',
      label: 'Dashboard',
      icon: <Dashboard />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      description: 'Vista general del negocio',
      route: '/dashboard/comercio',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      description: 'Métricas y análisis',
      route: '/dashboard/comercio/analytics',
      children: [
        {
          id: 'metrics',
          label: 'Métricas Clave',
          icon: <TrendingUp />,
          color: '#10b981',
          gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        },
        {
          id: 'reports',
          label: 'Reportes',
          icon: <Assessment />,
          color: '#f59e0b',
          gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        },
        {
          id: 'insights',
          label: 'Insights IA',
          icon: <AutoGraph />,
          color: '#ec4899',
          gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
        }
      ]
    },
    {
      id: 'perfil',
      label: 'Mi Comercio',
      icon: <Store />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      description: 'Perfil y configuración',
      route: '/dashboard/comercio/perfil',
    },
    {
      id: 'operaciones',
      label: 'Operaciones',
      icon: <LocalOffer />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      description: 'Gestión operativa',
      children: [
        {
          id: 'beneficios',
          label: 'Beneficios',
          icon: <LocalOffer />,
          badge: activeBeneficios.length,
          color: '#f59e0b',
          gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        },
        {
          id: 'qr-validacion',
          label: 'Validar QR',
          icon: <QrCode />,
          color: '#ec4899',
          gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
        },
        {
          id: 'historial-validaciones',
          label: 'Validaciones',
          icon: <Receipt />,
          badge: validacionesHoy > 0 ? validacionesHoy : undefined,
          color: '#8b5cf6',
          gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        }
      ]
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: <Campaign />,
      badge: notificationStats.unread,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      description: 'Centro de comunicaciones'
    }
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

  const renderCollapsedMenuItem = (item: MenuItem) => {
    const active = isActive(item);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Tooltip
          title={
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                {item.label}
              </Typography>
              {item.description && (
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {item.description}
                </Typography>
              )}
              {hasChildren && (
                <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  {item.children?.map(child => (
                    <Typography key={child.id} variant="caption" sx={{ display: 'block', opacity: 0.7 }}>
                      • {child.label}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          }
          placement="right"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                p: 2,
                maxWidth: 280,
              }
            }
          }}
        >
          <ListItem disablePadding sx={{ mb: 1.5 }}>
            <ListItemButton
              onClick={() => handleMenuClick(item)}
              sx={{
                minHeight: 60,
                width: 60,
                borderRadius: 3,
                mx: 'auto',
                position: 'relative',
                overflow: 'hidden',
                background: active ? item.gradient : 'transparent',
                border: active ? 'none' : `2px solid ${alpha(item.color, 0.15)}`,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: active ? item.gradient : alpha(item.color, 0.1),
                  border: `2px solid ${item.color}`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${alpha(item.color, active ? 0.4 : 0.15)}`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -3,
                  background: item.gradient,
                  borderRadius: 'inherit',
                  opacity: active ? 0.3 : 0,
                  filter: 'blur(8px)',
                  zIndex: -1,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover::before': {
                  opacity: 0.7,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                  color: active ? 'white' : item.color,
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
                      fontSize: '0.6rem',
                      minWidth: 16,
                      height: 16,
                      fontWeight: 700,
                      background: active ? 'rgba(255,255,255,0.9)' : '#ef4444',
                      color: active ? item.color : 'white',
                      border: active ? `1px solid ${alpha('#ffffff', 0.3)}` : 'none',
                      top: -2,
                      right: -2,
                    }
                  }}
                >
                  <motion.div
                    animate={active ? { 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1],
                    } : {}}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatType: "reverse" 
                    }}
                  >
                    {React.cloneElement(item.icon as React.ReactElement, {
                      sx: { fontSize: 26 }
                    })}
                  </motion.div>
                </Badge>
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </motion.div>
    );
  };

  const renderExpandedMenuItem = (item: MenuItem, level: number = 0) => {
    const active = isActive(item);
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <React.Fragment key={item.id}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: level * 0.05 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <ListItem 
            disablePadding 
            sx={{ 
              mb: level === 0 ? 1 : 0.5,
              ml: level > 0 ? 2 : 0,
            }}
          >
            <ListItemButton
              onClick={() => {
                if (hasChildren) {
                  handleExpandClick(item.id);
                } else {
                  handleMenuClick(item);
                }
              }}
              sx={{
                minHeight: level === 0 ? 56 : 44,
                px: 3,
                py: level === 0 ? 2 : 1.5,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                background: active ? item.gradient : 'transparent',
                color: active ? 'white' : '#64748b',
                border: active ? 'none' : `1px solid ${alpha(item.color, 0.1)}`,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: active ? item.gradient : alpha(item.color, 0.08),
                  color: active ? 'white' : item.color,
                  transform: 'translateX(4px)',
                  boxShadow: `0 6px 20px ${alpha(item.color, active ? 0.4 : 0.15)}`,
                  border: `1px solid ${alpha(item.color, 0.3)}`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  background: item.gradient,
                  opacity: active ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover::before': {
                  opacity: 0.7,
                },
                '&::after': active ? {
                  content: '""',
                  position: 'absolute',
                  inset: -2,
                  background: item.gradient,
                  borderRadius: 'inherit',
                  filter: 'blur(10px)',
                  opacity: 0.3,
                  zIndex: -1,
                } : {},
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
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
                      fontSize: '0.65rem',
                      minWidth: 18,
                      height: 18,
                      fontWeight: 700,
                      background: active ? 'rgba(255,255,255,0.9)' : '#ef4444',
                      color: active ? item.color : 'white',
                      border: active ? `1px solid ${alpha('#ffffff', 0.3)}` : 'none',
                    }
                  }}
                >
                  <motion.div
                    animate={active ? { 
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatType: "reverse" 
                    }}
                  >
                    {React.cloneElement(item.icon as React.ReactElement, {
                      sx: { fontSize: level === 0 ? 24 : 20 }
                    })}
                  </motion.div>
                </Badge>
              </ListItemIcon>

              <ListItemText 
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: active ? 700 : 600,
                      fontSize: level > 0 ? '0.85rem' : '0.95rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.label}
                  </Typography>
                }
                secondary={item.description && level === 0 && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: active ? alpha('#ffffff', 0.8) : alpha('#64748b', 0.7),
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      lineHeight: 1.2,
                      mt: 0.5,
                      display: 'block',
                    }}
                  >
                    {item.description}
                  </Typography>
                )}
              />

              {hasChildren && (
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <IconButton
                    size="small"
                    sx={{ 
                      color: 'inherit',
                      opacity: 0.7,
                      width: 28,
                      height: 28,
                      '&:hover': {
                        opacity: 1,
                        bgcolor: alpha('#ffffff', 0.1),
                      }
                    }}
                  >
                    <ExpandMore sx={{ fontSize: 18 }} />
                  </IconButton>
                </motion.div>
              )}
            </ListItemButton>
          </ListItem>
        </motion.div>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ py: 0.5 }}>
              {item.children?.map(child => renderExpandedMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const sidebarContent = (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: open 
          ? 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)'
          : 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: open ? 0.3 : 0.2,
          background: open ? `
            radial-gradient(circle at 25% 25%, ${alpha('#6366f1', 0.08)} 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${alpha('#8b5cf6', 0.08)} 0%, transparent 50%),
            radial-gradient(circle at 1px 1px, ${alpha('#e2e8f0', 0.6)} 1px, transparent 0)
          ` : `
            radial-gradient(circle at 50% 20%, ${alpha('#6366f1', 0.1)} 0%, transparent 40%),
            radial-gradient(circle at 50% 80%, ${alpha('#8b5cf6', 0.1)} 0%, transparent 40%)
          `,
          backgroundSize: open ? '300px 300px, 250px 250px, 20px 20px' : '150px 150px, 120px 120px',
          animation: 'float 25s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
            '33%': { transform: 'translate(8px, -6px) rotate(0.5deg)' },
            '66%': { transform: 'translate(-4px, 4px) rotate(-0.5deg)' },
          },
        }}
      />

      {/* Header */}
      <Box sx={{ p: open ? 3 : 2, position: 'relative', zIndex: 1 }}>
        <Stack 
          direction={open ? "row" : "column"} 
          alignItems="center" 
          justifyContent={open ? "space-between" : "center"}
          spacing={open ? 0 : 2}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="expanded-header"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Stack direction="row" alignItems="center" spacing={3}>
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
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.25)',
                      }}
                    >
                      <Store sx={{ fontSize: 26 }} />
                    </Avatar>
                  </motion.div>
                  
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 900, 
                        color: '#0f172a', 
                        fontSize: '1.2rem',
                        lineHeight: 1.1,
                        background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
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
            ) : (
              <motion.div
                key="collapsed-header"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Avatar
                    src={comercio?.logoUrl}
                    sx={{
                      width: 52,
                      height: 52,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      border: '3px solid rgba(255,255,255,0.9)',
                      boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    <Store sx={{ fontSize: 28 }} />
                  </Avatar>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Tooltip title={open ? 'Contraer sidebar' : 'Expandir sidebar'}>
              <IconButton
                onClick={onToggle}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  width: 40,
                  height: 40,
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {open ? <ChevronLeft sx={{ fontSize: 22 }} /> : <ChevronRight sx={{ fontSize: 22 }} />}
              </IconButton>
            </Tooltip>
          </motion.div>
        </Stack>

        {/* Business Profile - Solo en modo expandido */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Paper
                elevation={0}
                sx={{
                  mt: 3,
                  p: 3,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 60,
                    height: 60,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    borderRadius: '50%',
                    opacity: 0.08,
                  }}
                />
                
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <AccountCircle sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#1e293b', 
                        fontSize: '0.95rem',
                        lineHeight: 1.2,
                      }}
                    >
                      {user?.email?.split('@')[0] || 'Comercio'}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b', 
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    >
                      Propietario
                    </Typography>
                  </Box>
                  <Chip
                    label="ACTIVO"
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      height: 26,
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                    }}
                  />
                </Stack>

                {/* Stats compactos */}
                <Stack direction="row" spacing={3} sx={{ mt: 3, pt: 2, borderTop: '1px solid #f1f5f9' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 900, 
                        color: '#1e293b',
                        fontSize: '1rem',
                        lineHeight: 1,
                      }}
                    >
                      {stats.totalValidaciones}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b', 
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    >
                      Total
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ opacity: 0.3 }} />
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 900, 
                        color: '#10b981',
                        fontSize: '1rem',
                        lineHeight: 1,
                      }}
                    >
                      {validacionesHoy}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b', 
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    >
                      Hoy
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ opacity: 0.3 }} />
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 900, 
                        color: '#f59e0b',
                        fontSize: '1rem',
                        lineHeight: 1,
                      }}
                    >
                      {activeBeneficios.length}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b', 
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    >
                      Beneficios
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      <Divider sx={{ mx: open ? 3 : 1.5, opacity: 0.3 }} />

      {/* Navigation */}
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex',
          flexDirection: 'column',
          py: open ? 2 : 3, 
          px: open ? 1 : 0.5,
          position: 'relative', 
          zIndex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: open ? 6 : 0,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha('#64748b', 0.3),
            borderRadius: 3,
            '&:hover': {
              background: alpha('#64748b', 0.5),
            },
          },
        }}
      >
        <List sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: open ? 0 : 0.5 }}>
          {menuItems.map(item => 
            open ? renderExpandedMenuItem(item) : renderCollapsedMenuItem(item)
          )}
        </List>
      </Box>

      <Divider sx={{ mx: open ? 3 : 1.5, opacity: 0.3 }} />

      {/* Settings and Help Section */}
      <Box sx={{ p: open ? 2 : 1.5, position: 'relative', zIndex: 1 }}>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: open ? 0 : 0.5 }}>
          {/* Settings */}
          <motion.div
            whileHover={{ scale: open ? 1.01 : 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <ListItem disablePadding sx={{ mb: open ? 0.5 : 1 }}>
              <Tooltip title={!open ? 'Configuración' : ''} placement="right" arrow>
                <ListItemButton
                  onClick={() => onMenuClick?.('configuracion')}
                  sx={{
                    minHeight: open ? 44 : 56,
                    justifyContent: open ? 'initial' : 'center',
                    px: open ? 3 : 2,
                    borderRadius: 3,
                    color: '#64748b',
                    border: '1px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: alpha('#64748b', 0.08),
                      color: '#64748b',
                      transform: open ? 'translateX(4px)' : 'translateY(-2px)',
                      boxShadow: `0 4px 15px ${alpha('#64748b', 0.15)}`,
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
                    <Settings sx={{ fontSize: open ? 20 : 24 }} />
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
                              sx={{ fontWeight: 600, fontSize: '0.85rem' }}
                            >
                              Configuración
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

          {/* Help */}
          <motion.div
            whileHover={{ scale: open ? 1.01 : 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <ListItem disablePadding sx={{ mb: open ? 1 : 1.5 }}>
              <Tooltip title={!open ? 'Ayuda' : ''} placement="right" arrow>
                <ListItemButton
                  onClick={() => onMenuClick?.('ayuda')}
                  sx={{
                    minHeight: open ? 44 : 56,
                    justifyContent: open ? 'initial' : 'center',
                    px: open ? 3 : 2,
                    borderRadius: 3,
                    color: '#06b6d4',
                    border: '1px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: alpha('#06b6d4', 0.08),
                      color: '#06b6d4',
                      transform: open ? 'translateX(4px)' : 'translateY(-2px)',
                      boxShadow: `0 4px 15px ${alpha('#06b6d4', 0.15)}`,
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
                    <Help sx={{ fontSize: open ? 20 : 24 }} />
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
                              sx={{ fontWeight: 600, fontSize: '0.85rem' }}
                            >
                              Ayuda
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

      <Divider sx={{ mx: open ? 3 : 1.5, opacity: 0.3 }} />

      {/* Logout Section */}
      <Box sx={{ p: open ? 3 : 2, position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="expanded-logout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {/* Handle logout */}}
                  sx={{
                    minHeight: 52,
                    px: 3,
                    py: 2,
                    borderRadius: 3,
                    color: '#ef4444',
                    border: '2px solid',
                    borderColor: alpha('#ef4444', 0.2),
                    background: alpha('#ef4444', 0.05),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: alpha('#ef4444', 0.1),
                      borderColor: '#ef4444',
                      transform: 'translateX(4px)',
                      boxShadow: '0 6px 20px rgba(239, 68, 68, 0.2)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 3,
                      color: 'inherit',
                    }}
                  >
                    <Logout sx={{ fontSize: 22 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography
                        variant="body2"
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: '0.9rem',
                        }}
                      >
                        Cerrar Sesión
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{
                          color: alpha('#ef4444', 0.7),
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        Salir del sistema
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-logout"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Tooltip title="Cerrar Sesión" placement="right" arrow>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {/* Handle logout */}}
                    sx={{
                      minHeight: 60,
                      width: 60,
                      borderRadius: 3,
                      mx: 'auto',
                      color: '#ef4444',
                      border: '2px solid',
                      borderColor: alpha('#ef4444', 0.2),
                      background: alpha('#ef4444', 0.05),
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: alpha('#ef4444', 0.1),
                        borderColor: '#ef4444',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        justifyContent: 'center',
                        color: 'inherit',
                      }}
                    >
                      <Logout sx={{ fontSize: 24 }} />
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* System Status - Solo en modo expandido */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Box sx={{ p: 3, pt: 0, position: 'relative', zIndex: 1 }}>
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
                    top: -25,
                    left: -25,
                    width: 50,
                    height: 50,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '50%',
                    opacity: 0.1,
                  }}
                />
                
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#10b981', 
                        fontWeight: 700, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em',
                        fontSize: '0.7rem',
                      }}
                    >
                      Estado del Comercio
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#1e293b',
                        fontSize: '0.85rem',
                        lineHeight: 1.2,
                      }}
                    >
                      Operativo
                    </Typography>
                  </Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: '#10b981',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)',
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                          '50%': { opacity: 0.8, transform: 'scale(1.1)' },
                        },
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#10b981', 
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    >
                      Online
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
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
          overflowY: 'hidden',
          border: 'none',
          boxShadow: open 
            ? '0 0 50px rgba(0,0,0,0.08)' 
            : '0 0 30px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};