import { Metadata } from 'next';
import VerifyEmail from '@/components/auth/verify-email';

export const metadata: Metadata = {
  title: 'Verificar correo electrónico | Assuriva',
  description: 'Verifica tu correo electrónico para activar tu cuenta de Assuriva.',
};

export default function VerifyEmailPage() {
  return <VerifyEmail />;
}