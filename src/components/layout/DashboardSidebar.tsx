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
  Stack,
} from '@mui/material';
import {
  Dashboard,
  Group,
  Analytics,
  Upload,
  Notifications,
  Logout,
  ChevronLeft,
  ChevronRight,
  ExpandMore,
  PersonAdd,
  Assessment,
  TrendingUp,
  Security,
  AccountCircle,
  Business,
  CloudDownload,
  CloudUpload,
  AutoGraph,
  History,
  Insights,
  DataUsage,
  PeopleAlt,
  Campaign,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useSocios } from '@/hooks/useSocios';

interface DashboardSidebarProps {
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
  gradient?: string;
  description?: string;
}

const SIDEBAR_WIDTH = 300;
const SIDEBAR_COLLAPSED_WIDTH = 80;

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  open,
  onToggle,
  onMenuClick,
  activeSection
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { stats } = useSocios();
  const [expandedItems, setExpandedItems] = useState<string[]>(['analytics', 'members']);

  const handleExpandClick = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'overview',
      label: 'Vista General',
      icon: <Dashboard />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      description: 'Dashboard principal'
    },
    {
      id: 'analytics',
      label: 'Analytics Avanzado',
      icon: <Analytics />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      description: 'Métricas y análisis',
      children: [
        {
          id: 'metrics',
          label: 'Métricas Clave',
          icon: <TrendingUp />,
          color: '#10b981',
          description: 'KPIs principales'
        },
        {
          id: 'reports',
          label: 'Reportes Detallados',
          icon: <Assessment />,
          color: '#f59e0b',
          description: 'Informes completos'
        },
        {
          id: 'insights',
          label: 'Insights con IA',
          icon: <AutoGraph />,
          color: '#ec4899',
          description: 'Análisis inteligente'
        }
      ]
    },
    {
      id: 'members',
      label: 'Gestión de Miembros',
      icon: <PeopleAlt />,
      badge: stats.total,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      description: 'Administrar socios',
      children: [
        {
          id: 'all-members',
          label: 'Todos los Miembros',
          icon: <Group />,
          badge: stats.total,
          color: '#06b6d4',
          description: 'Lista completa'
        },
        {
          id: 'active-members',
          label: 'Miembros Activos',
          icon: <PersonAdd />,
          badge: stats.activos,
          color: '#10b981',
          description: 'Membresías vigentes'
        },
        {
          id: 'expired-members',
          label: 'Miembros Vencidos',
          icon: <History />,
          badge: stats.vencidos,
          color: '#ef4444',
          description: 'Requieren renovación'
        }
      ]
    },
    {
      id: 'data',
      label: 'Centro de Datos',
      icon: <DataUsage />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      description: 'Gestión de información',
      children: [
        {
          id: 'import',
          label: 'Importar CSV',
          icon: <Upload />,
          color: '#3b82f6',
          description: 'Cargar datos masivos'
        },
        {
          id: 'export',
          label: 'Exportar Datos',
          icon: <CloudDownload />,
          color: '#10b981',
          description: 'Descargar información'
        },
        {
          id: 'backup',
          label: 'Respaldos',
          icon: <Security />,
          color: '#f59e0b',
          description: 'Copias de seguridad'
        }
      ]
    },
    {
      id: 'notifications',
      label: 'Centro de Notificaciones',
      icon: <Campaign />,
      badge: 3,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      description: 'Comunicaciones'
    }
  ];

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isActive = activeSection === item.id;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <React.Fragment key={item.id}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: level * 0.1 }}
          whileHover={{ scale: open ? 1.02 : 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <ListItem disablePadding sx={{ display: 'block', mb: 1 }}>
            <Tooltip
              title={!open ? `${item.label}${item.description ? ` - ${item.description}` : ''}` : ''}
              placement="right"
              arrow
            >
              <ListItemButton
                onClick={() => {
                  if (hasChildren) {
                    handleExpandClick(item.id);
                  } else {
                    onMenuClick(item.id);
                  }
                }}
                sx={{
                  minHeight: 60,
                  justifyContent: open ? 'initial' : 'center',
                  px: open ? 3 : 2,
                  py: 2,
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 4,
                  ml: level > 0 ? 4 : 1,
                  mr: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  background: isActive ? (item.gradient || `linear-gradient(135deg, ${item.color} 0%, ${alpha(item.color || '#6366f1', 0.8)} 100%)`) : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                  border: isActive ? 'none' : '1px solid transparent',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: isActive 
                      ? (item.gradient || `linear-gradient(135deg, ${item.color} 0%, ${alpha(item.color || '#6366f1', 0.8)} 100%)`)
                      : alpha(item.color || '#6366f1', 0.08),
                    color: isActive ? 'white' : (item.color || '#6366f1'),
                    transform: 'translateX(6px)',
                    boxShadow: isActive 
                      ? `0 12px 40px ${alpha(item.color || '#6366f1', 0.4)}` 
                      : `0 6px 25px ${alpha(item.color || '#6366f1', 0.15)}`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: isActive ? 'none' : `linear-gradient(135deg, ${alpha(item.color || '#6366f1', 0.1)} 0%, transparent 100%)`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover::before': {
                    opacity: isActive ? 0 : 1,
                  },
                }}
              >
                {/* Glow effect for active items */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      position: 'absolute',
                      inset: -3,
                      background: item.gradient || `linear-gradient(135deg, ${item.color} 0%, ${alpha(item.color || '#6366f1', 0.8)} 100%)`,
                      borderRadius: 18,
                      filter: 'blur(12px)',
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
                    transition: 'all 0.3s ease',
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
                        minWidth: 20,
                        height: 20,
                        fontWeight: 700,
                        background: isActive ? 'rgba(255,255,255,0.9)' : '#ef4444',
                        color: isActive ? (item.color || '#6366f1') : 'white',
                        border: isActive ? `2px solid ${alpha('#ffffff', 0.3)}` : 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <motion.div
                      animate={isActive ? { 
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

                <ListItemText 
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isActive ? 700 : 600,
                        fontSize: level > 0 ? '0.85rem' : '0.95rem',
                        lineHeight: 1.2,
                        opacity: open ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      {item.label}
                    </Typography>
                  }
                  secondary={open && item.description && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: isActive ? alpha('#ffffff', 0.8) : alpha('#64748b', 0.7),
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        lineHeight: 1.1,
                        mt: 0.5,
                        display: 'block',
                        opacity: open ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      {item.description}
                    </Typography>
                  )}
                />

                {hasChildren && open && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconButton
                      size="small"
                      sx={{ 
                        color: 'inherit',
                        opacity: 0.8,
                      }}
                    >
                      <ExpandMore sx={{ fontSize: 20 }} />
                    </IconButton>
                  </motion.div>
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </motion.div>

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
        background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.4,
          background: `
            radial-gradient(circle at 25% 25%, ${alpha('#6366f1', 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${alpha('#8b5cf6', 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 1px 1px, ${alpha('#e2e8f0', 0.8)} 1px, transparent 0)
          `,
          backgroundSize: '400px 400px, 350px 350px, 25px 25px',
          animation: 'float 25s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
            '33%': { transform: 'translate(15px, -10px) rotate(1deg)' },
            '66%': { transform: 'translate(-8px, 8px) rotate(-1deg)' },
          },
        }}
      />

      {/* Header */}
      <Box sx={{ p: open ? 4 : 3, position: 'relative', zIndex: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stack direction="row" alignItems="center" spacing={open ? 3 : 0}>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Avatar
                  sx={{
                    width: open ? 56 : 48,
                    height: open ? 56 : 48,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: '3px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 12px 40px rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Business sx={{ fontSize: open ? 28 : 24 }} />
                </Avatar>
              </motion.div>
              
              {open && (
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 900, 
                      color: '#0f172a', 
                      fontSize: '1.3rem',
                      lineHeight: 1.2,
                      background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Fidelita Pro
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b', 
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    Centro de Control Ejecutivo
                  </Typography>
                </Box>
              )}
            </Stack>
          </motion.div>
          
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
                  width: 44,
                  height: 44,
                  boxShadow: '0 6px 25px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                    boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {open ? <ChevronLeft /> : <ChevronRight />}
              </IconButton>
            </Tooltip>
          </motion.div>
        </Stack>

        {/* Enhanced User Profile */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: 4,
                background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Animated background elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '50%',
                  opacity: 0.1,
                  animation: 'pulse 4s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: 0.1 },
                    '50%': { transform: 'scale(1.2)', opacity: 0.2 },
                  },
                }}
              />
              
              <Stack direction="column" spacing={3}>
                <Stack direction="row" alignItems="center" spacing={3}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <AccountCircle />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#1e293b', 
                        fontSize: '1rem',
                        lineHeight: 1.2,
                      }}
                    >
                      {user?.email?.split('@')[0] || 'Administrador'}
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
                      Super Administrador
                    </Typography>
                  </Box>
                  <Chip
                    label="PRO"
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      height: 28,
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                    }}
                  />
                </Stack>

                {/* Quick Stats */}
                <Stack direction="row" spacing={2}>
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 900, 
                        color: '#1e293b',
                        fontSize: '1.1rem',
                        lineHeight: 1,
                      }}
                    >
                      {stats.total}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b', 
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Miembros
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ opacity: 0.3 }} />
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 900, 
                        color: '#10b981',
                        fontSize: '1.1rem',
                        lineHeight: 1,
                      }}
                    >
                      {stats.activos}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b', 
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Activos
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Paper>
          </motion.div>
        )}
      </Box>

      <Divider sx={{ mx: 3, opacity: 0.3 }} />

      {/* Main Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 3, position: 'relative', zIndex: 1 }}>
        <List sx={{ px: 1 }}>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      <Divider sx={{ mx: 3, opacity: 0.3 }} />

      {/* Logout Section */}
      <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ListItem disablePadding>
            <Tooltip title={!open ? 'Cerrar Sesión' : ''} placement="right" arrow>
              <ListItemButton
                onClick={() => {/* Handle logout */}}
                sx={{
                  minHeight: 56,
                  justifyContent: open ? 'initial' : 'center',
                  px: open ? 3 : 2,
                  py: 2,
                  mx: 1,
                  borderRadius: 4,
                  color: '#ef4444',
                  border: '2px solid',
                  borderColor: alpha('#ef4444', 0.2),
                  background: alpha('#ef4444', 0.05),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: alpha('#ef4444', 0.1),
                    borderColor: '#ef4444',
                    transform: 'translateX(6px)',
                    boxShadow: '0 6px 25px rgba(239, 68, 68, 0.2)',
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
                <ListItemText 
                  primary={
                    <Typography
                      variant="body2"
                      sx={{ 
                        fontWeight: 700, 
                        fontSize: '0.9rem',
                        opacity: open ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      Cerrar Sesión
                    </Typography>
                  }
                  secondary={open && (
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
                  )}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </motion.div>
      </Box>

      {/* Enhanced System Status */}
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
                p: 4,
                background: 'linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)',
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
                  left: -30,
                  width: 60,
                  height: 60,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '50%',
                  opacity: 0.1,
                }}
              />
              
              <Stack direction="column" spacing={2}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#10b981', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em',
                    fontSize: '0.7rem',
                  }}
                >
                  Estado del Sistema
                </Typography>
                
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#1e293b',
                        fontSize: '0.9rem',
                        lineHeight: 1.2,
                      }}
                    >
                      Operativo
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b', 
                        fontWeight: 500,
                        fontSize: '0.7rem',
                      }}
                    >
                      Todos los servicios funcionando
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      bgcolor: '#10b981',
                      borderRadius: '50%',
                      boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)',
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { 
                          opacity: 1,
                          transform: 'scale(1)',
                        },
                        '50%': { 
                          opacity: 0.8,
                          transform: 'scale(1.1)',
                        },
                      },
                    }}
                  />
                </Stack>
              </Stack>
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
          boxShadow: '0 0 50px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};