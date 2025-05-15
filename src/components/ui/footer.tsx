'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Link,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { Envelope } from '@phosphor-icons/react/dist/ssr/Envelope';
import { Phone } from '@phosphor-icons/react/dist/ssr/Phone';
import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin';
import Logo from './logo';

// Data
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
  ],
};

const contactInfo = [
  {
    icon: <Envelope size={18} />,
    value: 'axeelhrz@gmail.com',
    href: 'mailto:axeelhrz@gmail.com',
  },
  {
    icon: <Phone size={18} />,
    value: '+598 92 388 748',
    href: 'tel:+59892388748',
  },
  {
    icon: <MapPin size={18} />,
    value: 'Montevideo, Uruguay',
    href: 'https://maps.google.com/?q=Montevideo,Uruguay',
  },
];

export default function Footer() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: isDarkMode ? '#0F172A' : '#F8FAFC',
        color: isDarkMode ? '#F8FAFC' : '#1E293B',
        pt: { xs: 6, md: 8 },
        pb: 3,
        position: 'relative',
        borderTop: `1px solid ${isDarkMode ? alpha('#CBD5E1', 0.1) : alpha('#64748B', 0.1)}`,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 4, md: 6 }}
          justifyContent="space-between"
          mb={4}
        >
          {/* Logo and contact */}
          <Box sx={{ maxWidth: 320 }}>
            <Box sx={{ mb: 2 }}>
              <Logo />
              </Box>
              
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? alpha('#CBD5E1', 0.8) : '#64748B',
                mb: 2,
                  maxWidth: 280,
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                }}
              >
                Transformando la gestión de seguros con tecnología inteligente.
                Únete a miles de corredores que ya han modernizado su negocio.
              </Typography>
              
              <Stack spacing={1.5}>
                {contactInfo.map((info, index) => (
                <Link
                    key={index}
                  href={info.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="none"
                        sx={{
                    display: 'flex',
                    alignItems: 'center',
                          gap: 1,
                color: isDarkMode ? alpha('#CBD5E1', 0.8) : '#64748B',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: isDarkMode ? '#F8FAFC' : '#1E293B',
                    },
                  }}
                >
                  <Box sx={{ 
                    color: isDarkMode ? theme.palette.primary.main : theme.palette.primary.main,
                  }}>
                    {info.icon}
                  </Box>
                  <Typography variant="body2">{info.value}</Typography>
                </Link>
              ))}
            </Stack>
                </Box>
                
          {/* Footer links */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 4, sm: 6, md: 8 }}
            flexWrap="wrap"
            useFlexGap
            sx={{ flex: 1 }}
                >
            {Object.entries(footerLinks).map(([category, links]) => (
              <Box
                key={category}
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
        }}
      >
                  {category}
                </Typography>
                <Stack spacing={1.5}>
                  {links.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      underline="none"
          sx={{
                        color: isDarkMode ? alpha('#CBD5E1', 0.8) : '#64748B',
                        fontSize: '0.875rem',
                        '&:hover': {
                          color: isDarkMode ? '#F8FAFC' : '#1E293B',
                        },
          }}
                    >
                      {link.name}
                    </Link>
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' },
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: isDarkMode ? alpha('#CBD5E1', 0.7) : '#64748B',
              fontSize: '0.75rem',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            Assuriva {new Date().getFullYear()}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: isDarkMode ? alpha('#CBD5E1', 0.7) : '#64748B',
              fontSize: '0.75rem',
              textAlign: { xs: 'center', md: 'right' },
            }}
          >
            Diseñado con ❤️ para corredores de seguros
          </Typography>
    </Box>
      </Container>
    </Box>
  );
}