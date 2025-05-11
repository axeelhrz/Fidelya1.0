'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Container,
  GlobalStyles,
  useTheme,
  alpha,
  styled,
  useMediaQuery,
  Backdrop,
  Box,
  Fade,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { MainNav } from '@/components/dashboard/layout/main-nav';
import SideNav from '@/components/dashboard/layout/side-nav';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeContextProvider from '@/context/themeContext';
import { useAuth } from '@/hooks/use-auth';
import { 
  Menu as MenuIcon, 
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import LoadingScreen from '@/components/core/loadingScreen';
import { AuthProvider } from '@/context/auth-context'; // ✅ Asegurate de importar

// Configurar locale para dayjs
dayjs.locale('es');

interface LayoutProps {
  children: React.ReactNode;
}

// Estilos Globales
const GlobalStyle = () => {
  const theme = useTheme();
  return (
    <GlobalStyles
      styles={{
        ':root': {
          '--MainNav-height': '70px', // Aumentado para más espacio
          '--MainNav-zIndex': 1200,
          '--SideNav-width': '280px',
          '--SideNav-collapsed-width': '80px', // Aumentado para mejor visibilidad
          '--SideNav-zIndex': 1200,
          '--MobileNav-width': '320px',
          '--MobileNav-zIndex': 1300,
          '--transition-speed': '0.3s',
          '--content-max-width': '1600px', // Ancho máximo para el contenido
        },
        'html, body': {
          backgroundColor: theme.palette.background.default,
          margin: 0,
          padding: 0,
          transition: 'background-color 0.3s ease-in-out',
          overflowX: 'hidden',
          fontFamily: '"Sora", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: alpha(theme.palette.primary.main, 0.05),
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb': {
          background: alpha(theme.palette.primary.main, 0.2),
          borderRadius: '4px',
          '&:hover': {
            background: alpha(theme.palette.primary.main, 0.3),
          },
        },
        // Estilos para animaciones suaves
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },
        // Estilos para tipografía
        'h1, h2, h3, h4, h5, h6': {
          margin: 0,
          lineHeight: 1.2,
          fontFamily: '"Sora", sans-serif',
          fontWeight: 600,
        },
        // Estilos para links
        'a': {
          color: 'inherit',
          textDecoration: 'none',
          transition: 'color 0.2s ease-in-out',
        },
        // Estilos para imágenes
        'img': {
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
        },
        // Estilos para botones
        'button': {
          fontFamily: '"Sora", sans-serif',
          fontWeight: 500,
        },
      }}
    />
  );
};

// Wrapper Principal
const MainWrapper = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  transition: 'all var(--transition-speed) ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  backgroundImage: theme.palette.mode === 'light'
    ? `radial-gradient(${alpha(theme.palette.primary.main, 0.03)} 1px, transparent 1px)`
    : `radial-gradient(${alpha(theme.palette.common.white, 0.03)} 1px, transparent 1px)`,
  backgroundSize: '20px 20px',
}));

// Wrapper del Contenido - Mejorado para mejor fluidez y responsividad
const ContentWrapper = styled(motion.div)<{ issidebaropen: string }>(
  ({ theme, issidebaropen }) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginLeft: issidebaropen === 'true' ? 'var(--SideNav-width)' : 'var(--SideNav-collapsed-width)',
    width: issidebaropen === 'true'
      ? `calc(100% - var(--SideNav-width))`
      : `calc(100% - var(--SideNav-collapsed-width))`,
    transition: 'all var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1)',
    [theme.breakpoints.down('lg')]: {
      marginLeft: 0,
      width: '100%',
    },
    backgroundColor: alpha(theme.palette.background.default, 0.8),
    backdropFilter: 'blur(10px)',
    minHeight: '100vh',
    position: 'relative',
    zIndex: 1,
  })
);

// Contenedor Principal - Optimizado para mejor espaciado y responsividad
const MainContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  paddingTop: theme.spacing(3),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  transition: 'padding var(--transition-speed) ease-in-out',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(2),
    gap: theme.spacing(2),
  },
  position: 'relative',
  zIndex: 1,
  maxWidth: 'var(--content-max-width)',
  margin: '0 auto',
  width: '100%',
}));

// Botón de navegación móvil - Mejorado con efectos y accesibilidad
const MobileNavButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  top: 16,
  left: 16,
  zIndex: 1100,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(8px)',
  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
  transition: 'all 0.2s ease',
  width: 40,
  height: 40,
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

// Componente de Backdrop mejorado con animación
const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer - 1,
  backgroundColor: alpha(theme.palette.common.black, 0.5),
  backdropFilter: 'blur(4px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

// Botón de retroceso mejorado
const BackButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  transition: 'all 0.2s ease',
  borderRadius: 12,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    transform: 'translateX(-3px)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

// Indicador de carga de página
const PageLoadingIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  // Estado para controlar si el sidebar está abierto
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const auth = useAuth();
  const loading = auth?.loading || false;
  const user = auth?.user || null;
  
  // Estado para controlar si el backdrop está abierto
  const [isBackdropOpen, setBackdropOpen] = React.useState(false);
  
  // Estado para controlar si se está cargando la página
  const [isPageLoading, setPageLoading] = React.useState(false);
  
  // Estado para controlar si se está refrescando la página
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Cerrar sidebar automáticamente en móvil
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Efecto para mostrar/ocultar el backdrop
  React.useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setBackdropOpen(true);
    } else {
      setBackdropOpen(false);
    }
  }, [isMobile, isSidebarOpen]);

  // Efecto para simular carga de página
  React.useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Función para alternar el sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Función para navegar hacia atrás
  const handleGoBack = () => {
    router.back();
  };

  // Función para refrescar la página
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simular refresco de datos
    setTimeout(() => {
      setIsRefreshing(false);
      // Aquí podrías llamar a funciones para recargar datos
    }, 1000);
  };

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return <LoadingScreen />;
  }

  // Verificar si el usuario está autenticado
  if (!user) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
    <ThemeContextProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <GlobalStyle />
        <MainWrapper
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Sidebar - Actualizado para usar el nuevo componente */}
          <SideNav isOpen={isSidebarOpen} onToggle={toggleSidebar} />
          
          {/* Contenido principal */}
          <ContentWrapper
            issidebaropen={isSidebarOpen.toString()}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Barra de navegación superior */}
            <MainNav
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={toggleSidebar}
            />
            
            {/* Contenedor principal */}
            <MainContainer maxWidth={false}>
              {/* Botones de navegación y acciones en móvil */}
              {isMobile && pathname !== '/dashboard' && (
                <Box 
                  sx={{ 
                    mb: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <BackButton onClick={handleGoBack}>
                    <ArrowBackIcon />
                  </BackButton>
                  
                  <Tooltip title="Refrescar datos" arrow>
                    <IconButton
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: 3,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.2),
                        },
                      }}
                    >
                      <motion.div
                        animate={isRefreshing ? { rotate: 360 } : {}}
                        transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
                      >
                        <RefreshIcon />
                      </motion.div>
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              
              {/* Contenido de la página con animación */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ flex: 1, width: '100%', overflow: 'hidden' }}
                >
                  {/* Indicador de carga de página */}
                  <Fade in={isPageLoading} unmountOnExit>
                    <PageLoadingIndicator>
                      <CircularProgress color="primary" size={40} thickness={4} />
                      <Typography variant="body2" color="text.secondary" fontFamily="Sora">
                        Cargando...
                      </Typography>
                    </PageLoadingIndicator>
                  </Fade>
                  
                  {/* Contenido real de la página */}
                  <Fade in={!isPageLoading}>
                    <Box sx={{ width: '100%', overflow: 'auto' }}>
                      {children}
                    </Box>
                  </Fade>
                </motion.div>
              </AnimatePresence>
            </MainContainer>
          </ContentWrapper>
          
          {/* Botón de navegación móvil */}
          {isMobile && !isSidebarOpen && (
            <MobileNavButton
              color="inherit"
              aria-label="abrir menú"
              onClick={toggleSidebar}
            >
              <MenuIcon />
            </MobileNavButton>
          )}
          
          {/* Backdrop para móvil */}
          <StyledBackdrop
            open={isBackdropOpen}
            onClick={() => setSidebarOpen(false)}
          />
        </MainWrapper>
      </LocalizationProvider>
    </ThemeContextProvider>
    </AuthProvider>
  );
}