import React, { useState, useEffect } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import AppBar from './AppBar';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

const MainLayout = ({ children, title }) => {
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

  // Create dark theme
  const darkTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#333333',
        secondary: darkMode ? '#b3b3b3' : '#666666',
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onClose={handleSidebarToggle}
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleSidebarCollapse}
        />

        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: isMobile ? '100%' : `calc(100% - ${getMainContentMargin()}px)`,
            ml: isMobile ? 0 : `${getMainContentMargin()}px`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            backgroundColor: darkTheme.palette.background.default,
            minHeight: '100vh',
          }}
        >
          {/* AppBar */}
          <AppBar
            sidebarOpen={sidebarOpen}
            onSidebarToggle={handleSidebarToggle}
            sidebarCollapsed={sidebarCollapsed}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
            title={title}
          />

          {/* Page content */}
          <Box
            sx={{
              pt: '64px', // AppBar height
              p: 3,
              minHeight: 'calc(100vh - 64px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
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
              zIndex: theme.zIndex.drawer - 1,
            }}
            onClick={handleSidebarToggle}
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;