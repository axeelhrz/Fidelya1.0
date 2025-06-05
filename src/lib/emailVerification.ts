import { supabaseBrowser } from './supabaseClient';

export interface EmailVerificationResult {
  success: boolean;
  message: string;
  error?: string;
}

export class EmailVerificationService {
  private static readonly RESEND_COOLDOWN = 60; // 60 segundos
  private static readonly MAX_RESEND_COOLDOWN = 300; // 5 minutos para rate limit

  /**
   * Reenvía el correo de verificación
   */
  static async resendVerificationEmail(email: string): Promise<EmailVerificationResult> {
    try {
      const supabase = supabaseBrowser();
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        if (error.message.includes('Email rate limit exceeded')) {
          return {
            success: false,
            message: 'Has enviado demasiados correos. Espera unos minutos antes de intentar nuevamente.',
            error: 'RATE_LIMIT_EXCEEDED'
          };
        }
        
        if (error.message.includes('User not found')) {
          return {
            success: false,
            message: 'No se encontró una cuenta con este correo electrónico.',
            error: 'USER_NOT_FOUND'
          };
        }

        return {
          success: false,
          message: error.message || 'Error al reenviar el correo de verificación',
          error: 'UNKNOWN_ERROR'
        };
      }

      return {
        success: true,
        message: 'Correo de verificación reenviado exitosamente'
      };
    } catch (error: any) {
      console.error('Error al reenviar correo:', error);
      return {
        success: false,
        message: 'Ocurrió un error inesperado al reenviar el correo',
        error: 'UNEXPECTED_ERROR'
      };
    }
  }

  /**
   * Verifica el token de confirmación de email
   */
  static async verifyEmailToken(tokenHash: string): Promise<EmailVerificationResult> {
    try {
      const supabase = supabaseBrowser();
      
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'email'
      });

      if (error) {
        if (error.message.includes('expired')) {
          return {
            success: false,
            message: 'El enlace de verificación ha expirado. Solicita un nuevo enlace.',
            error: 'TOKEN_EXPIRED'
          };
        }
        
        if (error.message.includes('invalid')) {
          return {
            success: false,
            message: 'El enlace de verificación es inválido.',
            error: 'TOKEN_INVALID'
          };
        }

        return {
          success: false,
          message: error.message || 'Error al verificar el correo electrónico',
          error: 'VERIFICATION_ERROR'
        };
      }

      if (!data.user) {
        return {
          success: false,
          message: 'No se pudo verificar el correo electrónico',
          error: 'NO_USER_DATA'
        };
      }

      return {
        success: true,
        message: '¡Correo verificado exitosamente!'
      };
    } catch (error: any) {
      console.error('Error al verificar token:', error);
      return {
        success: false,
        message: 'Ocurrió un error inesperado durante la verificación',
        error: 'UNEXPECTED_ERROR'
      };
    }
  }

  /**
   * Obtiene el estado de verificación del usuario actual
   */
  static async getVerificationStatus(): Promise<{
    isVerified: boolean;
    email?: string;
    user?: any;
  }> {
    try {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { isVerified: false };
      }

      return {
        isVerified: user.email_confirmed_at !== null,
        email: user.email,
        user: user
      };
    } catch (error) {
      console.error('Error al obtener estado de verificación:', error);
      return { isVerified: false };
    }
  }

  /**
   * Valida si un email tiene formato correcto
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Genera un mensaje de ayuda para problemas comunes
   */
  static getHelpMessage(errorType?: string): string {
    switch (errorType) {
      case 'RATE_LIMIT_EXCEEDED':
        return 'Si necesitas ayuda inmediata, contacta a soporte técnico.';
      case 'TOKEN_EXPIRED':
        return 'Los enlaces de verificación expiran por seguridad. Solicita uno nuevo.';
      case 'TOKEN_INVALID':
        return 'Asegúrate de usar el enlace completo del correo más reciente.';
      case 'USER_NOT_FOUND':
        return 'Verifica que el correo sea correcto o registra una nueva cuenta.';
      default:
        return 'Si el problema persiste, contacta a soporte técnico.';
    }
  }
}

// Tipos para TypeScript
export type EmailVerificationError = 
  | 'RATE_LIMIT_EXCEEDED'
  | 'USER_NOT_FOUND'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'VERIFICATION_ERROR'
  | 'NO_USER_DATA'
  | 'UNEXPECTED_ERROR'
  | 'UNKNOWN_ERROR';
