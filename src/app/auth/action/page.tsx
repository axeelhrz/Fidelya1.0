import dynamic from 'next/dynamic';
import ClientOnly from '@/app/clientOnly';
import LoadingScreen from '@/components/core/loadingScreen';

// Use dynamic import with SSR disabled to ensure client-side only rendering
const EmailVerificationHandler = dynamic(
  () => import('@/components/auth/email-verification-handler'),
  { 
    ssr: false,
    loading: () => <LoadingScreen />
  }
);

export const metadata = {
  title: 'Verificación de correo | Assuriva',
  description: 'Verificación de correo electrónico para tu cuenta de Assuriva.',
};

export default function ActionPage() {
  return (
    <ClientOnly>
      <EmailVerificationHandler />
    </ClientOnly>
  );
}
