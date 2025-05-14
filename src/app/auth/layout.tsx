import { Metadata } from 'next';

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
    <>
      {children}
    </>
  );
}
