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

const SIDEBAR_WIDTH = 320;
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
      label: 'Analytics',
      icon: <Analytics />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      description: 'Métricas y análisis',
      children: [
        {
          id: 'metrics',
          label: 'Métricas',
          icon: <TrendingUp />,
          color: '#10b981',
          description: 'KPIs'
        },
        {
          id: 'reports',
          label: 'Reportes',
          icon: <Assessment />,
          color: '#f59e0b',
          description: 'Informes'
        },
        {
          id: 'insights',
          label: 'Insights IA',
          icon: <AutoGraph />,
          color: '#ec4899',
          description: 'Análisis IA'
        }
      ]
    },
    {
      id: 'members',
      label: 'Miembros',
      icon: <PeopleAlt />,
      badge: stats.total,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      description: 'Gestión de socios',
      children: [
        {
          id: 'all-members',
          label: 'Todos',
          icon: <Group />,
          badge: stats.total,
          color: '#06b6d4',
          description: 'Lista completa'
        },
        {
          id: 'active-members',
          label: 'Activos',
          icon: <PersonAdd />,
          badge: stats.activos,
          color: '#10b981',
          description: 'Vigentes'
        },
        {
          id: 'expired-members',
          label: 'Vencidos',
          icon: <History />,
          badge: stats.vencidos,
          color: '#ef4444',
          description: 'A renovar'
        }
      ]
    },
    {
      id: 'data',
      label: 'Datos',
      icon: <DataUsage />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      description: 'Gestión de información',
      children: [
        {
          id: 'import',
          label: 'Importar',
          icon: <Upload />,
          color: '#3b82f6',
          description: 'CSV'
        },
        {
          id: 'export',
          label: 'Exportar',
          icon: <CloudDownload />,
          color: '#10b981',
          description: 'Datos'
        },
        {
          id: 'backup',
          label: 'Respaldos',
          icon: <Security />,
          color: '#f59e0b',
          description: 'Backup'
        }
      ]
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
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
          transition={{ duration: 0.3, delay: level * 0.05 }}
          whileHover={{ scale: open ? 1.01 : 1.03 }}
          whileTap={{ scale: 0.99 }}
        >
          <ListItem disablePadding sx={{ display: 'block', mb: level === 0 ? 0.5 : 0.3 }}>
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
                  minHeight: level === 0 ? 48 : 40,
                  justifyContent: open ? 'initial' : 'center',
                  px: open ? (level === 0 ? 2.5 : 3.5) : 2,
                  py: level === 0 ? 1.5 : 1,
                  mx: 1,
                  borderRadius: 3,
                  ml: level > 0 ? 3 : 1,
                  mr: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  background: isActive ? (item.gradient || `linear-gradient(135deg, ${item.color} 0%, ${alpha(item.color || '#6366f1', 0.8)} 100%)`) : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                  border: isActive ? 'none' : '1px solid transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: isActive 
                      ? (item.gradient || `linear-gradient(135deg, ${item.color} 0%, ${alpha(item.color || '#6366f1', 0.8)} 100%)`)
                      : alpha(item.color || '#6366f1', 0.08),
                    color: isActive ? 'white' : (item.color || '#6366f1'),
                    transform: 'translateX(4px)',
                    boxShadow: isActive 
                      ? `0 8px 32px ${alpha(item.color || '#6366f1', 0.3)}` 
                      : `0 4px 20px ${alpha(item.color || '#6366f1', 0.12)}`,
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
                      inset: -2,
                      background: item.gradient || `linear-gradient(135deg, ${item.color} 0%, ${alpha(item.color || '#6366f1', 0.8)} 100%)`,
                      borderRadius: 14,
                      filter: 'blur(8px)',
                      zIndex: -1,
                    }}
                  />
                )}

                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2.5 : 'auto',
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
                        fontSize: '0.65rem',
                        minWidth: 16,
                        height: 16,
                        fontWeight: 700,
                        background: isActive ? 'rgba(255,255,255,0.9)' : '#ef4444',
                        color: isActive ? (item.color || '#6366f1') : 'white',
                        border: isActive ? `2px solid ${alpha('#ffffff', 0.3)}` : 'none',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <motion.div
                      animate={isActive ? { 
                        scale: [1, 1.05, 1],
                      } : {}}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatType: "reverse" 
                      }}
                    >
                      {React.cloneElement(item.icon as React.ReactElement, {
                        sx: { fontSize: level === 0 ? 22 : 20 }
                      })}
                    </motion.div>
                  </Badge>
                </ListItemIcon>

                <ListItemText 
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isActive ? 700 : 600,
                        fontSize: level > 0 ? '0.8rem' : '0.9rem',
                        lineHeight: 1.2,
                        opacity: open ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      {item.label}
                    </Typography>
                  }
                  secondary={open && item.description && level === 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: isActive ? alpha('#ffffff', 0.8) : alpha('#64748b', 0.7),
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        lineHeight: 1.1,
                        mt: 0.3,
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
                        width: 24,
                        height: 24,
                      }}
                    >
                      <ExpandMore sx={{ fontSize: 18 }} />
                    </IconButton>
                  </motion.div>
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </motion.div>

        {hasChildren && (
          <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ py: 0.5 }}>
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
        height: '100vh',
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
          opacity: 0.3,
          background: `
            radial-gradient(circle at 25% 25%, ${alpha('#6366f1', 0.08)} 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${alpha('#8b5cf6', 0.08)} 0%, transparent 50%),
            radial-gradient(circle at 1px 1px, ${alpha('#e2e8f0', 0.6)} 1px, transparent 0)
          `,
          backgroundSize: '300px 300px, 250px 250px, 20px 20px',
          animation: 'float 30s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
            '33%': { transform: 'translate(10px, -8px) rotate(0.5deg)' },
            '66%': { transform: 'translate(-5px, 5px) rotate(-0.5deg)' },
          },
        }}
      />

      {/* Compact Header */}
      <Box sx={{ p: open ? 2.5 : 2, position: 'relative', zIndex: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stack direction="row" alignItems="center" spacing={open ? 2.5 : 0}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Avatar
                  sx={{
                    width: open ? 44 : 40,
                    height: open ? 44 : 40,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: '2px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.25)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Business sx={{ fontSize: open ? 24 : 20 }} />
                </Avatar>
              </motion.div>
              
              {open && (
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 900, 
                      color: '#0f172a', 
                      fontSize: '1.1rem',
                      lineHeight: 1.1,
                      background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Fidelita Pro
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#64748b', 
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Centro Ejecutivo
                  </Typography>
                </Box>
              )}
            </Stack>
          </motion.div>
          
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
                  width: 36,
                  height: 36,
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {open ? <ChevronLeft sx={{ fontSize: 20 }} /> : <ChevronRight sx={{ fontSize: 20 }} />}
              </IconButton>
            </Tooltip>
          </motion.div>
        </Stack>

        {/* Compact User Profile */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Paper
              elevation={0}
              sx={{
                mt: 2.5,
                p: 2.5,
                background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
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
                  right: -25,
                  width: 50,
                  height: 50,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '50%',
                  opacity: 0.08,
                }}
              />
              
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                  }}
                >
                  <AccountCircle sx={{ fontSize: 20 }} />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#1e293b', 
                      fontSize: '0.85rem',
                      lineHeight: 1.2,
                    }}
                  >
                    {user?.email?.split('@')[0] || 'Admin'}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#64748b', 
                      fontWeight: 500,
                      fontSize: '0.7rem',
                    }}
                  >
                    Super Admin
                  </Typography>
                </Box>
                <Chip
                  label="PRO"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    height: 22,
                  }}
                />
              </Stack>

              {/* Quick Stats Row */}
              <Stack direction="row" spacing={2} sx={{ mt: 2, pt: 2, borderTop: '1px solid #f1f5f9' }}>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 900, 
                      color: '#1e293b',
                      fontSize: '0.95rem',
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
                      fontSize: '0.65rem',
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
                      fontSize: '0.95rem',
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
                      fontSize: '0.65rem',
                    }}
                  >
                    Activos
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </motion.div>
        )}
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.3 }} />

      {/* Main Navigation - Optimized for full visibility */}
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex',
          flexDirection: 'column',
          py: 1.5, 
          position: 'relative', 
          zIndex: 1,
          minHeight: 0, // Important for flex child
        }}
      >
        <List sx={{ px: 0.5, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.3 }} />

      {/* Compact Logout Section */}
      <Box sx={{ p: 2, position: 'relative', zIndex: 1 }}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <ListItem disablePadding>
            <Tooltip title={!open ? 'Cerrar Sesión' : ''} placement="right" arrow>
              <ListItemButton
                onClick={() => {/* Handle logout */}}
                sx={{
                  minHeight: 44,
                  justifyContent: open ? 'initial' : 'center',
                  px: open ? 2.5 : 2,
                  py: 1.5,
                  mx: 1,
                  borderRadius: 3,
                  color: '#ef4444',
                  border: '1px solid',
                  borderColor: alpha('#ef4444', 0.2),
                  background: alpha('#ef4444', 0.05),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: alpha('#ef4444', 0.1),
                    borderColor: '#ef4444',
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2.5 : 'auto',
                    justifyContent: 'center',
                    color: 'inherit',
                  }}
                >
                  <Logout sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography
                      variant="body2"
                      sx={{ 
                        fontWeight: 700, 
                        fontSize: '0.85rem',
                        opacity: open ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      Cerrar Sesión
                    </Typography>
                  }
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </motion.div>
      </Box>

      {/* Compact System Status */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Box sx={{ p: 2, position: 'relative', zIndex: 1 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
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
                  top: -20,
                  left: -20,
                  width: 40,
                  height: 40,
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
                      fontSize: '0.65rem',
                    }}
                  >
                    Sistema
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#1e293b',
                      fontSize: '0.8rem',
                      lineHeight: 1.2,
                    }}
                  >
                    Operativo
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: '#10b981',
                    borderRadius: '50%',
                    boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.7 },
                    },
                  }}
                />
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
          overflowY: 'hidden', // Eliminamos el scroll vertical
          border: 'none',
          boxShadow: '0 0 40px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};