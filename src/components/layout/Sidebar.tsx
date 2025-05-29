import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  ShoppingBag,
  Assessment,
  People,
  Settings,
  Store,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Inventario', icon: <Inventory />, path: '/inventory' },
  { text: 'Ventas', icon: <ShoppingCart />, path: '/sales' },
  { text: 'Compras', icon: <ShoppingBag />, path: '/purchases' },
  { text: 'Reportes', icon: <Assessment />, path: '/reports' },
  { text: 'Clientes', icon: <People />, path: '/customers' },
  { text: 'Proveedores', icon: <Store />, path: '/suppliers' },
  { text: 'Configuración', icon: <Settings />, path: '/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const drawerWidth = 280;

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo y título */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #A3CB38 0%, #4CAF50 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Store sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          <Typography variant="h6" fontWeight="bold" color="primary">
            FrutaSystem
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sistema de Gestión
          </Typography>
        </motion.div>
      </Box>

      <Divider />

      {/* Menú de navegación */}
      <List sx={{ flex: 1, px: 2, py: 1 }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'white' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};