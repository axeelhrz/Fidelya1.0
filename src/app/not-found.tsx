'use client'
export const dynamic = 'force-dynamic';


import { Box, Typography, Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { AuthProvider } from '@/context/auth-context'

export default function NotFound() {
  return (
    <AuthProvider>
      <NotFoundContent />
    </AuthProvider>
  )
}

function NotFoundContent() {
  const router = useRouter()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 3
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Página no encontrada
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => router.push('/')}
        sx={{ mt: 2 }}
      >
        Volver al inicio
      </Button>
    </Box>
  )
}