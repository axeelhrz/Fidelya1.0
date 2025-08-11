import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '@/lib/firebase';
import { handleError } from '@/lib/error-handler';

export interface CustomEmailResponse {
  success: boolean;
  messageId?: string;
  message?: string;
  error?: string;
}

export interface EmailStatsResponse {
  total: number;
  successful: number;
  failed: number;
  byType: {
    email_verification: number;
    password_reset: number;
    auto_email_verification: number;
    resend_email_verification: number;
  };
  byDay: Record<string, number>;
}

class CustomAuthService {
  private functions = getFunctions();

  /**
   * Enviar correo de verificación personalizado
   */
  async sendCustomEmailVerification(
    email: string,
    displayName: string,
    continueUrl?: string
  ): Promise<CustomEmailResponse> {
    try {
      console.log('📧 Enviando correo de verificación personalizado...');
      
      const sendEmailVerification = httpsCallable<
        { email: string; displayName: string; continueUrl?: string },
        CustomEmailResponse
      >(this.functions, 'sendCustomEmailVerification');

      const result = await sendEmailVerification({
        email,
        displayName,
        continueUrl,
      });

      console.log('✅ Correo de verificación enviado:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error enviando correo de verificación:', error);
      return {
        success: false,
        error: handleError(error, 'Custom Email Verification', false).message,
      };
    }
  }

  /**
   * Enviar correo de restablecimiento de contraseña personalizado
   */
  async sendCustomPasswordReset(
    email: string,
    continueUrl?: string
  ): Promise<CustomEmailResponse> {
    try {
      console.log('🔑 Enviando correo de restablecimiento personalizado...');
      
      const sendPasswordReset = httpsCallable<
        { email: string; continueUrl?: string },
        CustomEmailResponse
      >(this.functions, 'sendCustomPasswordReset');

      const result = await sendPasswordReset({
        email,
        continueUrl,
      });

      console.log('✅ Correo de restablecimiento enviado:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error enviando correo de restablecimiento:', error);
      return {
        success: false,
        error: handleError(error, 'Custom Password Reset', false).message,
      };
    }
  }

  /**
   * Reenviar correo de verificación
   */
  async resendEmailVerification(continueUrl?: string): Promise<CustomEmailResponse> {
    try {
      console.log('🔄 Reenviando correo de verificación...');
      
      const resendVerification = httpsCallable<
        { continueUrl?: string },
        CustomEmailResponse
      >(this.functions, 'resendEmailVerification');

      const result = await resendVerification({
        continueUrl,
      });

      console.log('✅ Correo de verificación reenviado:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error reenviando correo de verificación:', error);
      return {
        success: false,
        error: handleError(error, 'Resend Email Verification', false).message,
      };
    }
  }

  /**
   * Obtener estadísticas de correos (solo para admins)
   */
  async getEmailStats(): Promise<EmailStatsResponse | null> {
    try {
      console.log('📊 Obteniendo estadísticas de correos...');
      
      const getStats = httpsCallable<{}, EmailStatsResponse>(
        this.functions, 
        'getEmailStats'
      );

      const result = await getStats({});
      
      console.log('✅ Estadísticas obtenidas:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      handleError(error, 'Get Email Stats');
      return null;
    }
  }

  /**
   * Verificar si el usuario actual está autenticado
   */
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  /**
   * Obtener el usuario actual
   */
  getCurrentUser() {
    return auth.currentUser;
  }

  /**
   * Generar URL de continuación personalizada
   */
  generateContinueUrl(path: string = '/auth/login', params: Record<string, string> = {}): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const url = new URL(path, baseUrl);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    return url.toString();
  }
}

// Export singleton instance
export const customAuthService = new CustomAuthService();
export default customAuthService;
