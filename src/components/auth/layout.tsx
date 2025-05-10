'use client';

import React, { ReactNode } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';

interface AuthLayoutProps {
  children: ReactNode;
}

// Componente de partículas para el fondo
const ParticlesBackground = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        opacity: 0.4,
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: 20 }).map((_, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            background: isDark 
              ? `radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)`
              : `radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)`,
            borderRadius: '50%',
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </Box>
  );
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      
      <Box
        component="main"
        sx={{
          position: 'relative',
          flexGrow: 1,
          background: isDark 
            ? 'radial-gradient(circle at 50% 50%, #0F172A 0%, #1E293B 100%)' 
            : 'radial-gradient(circle at 50% 50%, #F8FAFC 0%, #E0F2FE 100%)',
          color: isDark ? '#F8FAFC' : '#0F172A',
          transition: 'all 0.4s ease',
          overflow: 'hidden',
        }}
      >
        <ParticlesBackground />
        
        <Container 
          maxWidth="lg" 
          sx={{ 
            position: 'relative', 
            zIndex: 1,
            py: { xs: 4, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: 'calc(100vh - 120px)', md: 'calc(100vh - 160px)' },
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
          >
            {children}
          </motion.div>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default AuthLayout;