import { Metadata } from 'next';
import ClientOnly from '@/app/clientOnly';
import SignUpForm from '@/components/auth/sign-up-form';
import GuestGuard from '@/components/auth/guest-guard';

export const metadata: Metadata = {
  title: 'Crear cuenta | Assuriva',
  description: 'Regístrate en Assuriva para comenzar a gestionar tus seguros de manera eficiente.',
};

export default function SignUpPage() {
  return (
    <ClientOnly>
      <GuestGuard>
        <SignUpForm />
      </GuestGuard>
    </ClientOnly>
  );
}
