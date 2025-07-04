import { AuthError } from 'firebase/auth';
import { FirestoreError } from 'firebase/firestore';

/**
 * Handles Firebase authentication and Firestore errors
 * and returns user-friendly error messages in Spanish
 */
export function handleFirebaseError(error: AuthError | FirestoreError | Error): string {
  // Add debugging information
  console.error('Firebase Error Details:', {
    code: 'code' in error ? error.code : 'unknown',
    message: error.message,
    stack: error.stack
  });

  // Handle Firebase Auth errors
  if ('code' in error) {
    switch (error.code) {
      // Authentication errors
      case 'auth/user-not-found':
        return 'No existe una cuenta con este email. Verifica tu dirección de correo.';
      case 'auth/wrong-password':
      case 'auth/invalid-password':
        return 'La contraseña es incorrecta. Verifica tu contraseña e intenta nuevamente.';
      case 'auth/invalid-credential':
        return 'Las credenciales proporcionadas son inválidas. Verifica tu email y contraseña.';
      case 'auth/email-already-in-use':
        return 'Este email ya está registrado. Intenta iniciar sesión o usa otro email.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-email':
        return 'El formato del email no es válido. Verifica tu dirección de correo.';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada. Contacta al administrador.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Espera unos minutos antes de intentar nuevamente.';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.';
      case 'auth/requires-recent-login':
        return 'Por seguridad, debes iniciar sesión nuevamente para realizar esta acción.';
      case 'auth/account-exists-with-different-credential':
        return 'Ya existe una cuenta con este email usando otro método de acceso.';
      case 'auth/operation-not-allowed':
        return 'Este método de autenticación no está habilitado.';
      case 'auth/invalid-verification-code':
        return 'El código de verificación es inválido.';
      case 'auth/invalid-verification-id':
        return 'El ID de verificación es inválido.';
      case 'auth/missing-verification-code':
        return 'Falta el código de verificación.';
      case 'auth/missing-verification-id':
        return 'Falta el ID de verificación.';
      case 'auth/credential-already-in-use':
        return 'Estas credenciales ya están en uso por otra cuenta.';
      case 'auth/invalid-continue-uri':
        return 'La URL de continuación es inválida.';
      case 'auth/missing-continue-uri':
        return 'Falta la URL de continuación.';
      case 'auth/unauthorized-continue-uri':
        return 'La URL de continuación no está autorizada.';
      
      // Firestore errors
      case 'firestore/permission-denied':
        return 'No tienes permisos para realizar esta acción.';
      case 'firestore/not-found':
        return 'El documento solicitado no existe.';
      case 'firestore/already-exists':
        return 'El documento ya existe.';
      case 'firestore/resource-exhausted':
        return 'Se ha excedido el límite de operaciones. Intenta más tarde.';
      case 'firestore/failed-precondition':
        return 'La operación no se puede completar en el estado actual.';
      case 'firestore/aborted':
        return 'La operación fue cancelada debido a un conflicto.';
      case 'firestore/out-of-range':
        return 'Los datos están fuera del rango permitido.';
      case 'firestore/unimplemented':
        return 'Esta operación no está implementada.';
      case 'firestore/internal':
        return 'Error interno del servidor.';
      case 'firestore/unavailable':
        return 'El servicio no está disponible temporalmente.';
      case 'firestore/data-loss':
        return 'Se ha perdido información. Contacta al soporte.';
      case 'firestore/unauthenticated':
        return 'Debes iniciar sesión para realizar esta acción.';
      case 'firestore/invalid-argument':
        return 'Los datos proporcionados son inválidos.';
      case 'firestore/deadline-exceeded':
        return 'La operación tardó demasiado tiempo. Intenta nuevamente.';
      case 'firestore/cancelled':
        return 'La operación fue cancelada.';
      
      default:
        console.error('Unhandled Firebase error code:', error.code);
        return 'Ha ocurrido un error inesperado. Intenta nuevamente.';
    }
  }

  // Handle generic errors
  if (error.message) {
    // Check for common error patterns
    if (error.message.includes('network') || error.message.includes('Network')) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }
    if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      return 'La operación tardó demasiado tiempo. Intenta nuevamente.';
    }
    if (error.message.includes('permission') || error.message.includes('Permission')) {
      return 'No tienes permisos para realizar esta acción.';
    }
    if (error.message.includes('invalid') || error.message.includes('Invalid')) {
      return 'Los datos proporcionados son inválidos.';
    }
    
    // Return the original message if it's user-friendly (in Spanish)
    if (error.message.includes('no encontrado') || 
        error.message.includes('inválido') || 
        error.message.includes('requerido') ||
        error.message.includes('contraseña') ||
        error.message.includes('email') ||
        error.message.includes('usuario')) {
      return error.message;
    }
  }

  console.error('Unknown error type:', error);
  return 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.';
}

/**
 * Checks if an error is a Firebase Auth error
 */
export function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string' &&
    (error as { code: string }).code.startsWith('auth/')
  );
}

/**
 * Checks if an error is a Firestore error
 */
export function isFirestoreError(error: unknown): error is FirestoreError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string' &&
    (error as { code: string }).code.startsWith('firestore/')
  );
}

/**
 * Enhanced error logging for debugging
 */
export function logAuthError(error: unknown, context: string): void {
  console.group(`🔐 Auth Error - ${context}`);
  console.error('Error object:', error);
  
  if (error && typeof error === 'object') {
    if ('code' in error) {
      console.error('Error code:', (error as { code: unknown }).code);
    }
    if ('message' in error) {
      console.error('Error message:', (error as { message: unknown }).message);
    }
    if ('stack' in error) {
      console.error('Stack trace:', (error as { stack: unknown }).stack);
    }
  }
  
  console.groupEnd();
}