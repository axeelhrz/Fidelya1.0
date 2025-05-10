import { Metadata } from 'next';
import EmailVerificationHandler from '@/components/auth/email-verification-handler';
import AuthLayout from '@/components/auth/layout';

export const metadata: Metadata = {
  title: 'Verificación de correo | Assuriva',
  description: 'Verificación de correo electrónico para tu cuenta de Assuriva.',
};

export default function ActionPage() {
  return (
    <AuthLayout>
      <EmailVerificationHandler />
    </AuthLayout>
  );
}
