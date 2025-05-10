import { Metadata } from 'next';
import SignUpForm from '@/components/auth/sign-up-form';
import GuestGuard from '@/components/auth/guest-guard';

export const metadata: Metadata = {
  title: 'Crear cuenta | Assuriva',
  description: 'Regístrate en Assuriva para comenzar a gestionar tus seguros de manera eficiente.',
};

export default function SignUpPage() {
  return (
    <GuestGuard>
      <SignUpForm />
    </GuestGuard>
  );
}