'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import {
  ArrowForward,
  Explore,
} from '@mui/icons-material';
import Link from 'next/link';

const HomePage = () => {

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: '#fafbfc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Chip 
            label="Plataforma de Nueva Generación" 
            sx={{ 
              mb: 3,
              bgcolor: 'rgba(99, 102, 241, 0.08)',
              color: '#6366f1',
              fontWeight: 600,
              borderRadius: 2,
              fontSize: '0.85rem',
              px: 2,
              py: 0.5,
              border: '1px solid rgba(99, 102, 241, 0.1)'
            }} 
          />
          
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3.5rem', md: '4.5rem' },
              fontWeight: 900,
              lineHeight: 0.9,
              mb: 2,
              background: 'linear-gradient(135deg, #1e293b 0%, #6366f1 70%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}
          >
            Fidelita
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: '#64748b',
              mb: 4,
              fontWeight: 500,
              lineHeight: 1.5,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              maxWidth: 480,
              mx: 'auto'
            }}
          >
            La plataforma que conecta asociaciones, comercios y socios en un ecosistema único de beneficios mutuos.
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
          >
            <Button
              component={Link}
              href="/auth/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForward sx={{ fontSize: '1.2rem' }} />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.25)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 30px rgba(99, 102, 241, 0.35)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              Comenzar Ahora
            </Button>
            
            <Button
              component={Link}
              href="/auth/login"
              variant="outlined"
              size="large"
              startIcon={<Explore sx={{ fontSize: '1.2rem' }} />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#475569',
                borderColor: '#e2e8f0',
                bgcolor: 'white',
                '&:hover': {
                  borderColor: '#6366f1',
                  bgcolor: 'rgba(99, 102, 241, 0.02)',
                  color: '#6366f1',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)',
                },
                transition: 'all 0.2s ease'
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