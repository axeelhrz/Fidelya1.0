'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { applyActionCode, getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingScreen from '@/components/core/loadingScreen';

export default function EmailVerificationHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const oobCode = searchParams?.get('oobCode');
    const mode = searchParams?.get('mode');

    if (!oobCode || mode !== 'verifyEmail') {
      setStatus('error');
      setError('Enlace de verificación inválido o expirado.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const auth = getAuth();
        await applyActionCode(auth, oobCode);

        // Actualizar el estado de verificación en Firestore
        if (auth.currentUser) {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userDocRef, {
            emailVerified: true,
            verified: true,
            updatedAt: new Date()
          });
        }

        setStatus('success');
      } catch (err) {
        console.error('Error al verificar email:', err);
        setStatus('error');
        setError('No se pudo verificar tu correo electrónico. El enlace puede haber expirado o ser inválido.');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  const handleContinue = () => {
    router.push('/dashboard');
  };

  const handleRetry = () => {
    router.push('/auth/verify-email');
  };

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <Card className="w-full max-w-md p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {status === 'success' ? '¡Correo verificado!' : 'Error de verificación'}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {status === 'success'
            ? 'Tu correo electrónico ha sido verificado correctamente.'
            : error || 'Ha ocurrido un error al verificar tu correo electrónico.'}
        </p>
      </div>

      <div className="flex justify-center">
        {status === 'success' ? (
          <Button onClick={handleContinue}>Continuar al dashboard</Button>
        ) : (
          <Button onClick={handleRetry} variant="outline">
            Intentar de nuevo
          </Button>
        )}
      </div>
    </Card>
  );
}