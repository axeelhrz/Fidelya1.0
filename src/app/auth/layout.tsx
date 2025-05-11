import { Metadata } from 'next';
import { AuthProvider } from '@/context/auth-context';
import AuthLayout from '@/components/auth/layout';

export const metadata: Metadata = {
  title: 'Autenticación | Assuriva',
  description: 'Accede a tu cuenta de Assuriva o crea una nueva cuenta.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthLayout>{children}</AuthLayout>
    </AuthProvider>
  );
}