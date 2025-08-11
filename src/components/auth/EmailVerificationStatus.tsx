'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { customAuthService } from '@/services/custom-auth.service';
import toast from 'react-hot-toast';

interface EmailVerificationStatusProps {
  email?: string;
  onResendSuccess?: () => void;
}

export function EmailVerificationStatus({ 
  email, 
  onResendSuccess 
}: EmailVerificationStatusProps) {
  const [isResending, setIsResending] = useState(false);
  const [lastResendTime, setLastResendTime] = useState<number | null>(null);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Email no disponible para reenvío');
      return;
    }

    // Verificar límite de tiempo (30 segundos entre reenvíos)
    const now = Date.now();
    if (lastResendTime && (now - lastResendTime) < 30000) {
      const remainingTime = Math.ceil((30000 - (now - lastResendTime)) / 1000);
      toast.error(`Espera ${remainingTime} segundos antes de reenviar`);
      return;
    }

    try {
      setIsResending(true);
      
      const continueUrl = customAuthService.generateContinueUrl('/auth/login', {
        verified: 'true'
      });

      const result = await customAuthService.resendEmailVerification(continueUrl);

      if (result.success) {
        toast.success('Correo de verificación enviado exitosamente');
        setLastResendTime(now);
        onResendSuccess?.();
      } else {
        toast.error(result.error || 'Error enviando correo de verificación');
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      toast.error('Error inesperado al reenviar verificación');
    } finally {
      setIsResending(false);
    }
  };

  const getRemainingTime = () => {
    if (!lastResendTime) return 0;
    const elapsed = Date.now() - lastResendTime;
    return Math.max(0, Math.ceil((30000 - elapsed) / 1000));
  };

  const remainingTime = getRemainingTime();

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-amber-600 text-xl">📧</span>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-amber-800">
            Verificación de Email Requerida
          </h3>
          <div className="mt-2 text-sm text-amber-700">
            <p>
              Necesitas verificar tu dirección de correo electrónico antes de poder iniciar sesión.
            </p>
            {email && (
              <p className="mt-1">
                <strong>Email:</strong> {email}
              </p>
            )}
          </div>
          <div className="mt-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleResendVerification}
                disabled={isResending || remainingTime > 0}
                size="sm"
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                {isResending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-amber-600 mr-2"></div>
                    Enviando...
                  </div>
                ) : remainingTime > 0 ? (
                  `Reenviar en ${remainingTime}s`
                ) : (
                  'Reenviar Verificación'
                )}
              </Button>
              <Button
                onClick={() => window.open('https://mail.google.com', '_blank')}
                size="sm"
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                Abrir Gmail
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-amber-200">
        <div className="text-xs text-amber-600">
          <p className="font-medium mb-1">💡 Consejos:</p>
          <ul className="space-y-1">
            <li>• Revisa tu bandeja de entrada y carpeta de spam</li>
            <li>• El correo puede tardar unos minutos en llegar</li>
            <li>• Asegúrate de que tu email sea correcto</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
