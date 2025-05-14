import { Metadata } from 'next';
import ClientOnly from '@/app/clientOnly';
import SignInContent from './SignInContent';

export const metadata: Metadata = {
  title: 'Iniciar sesión | Assuriva',
  description: 'Inicia sesión en tu cuenta de Assuriva para acceder a todas las funcionalidades.',
};

export default function SignInPage() {
  return (
    <ClientOnly>
      <SignInContent />
    </ClientOnly>
  );
}
