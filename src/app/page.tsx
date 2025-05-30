'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
} from '@mui/material';
import {
  QrCode as QrCodeIcon,
  AdminPanelSettings as AdminIcon,
  Restaurant as RestaurantIcon,
  Speed as SpeedIcon,
  Cloud as CloudIcon,
  Phone as PhoneIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const MotionContainer = motion(Container);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);
const MotionBox = motion(Box);

const HomePage: React.FC = () => {
  const router = useRouter();

  const features = [
    {
      icon: <QrCodeIcon sx={{ fontSize: 40 }} />,
      title: 'Códigos QR Dinámicos',
      description: 'Genera códigos QR que se actualizan automáticamente cuando cambias tu menú.',
      color: '#3B82F6',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Tiempo Real',
      description: 'Los cambios se reflejan instantáneamente en todos los dispositivos conectados.',
      color: '#10B981',
    },
    {
      icon: <CloudIcon sx={{ fontSize: 40 }} />,
      title: 'Firebase Backend',
      description: 'Potenciado por Firebase para máxima confiabilidad y escalabilidad.',
      color: '#F59E0B',
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      title: 'Mobile First',
      description: 'Diseño optimizado para dispositivos móviles y tablets.',
      color: '#8B5CF6',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 50%, #1C1C1E 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Elementos decorativos de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      <MotionContainer
        maxWidth="lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ py: { xs: 4, md: 8 }, position: 'relative', zIndex: 1 }}
      >
        {/* Hero Section */}
        <MotionBox
          variants={itemVariants}
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 10 },
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
          >
            <Box
              sx={{
                width: { xs: 80, md: 100 },
                height: { xs: 80, md: 100 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
              }}
            >
              <RestaurantIcon sx={{ fontSize: { xs: 40, md: 50 }, color: 'white' }} />
            </Box>
          </motion.div>

          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              background: 'linear-gradient(135deg, #F5F5F7 0%, #A1A1AA 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.1,
            }}
          >
            MenuQR
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.4,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
            }}
          >
            Menús digitales en tiempo real para restaurantes modernos
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<AdminIcon />}
              onClick={() => router.push('/admin')}
              sx={{
                py: 2,
                px: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
                fontWeight: 600,
                fontSize: '1.1rem',
                minWidth: 200,
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Panel de Admin
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<QrCodeIcon />}
              onClick={() => router.push('/menu?id=menu-principal')}
              sx={{
                py: 2,
                px: 4,
                borderRadius: 3,
                borderWidth: 2,
                fontWeight: 600,
                fontSize: '1.1rem',
                minWidth: 200,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Ver Demo
            </Button>
          </Stack>
        </MotionBox>

        {/* Features Grid */}
        <MotionBox variants={itemVariants} sx={{ mb: { xs: 6, md: 10 } }}>
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 6, color: 'text.primary' }}
          >
            Características Principales
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionCard
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${feature.color}10 0%, ${feature.color}05 100%)`,
                    border: `1px solid ${feature.color}30`,
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: feature.color,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                      sx={{
                        color: feature.color,
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </MotionBox>

        {/* Tech Stack */}
        <MotionPaper
          variants={itemVariants}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            mb: { xs: 6, md: 8 },
          }}
        >
          <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
            Tecnologías Utilizadas
          </Typography>
          
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ gap: 2 }}
          >
            {[
              'Next.js 15',
              'TypeScript',
              'Firebase',
              'Material UI',
              'Framer Motion',
              'React QR Code'
            ].map((tech) => (
              <Chip
                key={tech}
                label={tech}
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 1,
                }}
              />
            ))}
          </Stack>
        </MotionPaper>

        {/* CTA Section */}
        <MotionBox
          variants={itemVariants}
          sx={{
            textAlign: 'center',
            py: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mb: 2, color: 'text.primary' }}
          >
            ¿Listo para digitalizar tu menú?
          </Typography>
          
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}
          >
            Comienza a usar MenuQR hoy mismo y ofrece a tus clientes una experiencia moderna y sin contacto.
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<LaunchIcon />}
            onClick={() => router.push('/admin')}
            sx={{
              py: 2,
              px: 6,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
              fontWeight: 600,
              fontSize: '1.2rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Comenzar Ahora
          </Button>
        </MotionBox>

        {/* Footer */}
        <MotionBox
          variants={itemVariants}
          sx={{
            textAlign: 'center',
            pt: 4,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            MenuQR - Menús digitales profesionales
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center">
            <IconButton
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <GitHubIcon />
            </IconButton>
          </Stack>
        </MotionBox>
      </MotionContainer>

      {/* CSS para animaciones */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </Box>
  );
};

export default HomePage;