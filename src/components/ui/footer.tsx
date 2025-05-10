'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
  Link,
  Divider,
  Button,
  Menu,
  MenuItem,
  Modal,
  TextField,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { landingColors } from '@/styles/theme/landing-colors';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import Logo from './logo';

// Tipos
type Language = 'es' | 'en' | 'fr';
type Currency = 'USD' | 'EUR';

// Datos
const footerLinks = {
  producto: [
    { name: 'Características', href: '/caracteristicas' },
    { name: 'Precios', href: '/pricing' },
    { name: 'Actualizaciones', href: '/actualizaciones' },
  ],
  empresa: [
    { name: 'Sobre nosotros', href: '/sobre-nosotros' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contacto', href: '/contact' },
  ],
  soporte: [
    { name: 'Centro de ayuda', href: '/ayuda' },
    { name: 'Estado del sistema', href: '/estado' },
    { name: 'Seguridad', href: '/seguridad' },
  ],
  legal: [
    { name: 'Términos de servicio', href: '/terminos' },
    { name: 'Privacidad', href: '/privacidad' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'Licencias', href: '/licencias' },
  ],
};

const socialLinks = [
  { Icon: LinkedInIcon, href: '#', label: 'LinkedIn' },
  { Icon: TwitterIcon, href: '#', label: 'Twitter' },
  { Icon: FacebookIcon, href: '#', label: 'Facebook' },
  { Icon: InstagramIcon, href: '#', label: 'Instagram' },
];

const contactInfo = [
  {
    icon: <EmailIcon sx={{ fontSize: 20 }} />,
    value: 'axeelhrz@gmail.com',
    href: 'mailto:axeelhrz@gmail.com',
    action: 'email',
  },
  {
    icon: <PhoneIcon sx={{ fontSize: 20 }} />,
    value: '+598 92 388 748',
    href: 'tel:+59892388748',
    action: 'phone',
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: 20 }} />,
    value: 'Montevideo, Uruguay',
    href: 'https://maps.google.com/?q=Montevideo,Uruguay',
    action: null,
  },
];

const languages = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
];

const currencies = [
  { code: 'USD', label: 'USD $', symbol: '$' },
  { code: 'EUR', label: 'EUR €', symbol: '€' },
];

export default function Footer() {
  const theme = useTheme();
  // Theme detection hook
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Estados para menús desplegables
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);
  const [currencyAnchor, setCurrencyAnchor] = useState<null | HTMLElement>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactType, setContactType] = useState<'email' | 'phone' | null>(null);
  
  // Estados para idioma y moneda
  const [language, setLanguage] = useState<Language>('es');
  const [currency, setCurrency] = useState<Currency>('USD');
  
  // Cargar preferencias guardadas
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    const savedCurrency = localStorage.getItem('currency') as Currency;
    
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedCurrency) setCurrency(savedCurrency);
  }, []);
  
  // Guardar preferencias
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    setLanguageAnchor(null);
  };
  
  const handleCurrencyChange = (curr: Currency) => {
    setCurrency(curr);
    localStorage.setItem('currency', curr);
    setCurrencyAnchor(null);
  };
  
  // Manejadores de modal
  const handleContactClick = (type: 'email' | 'phone') => {
    setContactType(type);
    setContactModalOpen(true);
  };
  
  // Estilos dinámicos basados en el tema
  const gradientBg = isDarkMode
    ? `
      radial-gradient(circle at 0% 0%, ${alpha('#0F172A', 0.8)} 0%, ${alpha('#1E293B', 0.4)} 50%),
      radial-gradient(circle at 100% 100%, ${alpha('#6D28D9', 0.3)} 0%, transparent 50%)
    `
    : `
      radial-gradient(circle at 0% 0%, ${alpha('#3B82F6', 0.08)} 0%, transparent 50%),
      radial-gradient(circle at 100% 100%, ${alpha('#8B5CF6', 0.08)} 0%, transparent 50%)
    `;
  
  const linkStyles = {
    color: isDarkMode ? alpha('#CBD5E1', 0.8) : '#64748B',
    transition: 'all 0.4s ease',
    fontSize: '0.875rem',
    fontFamily: '"Space Grotesk", sans-serif',
    letterSpacing: '0.3px',
    position: 'relative',
    '&:hover': {
      color: isDarkMode ? '#F8FAFC' : '#1E293B',
      transform: 'translateY(-2px)',
      textShadow: isDarkMode 
        ? '0 0 8px rgba(203, 213, 225, 0.3)' 
        : 'none',
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      width: '0%',
      height: '1px',
      bottom: '-2px',
      left: '0',
      background: isDarkMode 
        ? 'linear-gradient(90deg, #8B5CF6, transparent)' 
        : 'linear-gradient(90deg, #3B82F6, transparent)',
      transition: 'width 0.3s ease',
    },
    '&:hover:after': {
      width: '100%',
    },
    '&:focus-visible': {
      outline: `2px solid ${isDarkMode ? '#8B5CF6' : '#3B82F6'}`,
      outlineOffset: '3px',
      borderRadius: '2px',
    },
  };
  
  const socialIconStyles = {
    color: isDarkMode ? alpha('#CBD5E1', 0.8) : '#64748B',
    transition: 'all 0.4s ease',
    p: 1,
    '&:hover': {
      color: isDarkMode ? '#F8FAFC' : landingColors.primary,
      transform: 'scale(1.1)',
      bgcolor: isDarkMode 
        ? alpha('#8B5CF6', 0.15) 
        : alpha('#3B82F6', 0.08),
      boxShadow: isDarkMode 
        ? '0 0 12px rgba(139, 92, 246, 0.3)' 
        : '0 0 8px rgba(59, 130, 246, 0.2)',
    },
    '&:focus-visible': {
      outline: `2px solid ${isDarkMode ? '#8B5CF6' : '#3B82F6'}`,
      outlineOffset: '3px',
    },
  };
  
  const buttonStyles = {
    color: isDarkMode ? alpha('#CBD5E1', 0.8) : '#64748B',
    textTransform: 'none',
    fontSize: '0.875rem',
    fontFamily: '"Space Grotesk", sans-serif',
    letterSpacing: '0.3px',
    minWidth: 'auto',
    transition: 'all 0.4s ease',
    '&:hover': {
      color: isDarkMode ? '#F8FAFC' : '#1E293B',
      bgcolor: isDarkMode 
        ? alpha('#8B5CF6', 0.15) 
        : alpha('#3B82F6', 0.08),
      transform: 'translateY(-2px)',
    },
    '&:focus-visible': {
      outline: `2px solid ${isDarkMode ? '#8B5CF6' : '#3B82F6'}`,
      outlineOffset: '3px',
    },
  };
  
  // Efecto de ruido (noise texture)
  const noiseEffect = {
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      opacity: 0.03,
      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
      backgroundRepeat: 'repeat',
      pointerEvents: 'none',
      zIndex: 1,
    }
  };
  
  return (
    <Box
      component={motion.footer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      sx={{
        bgcolor: isDarkMode ? '#0F172A' : '#F8FAFC',
        color: isDarkMode ? '#F8FAFC' : '#1E293B',
        pt: { xs: 6, md: 8 },
        pb: 3,
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(80px)',
        borderTop: `1px solid ${isDarkMode ? alpha('#CBD5E1', 0.1) : alpha('#64748B', 0.1)}`,
        ...noiseEffect,
      }}
    >
      {/* Fondo con gradiente */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: gradientBg,
          zIndex: 0,
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 6, md: 8 }}
          justifyContent="space-between"
          mb={6}
        >
          {/* Logo y contacto */}
          <Box sx={{ maxWidth: 320 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Box 
                sx={{ 
                  mb: 2.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    filter: `drop-shadow(0 0 8px ${isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(59, 130, 246, 0.4)'})`
                  }
                }}
              >
                <Logo />
              </Box>
              
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? alpha('#CBD5E1', 0.8) : '#64748B',
                  mb: 2.5,
                  maxWidth: 280,
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  fontFamily: '"Space Grotesk", sans-serif',
                  letterSpacing: '0.3px',
                }}
              >
                Transformando la gestión de seguros con tecnología inteligente.
                Únete a miles de corredores que ya han modernizado su negocio.
              </Typography>
              
              <Stack spacing={1.5}>
                {contactInfo.map((info, index) => (
                  <Box
                    key={index}
                    component={motion.div}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    {info.action ? (
                      <Button
                        onClick={() => info.action && handleContactClick(info.action as 'email' | 'phone')}
                        sx={{
                          justifyContent: 'flex-start',
                          p: 0,
                          minWidth: 'auto',
                          textTransform: 'none',
                          color: 'inherit',
                          '&:hover': {
                            background: 'transparent',
                          }
                        }}
                      >
                        <Link
                          component="span"
                          underline="none"
                          sx={{
                            ...linkStyles,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box sx={{ 
                            color: isDarkMode ? '#8B5CF6' : landingColors.primary,
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            }
                          }}>
                            {info.icon}
                          </Box>
                          <Typography variant="body2">{info.value}</Typography>
                        </Link>
                      </Button>
                    ) : (
                      <Link
                        href={info.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="none"
                        sx={{
                          ...linkStyles,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Box sx={{ 
                          color: isDarkMode ? '#8B5CF6' : landingColors.primary,
                        }}>
                          {info.icon}
                        </Box>
                        <Typography variant="body2">{info.value}</Typography>
                      </Link>
                    )}
                  </Box>
                ))}
              </Stack>
            </motion.div>
          </Box>
          
          {/* Enlaces del footer */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 4, sm: 6, md: 8 }}
            flexWrap="wrap"
            useFlexGap
            sx={{ flex: 1 }}
          >
            {Object.entries(footerLinks).map(([category, links], index) => (
              <Box
                key={category}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                sx={{ minWidth: { sm: '140px' } }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: isDarkMode ? '#F8FAFC' : '#1E293B',
                    fontWeight: 600,
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '0.75rem',
                    fontFamily: '"Space Grotesk", sans-serif',
                  }}
                >
                  {category}
                </Typography>
                <Stack spacing={1.5}>
                  {links.map((link) => (
                    <Box
                      key={link.name}
                      component={motion.div}
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <Link
                        href={link.href}
                        underline="none"
                        sx={linkStyles}
                      >
                        {link.name}
                      </Link>
                    </Box>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Stack>
        
        <Divider sx={{ 
          borderColor: isDarkMode ? alpha('#CBD5E1', 0.1) : '#E2E8F0',
          mb: 3,
        }} />
        
        {/* Footer bottom */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Typography
              variant="body2"
              sx={{
                color: isDarkMode ? alpha('#CBD5E1', 0.7) : '#64748B',
                fontSize: '0.75rem',
                fontFamily: '"Space Grotesk", sans-serif',
                letterSpacing: '0.3px',
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              Assuriva {new Date().getFullYear()}
            </Typography>
          </Box>
          
          <Stack
            direction="row"
            spacing={1}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {socialLinks.map((social) => (
              <Tooltip key={social.label} title={social.label} arrow>
                <IconButton
                  component={motion.a}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: isDarkMode 
                      ? '0 0 12px rgba(139, 92, 246, 0.4)' 
                      : '0 0 8px rgba(59, 130, 246, 0.3)'
                  }}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  size="small"
                  sx={socialIconStyles}
                >
                  <social.Icon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            ))}
          </Stack>
          
          <Stack
            direction="row"
            spacing={2}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {/* Selector de idioma */}
            <Button
              variant="text"
              size="small"
              endIcon={<KeyboardArrowDownIcon />}
              onClick={(e) => setLanguageAnchor(e.currentTarget)}
              aria-label="Seleccionar idioma"
              aria-controls={Boolean(languageAnchor) ? 'language-menu' : undefined}
              aria-expanded={Boolean(languageAnchor) ? 'true' : undefined}
              aria-haspopup="true"
              sx={buttonStyles}
            >
              {languages.find(lang => lang.code === language)?.label || 'Español'}
            </Button>
            <Menu
              id="language-menu"
              anchorEl={languageAnchor}
              open={Boolean(languageAnchor)}
              onClose={() => setLanguageAnchor(null)}
              MenuListProps={{
                'aria-labelledby': 'language-button',
              }}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 120,
                  backdropFilter: 'blur(20px)',
                  bgcolor: isDarkMode ? alpha('#1E293B', 0.9) : alpha('#F8FAFC', 0.9),
                  borderRadius: '8px',
                  border: `1px solid ${isDarkMode ? alpha('#CBD5E1', 0.1) : alpha('#64748B', 0.1)}`,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                    fontFamily: '"Space Grotesk", sans-serif',
                    letterSpacing: '0.3px',
                  },
                }
              }}
            >
              {languages.map((lang) => (
                <MenuItem 
                  key={lang.code}
                  selected={lang.code === language}
                  onClick={() => handleLanguageChange(lang.code as Language)}
                  sx={{
                    color: isDarkMode ? '#F8FAFC' : '#1E293B',
                    '&:hover': {
                      bgcolor: isDarkMode ? alpha('#8B5CF6', 0.15) : alpha('#3B82F6', 0.08),
                    },
                    '&.Mui-selected': {
                      bgcolor: isDarkMode ? alpha('#8B5CF6', 0.2) : alpha('#3B82F6', 0.1),
                      '&:hover': {
                        bgcolor: isDarkMode ? alpha('#8B5CF6', 0.25) : alpha('#3B82F6', 0.15),
                      }
                    }
                  }}
                >
                  {lang.label}
                </MenuItem>
              ))}
            </Menu>
            
            {/* Selector de moneda */}
            <Button
              variant="text"
              size="small"
              endIcon={<KeyboardArrowDownIcon />}
              onClick={(e) => setCurrencyAnchor(e.currentTarget)}
              aria-label="Seleccionar moneda"
              aria-controls={Boolean(currencyAnchor) ? 'currency-menu' : undefined}
              aria-expanded={Boolean(currencyAnchor) ? 'true' : undefined}
              aria-haspopup="true"
              sx={buttonStyles}
            >
              {currencies.find(curr => curr.code === currency)?.label || 'USD $'}
            </Button>
            <Menu
              id="currency-menu"
              anchorEl={currencyAnchor}
              open={Boolean(currencyAnchor)}
              onClose={() => setCurrencyAnchor(null)}
              MenuListProps={{
                'aria-labelledby': 'currency-button',
              }}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 120,
                  backdropFilter: 'blur(20px)',
                  bgcolor: isDarkMode ? alpha('#1E293B', 0.9) : alpha('#F8FAFC', 0.9),
                  borderRadius: '8px',
                  border: `1px solid ${isDarkMode ? alpha('#CBD5E1', 0.1) : alpha('#64748B', 0.1)}`,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                    fontFamily: '"Space Grotesk", sans-serif',
                    letterSpacing: '0.3px',
                  },
                }
              }}
            >
              {currencies.map((curr) => (
                <MenuItem 
                  key={curr.code}
                  selected={curr.code === currency}
                  onClick={() => handleCurrencyChange(curr.code as Currency)}
                  sx={{
                    color: isDarkMode ? '#F8FAFC' : '#1E293B',
                    '&:hover': {
                      bgcolor: isDarkMode ? alpha('#8B5CF6', 0.15) : alpha('#3B82F6', 0.08),
                    },
                    '&.Mui-selected': {
                      bgcolor: isDarkMode ? alpha('#8B5CF6', 0.2) : alpha('#3B82F6', 0.1),
                      '&:hover': {
                        bgcolor: isDarkMode ? alpha('#8B5CF6', 0.25) : alpha('#3B82F6', 0.15),
                      }
                    }
                  }}
                >
                  {curr.label}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Stack>
      </Container>
      
      {/* Modal de contacto */}
      <Modal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        aria-labelledby="contact-modal-title"
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 450 },
            maxWidth: '100%',
            bgcolor: isDarkMode ? '#1E293B' : 'background.paper',
            borderRadius: '16px',
            boxShadow: 24,
            p: 4,
            outline: 'none',
            border: `1px solid ${isDarkMode ? alpha('#CBD5E1', 0.1) : alpha('#64748B', 0.1)}`,
            backdropFilter: 'blur(20px)',
            ...noiseEffect,
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <IconButton
              aria-label="cerrar"
              onClick={() => setContactModalOpen(false)}
              sx={{
                position: 'absolute',
                right: -16,
                top: -16,
                color: isDarkMode ? alpha('#CBD5E1', 0.8) : '#64748B',
              }}
            >
              <CloseIcon />
            </IconButton>
            
            <Typography
              id="contact-modal-title"
              variant="h6"
              component="h2"
              sx={{
                mb: 3,
                fontWeight: 600,
                fontFamily: '"Space Grotesk", sans-serif',
                letterSpacing: '0.5px',
                color: isDarkMode ? '#F8FAFC' : '#1E293B',
              }}
            >
              {contactType === 'email' ? 'Envíanos un mensaje' : 'Contáctanos por teléfono'}
            </Typography>
            
            {contactType === 'email' ? (
              <Stack spacing={3}>
                <TextField
                  label="Nombre"
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isDarkMode ? alpha('#CBD5E1', 0.2) : alpha('#64748B', 0.2),
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? alpha('#8B5CF6', 0.5) : alpha('#3B82F6', 0.5),
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isDarkMode ? '#8B5CF6' : '#3B82F6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? alpha('#CBD5E1', 0.8) : '#64748B',
                    },
                    '& .MuiInputBase-input': {
                      color: isDarkMode ? '#F8FAFC' : '#1E293B',
                    },
                  }}
                />
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  defaultValue="assurivac@gmail.com"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isDarkMode ? alpha('#CBD5E1', 0.2) : alpha('#64748B', 0.2),
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? alpha('#8B5CF6', 0.5) : alpha('#3B82F6', 0.5),
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isDarkMode ? '#8B5CF6' : '#3B82F6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? alpha('#CBD5E1', 0.8) : '#64748B',
                    },
                    '& .MuiInputBase-input': {
                      color: isDarkMode ? '#F8FAFC' : '#1E293B',
                    },
                  }}
                />
                <TextField
                  label="Mensaje"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isDarkMode ? alpha('#CBD5E1', 0.2) : alpha('#64748B', 0.2),
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? alpha('#8B5CF6', 0.5) : alpha('#3B82F6', 0.5),
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isDarkMode ? '#8B5CF6' : '#3B82F6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? alpha('#CBD5E1', 0.8) : '#64748B',
                    },
                    '& .MuiInputBase-input': {
                      color: isDarkMode ? '#F8FAFC' : '#1E293B',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  component={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    bgcolor: isDarkMode ? '#8B5CF6' : '#3B82F6',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    fontFamily: '"Space Grotesk", sans-serif',
                    letterSpacing: '0.5px',
                    fontWeight: 500,
                    py: 1.2,
                    '&:hover': {
                      bgcolor: isDarkMode ? '#7C3AED' : '#2563EB',
                      boxShadow: isDarkMode 
                        ? '0 4px 20px rgba(139, 92, 246, 0.4)' 
                        : '0 4px 20px rgba(59, 130, 246, 0.3)',
                    },
                  }}
                >
                  Enviar mensaje
                </Button>
              </Stack>
            ) : (
              <Stack spacing={3}>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? alpha('#CBD5E1', 0.9) : '#334155',
                    fontFamily: '"Space Grotesk", sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  Estamos disponibles para atenderte de lunes a viernes de 9:00 a 18:00 horas.
                </Typography>
                
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    p: 3,
                    borderRadius: '12px',
                    bgcolor: isDarkMode ? alpha('#8B5CF6', 0.1) : alpha('#3B82F6', 0.05),
                    border: `1px solid ${isDarkMode ? alpha('#8B5CF6', 0.2) : alpha('#3B82F6', 0.1)}`,
                  }}
                >
                  <PhoneIcon 
                    sx={{ 
                      fontSize: 32, 
                      color: isDarkMode ? '#8B5CF6' : '#3B82F6',
                    }} 
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 600,
                      color: isDarkMode ? '#F8FAFC' : '#1E293B',
                      letterSpacing: '0.5px',
                    }}
                  >
                    +598 92 388 748
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  component={motion.a}
                  href="tel:+59892388748"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    bgcolor: isDarkMode ? '#8B5CF6' : '#3B82F6',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    fontFamily: '"Space Grotesk", sans-serif',
                    letterSpacing: '0.5px',
                    fontWeight: 500,
                    py: 1.2,
                    '&:hover': {
                      bgcolor: isDarkMode ? '#7C3AED' : '#2563EB',
                      boxShadow: isDarkMode 
                        ? '0 4px 20px rgba(139, 92, 246, 0.4)' 
                        : '0 4px 20px rgba(59, 130, 246, 0.3)',
                    },
                  }}
                >
                  Llamar ahora
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
      </Modal>
      
      {/* Efecto de aurora animada */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      >
        <Box
          component={motion.div}
          animate={{
            x: ['-25%', '0%', '-20%'],
            y: ['0%', '-15%', '5%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          sx={{
            position: 'absolute',
            width: '150%',
            height: '150%',
            filter: 'blur(100px)',
            background: isDarkMode
              ? 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1) 0%, rgba(139, 92, 246, 0) 50%), radial-gradient(circle at 0% 0%, rgba(79, 70, 229, 0.1) 0%, rgba(79, 70, 229, 0) 50%)'
              : 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0) 50%), radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0) 50%)',
          }}
        />
      </Box>
    </Box>
  );
}