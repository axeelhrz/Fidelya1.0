'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowForward,
} from '@mui/icons-material';
import Link from 'next/link';

const HomePage = () => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <Chip 
            label="Plataforma de Nueva Generación" 
            sx={{ 
              mb: 4,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              fontWeight: 600,
              borderRadius: 3,
              fontSize: '0.9rem',
              px: 2,
              py: 0.5
            }} 
          />
          
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '5rem', lg: '6rem' },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 4,
              background: 'linear-gradient(135deg, #1a1a1a 0%, #667eea 50%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Fidelización
            <br />
            <Box component="span" sx={{ color: 'primary.main' }}>
              Inteligente
            </Box>
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              mb: 6,
              maxWidth: 700,
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6,
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            La plataforma que conecta asociaciones, comercios y socios en un ecosistema único de beneficios mutuos.
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            justifyContent="center"
          >
            <Button
              component={Link}
              href="/auth/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                py: 2,
                px: 5,
                borderRadius: 4,
                textTransform: 'none',
                fontSize: '1.2rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Comenzar Ahora
            </Button>
            
            <Button
              component={Link}
              href="/auth/login"
              variant="outlined"
              size="large"
              sx={{
                py: 2,
                px: 5,
                borderRadius: 4,
                textTransform: 'none',
                fontSize: '1.2rem',
                fontWeight: 600,
                borderWidth: 2,
                color: 'text.primary',
                borderColor: alpha(theme.palette.primary.main, 0.3),
                '&:hover': {
                  borderWidth: 2,
                  borderColor: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Explorar Plataforma
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;