import React, { useState, useEffect } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 72;
const DRAWER_WIDTH_COLLAPSED = 72;

const MainLayout = ({ title }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Responsive behavior
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setSidebarCollapsed(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const getMainContentMargin = () => {
    if (isMobile) return 0;
    if (sidebarCollapsed) return DRAWER_WIDTH_COLLAPSED;
    return DRAWER_WIDTH;
  };

  // Create enhanced theme
  const enhancedTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#0a0a0a' : '#fafafa',
        paper: darkMode ? '#1a1a1a' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#1a1a1a',
        secondary: darkMode ? '#a0a0a0' : '#6b7280',
      },
      primary: {
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#1d4ed8',
    },
      divider: darkMode ? '#2a2a2a' : '#e5e7eb',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.025em',
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.025em',
      },
      h6: {
        fontWeight: 600,
        letterSpacing: '-0.025em',
      },
      subtitle1: {
        fontWeight: 500,
      },
      body1: {
        lineHeight: 1.6,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: darkMode 
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            borderRadius: 16,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 10,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={enhancedTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onClose={handleSidebarToggle}
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleSidebarCollapse}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />

        {/* Main content area */}
          <Box
          component="main"
            sx={{
            flexGrow: 1,
            width: isMobile ? '100%' : `calc(100% - ${getMainContentMargin()}px)`,
            ml: isMobile ? 0 : `${getMainContentMargin()}px`,
            transition: enhancedTheme.transitions.create(['width', 'margin'], {
              easing: enhancedTheme.transitions.easing.sharp,
              duration: enhancedTheme.transitions.duration.leavingScreen,
            }),
            backgroundColor: 'background.default',
            minHeight: '100vh',
            position: 'relative',
          }}
            >
          {/* Page content with integrated header */}
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ flex: 1 }}
            >
              {/* Usar Outlet en lugar de React.cloneElement */}
              <Outlet />
            </motion.div>
          </Box>
        </Box>

        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: enhancedTheme.zIndex.drawer - 1,
              backdropFilter: 'blur(4px)',
            }}
            onClick={handleSidebarToggle}
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;