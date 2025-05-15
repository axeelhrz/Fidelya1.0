'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
  useTheme,
  InputBase,
  Paper,
  Typography,
  Button,
  Stack
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Help as HelpIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { useThemeContext } from '@/context/themeContext';
import MobileNav from './mobile-nav';

interface MainNavProps {
  isSidebarOpen?: boolean;
  onToggleSidebar: () => void;
}

export function MainNav({ isSidebarOpen = true, onToggleSidebar }: MainNavProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { toggleColorMode } = useThemeContext();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Estado para menú de usuario
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(userMenuAnchorEl);

  // Estado para menú de notificaciones
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const notificationsMenuOpen = Boolean(notificationsAnchorEl);

  // Toggle sidebar on small screens when hamburger menu is clicked
  const handleToggleSidebar = () => {
    if (window.innerWidth >= 1200) { // lg breakpoint
      onToggleSidebar();
    } else {
      setMobileNavOpen(true);
    }
  };

  // Manejadores para menú de usuario
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  // Manejadores para menú de notificaciones
  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  // Manejador para cerrar sesión
  const handleSignOut = async () => {
    handleUserMenuClose();
    await signOut();
  };

  // Manejador para búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implementar lógica de búsqueda
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          height: 'var(--MainNav-height)',
          zIndex: 'var(--MainNav-zIndex)',
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.04)}`,
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Botón de menú para móviles */}
            <IconButton
              color="inherit"
              aria-label="abrir menú"
              onClick={handleToggleSidebar}
              edge="start"
              sx={{
                mr: 2,
                display: { xs: 'flex', lg: 'none' },
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Botón para colapsar sidebar (visible solo en desktop) */}
            <Tooltip title={isSidebarOpen ? "Colapsar menú" : "Expandir menú"} arrow>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ display: 'flex' }}
              >
                <IconButton
                  color="inherit"
                  aria-label={isSidebarOpen ? "colapsar menú" : "expandir menú"}
                  onClick={onToggleSidebar}
                  sx={{
                    mr: 2,
                    display: { xs: 'none', lg: 'flex' },
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
              </motion.div>
            </Tooltip>

            {/* Título de la página actual */}
            <Typography
              variant="h6"
              component="h1"
              fontFamily="Sora"
              fontWeight={600}
              sx={{
                display: { xs: 'none', sm: 'block' },
                color: theme.palette.text.primary,
              }}
            >
              {!pathname 
                ? 'Dashboard'
                : pathname === '/dashboard'
                  ? 'Dashboard'
                  : pathname.includes('/dashboard/analisis')
                    ? 'Análisis'
                    : pathname.includes('/dashboard/policies')
                      ? 'Pólizas'
                      : pathname.includes('/dashboard/customers')
                        ? 'Clientes'
                        : pathname.includes('/dashboard/tasks')
                          ? 'Tareas'
                          : pathname.includes('/dashboard/contactos')
                            ? 'Contactos'
                            : pathname.includes('/dashboard/chat')
                              ? 'Chat'
                              : pathname.includes('/dashboard/soporte')
                                ? 'Soporte'
                                : pathname.includes('/dashboard/configuracion')
                                  ? 'Configuración'
                                  : 'Dashboard'}
            </Typography>
          </Box>

          {/* Sección central - Búsqueda */}
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '100%', maxWidth: 500 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
              >
                <Paper
                  component="form"
                  onSubmit={handleSearchSubmit}
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    borderRadius: 3,
                    px: 2,
                    py: 0.5,
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
                  }}
                >
                  <SearchIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                  <InputBase
                    placeholder="Buscar pólizas, clientes, tareas..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    autoFocus
                    sx={{
                      flex: 1,
                      fontSize: '0.95rem',
                      fontFamily: 'Sora',
                    }}
                  />
                  <IconButton size="small" onClick={toggleSearch} edge="end">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Sección derecha */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Botón de búsqueda */}
            <Tooltip title="Buscar" arrow>
              <IconButton
                color="inherit"
                onClick={toggleSearch}
                sx={{
                  backgroundColor: searchOpen ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>

            {/* Botón de tema */}
            <Tooltip title={theme.palette.mode === 'dark' ? 'Modo claro' : 'Modo oscuro'} arrow>
              <IconButton
                color="inherit"
                onClick={toggleColorMode}
                sx={{
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Botón de notificaciones */}
            <Tooltip title="Notificaciones" arrow>
              <IconButton
                color="inherit"
                onClick={handleNotificationsOpen}
                sx={{
                  backgroundColor: notificationsMenuOpen ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Botón de ayuda */}
            <Tooltip title="Ayuda" arrow>
              <IconButton
                component={Link}
                href="/dashboard/soporte"
                color="inherit"
                sx={{
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>

            {/* Avatar de usuario */}
            <Tooltip title="Perfil" arrow>
              <IconButton
                onClick={handleUserMenuOpen}
                size="small"
                sx={{
                  ml: 1,
                  p: 0.5,
                  border: userMenuOpen ? `2px solid ${theme.palette.primary.main}` : `2px solid transparent`,
                  transition: 'all 0.2s ease',
                }}
              >
                <Avatar
                  src={profile?.avatarUrl}
                  alt={profile?.displayName || 'Usuario'}
                  sx={{
                    width: 36,
                    height: 36,
                    boxShadow: userMenuOpen ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}` : 'none',
                  }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Menú de usuario */}
      <Menu
        anchorEl={userMenuAnchorEl}
        id="user-menu"
        open={userMenuOpen}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            borderRadius: 2,
            minWidth: 220,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600} fontFamily="Sora">
            {profile?.displayName || 'Usuario'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {profile?.email || ''}
          </Typography>
        </Box>
        <Divider />
        <MenuItem component={Link} href="/dashboard/profile">
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mi perfil</ListItemText>
        </MenuItem>
        <MenuItem component={Link} href="/dashboard/configuracion">
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Configuración</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'error' }}>
            Cerrar sesión
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Menú de notificaciones */}
      <Menu
        anchorEl={notificationsAnchorEl}
        id="notifications-menu"
        open={notificationsMenuOpen}
        onClose={handleNotificationsClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            borderRadius: 2,
            width: 320,
            maxHeight: 400,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600} fontFamily="Sora">
            Notificaciones
          </Typography>
          <Button
            size="small"
            color="primary"
            onClick={handleNotificationsClose}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Marcar todo como leído
          </Button>
        </Box>
        <Divider />
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {/* Ejemplo de notificaciones */}
          <MenuItem onClick={handleNotificationsClose} sx={{ py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
              <Badge
                variant="dot"
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    right: 3,
                    top: 3,
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mr: 1.5,
                  }}
                >
                  <NotificationsIcon fontSize="small" />
                </Avatar>
              </Badge>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  Nueva solicitud de contacto
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Juan Pérez quiere conectar contigo
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Hace 5 minutos
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationsClose} sx={{ py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.main,
                  mr: 1.5,
                }}
              >
                <NotificationsIcon fontSize="small" />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  Recordatorio de tarea
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tienes una tarea pendiente para hoy
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Hace 1 hora
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationsClose} sx={{ py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  mr: 1.5,
                }}
              >
                <NotificationsIcon fontSize="small" />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  Póliza renovada
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  La póliza #12345 ha sido renovada exitosamente
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Ayer
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        </Box>
        <Divider />
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            component={Link}
            href="/dashboard/configuracion"
            color="primary"
            size="small"
            onClick={handleNotificationsClose}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Ver todas las notificaciones
          </Button>
        </Box>
      </Menu>

      {/* Navegación móvil */}
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}