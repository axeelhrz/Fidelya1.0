import { Metadata } from 'next';
import ClientOnly from '@/app/clientOnly';
import AfterCheckoutContent from './AfterCheckoutContent';

export const metadata: Metadata = {
  title: 'Suscripción completada | Assuriva',
  description: 'Tu suscripción a Assuriva ha sido completada con éxito.',
};

export default function AfterCheckoutPage() {
  return (
    <ClientOnly>
      <AfterCheckoutContent />
    </ClientOnly>
  );
}