import axios from 'axios';

// Interfaces para diferentes proveedores
export interface EmailProvider {
  name: 'sendgrid' | 'mailgun' | 'ses' | 'resend';
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

export interface WhatsAppProvider {
  name: 'twilio' | 'whatsapp-business' | 'meta' | '360dialog';
  apiKey: string;
  phoneNumberId?: string;
  accessToken?: string;
  accountSid?: string;
  authToken?: string;
}

export interface SMSProvider {
  name: 'twilio' | 'vonage' | 'aws-sns';
  apiKey: string;
  accountSid?: string;
  authToken?: string;
  fromNumber: string;
}

export interface NotificationPayload {
  to: string;
  subject?: string;
  content: string;
  htmlContent?: string;
  templateId?: string;
  variables?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: string;
    type: string;
  }>;
}

export interface DeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
  providerId?: string;
  timestamp: Date;
  cost?: number;
}

class NotificationProvidersService {
  // ==================== EMAIL PROVIDERS ====================

  // SendGrid
  async sendEmailViaSendGrid(
    provider: EmailProvider,
    payload: NotificationPayload
  ): Promise<DeliveryResult> {
    try {
      const response = await axios.post(
        'https://api.sendgrid.com/v3/mail/send',
        {
          personalizations: [
            {
              to: [{ email: payload.to }],
              dynamic_template_data: payload.variables || {}
            }
          ],
          from: {
            email: provider.fromEmail,
            name: provider.fromName
          },
          subject: payload.subject,
          content: [
            {
              type: 'text/html',
              value: payload.htmlContent || payload.content
            }
          ],
          template_id: payload.templateId
        },
        {
          headers: {
            'Authorization': `Bearer ${provider.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.headers['x-message-id'],
        providerId: 'sendgrid',
        timestamp: new Date()
      };
    } catch (error: any) {
      console.error('SendGrid error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errors?.[0]?.message || error.message,
        providerId: 'sendgrid',
        timestamp: new Date()
      };
    }
  }

  // Resend (Alternativa moderna a SendGrid)
  async sendEmailViaResend(
    provider: EmailProvider,
    payload: NotificationPayload
  ): Promise<DeliveryResult> {
    try {
      const response = await axios.post(
        'https://api.resend.com/emails',
        {
          from: `${provider.fromName} <${provider.fromEmail}>`,
          to: [payload.to],
          subject: payload.subject,
          html: payload.htmlContent || payload.content,
          text: payload.content
        },
        {
          headers: {
            'Authorization': `Bearer ${provider.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.id,
        providerId: 'resend',
        timestamp: new Date()
      };
    } catch (error: any) {
      console.error('Resend error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        providerId: 'resend',
        timestamp: new Date()
      };
    }
  }

  // ==================== WHATSAPP PROVIDERS ====================

  // WhatsApp Business API (Meta)
  async sendWhatsAppViaMeta(
    provider: WhatsAppProvider,
    payload: NotificationPayload
  ): Promise<DeliveryResult> {
    try {
      // Limpiar número de teléfono (remover espacios, guiones, etc.)
      const cleanPhone = payload.to.replace(/\D/g, '');
      
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${provider.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: cleanPhone,
          type: 'text',
          text: {
            body: payload.content
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${provider.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id,
        providerId: 'meta-whatsapp',
        timestamp: new Date()
      };
    } catch (error: any) {
      console.error('Meta WhatsApp error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        providerId: 'meta-whatsapp',
        timestamp: new Date()
      };
    }
  }

  // WhatsApp via Twilio
  async sendWhatsAppViaTwilio(
    provider: WhatsAppProvider,
    payload: NotificationPayload
  ): Promise<DeliveryResult> {
    try {
      const cleanPhone = payload.to.replace(/\D/g, '');
      const formattedPhone = `whatsapp:+${cleanPhone}`;
      
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${provider.accountSid}/Messages.json`,
        new URLSearchParams({
          From: 'whatsapp:+14155238886', // Twilio Sandbox number
          To: formattedPhone,
          Body: payload.content
        }),
        {
          auth: {
            username: provider.accountSid!,
            password: provider.authToken!
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.sid,
        providerId: 'twilio-whatsapp',
        timestamp: new Date(),
        cost: parseFloat(response.data.price || '0')
      };
    } catch (error: any) {
      console.error('Twilio WhatsApp error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        providerId: 'twilio-whatsapp',
        timestamp: new Date()
      };
    }
  }

  // 360Dialog (Proveedor WhatsApp Business API)
  async sendWhatsAppVia360Dialog(
    provider: WhatsAppProvider,
    payload: NotificationPayload
  ): Promise<DeliveryResult> {
    try {
      const cleanPhone = payload.to.replace(/\D/g, '');
      
      const response = await axios.post(
        'https://waba.360dialog.io/v1/messages',
        {
          to: cleanPhone,
          type: 'text',
          text: {
            body: payload.content
          }
        },
        {
          headers: {
            'D360-API-KEY': provider.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id,
        providerId: '360dialog',
        timestamp: new Date()
      };
    } catch (error: any) {
      console.error('360Dialog error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errors?.[0]?.title || error.message,
        providerId: '360dialog',
        timestamp: new Date()
      };
    }
  }

  // ==================== SMS PROVIDERS ====================

  // SMS via Twilio
  async sendSMSViaTwilio(
    provider: SMSProvider,
    payload: NotificationPayload
  ): Promise<DeliveryResult> {
    try {
      const cleanPhone = payload.to.replace(/\D/g, '');
      const formattedPhone = `+${cleanPhone}`;
      
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${provider.accountSid}/Messages.json`,
        new URLSearchParams({
          From: provider.fromNumber,
          To: formattedPhone,
          Body: payload.content
        }),
        {
          auth: {
            username: provider.accountSid!,
            password: provider.authToken!
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.sid,
        providerId: 'twilio-sms',
        timestamp: new Date(),
        cost: parseFloat(response.data.price || '0')
      };
    } catch (error: any) {
      console.error('Twilio SMS error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        providerId: 'twilio-sms',
        timestamp: new Date()
      };
    }
  }

  // ==================== UNIFIED SEND METHOD ====================

  async sendNotification(
    channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'app',
    provider: EmailProvider | WhatsAppProvider | SMSProvider,
    payload: NotificationPayload
  ): Promise<DeliveryResult> {
    try {
      switch (channel) {
        case 'email':
          const emailProvider = provider as EmailProvider;
          switch (emailProvider.name) {
            case 'sendgrid':
              return await this.sendEmailViaSendGrid(emailProvider, payload);
            case 'resend':
              return await this.sendEmailViaResend(emailProvider, payload);
            default:
              throw new Error(`Unsupported email provider: ${emailProvider.name}`);
          }

        case 'whatsapp':
          const whatsappProvider = provider as WhatsAppProvider;
          switch (whatsappProvider.name) {
            case 'meta':
            case 'whatsapp-business':
              return await this.sendWhatsAppViaMeta(whatsappProvider, payload);
            case 'twilio':
              return await this.sendWhatsAppViaTwilio(whatsappProvider, payload);
            case '360dialog':
              return await this.sendWhatsAppVia360Dialog(whatsappProvider, payload);
            default:
              throw new Error(`Unsupported WhatsApp provider: ${whatsappProvider.name}`);
          }

        case 'sms':
          const smsProvider = provider as SMSProvider;
          switch (smsProvider.name) {
            case 'twilio':
              return await this.sendSMSViaTwilio(smsProvider, payload);
            default:
              throw new Error(`Unsupported SMS provider: ${smsProvider.name}`);
          }

        case 'push':
          // Implementar Firebase Cloud Messaging
          return await this.sendPushNotification(payload);

        case 'app':
          // Notificaciones in-app (guardar en Firestore)
          return await this.sendInAppNotification(payload);

        default:
          throw new Error(`Unsupported channel: ${channel}`);
      }
    } catch (error: any) {
      console.error(`Error sending ${channel} notification:`, error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // ==================== PUSH NOTIFICATIONS ====================

  private async sendPushNotification(payload: NotificationPayload): Promise<DeliveryResult> {
    try {
      // Implementar Firebase Cloud Messaging
      // Esto requiere configuración adicional de FCM
      
      // Por ahora, simular envío exitoso
      return {
        success: true,
        messageId: `push_${Date.now()}`,
        providerId: 'fcm',
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        providerId: 'fcm',
        timestamp: new Date()
      };
    }
  }

  // ==================== IN-APP NOTIFICATIONS ====================

  private async sendInAppNotification(payload: NotificationPayload): Promise<DeliveryResult> {
    try {
      // Guardar notificación in-app en Firestore
      // Esto se implementaría con el servicio de notificaciones existente
      
      return {
        success: true,
        messageId: `app_${Date.now()}`,
        providerId: 'firestore',
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        providerId: 'firestore',
        timestamp: new Date()
      };
    }
  }

  // ==================== PROVIDER VALIDATION ====================

  async validateProvider(
    channel: 'email' | 'sms' | 'whatsapp',
    provider: EmailProvider | WhatsAppProvider | SMSProvider
  ): Promise<{ isValid: boolean; error?: string }> {
    try {
      // Enviar mensaje de prueba para validar configuración
      const testPayload: NotificationPayload = {
        to: channel === 'email' ? 'test@example.com' : '+1234567890',
        subject: 'Test de configuración',
        content: 'Este es un mensaje de prueba para validar la configuración del proveedor.'
      };

      const result = await this.sendNotification(channel, provider, testPayload);
      
      return {
        isValid: result.success,
        error: result.error
      };
    } catch (error: any) {
      return {
        isValid: false,
        error: error.message
      };
    }
  }

  // ==================== COST ESTIMATION ====================

  estimateCost(
    channel: 'email' | 'sms' | 'whatsapp',
    provider: EmailProvider | WhatsAppProvider | SMSProvider,
    recipientCount: number,
    country?: string
  ): number {
    // Costos aproximados por mensaje (en USD)
    const costs = {
      email: {
        sendgrid: 0.0006, // $0.0006 por email
        resend: 0.001,    // $0.001 por email
        mailgun: 0.0008,
        ses: 0.0001
      },
      sms: {
        twilio: 0.0075,   // $0.0075 por SMS (US)
        vonage: 0.008,
        'aws-sns': 0.0075
      },
      whatsapp: {
        meta: 0.005,      // $0.005 por mensaje
        twilio: 0.005,
        '360dialog': 0.004
      }
    };

    const providerName = provider.name as keyof typeof costs[typeof channel];
    const baseCost = costs[channel]?.[providerName] || 0;
    
    // Aplicar multiplicador por país si es necesario
    let countryMultiplier = 1;
    if (country && channel === 'sms') {
      const countryMultipliers: Record<string, number> = {
        'US': 1,
        'MX': 0.8,
        'BR': 1.2,
        'AR': 1.1,
        'CO': 1.0,
        'PE': 1.0,
        'CL': 1.1
      };
      countryMultiplier = countryMultipliers[country] || 1.2;
    }

    return baseCost * recipientCount * countryMultiplier;
  }

  // ==================== DELIVERY TRACKING ====================

  async trackDelivery(
    messageId: string,
    providerId: string
  ): Promise<{
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp?: Date;
    error?: string;
  }> {
    try {
      switch (providerId) {
        case 'sendgrid':
          return await this.trackSendGridDelivery(messageId);
        case 'twilio-sms':
        case 'twilio-whatsapp':
          return await this.trackTwilioDelivery(messageId);
        case 'meta-whatsapp':
          return await this.trackMetaWhatsAppDelivery(messageId);
        default:
          return { status: 'sent' }; // Estado por defecto
      }
    } catch (error: any) {
      return {
        status: 'failed',
        error: error.message
      };
    }
  }

  private async trackSendGridDelivery(messageId: string) {
    // Implementar tracking de SendGrid
    return { status: 'sent' as const };
  }

  private async trackTwilioDelivery(messageId: string) {
    // Implementar tracking de Twilio
    return { status: 'sent' as const };
  }

  private async trackMetaWhatsAppDelivery(messageId: string) {
    // Implementar tracking de Meta WhatsApp
    return { status: 'sent' as const };
  }
}

export const notificationProvidersService = new NotificationProvidersService();aaaaas