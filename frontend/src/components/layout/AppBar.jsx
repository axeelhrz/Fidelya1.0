import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import NotificationBell from './NotificationBell';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

const AppBar = ({ 
  sidebarOpen, 
  onSidebarToggle, 
  sidebarCollapsed, 
  darkMode, 
  onToggleDarkMode,
  title = 'Dashboard'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getAppBarWidth = () => {
    if (isMobile) return '100%';
    if (sidebarCollapsed) return `calc(100% - ${DRAWER_WIDTH_COLLAPSED}px)`;
    return `calc(100% - ${DRAWER_WIDTH}px)`;
  };

  const getAppBarMargin = () => {
    if (isMobile) return 0;
    if (sidebarCollapsed) return DRAWER_WIDTH_COLLAPSED;
    return DRAWER_WIDTH;
  };

  return (
    <MuiAppBar
      position="fixed"
      elevation={1}
      sx={{
        width: getAppBarWidth(),
        ml: `${getAppBarMargin()}px`,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        {/* Mobile menu button */}
        {isMobile && (
          <IconButton
            edge="start"
            onClick={onSidebarToggle}
            sx={{
              mr: 2,
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              flexGrow: 1,
            }}
          >
            {title}
          </Typography>
        </motion.div>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Dark mode toggle */}
          <IconButton
            onClick={onToggleDarkMode}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Notifications */}
          <NotificationBell />
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;