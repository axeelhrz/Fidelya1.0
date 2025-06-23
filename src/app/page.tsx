'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowForward,
  Explore,
  TrendingUp,
  Security,
  Speed,
  Groups,
  Store,
  Business,
  AutoAwesome,
  PlayArrow,
  KeyboardArrowDown,
} from '@mui/icons-material';
import Link from 'next/link';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Groups sx={{ fontSize: 32 }} />,
      title: 'Ecosistema Conectado',
      description: 'Unifica asociaciones, comercios y socios en una sola plataforma inteligente',
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      title: 'Analytics Avanzado',
      description: 'Insights en tiempo real con IA para optimizar tu programa de fidelidad',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    },
    {
      icon: <Security sx={{ fontSize: 32 }} />,
      title: 'Seguridad Total',
      description: 'Protección de datos de nivel empresarial con encriptación end-to-end',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    },
    {
      icon: <Speed sx={{ fontSize: 32 }} />,
      title: 'Rendimiento Extremo',
      description: 'Procesamiento ultrarrápido con arquitectura cloud-native escalable',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Usuarios Activos', icon: <Groups /> },
    { value: '500+', label: 'Comercios', icon: <Store /> },
    { value: '50+', label: 'Asociaciones', icon: <Business /> },
    { value: '99.9%', label: 'Uptime', icon: <Speed /> },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)
      `,
      color: 'white',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(99, 102, 241, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
          transition: 'background 0.3s ease',
        }}
      />

      {/* Floating Geometric Shapes */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-20 left-1/4 w-16 h-16 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-xl"
      />

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 8,
        }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Chip 
              label="🚀 Plataforma SaaS de Nueva Generación" 
              sx={{ 
                mb: 4,
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                color: '#a5b4fc',
                fontWeight: 600,
                borderRadius: 50,
                fontSize: '0.9rem',
                px: 3,
                py: 1,
                border: '1px solid rgba(99, 102, 241, 0.2)',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: 'rgba(99, 102, 241, 0.15)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }} 
            />
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3.5rem', sm: '4.5rem', md: '6rem', lg: '7rem' },
                fontWeight: 900,
                lineHeight: 0.85,
                mb: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #c084fc 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.04em',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                textShadow: '0 0 40px rgba(165, 180, 252, 0.5)',
              }}
            >
              Fidelya
            </Typography>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography
              variant="h4"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 2,
                fontWeight: 600,
                lineHeight: 1.3,
                fontSize: { xs: '1.5rem', md: '2rem' },
                maxWidth: 800,
                mx: 'auto',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                letterSpacing: '-0.01em',
              }}
            >
              El futuro de los programas de fidelidad
            </Typography>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                mb: 6,
                fontWeight: 400,
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                maxWidth: 600,
                mx: 'auto',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Conecta asociaciones, comercios y socios en un ecosistema inteligente 
              potenciado por IA para maximizar la fidelización y el crecimiento.
            </Typography>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 8 }}
            >
              <Button
                component={Link}
                href="/auth/register"
                variant="contained"
                size="large"
                endIcon={<ArrowForward sx={{ fontSize: '1.3rem' }} />}
                sx={{
                  py: 2,
                  px: 6,
                  borderRadius: 50,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 40px rgba(99, 102, 241, 0.5)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Comenzar Gratis
              </Button>
              
              <Button
                component={Link}
                href="/auth/login"
                variant="outlined"
                size="large"
                startIcon={<PlayArrow sx={{ fontSize: '1.3rem' }} />}
                sx={{
                  py: 2,
                  px: 6,
                  borderRadius: 50,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  color: 'rgba(255, 255, 255, 0.9)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Ver Demo
              </Button>
            </Stack>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Grid container spacing={4} justifyContent="center" sx={{ mb: 8 }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.8rem', md: '2.5rem' },
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <IconButton
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  color: 'rgba(255, 255, 255, 0.8)',
                  transform: 'translateY(5px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <KeyboardArrowDown sx={{ fontSize: '2rem' }} />
              </motion.div>
            </IconButton>
          </motion.div>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 12 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                mb: 3,
                fontWeight: 800,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                letterSpacing: '-0.02em',
              }}
            >
              Características Revolucionarias
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                mb: 8,
                color: 'rgba(255, 255, 255, 0.6)',
                fontFamily: 'Inter, sans-serif',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Tecnología de vanguardia que transforma la experiencia de fidelización
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: `1px solid ${feature.color}40`,
                        boxShadow: `0 20px 40px ${feature.color}20`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 3,
                          background: feature.gradient,
                          color: 'white',
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          fontWeight: 700,
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          color: 'white',
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;