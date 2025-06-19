import { WHATSAPP_TEMPLATES } from '@/types/alert';

export interface WhatsAppMessage {
  to: string;
  type: 'template';
  template: {
    name: string;
    language: {
      code: string;
    };
    components: {
      type: string;
      parameters?: { type: string; text: string }[];
    }[];
  };
}

export interface WhatsAppResponse {
  messaging_product: string;
  contacts: { input: string; wa_id: string }[];
  messages: { id: string }[];
}

export class WhatsAppService {
  private static readonly API_URL = 'https://graph.facebook.com/v18.0';
  private static readonly PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
  private static readonly ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

  /**
   * Envía un recordatorio de sesión al paciente
   */
  static async sendPatientReminder(
    phoneNumber: string,
    patientName: string,
    sessionDateTime: string,
    professionalName: string
  ): Promise<string | null> {
    try {
      const template = WHATSAPP_TEMPLATES.patient_reminder;
      
      const message: WhatsAppMessage = {
        to: this.formatPhoneNumber(phoneNumber),
        type: 'template',
        template: {
          name: template.name,
          language: { code: template.language },
          components: [
            {
              type: 'BODY',
              parameters: [
                { type: 'TEXT', text: patientName },
                { type: 'TEXT', text: sessionDateTime },
                { type: 'TEXT', text: professionalName }
              ]
            }
          ]
        }
      };

      const response = await this.sendMessage(message);
      return response?.messages[0]?.id || null;
    } catch (error) {
      console.error('Error sending patient reminder:', error);
      throw new Error('No se pudo enviar el recordatorio por WhatsApp');
    }
  }

  /**
   * Envía una alerta al profesional
   */
  static async sendProfessionalAlert(
    phoneNumber: string,
    alertType: string,
    patientName: string,
    description: string
  ): Promise<string | null> {
    try {
      const template = WHATSAPP_TEMPLATES.professional_alert;
      
      const message: WhatsAppMessage = {
        to: this.formatPhoneNumber(phoneNumber),
        type: 'template',
        template: {
          name: template.name,
          language: { code: template.language },
          components: [
            {
              type: 'BODY',
              parameters: [
                { type: 'TEXT', text: alertType },
                { type: 'TEXT', text: patientName },
                { type: 'TEXT', text: description }
              ]
            }
          ]
        }
      };

      const response = await this.sendMessage(message);
      return response?.messages[0]?.id || null;
    } catch (error) {
      console.error('Error sending professional alert:', error);
      throw new Error('No se pudo enviar la alerta por WhatsApp');
    }
  }

  /**
   * Envía una alerta de emergencia
   */
  static async sendEmergencyAlert(
    phoneNumber: string,
    patientName: string,
    crisisDescription: string
  ): Promise<string | null> {
    try {
      const template = WHATSAPP_TEMPLATES.emergency_alert;
      
      const message: WhatsAppMessage = {
        to: this.formatPhoneNumber(phoneNumber),
        type: 'template',
        template: {
          name: template.name,
          language: { code: template.language },
          components: [
            {
              type: 'HEADER'
            },
            {
              type: 'BODY',
              parameters: [
                { type: 'TEXT', text: patientName },
                { type: 'TEXT', text: crisisDescription }
              ]
            }
          ]
        }
      };

      const response = await this.sendMessage(message);
      return response?.messages[0]?.id || null;
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      throw new Error('No se pudo enviar la alerta de emergencia por WhatsApp');
    }
  }

  /**
   * Envía un mensaje usando la API de WhatsApp Cloud
   */
  private static async sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse | null> {
    if (!this.PHONE_NUMBER_ID || !this.ACCESS_TOKEN) {
      throw new Error('WhatsApp credentials not configured');
    }

    const response = await fetch(`${this.API_URL}/${this.PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`WhatsApp API error: ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Formatea el número de teléfono para WhatsApp
   */
  private static formatPhoneNumber(phoneNumber: string): string {
    // Remover espacios, guiones y paréntesis
    let formatted = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Si no empieza con +, agregar código de país (Argentina por defecto)
    if (!formatted.startsWith('+')) {
      if (formatted.startsWith('54')) {
        formatted = '+' + formatted;
      } else if (formatted.startsWith('9')) {
        formatted = '+54' + formatted;
      } else {
        formatted = '+549' + formatted;
      }
    }
    
    return formatted;
  }

  /**
   * Valida si un número de teléfono es válido para WhatsApp
   */
  static validatePhoneNumber(phoneNumber: string): boolean {
    const formatted = this.formatPhoneNumber(phoneNumber);
    // Validar formato internacional básico
    return /^\+[1-9]\d{1,14}$/.test(formatted);
  }

  /**
   * Obtiene el estado de un mensaje enviado
   */
  static async getMessageStatus(): Promise<{
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: Date;
  } | null> {
    try {
      // Esta funcionalidad requiere webhooks configurados
      // Por ahora retornamos null, se puede implementar con webhooks
      return null;
    } catch (error) {
      console.error('Error getting message status:', error);
      return null;
    }
  }
}
