import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailVerificationData {
  email: string;
  displayName: string;
  actionCodeSettings: {
    url: string;
    handleCodeInApp: boolean;
  };
}

export interface PasswordResetData {
  email: string;
  displayName: string;
  actionCodeSettings: {
    url: string;
    handleCodeInApp: boolean;
  };
}

export class CustomEmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    // Configurar el transportador de email
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@fidelya.com';
    this.fromName = process.env.FROM_NAME || 'Fidelya';

    // Configurar nodemailer con Gmail SMTP
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // App Password de Gmail
      },
    });
  }

  /**
   * Generar template para verificación de email
   */
  generateEmailVerificationTemplate(
    displayName: string,
    verificationLink: string
  ): EmailTemplate {
    const subject = '🔐 Verifica tu cuenta en Fidelya';
    
    const html = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
              background-color: #f8fafc; 
              line-height: 1.6;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: white; 
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
              padding: 40px 32px; 
              text-align: center; 
            }
            .logo { 
              font-size: 32px; 
              font-weight: 800; 
              color: white; 
              margin-bottom: 8px;
              letter-spacing: -0.5px;
            }
            .subtitle { 
              color: #bfdbfe; 
              font-size: 16px; 
              margin: 0;
            }
            .content { 
              padding: 40px 32px; 
            }
            .greeting { 
              font-size: 20px; 
              color: #1f2937; 
              margin-bottom: 24px; 
              font-weight: 600;
            }
            .message { 
              font-size: 16px; 
              line-height: 1.7; 
              color: #374151; 
              margin-bottom: 32px; 
            }
            .verification-box {
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
              border: 2px solid #0ea5e9;
              border-radius: 12px;
              padding: 24px;
              text-align: center;
              margin: 32px 0;
            }
            .verification-title {
              font-size: 18px;
              font-weight: 600;
              color: #0c4a6e;
              margin-bottom: 16px;
            }
            .button { 
              display: inline-block; 
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
              color: white; 
              text-decoration: none; 
              padding: 16px 32px; 
              border-radius: 8px; 
              font-weight: 600; 
              font-size: 16px; 
              margin: 16px 0;
              box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
              transition: all 0.2s ease;
            }
            .button:hover {
              transform: translateY(-1px);
              box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
            }
            .alternative-text {
              font-size: 14px;
              color: #6b7280;
              margin-top: 24px;
              padding-top: 24px;
              border-top: 1px solid #e5e7eb;
            }
            .link-text {
              word-break: break-all;
              background: #f3f4f6;
              padding: 8px 12px;
              border-radius: 4px;
              font-family: monospace;
              font-size: 12px;
              margin: 8px 0;
            }
            .footer { 
              background-color: #f8fafc; 
              padding: 32px; 
              text-align: center; 
              border-top: 1px solid #e5e7eb; 
            }
            .footer-text { 
              margin: 0; 
              color: #6b7280; 
              font-size: 14px; 
              line-height: 1.5; 
            }
            .security-note {
              background: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 8px;
              padding: 16px;
              margin: 24px 0;
            }
            .security-title {
              font-weight: 600;
              color: #92400e;
              margin-bottom: 8px;
            }
            .security-text {
              color: #92400e;
              font-size: 14px;
              margin: 0;
            }
            .features {
              display: flex;
              justify-content: space-around;
              margin: 32px 0;
              flex-wrap: wrap;
            }
            .feature {
              text-align: center;
              flex: 1;
              min-width: 150px;
              margin: 8px;
            }
            .feature-icon {
              font-size: 24px;
              margin-bottom: 8px;
            }
            .feature-text {
              font-size: 14px;
              color: #6b7280;
            }
            @media (max-width: 600px) {
              .container { margin: 0 16px; }
              .content, .header, .footer { padding: 24px 20px; }
              .features { flex-direction: column; }
              .feature { margin: 16px 0; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Fidelya</div>
              <p class="subtitle">Tu plataforma de gestión de socios y beneficios</p>
            </div>
            
            <div class="content">
              <div class="greeting">¡Hola ${displayName}! 👋</div>
              
              <div class="message">
                ¡Bienvenido a <strong>Fidelya</strong>! Estamos emocionados de tenerte en nuestra plataforma.
                Para completar tu registro y comenzar a disfrutar de todos los beneficios, necesitas verificar tu dirección de correo electrónico.
              </div>

              <div class="verification-box">
                <div class="verification-title">🔐 Verificación de Cuenta</div>
                <p style="margin: 0 0 20px 0; color: #0c4a6e;">
                  Haz clic en el botón de abajo para verificar tu cuenta:
                </p>
                <a href="${verificationLink}" class="button">
                  ✅ Verificar mi cuenta
                </a>
              </div>

              <div class="features">
                <div class="feature">
                  <div class="feature-icon">🏪</div>
                  <div class="feature-text">Gestiona comercios y socios</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">🎁</div>
                  <div class="feature-text">Crea beneficios atractivos</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">📊</div>
                  <div class="feature-text">Analiza tu rendimiento</div>
                </div>
              </div>

              <div class="security-note">
                <div class="security-title">🔒 Nota de Seguridad</div>
                <p class="security-text">
                  Este enlace de verificación expirará en <strong>24 horas</strong> por tu seguridad. 
                  Si no solicitaste esta cuenta, puedes ignorar este correo.
                </p>
              </div>

              <div class="alternative-text">
                <strong>¿No puedes hacer clic en el botón?</strong><br>
                Copia y pega este enlace en tu navegador:
                <div class="link-text">${verificationLink}</div>
              </div>
            </div>
            
            <div class="footer">
              <p class="footer-text">
                <strong>Fidelya</strong><br>
                Transformando la gestión de socios y beneficios<br>
                <br>
                Si tienes alguna pregunta, no dudes en contactarnos.<br>
                © ${new Date().getFullYear()} Fidelya. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
🔐 Verifica tu cuenta en Fidelya

¡Hola ${displayName}!

¡Bienvenido a Fidelya! Estamos emocionados de tenerte en nuestra plataforma.

Para completar tu registro y comenzar a disfrutar de todos los beneficios, necesitas verificar tu dirección de correo electrónico.

Verificar cuenta: ${verificationLink}

🔒 Nota de Seguridad:
Este enlace de verificación expirará en 24 horas por tu seguridad. Si no solicitaste esta cuenta, puedes ignorar este correo.

---
Fidelya - Tu plataforma de gestión de socios y beneficios
© ${new Date().getFullYear()} Fidelya. Todos los derechos reservados.

Si tienes alguna pregunta, no dudes en contactarnos.
    `.trim();

    return { subject, html, text };
  }

  /**
   * Generar template para restablecimiento de contraseña
   */
  generatePasswordResetTemplate(
    displayName: string,
    resetLink: string
  ): EmailTemplate {
    const subject = '🔑 Restablece tu contraseña en Fidelya';
    
    const html = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
              background-color: #f8fafc; 
              line-height: 1.6;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: white; 
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
              padding: 40px 32px; 
              text-align: center; 
            }
            .logo { 
              font-size: 32px; 
              font-weight: 800; 
              color: white; 
              margin-bottom: 8px;
              letter-spacing: -0.5px;
            }
            .subtitle { 
              color: #fed7aa; 
              font-size: 16px; 
              margin: 0;
            }
            .content { 
              padding: 40px 32px; 
            }
            .greeting { 
              font-size: 20px; 
              color: #1f2937; 
              margin-bottom: 24px; 
              font-weight: 600;
            }
            .message { 
              font-size: 16px; 
              line-height: 1.7; 
              color: #374151; 
              margin-bottom: 32px; 
            }
            .reset-box {
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              border: 2px solid #f59e0b;
              border-radius: 12px;
              padding: 24px;
              text-align: center;
              margin: 32px 0;
            }
            .reset-title {
              font-size: 18px;
              font-weight: 600;
              color: #92400e;
              margin-bottom: 16px;
            }
            .button { 
              display: inline-block; 
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
              color: white; 
              text-decoration: none; 
              padding: 16px 32px; 
              border-radius: 8px; 
              font-weight: 600; 
              font-size: 16px; 
              margin: 16px 0;
              box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3);
              transition: all 0.2s ease;
            }
            .button:hover {
              transform: translateY(-1px);
              box-shadow: 0 6px 12px rgba(245, 158, 11, 0.4);
            }
            .alternative-text {
              font-size: 14px;
              color: #6b7280;
              margin-top: 24px;
              padding-top: 24px;
              border-top: 1px solid #e5e7eb;
            }
            .link-text {
              word-break: break-all;
              background: #f3f4f6;
              padding: 8px 12px;
              border-radius: 4px;
              font-family: monospace;
              font-size: 12px;
              margin: 8px 0;
            }
            .footer { 
              background-color: #f8fafc; 
              padding: 32px; 
              text-align: center; 
              border-top: 1px solid #e5e7eb; 
            }
            .footer-text { 
              margin: 0; 
              color: #6b7280; 
              font-size: 14px; 
              line-height: 1.5; 
            }
            .security-note {
              background: #fef2f2;
              border: 1px solid #ef4444;
              border-radius: 8px;
              padding: 16px;
              margin: 24px 0;
            }
            .security-title {
              font-weight: 600;
              color: #dc2626;
              margin-bottom: 8px;
            }
            .security-text {
              color: #dc2626;
              font-size: 14px;
              margin: 0;
            }
            .tips {
              background: #f0f9ff;
              border: 1px solid #0ea5e9;
              border-radius: 8px;
              padding: 20px;
              margin: 24px 0;
            }
            .tips-title {
              font-weight: 600;
              color: #0c4a6e;
              margin-bottom: 12px;
              font-size: 16px;
            }
            .tips-list {
              color: #0c4a6e;
              font-size: 14px;
              margin: 0;
              padding-left: 20px;
            }
            .tips-list li {
              margin-bottom: 8px;
            }
            @media (max-width: 600px) {
              .container { margin: 0 16px; }
              .content, .header, .footer { padding: 24px 20px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Fidelya</div>
              <p class="subtitle">Restablecimiento de contraseña</p>
            </div>
            
            <div class="content">
              <div class="greeting">Hola ${displayName} 👋</div>
              
              <div class="message">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Fidelya</strong>.
                Si fuiste tú quien solicitó este cambio, puedes crear una nueva contraseña haciendo clic en el botón de abajo.
              </div>

              <div class="reset-box">
                <div class="reset-title">🔑 Restablecer Contraseña</div>
                <p style="margin: 0 0 20px 0; color: #92400e;">
                  Haz clic en el botón para crear una nueva contraseña:
                </p>
                <a href="${resetLink}" class="button">
                  🔑 Restablecer mi contraseña
                </a>
              </div>

              <div class="tips">
                <div class="tips-title">💡 Consejos para una contraseña segura:</div>
                <ul class="tips-list">
                  <li>Usa al menos 8 caracteres</li>
                  <li>Combina letras mayúsculas y minúsculas</li>
                  <li>Incluye números y símbolos</li>
                  <li>Evita información personal obvia</li>
                  <li>No reutilices contraseñas de otras cuentas</li>
                </ul>
              </div>

              <div class="security-note">
                <div class="security-title">🚨 Importante</div>
                <p class="security-text">
                  Este enlace expirará en <strong>1 hora</strong> por tu seguridad. 
                  Si no solicitaste este cambio, puedes ignorar este correo y tu contraseña permanecerá sin cambios.
                </p>
              </div>

              <div class="alternative-text">
                <strong>¿No puedes hacer clic en el botón?</strong><br>
                Copia y pega este enlace en tu navegador:
                <div class="link-text">${resetLink}</div>
              </div>
            </div>
            
            <div class="footer">
              <p class="footer-text">
                <strong>Fidelya</strong><br>
                Tu plataforma de gestión de socios y beneficios<br>
                <br>
                Si no solicitaste este cambio o tienes alguna pregunta sobre la seguridad de tu cuenta, 
                contáctanos inmediatamente.<br>
                © ${new Date().getFullYear()} Fidelya. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
🔑 Restablece tu contraseña en Fidelya

Hola ${displayName}!

Recibimos una solicitud para restablecer la contraseña de tu cuenta en Fidelya.

Si fuiste tú quien solicitó este cambio, puedes crear una nueva contraseña usando este enlace:

${resetLink}

💡 Consejos para una contraseña segura:
- Usa al menos 8 caracteres
- Combina letras mayúsculas y minúsculas
- Incluye números y símbolos
- Evita información personal obvia
- No reutilices contraseñas de otras cuentas

🚨 Importante:
Este enlace expirará en 1 hora por tu seguridad. Si no solicitaste este cambio, puedes ignorar este correo y tu contraseña permanecerá sin cambios.

---
Fidelya - Tu plataforma de gestión de socios y beneficios
© ${new Date().getFullYear()} Fidelya. Todos los derechos reservados.

Si no solicitaste este cambio o tienes alguna pregunta sobre la seguridad de tu cuenta, contáctanos inmediatamente.
    `.trim();

    return { subject, html, text };
  }

  /**
   * Enviar correo de verificación personalizado
   */
  async sendEmailVerification(data: EmailVerificationData): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    try {
      const template = this.generateEmailVerificationTemplate(
        data.displayName,
        data.actionCodeSettings.url
      );

      const mailOptions = {
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: data.email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Email verification sent successfully:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      console.error('❌ Error sending email verification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Enviar correo de restablecimiento de contraseña personalizado
   */
  async sendPasswordReset(data: PasswordResetData): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    try {
      const template = this.generatePasswordResetTemplate(
        data.displayName,
        data.actionCodeSettings.url
      );

      const mailOptions = {
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: data.email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Password reset email sent successfully:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      console.error('❌ Error sending password reset email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instance
export const customEmailService = new CustomEmailService();
