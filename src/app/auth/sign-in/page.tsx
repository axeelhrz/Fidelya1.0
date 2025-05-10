import { Metadata } from 'next';
import SignInForm from '@/components/auth/sign-in-form';
import GuestGuard from '@/components/auth/guest-guard';

export const metadata: Metadata = {
  title: 'Iniciar sesión | Assuriva',
  description: 'Inicia sesión en tu cuenta de Assuriva para acceder a todas las funcionalidades.',
};

export default function SignInPage() {
  return (
    <GuestGuard>
      <SignInForm />
    </GuestGuard>
  );
}