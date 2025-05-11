'use client';

import dynamic from 'next/dynamic';
import AuthLayout from '@/components/auth/layout';
import LoadingScreen from '@/components/core/loadingScreen';

// Use dynamic import with SSR disabled to ensure client-side only rendering
const EmailVerificationHandler = dynamic(
  () => import('@/components/auth/email-verification-handler'),
  { 
    ssr: false,
    loading: () => <LoadingScreen />
  }
);

// Metadata can't be exported from client components in Next.js 13+
// We'll need to move this to a separate layout file or use a different approach
// export const metadata: Metadata = {
//   title: 'Verificación de correo | Assuriva',
//   description: 'Verificación de correo electrónico para tu cuenta de Assuriva.',
// };

export default function ActionPage() {
  return (
    <AuthLayout>
      <EmailVerificationHandler />
    </AuthLayout>
  );
}