import { AuthError } from 'firebase/auth';
import { FirestoreError } from 'firebase/firestore';

/**
 * Handles Firebase authentication and Firestore errors
 * and returns user-friendly error messages in Spanish
 */
export function handleFirebaseError(error: AuthError | FirestoreError | Error): string {
  // Handle Firebase Auth errors
  if ('code' in error) {
    switch (error.code) {
      // Authentication errors
      case 'auth/user-not-found':
        return 'Usuario no encontrado. Verifica tu email.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      case 'auth/email-already-in-use':
        return 'Este email ya está registrado.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta más tarde.';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu internet.';
      case 'auth/requires-recent-login':
        return 'Por seguridad, debes iniciar sesión nuevamente.';
      case 'auth/invalid-credential':
        return 'Credenciales inválidas.';
      case 'auth/account-exists-with-different-credential':
        return 'Ya existe una cuenta con este email usando otro método de acceso.';
      
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
        console.error('Unhandled Firebase error:', error);
        return 'Ha ocurrido un error inesperado. Intenta nuevamente.';
    }
  }

  // Handle generic errors
  if (error.message) {
    // Check for common error patterns
    if (error.message.includes('network')) {
      return 'Error de conexión. Verifica tu internet.';
    }
    if (error.message.includes('timeout')) {
      return 'La operación tardó demasiado tiempo. Intenta nuevamente.';
    }
    if (error.message.includes('permission')) {
      return 'No tienes permisos para realizar esta acción.';
    }
    
    // Return the original message if it's user-friendly (in Spanish)
    if (error.message.includes('no encontrado') || 
        error.message.includes('inválido') || 
        error.message.includes('requerido')) {
      return error.message;
    }
  }

  console.error('Unknown error:', error);
  return 'Ha ocurrido un error inesperado. Intenta nuevamente.';
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
