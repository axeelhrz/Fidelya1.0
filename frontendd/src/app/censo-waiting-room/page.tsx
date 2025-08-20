import React from 'react';
import type { Metadata } from 'next';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import authTheme from '@/theme/authTheme';
import AuthLayout from '@/components/auth/AuthLayout';
import QuickRegistrationWaitingRoom from '@/components/auth/QuickRegistrationWaitingRoom';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Sala de Espera - Censo de Tenis de Mesa | Raquet Power',
  description: 'Consulta el estado de tu registro en el censo de tenis de mesa de Ecuador. Revisa tu información y el progreso de tu solicitud.',
  keywords: 'censo tenis de mesa, sala de espera, registro Ecuador, LATEM, estado registro',
  openGraph: {
    title: 'Sala de Espera - Censo de Tenis de Mesa | Raquet Power',
    description: 'Consulta el estado de tu registro en el censo de tenis de mesa de Ecuador',
    type: 'website',
  },
};

interface PageProps {
  searchParams: {
    code?: string;
  };
}

const CensoWaitingRoomPage: React.FC<PageProps> = ({ searchParams }) => {
  const registrationCode = searchParams.code;

  return (
    <ThemeProvider theme={authTheme}>
      <CssBaseline />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
        <AuthLayout>
          <QuickRegistrationWaitingRoom registrationCode={registrationCode} />
        </AuthLayout>
      </div>
    </ThemeProvider>
  );
};

export default CensoWaitingRoomPage;