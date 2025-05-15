'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Box,
  Container,
  Stack,
  alpha,
  Typography,
  Tooltip,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Logo from './logo'
import { useUser } from '@/hooks/use-user'
import { useThemeContext } from '@/context/themeContext'

// Import only the specific icons we need
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { Sun } from '@phosphor-icons/react/dist/ssr/Sun';
import { Moon } from '@phosphor-icons/react/dist/ssr/Moon';
import { SignIn } from '@phosphor-icons/react/dist/ssr/SignIn';
import { RocketLaunch } from '@phosphor-icons/react/dist/ssr/RocketLaunch';

// Types
interface NavItem {
  label: string;
  path: string;
  badge?: 'new' | 'live';
}

// Navigation Items
const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Características', path: '/caracteristicas', badge: 'new' },
  { label: 'Precios', path: '/pricing' },
  { label: 'Contacto', path: '/contact' },
];

// Styled Components - Simplified
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.mode === 'light'
    ? alpha(theme.palette.background.paper, 0.7)
    : alpha(theme.palette.background.paper, 0.6),
  backdropFilter: 'blur(15px)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease-in-out',
  height: '70px',
  [theme.breakpoints.down('md')]: {
    height: '60px',
  },
  '&.scrolled': {
    background: theme.palette.mode === 'light'
      ? alpha(theme.palette.background.paper, 0.85)
      : alpha(theme.palette.background.paper, 0.75),
    backdropFilter: 'blur(20px)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
  },
}));

// NavLink with simplified styling
const NavLink = styled('a')(({ theme }) => ({
  color: theme.palette.text.primary,
  opacity: 0.85,
  textDecoration: 'none',
  padding: '8px 16px',
  borderRadius: '12px',
  fontSize: '0.95rem',
  letterSpacing: '0.3px',
  fontWeight: 600,
  position: 'relative',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '&.active': {
    color: theme.palette.primary.main,
    opacity: 1,
    fontWeight: 700,
    backgroundColor: theme.palette.mode === 'light'
      ? alpha(theme.palette.primary.main, 0.05)
      : alpha(theme.palette.primary.main, 0.1),
    boxShadow: theme.palette.mode === 'light'
      ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`
      : `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
  '&:hover': {
    opacity: 1,
    transform: 'translateY(-2px)',
    backgroundColor: theme.palette.mode === 'light'
      ? alpha(theme.palette.primary.main, 0.03)
      : alpha(theme.palette.primary.main, 0.07),
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

// Simplified button styling
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '14px',
  textTransform: 'none',
  padding: '10px 20px',
  fontSize: '0.95rem',
  fontWeight: 600,
  letterSpacing: '0.3px',
  boxShadow: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&.MuiButton-contained': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary ? theme.palette.secondary.main : theme.palette.primary.dark})`,
    color: '#fff',
    border: 'none',
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary ? theme.palette.secondary.dark : theme.palette.primary.main})`,
      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
      transform: 'translateY(-3px)',
    },
  },
  '&.MuiButton-outlined': {
    borderWidth: '1.5px',
    borderColor: theme.palette.mode === 'light'
      ? alpha(theme.palette.divider, 0.5)
      : alpha(theme.palette.divider, 0.2),
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.mode === 'light'
        ? alpha(theme.palette.primary.main, 0.04)
        : alpha(theme.palette.primary.main, 0.08),
      transform: 'translateY(-3px)',
      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
    },
  },
}));

// Badge for "new" and "live" labels
const BadgeLabel = styled('span')(({ theme }) => ({
  padding: '3px 8px',
  borderRadius: '20px',
  fontSize: '0.65rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  background: theme.palette.mode === 'light'
    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.light, 0.2)})`
    : `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.3)}, ${alpha(theme.palette.primary.main, 0.2)})`,
  color: theme.palette.primary.main,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  letterSpacing: '0.5px',
  marginLeft: '6px',
}));

// Theme toggle with simplified styling
const ThemeModeToggle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '60px',
  height: '32px',
  borderRadius: '30px',
  padding: '4px',
  position: 'relative',
  cursor: 'pointer',
  background: theme.palette.mode === 'light'
    ? `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.light, 0.2)})`
    : `linear-gradient(to right, ${alpha(theme.palette.primary.dark, 0.3)}, ${alpha(theme.palette.primary.main, 0.2)})`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  boxShadow: theme.palette.mode === 'light'
    ? 'inset 0 2px 5px rgba(0, 0, 0, 0.05)'
    : 'inset 0 2px 5px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
}));

const ThemeToggleIndicator = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  background: theme.palette.mode === 'light'
    ? `linear-gradient(135deg, #FFD700, #FFA500)`
    : `linear-gradient(135deg, #2C3E50, #4A5568)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  zIndex: 1,
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: theme.palette.mode === 'light' ? 'translateX(0)' : 'translateX(28px)',
}));

const ThemeIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  zIndex: 0,
  color: theme.palette.mode === 'light'
    ? alpha(theme.palette.text.primary, 0.7)
    : alpha(theme.palette.text.primary, 0.7),
}));

// Simplified language button
const LanguageButton = styled(Button)(({ theme }) => ({
  borderRadius: '14px',
  textTransform: 'none',
  padding: '8px 14px',
  fontSize: '0.9rem',
  fontWeight: 600,
  letterSpacing: '0.3px',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.mode === 'light'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.background.paper, 0.8),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light'
      ? alpha(theme.palette.primary.main, 0.05)
      : alpha(theme.palette.primary.main, 0.1),
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

// Progress bar for scroll position
const ScrollProgressBar = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '3px',
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || theme.palette.primary.dark} 100%)`,
  transformOrigin: '0%',
  transition: 'transform 0.2s ease-out',
}));

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useUser();
  const { mode, toggleColorMode } = useThemeContext();

  // Handle scroll events with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Update scroll state
          setIsScrolled(window.scrollY > 10);
          
          // Calculate scroll progress
          const totalHeight = document.body.scrollHeight - window.innerHeight;
          const progress = (window.scrollY / totalHeight) || 0;
          setScrollProgress(progress);
          
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoize container styles for better performance
  const containerStyles = useMemo(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(isMobile ? 1 : 2),
    transition: 'all 0.3s ease',
    height: isScrolled ? (isMobile ? '60px' : '70px') : (isMobile ? '60px' : '70px'),
  }), [theme, isScrolled, isMobile]);

  // Handle navigation
  const handleNavigation = (path: string) => {
    setIsDrawerOpen(false);
    router.push(path);
  };

  // Get first name for greeting
  const getFirstName = () => {
    if (!profile?.displayName) return null;
    return profile.displayName.split(' ')[0];
  };

  return (
    <>
      <StyledAppBar
        position="fixed"
        className={isScrolled ? 'scrolled' : ''}
      >
        {/* Scroll Progress Bar */}
        <ScrollProgressBar
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
        
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={containerStyles}>
            {/* Logo */}
            <Link href="/" passHref>
              <Box
                sx={{
                  '&:hover': {
                    transform: 'scale(1.03)',
                    transition: 'transform 0.3s ease',
                  }
                }}
              >
                <Logo />
              </Box>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Stack 
                direction="row" 
                spacing={1.5}
                alignItems="center"
                sx={{ mx: 'auto', px: 4 }}
              >
                {NAV_ITEMS.map((item) => (
                  <Link key={item.path} href={item.path} passHref>
                    <NavLink
                      className={pathname === item.path ? 'active' : ''}
                    >
                      <span>
                        {item.label}
                      </span>
                      
                      {item.badge && (
                        <BadgeLabel>
                          {item.badge}
                        </BadgeLabel>
                      )}
                    </NavLink>
                  </Link>
                ))}
              </Stack>
            )}

            {/* Right Side Actions */}
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Language Button - Simplified */}
              <Box>
                <LanguageButton>
                  <Typography component="span" sx={{ mr: 0.5 }}>
                    🇪🇸
                  </Typography>
                  {!isMobile && (
                    <Typography variant="body2">
                      ES
                    </Typography>
                  )}
                </LanguageButton>
              </Box>

              {/* Theme Toggle */}
              <Tooltip title={mode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}>
                <ThemeModeToggle onClick={toggleColorMode}>
                  <ThemeIcon>
                    <Sun size={16} weight="fill" />
                  </ThemeIcon>
                  <ThemeIcon>
                    <Moon size={16} weight="fill" />
                  </ThemeIcon>
                  <ThemeToggleIndicator>
                    {mode === 'light' ? (
                      <Sun size={14} weight="fill" color="#FFF" />
                    ) : (
                      <Moon size={14} weight="fill" color="#FFF" />
                    )}
                  </ThemeToggleIndicator>
                </ThemeModeToggle>
              </Tooltip>

              {/* User Actions */}
              {!isMobile && (
                <>
                  {profile ? (
                    <Stack direction="row" spacing={2} alignItems="center">
                      {/* User Greeting */}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          display: { xs: 'none', md: 'block' },
                          color: theme.palette.mode === 'light' ? 'black' : 'white'
                        }}
                      >
                        Hola, {getFirstName()}
                      </Typography>
                      
                      {/* Dashboard Button */}
                      <StyledButton
                        variant="contained"
                        onClick={() => handleNavigation('/dashboard')}
                        startIcon={<RocketLaunch weight="bold" />}
                      >
                        Dashboard
                      </StyledButton>
                    </Stack>
                  ) : (
                    <>
                      <StyledButton
                        variant="outlined"
                        onClick={() => handleNavigation('/auth/sign-in')}
                        startIcon={<SignIn weight="bold" />}
                      >
                        Iniciar sesión
                      </StyledButton>
                      <StyledButton
                        variant="contained"
                        onClick={() => handleNavigation('/auth/sign-up')}
                        startIcon={<RocketLaunch weight="bold" />}
                      >
                        Comenzar ahora
                      </StyledButton>
                    </>
                  )}
                </>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  onClick={() => setIsDrawerOpen(true)}
                  sx={{
                    color: theme.palette.text.primary
                  }}
                  aria-label="abrir menú"
                >
                  <ListIcon size={24} weight="bold" />
                </IconButton>
              )}
            </Stack>

            {/* Mobile Drawer - Simplified */}
            <Drawer
              anchor="right"
              open={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              PaperProps={{
                sx: {
                  width: '100%',
                  maxWidth: '320px',
                  background: theme.palette.mode === 'light'
                    ? alpha(theme.palette.background.paper, 0.98)
                    : alpha(theme.palette.background.paper, 0.98),
                  backdropFilter: 'blur(15px)',
                  borderTopLeftRadius: '16px',
                  borderBottomLeftRadius: '16px',
                  boxShadow: '-8px 0px 32px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Logo />
                  <IconButton
                    onClick={() => setIsDrawerOpen(false)}
                    aria-label="cerrar menú"
                  >
                    <XIcon size={24} weight="bold" />
                  </IconButton>
                </Box>
                
                <List>
                  {NAV_ITEMS.map((item) => (
                    <ListItemButton
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        borderRadius: '12px',
                        mb: 1.5,
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: pathname === item.path
                          ? theme.palette.mode === 'light'
                            ? alpha(theme.palette.primary.main, 0.08)
                            : alpha(theme.palette.primary.main, 0.15)
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'light'
                            ? alpha(theme.palette.primary.main, 0.05)
                            : alpha(theme.palette.primary.main, 0.1),
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {item.label}
                            {item.badge && (
                              <BadgeLabel>
                                {item.badge}
                              </BadgeLabel>
                            )}
                          </Box>
                        }
                        sx={{
                          '& .MuiTypography-root': {
                            fontWeight: pathname === item.path ? 700 : 600,
                            fontSize: '1rem',
                            letterSpacing: '0.3px',
                            color: pathname === item.path
                              ? theme.palette.primary.main
                              : theme.palette.text.primary,
                          },
                        }}
                      />
                    </ListItemButton>
                  ))}
                  
                  {/* Mobile User Actions */}
                  <Box sx={{ mt: 2, px: 1 }}>
                    {profile ? (
                      <>
                        {/* User Greeting */}
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 600,
                            mb: 2,
                            pl: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: theme.palette.mode === 'light' ? 'black' : 'white'
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              borderRadius: '50%', 
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: theme.palette.primary.main
                            }}
                          >
                            {getFirstName()?.charAt(0).toUpperCase()}
                          </Box>
                          Hola, {getFirstName()}
                        </Typography>
                        
                        <StyledButton
                          fullWidth
                          variant="contained"
                          onClick={() => handleNavigation('/dashboard')}
                          startIcon={<RocketLaunch weight="bold" />}
                          sx={{ mb: 2 }}
                        >
                          Dashboard
                        </StyledButton>
                      </>
                    ) : (
                      <>
                        <StyledButton
                          fullWidth
                          variant="outlined"
                          onClick={() => handleNavigation('/auth/sign-in')}
                          startIcon={<SignIn weight="bold" />}
                          sx={{ mb: 2 }}
                        >
                          Iniciar sesión
                        </StyledButton>
                        <StyledButton
                          fullWidth
                          variant="contained"
                          onClick={() => handleNavigation('/auth/sign-up')}
                          startIcon={<RocketLaunch weight="bold" />}
                        >
                          Comenzar ahora
                        </StyledButton>
                      </>
                    )}
                  </Box>
                </List>
              </Box>
            </Drawer>
          </Toolbar>
        </Container>
      </StyledAppBar>
      
      {/* Spacer to prevent content from being hidden under the fixed header */}
      <Box sx={{ height: { xs: '60px', md: '70px' } }} />
    </>
  );
};

export default Header;