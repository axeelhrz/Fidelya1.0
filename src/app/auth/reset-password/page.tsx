import { Metadata } from 'next';
import ResetPasswordForm from '@/components/auth/reset-password-form';
import GuestGuard from '@/components/auth/guest-guard';

export const metadata: Metadata = {
  title: 'Restablecer contraseña | Assuriva',
  description: 'Restablece tu contraseña para recuperar el acceso a tu cuenta de Assuriva.',
};

export default function ResetPasswordPage() {
  return (
    <GuestGuard>
      <ResetPasswordForm />
    </GuestGuard>
  );
}