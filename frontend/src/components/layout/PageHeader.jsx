import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  alpha,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const PageHeader = ({ 
  title, 
  subtitle, 
  onSidebarToggle, 
  isMobile, 
  darkMode, 
  onToggleDarkMode,
  breadcrumbs = [],
  actions = null,
  stats = null
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const generateBreadcrumbs = () => {
    if (breadcrumbs.length > 0) return breadcrumbs;
    
    const pathnames = location.pathname.split('/').filter((x) => x);
    const defaultBreadcrumbs = [
      { label: 'Inicio', path: '/dashboard', icon: <HomeIcon sx={{ fontSize: 16 }} /> }
    ];

    pathnames.forEach((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = name.charAt(0).toUpperCase() + name.slice(1);
      defaultBreadcrumbs.push({ label, path: routeTo });
    });

    return defaultBreadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Top Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            {/* Left Side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Mobile menu button */}
              {isMobile && (
                <IconButton
                  edge="start"
                  onClick={onSidebarToggle}
                  sx={{
                    color: theme.palette.text.primary,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              {/* Breadcrumbs */}
              <Breadcrumbs
                separator={<ChevronRightIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                {breadcrumbItems.map((item, index) => (
                  <Link
                    key={index}
                    component="button"
                    variant="body2"
                    onClick={() => navigate(item.path)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      color: index === breadcrumbItems.length - 1 ? 'primary.main' : 'text.secondary',
                      textDecoration: 'none',
                      fontWeight: index === breadcrumbItems.length - 1 ? 600 : 400,
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline',
                      },
                      transition: 'color 0.2s ease-in-out',
                    }}
                  >
                    {item.icon && item.icon}
                    {item.label}
                  </Link>
                ))}
              </Breadcrumbs>
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {actions}
              <NotificationBell />
            </Box>
          </Box>

          {/* Title Section */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: subtitle ? 1 : 0,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontSize: '1rem',
                    lineHeight: 1.5,
                    maxWidth: '600px',
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>

            {/* Stats */}
            {stats && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Chip
                      label={`${stat.label}: ${stat.value}`}
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        fontWeight: 600,
                        '& .MuiChip-label': {
                          px: 2,
                          py: 1,
                        },
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            )}
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default PageHeader;