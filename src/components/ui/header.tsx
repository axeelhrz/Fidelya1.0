'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { motion } from 'framer-motion'
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
import 'nprogress/nprogress.css'
import Logo from './logo'
import { useUser } from '@/hooks/use-user'
import { useThemeContext } from '@/context/themeContext'

// Import Phosphor Icons
import {
  List as ListIcon,
  X as XIcon,
  Sun,
  Moon,
  ChatCircle,
  SignIn,
  RocketLaunch,
  Globe,
  ArrowRight,
} from '@phosphor-icons/react'

// Types
interface NavItem {
  label: string
  path: string
  badge?: 'new' | 'live'
}

interface Language {
  code: string
  name: string
  flag: string
}

// Navigation Items - En el futuro podrían ser dinámicos según el idioma
const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Características', path: '/caracteristicas', badge: 'new' },
  { label: 'Precios', path: '/pricing' },
  { label: 'Contacto', path: '/contact' },
]

// Available languages
const LANGUAGES: Language[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
]

// Context for language, to avoid prop drilling
const LanguageContext = React.createContext<{
  currentLanguage: Language;
  handleLanguageChange: (language: Language) => void;
}>({
  currentLanguage: LANGUAGES[0],
  handleLanguageChange: () => {},
});

const useLanguageContext = () => React.useContext(LanguageContext);

// Styled Components
const StyledAppBar = styled(motion(AppBar))(({ theme }) => ({
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
}))

// Nuevo NavLink futurista con efectos modernos
const NavLink = styled(motion.a)(({ theme }) => ({
  color: theme.palette.text.primary,
  opacity: 0.85,
  textDecoration: 'none',
  padding: '8px 16px',
  borderRadius: '12px',
  fontSize: '0.95rem',
  letterSpacing: '0.3px',
  fontFamily: '"Inter", sans-serif',
  fontWeight: 600,
  position: 'relative',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at center, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
    opacity: 0,
    transform: 'scale(0)',
    transformOrigin: 'center',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: -1,
    borderRadius: 'inherit',
  },
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
    '&::after': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
  '&:hover': {
    opacity: 1,
    transform: 'translateY(-2px)',
    backgroundColor: theme.palette.mode === 'light'
      ? alpha(theme.palette.primary.main, 0.03)
      : alpha(theme.palette.primary.main, 0.07),
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
    '&::after': {
      opacity: 0.8,
      transform: 'scale(1)',
    },
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}))

// Botones modernizados con diseño más minimalista y estético
const StyledButton = styled(motion(Button))(({ theme }) => ({
  borderRadius: '14px',
  textTransform: 'none',
  padding: '10px 22px',
  fontSize: '0.95rem',
  fontFamily: '"Plus Jakarta Sans", sans-serif',
  fontWeight: 600,
  letterSpacing: '0.3px',
  boxShadow: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 10%, transparent 10.01%)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50%',
    transform: 'scale(10, 10)',
    opacity: 0,
    transition: 'transform .4s, opacity 0.8s',
  },
  '&:active::after': {
    transform: 'scale(0, 0)',
    opacity: 0.3,
    transition: '0s',
  },
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
  '& .MuiButton-startIcon': {
    marginRight: '8px',
  },
  '& .MuiButton-endIcon': {
    marginLeft: '8px',
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}))

// Badge futurista para etiquetas "new" y "live"
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
  backdropFilter: 'blur(4px)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  letterSpacing: '0.5px',
  marginLeft: '6px',
  boxShadow: `0 2px 5px ${alpha(theme.palette.primary.main, 0.15)}`,
}))

// Selector de tema mejorado con diseño más moderno
const ThemeModeToggle = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '80px',
  height: '36px',
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
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}))

const ThemeToggleIndicator = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: theme.palette.mode === 'light'
    ? `linear-gradient(135deg, #FFD700, #FFA500)`
    : `linear-gradient(135deg, #2C3E50, #4A5568)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  zIndex: 1,
}))

const ThemeIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  zIndex: 0,
  color: theme.palette.mode === 'light'
    ? alpha(theme.palette.text.primary, 0.7)
    : alpha(theme.palette.text.primary, 0.7),
}))

// This component is removed since it's not being used
// If you need a language button in the future, you can uncomment this code
/*
const LanguageButton = styled(motion(Button))(({ theme }) => ({
  borderRadius: '14px',
  textTransform: 'none',
  padding: '8px 14px',
  fontSize: '0.9rem',
  fontFamily: '"Inter", sans-serif',
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
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light'
      ? alpha(theme.palette.primary.main, 0.05)
      : alpha(theme.palette.primary.main, 0.1),
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}))
*/

// Note: This component was commented out as it's not currently used,
// but may be needed for future language selection implementation
/*
const LanguageMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '0.9rem',
  fontFamily: '"Inter", sans-serif',
  padding: '10px 16px',
  borderRadius: '8px',
  margin: '2px 8px',
  gap: '8px',
  transition: 'all 0.2s ease',
  '&.active': {
    backgroundColor: theme.palette.mode === 'light'
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.2),
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light'
      ? alpha(theme.palette.primary.main, 0.05)
      : alpha(theme.palette.primary.main, 0.1),
    transform: 'translateX(2px)',
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}))
*/


// Botón de chat flotante mejorado
const ChatButton = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary ? theme.palette.secondary.main : theme.palette.primary.dark})`,
  color: '#fff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  cursor: 'pointer',
  zIndex: 1000,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '3px',
  },
}))



// Componente para el efecto de resplandor en los enlaces
const GlowEffect = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '12px',
  zIndex: -1,
  background: theme.palette.mode === 'light'
    ? `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0)}, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0)})`
    : `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0)}, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0)})`,
  backgroundSize: '200% 100%',
  backgroundPosition: '100% 0',
}))


// Variantes para el efecto de resplandor
const glowVariants = {
  initial: { backgroundPosition: '100% 0', opacity: 0 },
  hover: { 
    backgroundPosition: '0% 0', 
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeInOut' }
  }
}

const buttonVariants = {
  hover: { scale: 1.05, y: -3, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' },
  tap: { scale: 0.97 },
}

const drawerItemVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  }),
  exit: { x: -50, opacity: 0 },
}

const chatButtonVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: 1,
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  },
  hover: { scale: 1.05, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' },
  tap: { scale: 0.95 }
};

const MobileDrawerContent = ({ 
  navItems, 
  pathname, 
  handleNavigation, 
  profile, 
  getFirstName, 
  mode, 
  toggleColorMode,
  theme
}: { 
  navItems: NavItem[]; 
  pathname: string | null; 
  handleNavigation: (path: string) => void; 
  profile: { displayName?: string } | null;
  getFirstName: () => string | null;
  mode: 'light' | 'dark';
  toggleColorMode: () => void;
  theme: import('@mui/material/styles').Theme;
}) => {
  const { currentLanguage, handleLanguageChange } = useLanguageContext();
  return (
    <List>
      {navItems.map((item, index) => (
                      <motion.div
                        key={item.path}
                        custom={index}
                        variants={drawerItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <ListItemButton
                          onClick={() => handleNavigation(item.path)}
                          sx={{
                            borderRadius: '12px',
                            mb: 1.5,
                            position: 'relative',
                            overflow: 'hidden',
                            backgroundColor: pathname && pathname === item.path
                              ? theme.palette.mode === 'light'
                                ? alpha(theme.palette.primary.main, 0.08)
                                : alpha(theme.palette.primary.main, 0.15)
                              : 'transparent',
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'light'
                                ? alpha(theme.palette.primary.main, 0.05)
                                : alpha(theme.palette.primary.main, 0.1),
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                            },
                            '&:focus-visible': {
                              outline: `2px solid ${theme.palette.primary.main}`,
                              outlineOffset: '2px',
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
                                fontFamily: '"Inter", sans-serif',
                                fontWeight: pathname && pathname === item.path ? 700 : 600,
                                fontSize: '1rem',
                                letterSpacing: '0.3px',
                                color: pathname && pathname === item.path
                                  ? theme.palette.primary.main
                                  : theme.palette.text.primary,
                              },
                            }}
                          />
                          {/* Efecto de resplandor para elementos del drawer */}
                          {(!pathname || pathname !== item.path) && (
                            <GlowEffect
                              variants={glowVariants}
                              initial="initial"
                              whileHover="hover"
                            />
                          )}
                        </ListItemButton>
                      </motion.div>
                    ))}
                    
                    {/* Selector de Idioma en Menú Móvil */}
                    <Box sx={{ mt: 3, mb: 2 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            mb: 2, 
                          pl: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <Globe size={16} weight="fill" />
                        Idioma
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ px: 1, flexWrap: 'wrap', gap: 1 }}>
                        {LANGUAGES.map((language) => (
                          <Box
                            key={language.code}
                            component={motion.div}
                            whileHover={{ scale: 1.05, y: -2, boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}` }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleLanguageChange(language)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 1,
                              padding: '8px 12px',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              backgroundColor: currentLanguage.code === language.code
                                ? theme.palette.mode === 'light'
                                  ? alpha(theme.palette.primary.main, 0.1)
                                  : alpha(theme.palette.primary.main, 0.2)
                                : theme.palette.mode === 'light'
                                  ? alpha(theme.palette.background.default, 0.5)
                                  : alpha(theme.palette.background.default, 0.2),
                              border: `1px solid ${
                                currentLanguage.code === language.code
                                  ? alpha(theme.palette.primary.main, 0.3)
                                  : alpha(theme.palette.divider, 0.1)
                              }`,
                              color: currentLanguage.code === language.code
                                ? theme.palette.primary.main
                                : theme.palette.text.primary,
                              fontWeight: currentLanguage.code === language.code ? 600 : 400,
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:focus-visible': {
                                outline: `2px solid ${theme.palette.primary.main}`,
                                outlineOffset: '2px',
                              },
                            }}
                          >
                            <Typography component="span" sx={{ fontSize: '1.2rem' }}>
                              {language.flag}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
                              {language.code.toUpperCase()}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                    
                    {/* Selector de Tema en Menú Móvil */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2, 
        my: 3, 
                      px: 2,
                      pb: 2,
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}>
                      <Typography variant="subtitle2" sx={{
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        {mode === 'light' ? <Sun size={16} weight="fill" /> : <Moon size={16} weight="fill" />}
                        Tema
                      </Typography>
                      
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
                        justifyContent: 'space-between',
                        backgroundColor: theme.palette.mode === 'light'
                          ? alpha(theme.palette.background.default, 0.5)
                          : alpha(theme.palette.background.default, 0.2),
                        borderRadius: '12px',
                        padding: '12px 16px',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
              {mode === 'light' ? (
                <Sun size={20} weight="fill" color={theme.palette.primary.main} />
              ) : (
                <Moon size={20} weight="fill" color={theme.palette.primary.main} />
              )}
            </Stack>
            
            <ThemeModeToggle
              onClick={toggleColorMode}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          sx={{ width: '60px', height: '30px' }}
                        >
                          <ThemeIcon sx={{ width: '22px', height: '22px' }}>
                            <Sun size={14} weight="fill" />
                          </ThemeIcon>
                          <ThemeIcon sx={{ width: '22px', height: '22px' }}>
                            <Moon size={14} weight="fill" />
                          </ThemeIcon>
                          <ThemeToggleIndicator
                            variants={{
                              light: { x: 4 },
                              dark: { x: 30 },
                            }}
                            animate={mode === 'light' ? 'light' : 'dark'}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            sx={{ width: '22px', height: '22px' }}
                          >
                            {mode === 'light' ? (
                              <Sun size={12} weight="fill" color="#FFF" />
                            ) : (
                              <Moon size={12} weight="fill" color="#FFF" />
                            )}
                          </ThemeToggleIndicator>
                        </ThemeModeToggle>
                      </Box>
                    </Box>
                    
                    {/* Acciones de Usuario en Menú Móvil */}
                    <Box sx={{ mt: 2, px: 1 }}>
                      {profile ? (
                        <>
                          {/* Saludo al Usuario en Móvil */}
            <Typography 
              variant="body1" 
              sx={{ 
                              fontFamily: '"Plus Jakarta Sans", sans-serif',
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
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
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
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            fullWidth
                            variant="outlined"
                            onClick={() => handleNavigation('/auth/sign-in')}
                            startIcon={<SignIn weight="bold" />}
                            sx={{ mb: 2 }}
                          >
                            Iniciar sesión
                          </StyledButton>
                          <StyledButton
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            fullWidth
                            variant="contained"
                            onClick={() => handleNavigation('/auth/sign-up')}
                            startIcon={<RocketLaunch weight="bold" />}
                            endIcon={<ArrowRight weight="bold" />}
                          >
                            Comenzar ahora
                          </StyledButton>
                        </>
                      )}
                    </Box>
                  </List>
  )
}

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<Language>(LANGUAGES[0])
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const pathname = usePathname()
  const router = useRouter()
  const { profile } = useUser()
  const { mode, toggleColorMode } = useThemeContext()

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Memoize container styles for better performance
  const containerStyles = useMemo(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: isMobile ? '0 8px' : '0 16px',
  }), [isMobile])

  // Get first name for greeting
  const getFirstName = () => {
    if (!profile?.displayName) return null
    return profile.displayName.split(' ')[0]
  }

  // Handle navigation
  const handleNavigation = (path: string) => {
    setIsDrawerOpen(false)
    router.push(path)
  }

  // Context value for language
  const languageContextValue = useMemo(() => ({
    currentLanguage,
    handleLanguageChange: (language: Language) => {
      setCurrentLanguage(language);
    }
  }), [currentLanguage]);
  return (
    <>
      <LanguageContext.Provider value={languageContextValue}>
        <StyledAppBar className={isScrolled ? 'scrolled' : ''}>
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={containerStyles}>
              {/* Logo */}
              <Link href="/" passHref>
                <Box
                  sx={{
                    '&:hover': {
                      opacity: 0.9,
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
                  spacing={1}
                  alignItems="center"
                  sx={{ mx: 'auto', px: 2 }}
                >
                  {NAV_ITEMS.map((item) => (
                    <Link key={item.path} href={item.path} passHref>
                      <NavLink className={pathname === item.path ? 'active' : ''}>
                        {item.label}
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
              <Stack direction="row" spacing={1.5} alignItems="center">
                {/* Theme Selector */}
                <Tooltip title={mode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}>
                  <ThemeModeToggle onClick={toggleColorMode} />
                </Tooltip>
                {/* User Actions */}
                {!isMobile && (
                  <>
                    {profile ? (
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        {/* User Greeting */}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600,
                            display: { xs: 'none', md: 'block' },
                          }}
                        >
                          Hola, {getFirstName()}
                        </Typography>
                        
                        {/* Dashboard Button */}
                        <Button
                          variant="contained"
                          onClick={() => handleNavigation('/dashboard')}
                          startIcon={<RocketLaunch weight="bold" />}
                          sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            px: 2,
                            py: 0.75,
                          }}
                        >
                          Dashboard
                        </Button>
                      </Stack>
                    ) : (
                      <>
                        <Button
                          variant="outlined"
                          onClick={() => handleNavigation('/auth/sign-in')}
                          startIcon={<SignIn weight="bold" />}
                          sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            px: 2,
                            py: 0.75,
                          }}
                        >
                          Iniciar sesión
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleNavigation('/auth/sign-up')}
                          startIcon={<RocketLaunch weight="bold" />}
                          endIcon={<ArrowRight weight="bold" />}
                          sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            px: 2,
                            py: 0.75,
                          }}
                        >
                          Comenzar ahora
                        </Button>
                      </>
                    )}
                  </>
                )}

                {/* Mobile Menu Button */}
                {isMobile && (
                  <IconButton
                    onClick={() => setIsDrawerOpen(true)}
                    sx={{
                      color: 'text.primary'
                    }}
                    aria-label="abrir menú"
                  >
                    <ListIcon size={24} weight="bold" />
                  </IconButton>
                )}
              </Stack>
            </Toolbar>
          </Container>
        </StyledAppBar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: '100%',
              maxWidth: '320px',
              borderTopLeftRadius: '16px',
              borderBottomLeftRadius: '16px',
              padding: '16px',
            }
          }}
        >
          <IconButton
            onClick={() => setIsDrawerOpen(false)}
            aria-label="cerrar menú"
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              color: 'text.primary',
            }}
          >
            <XIcon size={24} weight="bold" />
          </IconButton>
          
          <Suspense fallback={<Box sx={{ height: '400px' }}><Typography>Cargando...</Typography></Box>}>
            <MobileDrawerContent 
              navItems={NAV_ITEMS} 
              pathname={pathname} 
              handleNavigation={handleNavigation}
              profile={profile}
              getFirstName={getFirstName}
              mode={mode}
              toggleColorMode={toggleColorMode}
              theme={theme}
            />
          </Suspense>
        </Drawer>
  
        {/* Spacer to prevent content from hiding behind the fixed header */}
        <Box sx={{ height: '70px', [theme.breakpoints.down('md')]: { height: '60px' } }} />
  
        {/* Chat Button */}
        <ChatButton
          variants={chatButtonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          onClick={() => setShowChatModal(true)}
        >
          <ChatCircle size={28} weight="fill" />
        </ChatButton>
      
        {/* Modal de Chat (implementación futura) */}
        {showChatModal && (
          // Placeholder para implementación del modal de chat
          <Box sx={{ display: 'none' }}>Chat Modal</Box>
        )}
      </LanguageContext.Provider>
    </>
  )
}

export default Header;