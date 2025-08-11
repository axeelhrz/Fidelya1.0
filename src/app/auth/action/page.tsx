'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { applyActionCode, checkActionCode, confirmPasswordReset } from 'firebase/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';

interface ActionCodeInfo {
  operation: string;
  email: string;
}

export default function AuthActionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [actionInfo, setActionInfo] = useState<ActionCodeInfo | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');
  const continueUrl = searchParams.get('continueUrl');

  useEffect(() => {
    if (!mode || !oobCode) {
      setError('Parámetros de acción inválidos');
      setLoading(false);
      return;
    }

    handleActionCode();
  }, [mode, oobCode]);

  const handleActionCode = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar el código de acción
      const info = await checkActionCode(auth, oobCode!);
      setActionInfo({
        operation: info.operation,
        email: info.data.email || 'Email no disponible'
      });

      if (mode === 'verifyEmail') {
        // Para verificación de email, aplicar el código inmediatamente
        await applyActionCode(auth, oobCode!);
        toast.success('¡Email verificado exitosamente!');
        
        // Redirigir al login con parámetro de éxito
        setTimeout(() => {
          router.push('/auth/login?verified=success');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error handling action code:', error);
      
      let errorMessage = 'Error procesando la acción';
      
      switch (error.code) {
        case 'auth/expired-action-code':
          errorMessage = 'El enlace ha expirado. Solicita uno nuevo.';
          break;
        case 'auth/invalid-action-code':
          errorMessage = 'El enlace es inválido o ya fue usado.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta cuenta ha sido deshabilitada.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No se encontró el usuario asociado.';
          break;
        default:
          errorMessage = error.message || 'Error desconocido';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setProcessing(true);
      
      await confirmPasswordReset(auth, oobCode!, newPassword);
      
      toast.success('¡Contraseña actualizada exitosamente!');
      
      // Redirigir al login
      setTimeout(() => {
        router.push('/auth/login?reset=success');
      }, 2000);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      
      let errorMessage = 'Error actualizando la contraseña';
      
      switch (error.code) {
        case 'auth/expired-action-code':
          errorMessage = 'El enlace ha expirado. Solicita uno nuevo.';
          break;
        case 'auth/invalid-action-code':
          errorMessage = 'El enlace es inválido o ya fue usado.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil.';
          break;
        default:
          errorMessage = error.message || 'Error desconocido';
      }
      
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Procesando...
            </h1>
            <p className="text-gray-600">
              Verificando la acción solicitada
            </p>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Error
            </h1>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/auth/login')}
                className="w-full"
              >
                Ir al Login
              </Button>
              <Button
                onClick={() => router.push('/auth/register')}
                variant="outline"
                className="w-full"
              >
                Crear Cuenta
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'verifyEmail') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Email Verificado!
            </h1>
            <p className="text-gray-600 mb-2">
              Tu dirección de correo electrónico ha sido verificada exitosamente.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Email: {actionInfo?.email}
            </p>
            <p className="text-gray-600 mb-6">
              Ahora puedes iniciar sesión en tu cuenta.
            </p>
            <Button
              onClick={() => router.push('/auth/login?verified=success')}
              className="w-full"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'resetPassword') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔑</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Nueva Contraseña
            </h1>
            <p className="text-gray-600 mb-2">
              Crea una nueva contraseña para tu cuenta
            </p>
            <p className="text-sm text-gray-500">
              Email: {actionInfo?.email}
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handlePasswordReset(); }} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Contraseña
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                required
                minLength={6}
                disabled={processing}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                required
                minLength={6}
                disabled={processing}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                💡 Consejos para una contraseña segura:
              </h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Al menos 8 caracteres</li>
                <li>• Combina mayúsculas y minúsculas</li>
                <li>• Incluye números y símbolos</li>
                <li>• Evita información personal</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={processing || !newPassword || !confirmPassword}
            >
              {processing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Actualizando...
                </div>
              ) : (
                'Actualizar Contraseña'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              onClick={() => router.push('/auth/login')}
              variant="outline"
              className="text-sm"
            >
              Volver al Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❓</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acción No Reconocida
          </h1>
          <p className="text-gray-600 mb-6">
            La acción solicitada no es válida o no está soportada.
          </p>
          <Button
            onClick={() => router.push('/auth/login')}
            className="w-full"
          >
            Ir al Login
          </Button>
        </div>
      </div>
    );
  }
}
