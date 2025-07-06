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
  Badge,
  Tooltip,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Home,
  Person,
  CardGiftcard,
  QrCodeScanner,
  Notifications,
  Logout,
  ChevronLeft,
  ChevronRight,
  AccountCircle,
  Warning,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'react-hot-toast';

interface SocioSidebarProps {
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
  gradient: string;
  description?: string;
  route?: string;
}

const SIDEBAR_WIDTH = 340;
const SIDEBAR_COLLAPSED_WIDTH = 85;

export const SocioSidebar: React.FC<SocioSidebarProps> = ({
  open,
  onToggle,
  onMenuClick,
  activeSection
}) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { stats: notificationStats } = useNotifications();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión. Inténtalo de nuevo.');
    } finally {
      setLoggingOut(false);
      setLogoutDialogOpen(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Inicio',
      icon: <Home />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      description: 'Panel principal',
      route: '/dashboard/socio',
    },
    {
      id: 'perfil',
      label: 'Mi Perfil',
      icon: <Person />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      description: 'Información personal',
      route: '/dashboard/socio/perfil',
    },
    {
      id: 'beneficios',
      label: 'Beneficios',
      icon: <CardGiftcard />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      description: 'Descuentos disponibles',
      route: '/dashboard/socio/beneficios',
    },
    {
      id: 'validar',
      label: 'Validar Beneficio',
      icon: <QrCodeScanner />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      description: 'Escanear QR',
      route: '/dashboard/socio/validar',
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: <Notifications />,
      badge: notificationStats.unread || 0,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      description: 'Mensajes y avisos',
      route: '/dashboard/socio/notificaciones',
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
            </Box>
          }
          placement="right"
          arrow
          slotProps={{
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
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatType: "reverse" 
                    }}
                  >
                    <Box sx={{ fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.icon}
                    </Box>
                  </motion.div>
                </Badge>
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </motion.div>
    );
  };

  const renderExpandedMenuItem = (item: MenuItem) => {
    const active = isActive(item);

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            onClick={() => handleMenuClick(item)}
            sx={{
              minHeight: 56,
              px: 3,
              py: 2,
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
                    scale: [1, 1.05, 1],
                  } : {}}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }}
                >
                  <Box sx={{ fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </Box>
                </motion.div>
              </Badge>
            </ListItemIcon>

            <ListItemText 
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: active ? 700 : 600,
                    fontSize: '0.95rem',
                    lineHeight: 1.3,
                  }}
                >
                  {item.label}
                </Typography>
              }
              secondary={item.description && (
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
          </ListItemButton>
        </ListItem>
      </motion.div>
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
                      sx={{
                        width: 48,
                        height: 48,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        border: '3px solid rgba(255,255,255,0.9)',
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.25)',
                        fontSize: 26,
                        fontWeight: 900,
                        color: 'white',
                      }}
                    >
                      F
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
                      Fidelitá
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b', 
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Portal Socio
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
                    sx={{
                      width: 52,
                      height: 52,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      border: '3px solid rgba(255,255,255,0.9)',
                      boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
                      fontSize: 28,
                      fontWeight: 900,
                      color: 'white',
                    }}
                  >
                    F
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

        {/* User Profile - Solo en modo expandido */}
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
                
                <Stack direction="row" alignItems="center" spacing={3}>
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
                      {user?.nombre || user?.email?.split('@')[0] || 'Socio'}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b', 
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    >
                      Miembro Activo
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
                      12
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
                      8
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b', 
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    >
                      Usados
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
                      $450
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b', 
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    >
                      Ahorrado
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
                  onClick={handleLogoutClick}
                  disabled={loggingOut}
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
                    '&:disabled': {
                      opacity: 0.6,
                      transform: 'none',
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
                        {loggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
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
                    onClick={handleLogoutClick}
                    disabled={loggingOut}
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
                      '&:disabled': {
                        opacity: 0.6,
                        transform: 'none',
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

      {/* Member Status - Solo en modo expandido */}
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
                      Socio Activo
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
                      Activo
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
                      Vigente
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
    <>
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

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
              }}
            >
              <Warning sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Confirmar Cierre de Sesión
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                ¿Estás seguro de que deseas cerrar tu sesión?
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ py: 2 }}>
          <Typography variant="body1" sx={{ color: '#475569' }}>
            Se cerrará tu sesión actual y serás redirigido a la página de inicio de sesión. 
            Cualquier trabajo no guardado se perderá.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleLogoutCancel}
            variant="outlined"
            sx={{
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#cbd5e1',
                bgcolor: '#f8fafc',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            disabled={loggingOut}
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              },
              '&:disabled': {
                opacity: 0.6,
              },
            }}
          >
            {loggingOut ? 'Cerrando Sesión...' : 'Cerrar Sesión'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};