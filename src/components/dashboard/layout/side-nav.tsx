'use client';
import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Stack,
  Avatar,
  Divider,
  Tooltip,
  Badge,
  Chip,
  alpha,
  useTheme,
  useMediaQuery,
  styled,
  ListSubheader
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { useSubscription } from '@/hooks/use-subscription';
import { useMessages } from '@/hooks/use-messages';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { useThemeContext } from '@/context/themeContext';
// Iconos
import {
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Psychology as PsychologyIcon,
  Logout as LogoutIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Upgrade as UpgradeIcon,
  Star as StarIcon,
  Insights as InsightsIcon,
  Lock as LockIcon
} from '@mui/icons-material';

// Constantes
const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED_WIDTH = 72;

// Componentes estilizados
const SidebarRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  borderRight: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.mode === 'dark' ? '#000' : '#6366F1', 0.08)}`,
  backdropFilter: 'blur(20px)',
  transition: theme.transitions.create(['width', 'transform', 'box-shadow'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  zIndex: theme.zIndex.drawer,
  [theme.breakpoints.down('lg')]: {
    position: 'fixed',
    transform: open ? 'translateX(0)' : 'translateX(-100%)',
    width: DRAWER_WIDTH,
    boxShadow: theme.shadows[10],
  },
}));

// Componente para el logo
const LogoContainer = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3, 2),
  height: 80,
  transition: 'all 0.3s ease',
}));

// Componente para el botón de navegación
const NavButton = styled(motion.div, {
  shouldForwardProp: (prop) => 
    prop !== 'active' && 
    prop !== 'collapsed' && 
    prop !== 'disabled' && 
    prop !== 'component',
})<{ 
  active: number; 
  collapsed: number; 
  disabled?: number;
  component?: React.ElementType 
}>(({ theme, active, collapsed, disabled }) => ({
  borderRadius: collapsed ? 16 : 12,
  margin: collapsed ? theme.spacing(1, 'auto') : theme.spacing(0.5, 2),
  padding: collapsed ? theme.spacing(1.5) : theme.spacing(1, 2),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: active 
    ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.1) 
    : 'transparent',
  color: active 
    ? theme.palette.primary.main 
    : disabled 
      ? alpha(theme.palette.text.secondary, 0.4) 
      : theme.palette.text.secondary,
  opacity: disabled ? 0.5 : 1,
  cursor: disabled ? 'not-allowed' : 'pointer',
  pointerEvents: disabled ? 'none' : 'auto',
  position: 'relative',
  overflow: 'hidden',
  width: collapsed ? 48 : 'auto',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: active 
      ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.15) 
      : alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.08 : 0.05),
    transform: disabled ? 'none' : 'translateX(4px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    height: active ? '60%' : '0%',
    width: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: '0 4px 4px 0',
    transform: 'translateY(-50%)',
    transition: 'height 0.3s ease',
    opacity: active ? 1 : 0,
  },
}));

// Componente para el footer del sidebar
const SidebarFooter = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  backdropFilter: 'blur(8px)',
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
}));

// Componente para la insignia del plan
const PlanBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  borderRadius: 12,
  '& .MuiChip-icon': {
    color: theme.palette.primary.main,
  },
  '& .MuiChip-label': {
    padding: '0 8px',
    fontFamily: 'Sora, sans-serif',
  },
}));

// Componente para el prompt de actualización
const UpgradePrompt = styled(motion.div)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: 16,
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
    zIndex: -1,
  },
}));

// Componente para el avatar del usuario
const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 44,
  height: 44,
  border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  boxShadow: `0 0 0 2px ${alpha(theme.palette.background.paper, 0.8)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

// Interfaces
interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
  requiredPlan?: 'basic' | 'professional' | 'enterprise';
}

interface SideNavProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ isOpen = true, onToggle }) => {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { signOut, user, userData } = useAuth();
  const { profile } = useProfile();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { totalUnread } = useMessages('', ''); // Pass empty strings as placeholders
  const { mode, toggleColorMode } = useThemeContext();

  // Estado para controlar si el sidebar está abierto
  const [open, setOpen] = React.useState(isOpen);

  // Efecto para sincronizar el estado open con la prop isOpen
  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  // Efecto para cerrar el sidebar en mobile al navegar
  React.useEffect(() => {
    if (isMobile && open) {
      setOpen(false);
      if (onToggle) onToggle();
    }
  }, [pathname, isMobile, open, onToggle]);

  // Determinar el plan actual del usuario
  const currentPlan = React.useMemo(() => {
    // Si está cargando, mostrar un valor por defecto
    if (subscriptionLoading) return 'basic';
    
    // Obtener el plan desde la suscripción
    const planId = subscription?.planId || 'basic';
    
    // Mapear el planId a uno de los valores esperados
    if (typeof planId === 'string') {
      const planIdLower = planId.toLowerCase();
      if (planIdLower === 'pro' || planIdLower === 'professional') {
        return 'professional' as const;
      } else if (planIdLower === 'enterprise') {
        return 'enterprise' as const;
      }
    }
    
    // Por defecto, retornar 'basic'
    return 'basic' as const;
  }, [subscription, subscriptionLoading]);

  // Función para verificar si un usuario puede acceder a una funcionalidad según su plan
  const canAccess = (requiredPlan?: 'basic' | 'professional' | 'enterprise') => {
    if (!requiredPlan) return true;
    
    if (requiredPlan === 'professional') {
      return currentPlan === 'professional' || currentPlan === 'enterprise';
    }
    
    if (requiredPlan === 'enterprise') {
      return currentPlan === 'enterprise';
    }
    
    return true;
  };

  // Ítems de navegación principal
  const navigationItems: NavItem[] = [
    { icon: <DashboardIcon />, label: 'Dashboard', path: '/dashboard' },
    { icon: <DescriptionIcon />, label: 'Pólizas', path: '/dashboard/policies' },
    { icon: <PeopleIcon />, label: 'Clientes', path: '/dashboard/customers' },
    { icon: <AssignmentIcon />, label: 'Tareas', path: '/dashboard/tasks' },
    {
      icon: <ChatIcon />,
      label: 'Contactos',
      path: '/dashboard/contactos',
      badge: totalUnread,
      requiredPlan: 'professional'
    },
    {
      icon: <InsightsIcon />,
      label: 'Análisis',
      path: '/dashboard/analisis',
      requiredPlan: 'professional'
    },
    {
      icon: <PsychologyIcon />,
      label: 'IA Asistente',
      path: '/dashboard/ia-asistente',
      requiredPlan: 'enterprise'
    },
  ];

  // Ítems de navegación de configuración
  const settingsItems: NavItem[] = [
    { icon: <SettingsIcon />, label: 'Configuración', path: '/dashboard/configuracion' },
    { icon: <HelpIcon />, label: 'Ayuda', path: '/dashboard/soporte' },
  ];

  // Función para manejar el cierre de sesión
  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/sign-in');
  };

  // Función para alternar el sidebar
  const handleToggleSidebar = () => {
    setOpen(!open);
    if (onToggle) onToggle();
  };

  // Animaciones para los elementos del sidebar
  const sidebarAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  // Obtener el nombre del plan para mostrar
  const getPlanDisplayName = () => {
    switch (currentPlan) {
      case 'professional':
        return 'Pro';
      case 'enterprise':
        return 'Enterprise';
      default:
        return 'Free';
    }
  };

  // Obtener el nombre de usuario desde Firebase
  const getUserDisplayName = () => {
    // Intentar obtener el nombre desde diferentes fuentes en orden de prioridad
    
    // 1. Desde el perfil en la colección 'profiles'
    if (profile?.displayName) {
      return profile.displayName;
    }
    
    // 2. Desde userData en la colección 'users'
    if (userData?.displayName) {
      return userData.displayName;
    }
    
    // 3. Construir desde firstName y lastName del perfil
    if (profile?.firstName || profile?.lastName) {
      return `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
    }
    
    // 4. Construir desde firstName y lastName de userData
    if (userData?.firstName || userData?.lastName) {
      return `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
    }
    
    // 5. Desde el objeto user de Firebase Auth
    if (user?.displayName) {
      return user.displayName;
    }
    
    // 6. Usar el email como último recurso
    return user?.email || userData?.email || profile?.email || 'Usuario';
  };

  // Obtener la URL del avatar
  const getAvatarUrl = () => {
    // Intentar obtener la URL del avatar desde diferentes fuentes en orden de prioridad
    
    // 1. Desde el perfil en la colección 'profiles'
    if (profile?.avatarUrl) {
      return profile.avatarUrl;
    }
    
    // 2. Desde userData en la colección 'users'
    if (userData?.photoURL) {
      return userData.photoURL;
    }
    
    // 3. Desde el objeto user de Firebase Auth
    if (user?.photoURL) {
      return user.photoURL;
    }
    
    // 4. Retornar undefined para usar el avatar por defecto
    return undefined;
  };

  // Renderizar ítems de navegación
  const renderNavItems = (items: NavItem[]) => {
    return items.map((item, index) => {
      const isActive = isNavItemActive({ href: item.path, pathname: pathname || '' });
      const hasAccess = canAccess(item.requiredPlan);
      
      return (
        <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
          <Tooltip 
            title={!open 
              ? hasAccess 
                ? item.label 
                : `${item.label} (Requiere plan ${item.requiredPlan === 'professional' ? 'Pro' : 'Enterprise'})` 
              : ''
            } 
            placement="right"
            arrow
          >
            <Box>
              <NavButton
                component={motion.div}
                variants={sidebarAnimation}
                custom={index}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: hasAccess ? 1.02 : 1 }}
                active={isActive ? 1 : 0}
                collapsed={!open ? 1 : 0}
                disabled={!hasAccess ? 1 : 0}
                onClick={() => hasAccess && router.push(item.path)}
              >
                <ListItemButton
                  disableRipple
                  sx={{ 
                    p: 0, 
                    backgroundColor: 'transparent',
                    '&:hover': { backgroundColor: 'transparent' },
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: open ? 'flex-start' : 'center',
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 0, 
                      mr: open ? 2 : 0, 
                      justifyContent: 'center',
                      color: 'inherit',
                      position: 'relative',
                    }}
                  >
                    {item.badge ? (
                      <Badge 
                        badgeContent={item.badge} 
                        color="error"
                        sx={{ 
                          '& .MuiBadge-badge': { 
                            fontSize: 10, 
                            height: 16, 
                            minWidth: 16,
                            fontFamily: 'Sora, sans-serif',
                            fontWeight: 600,
                          } 
                        }}
                      >
                        {item.icon}
                      </Badge>
                    ) : (
                      <>
                        {item.icon}
                        {!hasAccess && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -4,
                              right: -4,
                              backgroundColor: theme.palette.background.paper,
                              borderRadius: '50%',
                              width: 16,
                              height: 16,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                              boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
                            }}
                          >
                            <LockIcon sx={{ fontSize: 10, color: theme.palette.text.secondary }} />
                          </Box>
                        )}
                      </>
                    )}
                  </ListItemIcon>
                  {open && (
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{ 
                        noWrap: true,
                        fontSize: 14,
                        fontWeight: isActive ? 700 : 400,
                        fontFamily: 'Sora, sans-serif',
                        letterSpacing: 0.2,
                      }} 
                    />
                  )}
                </ListItemButton>
              </NavButton>
            </Box>
          </Tooltip>
        </ListItem>
      );
    });
  };

  // Renderizar el drawer para mobile
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleToggleSidebar}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            backgroundColor: alpha(theme.palette.background.paper, 0.85),
            backdropFilter: 'blur(20px)',
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            boxShadow: `0 8px 32px 0 ${alpha(theme.palette.mode === 'dark' ? '#000' : '#6366F1', 0.08)}`,
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Logo */}
          <LogoContainer
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box 
              component="img" 
              src="/assets/Logotipo.svg"
              alt="Assuriva" 
              sx={{ 
                height: 40,
                transition: 'all 0.3s ease',
                filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none',
              }}
            />
          </LogoContainer>

          {/* Perfil de usuario */}
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: alpha(theme.palette.background.paper, 0.4),
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              mx: 2,
              mb: 2,
              boxShadow: `0 4px 20px ${alpha(theme.palette.mode === 'dark' ? '#000' : theme.palette.primary.main, 0.05)}`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <UserAvatar 
                src={getAvatarUrl()}
                alt={getUserDisplayName()}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography 
                  variant="subtitle2" 
                  noWrap 
                  fontWeight={700}
                  fontFamily="Sora, sans-serif"
                  letterSpacing={0.2}
                >
                  {getUserDisplayName()}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PlanBadge 
                    size="small" 
                    icon={<StarIcon fontSize="small" />}
                    label={getPlanDisplayName()}
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ mx: 2, opacity: 0.4 }} />

          {/* Navegación principal */}
          <List component="nav" sx={{ px: 0, py: 1 }}>
            {renderNavItems(navigationItems)}
          </List>

          <Divider sx={{ mx: 2, opacity: 0.4 }} />

          {/* Navegación de configuración */}
          <List 
            component="nav" 
            subheader={
              <ListSubheader 
                component="div" 
                sx={{ 
                  bgcolor: 'transparent', 
                  fontSize: 12, 
                  color: theme.palette.text.secondary,
                  lineHeight: '30px',
                  fontFamily: 'Sora, sans-serif',
                  letterSpacing: 0.5,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  opacity: 0.7,
                }}
              >
                Configuración
              </ListSubheader>
            }
            sx={{ px: 0, py: 1 }}
          >
            {renderNavItems(settingsItems)}
          </List>

          {/* Prompt de actualización */}
          {currentPlan !== 'enterprise' && (
            <UpgradePrompt
              whileHover={{ y: -4, boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              onClick={() => router.push('/pricing')}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <UpgradeIcon color="primary" fontSize="small" />
                <Typography 
                  variant="subtitle2" 
                  color="primary" 
                  fontWeight={700}
                  fontFamily="Sora, sans-serif"
                  letterSpacing={0.2}
                >
                  Mejora tu plan
                </Typography>
              </Stack>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ lineHeight: 1.5 }}
              >
                Desbloquea todas las funciones con nuestro plan Enterprise
              </Typography>
            </UpgradePrompt>
          )}

          {/* Footer */}
          <SidebarFooter>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <IconButton 
                  onClick={toggleColorMode} 
                  size="small"
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                </IconButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <IconButton 
                  onClick={handleSignOut} 
                  size="small" 
                  color="error"
                  sx={{
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.error.main, 0.2),
                    }
                  }}
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </motion.div>
            </Stack>
          </SidebarFooter>
        </Box>
      </Drawer>
    );
  }

  // Renderizar el sidebar para desktop
  return (
    <SidebarRoot open={open}>
      {/* Logo */}
      <LogoContainer
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box 
          component="img" 
          src="/assets/Logotipo.svg"
          alt="Assuriva" 
          sx={{ 
            height: open ? 40 : 36,
            transition: 'all 0.3s ease',
            filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none',
          }}
        />
      </LogoContainer>

      {/* Perfil de usuario */}
      {open && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: alpha(theme.palette.background.paper, 0.4),
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              mx: 2,
              mb: 2,
              boxShadow: `0 4px 20px ${alpha(theme.palette.mode === 'dark' ? '#000' : theme.palette.primary.main, 0.05)}`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <UserAvatar 
                src={getAvatarUrl()}
                alt={getUserDisplayName()}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography 
                  variant="subtitle2" 
                  noWrap 
                  fontWeight={700}
                  fontFamily="Sora, sans-serif"
                  letterSpacing={0.2}
                >
                  {getUserDisplayName()}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PlanBadge 
                    size="small" 
                    icon={<StarIcon fontSize="small" />}
                    label={getPlanDisplayName()}
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </motion.div>
      )}

      <Divider sx={{ mx: 2, opacity: 0.4 }} />

      {/* Navegación principal */}
      <List component="nav" sx={{ px: 0, py: 1 }}>
        {renderNavItems(navigationItems)}
      </List>

      <Divider sx={{ mx: 2, opacity: 0.4 }} />

      {/* Navegación de configuración */}
      <List 
        component="nav" 
        subheader={
          open ? (
            <ListSubheader 
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              sx={{ 
                bgcolor: 'transparent', 
                fontSize: 12, 
                color: theme.palette.text.secondary,
                lineHeight: '30px',
                fontFamily: 'Sora, sans-serif',
                letterSpacing: 0.5,
                fontWeight: 600,
                textTransform: 'uppercase',
                opacity: 0.7,
              }}
            >
              Configuración
            </ListSubheader>
          ) : null
        }
        sx={{ px: 0, py: 1 }}
      >
        {renderNavItems(settingsItems)}
      </List>

      {/* Prompt de actualización */}
      {open && currentPlan !== 'enterprise' && (
        <UpgradePrompt
          whileHover={{ 
            y: -4, 
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}` 
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          onClick={() => router.push('/pricing')}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <UpgradeIcon color="primary" fontSize="small" />
            <Typography 
              variant="subtitle2" 
              color="primary" 
              fontWeight={700}
              fontFamily="Sora, sans-serif"
              letterSpacing={0.2}
            >
              Mejora tu plan
            </Typography>
          </Stack>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ lineHeight: 1.5 }}
          >
            Desbloquea todas las funciones con nuestro plan Enterprise
          </Typography>
        </UpgradePrompt>
      )}

      {/* Footer */}
      <SidebarFooter>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <IconButton 
              onClick={toggleColorMode} 
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <IconButton 
              onClick={handleSignOut} 
              size="small" 
              color="error"
              sx={{
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.2),
                }
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </motion.div>
        </Stack>
      </SidebarFooter>
    </SidebarRoot>
  );
};

export default SideNav;