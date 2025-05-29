import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  Receipt,
  Assessment,
  People,
  Business,
  Settings,
  Notifications,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  onItemClick?: () => void;
}

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Inventario', icon: <Inventory />, path: '/inventory' },
  { text: 'Ventas', icon: <ShoppingCart />, path: '/sales' },
  { text: 'Compras', icon: <Receipt />, path: '/purchases' },
  { text: 'Reportes', icon: <Assessment />, path: '/reports' },
  { text: 'Clientes', icon: <People />, path: '/clients' },
  { text: 'Proveedores', icon: <Business />, path: '/suppliers' },
  { text: 'Notificaciones', icon: <Notifications />, path: '/notifications' },
  { text: 'Configuración', icon: <Settings />, path: '/settings', adminOnly: true },
];

const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleItemClick = (path: string) => {
    navigate(path);
    onItemClick?.();
  };

  const filteredMenuItems = menuItems.filter(
    item => !item.adminOnly || user?.role === 'ADMIN'
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Brand */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            mb: 1,
          }}
        >
          FruteriaApp
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sistema de Gestión
        </Typography>
      </Box>

      <Divider />

      {/* User Info */}
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Bienvenido,
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {user?.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.role === 'ADMIN' ? 'Administrador' : 'Empleado'}
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, py: 1 }}>
        <List>
          {filteredMenuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem disablePadding sx={{ px: 2, mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleItemClick(item.path)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: isActive ? 'primary.main' : 'transparent',
                      color: isActive ? 'white' : 'text.primary',
                      '&:hover': {
                        backgroundColor: isActive 
                          ? 'primary.dark' 
                          : theme.palette.action.hover,
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? 'white' : 'text.secondary',
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: isActive ? 500 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </motion.div>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          v1.0.0 - Sistema Contable
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;