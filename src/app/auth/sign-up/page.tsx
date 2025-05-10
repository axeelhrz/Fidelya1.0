'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { CircularProgress, Box } from '@mui/material';

// Importaciones dinámicas


const GuestGuard = dynamic(() => import('@/components/auth/guest-guard'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

const SignUpForm = dynamic(() => import('@/components/auth/sign-up-form'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

// Componente de carga
function LoadingSpinner(): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default function Page(): React.JSX.Element {
  return (
    <Suspense fallback={<LoadingSpinner />}>
        <GuestGuard>
          <SignUpForm />
        </GuestGuard>
    </Suspense>
  );
}