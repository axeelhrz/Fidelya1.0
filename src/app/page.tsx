'use client';

import { Box, Typography, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter();

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4
      }}
    >
      <Stack 
        spacing={4} 
        sx={{ 
          maxWidth: 600, 
          width: '100%', 
          textAlign: 'center' 
        }}
      >
        <Typography variant="h2" component="h1" fontWeight="bold" color="primary">
          Bienvenido a MenuQR
        </Typography>
        
        <Typography variant="h5" component="h2" color="text.secondary">
          La forma más sencilla de gestionar y compartir tu menú digital
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => router.push('/menu')}
            sx={{ px: 4, py: 1.5 }}
          >
            Ver Menú
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            onClick={() => router.push('/admin')}
            sx={{ px: 4, py: 1.5 }}
          >
            Panel Admin
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
