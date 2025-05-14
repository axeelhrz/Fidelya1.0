import ClientOnly from '@/app/clientOnly';
import EmailVerificationWrapper from '@/components/auth/email-verification-handler';


// Use dynamic import with SSR disabled to ensure client-side only rendering


export const metadata = {
  title: 'Verificación de correo | Assuriva',
  description: 'Verificación de correo electrónico para tu cuenta de Assuriva.',
};

export default function ActionPage() {
    return (
      <ClientOnly>
        <EmailVerificationWrapper />
      </ClientOnly>
    );
  }
