import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  SimpleNotification, 
  SimpleNotificationFormData, 
  SimpleNotificationResult,
  RecipientInfo,
  SimpleNotificationChannel
} from '@/types/simple-notification';

// Servicio de Email simplificado
class SimpleEmailService {
  private apiKey: string;
  private baseUrl = 'https://api.sendgrid.com/v3/mail/send';

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || '';
  }

  async sendEmail(to: string, subject: string, message: string): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('SendGrid API key not configured');
      return false;
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: to }],
            subject: subject,
          }],
          from: {
            email: process.env.FROM_EMAIL || 'noreply@fidelya.com',
            name: process.env.FROM_NAME || 'Fidelya'
          },
          content: [{
            type: 'text/html',
            value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">${subject}</h2>
                <p style="color: #666; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">
                  Este mensaje fue enviado desde Fidelya
                </p>
              </div>
            `
          }]
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}

// Servicio de WhatsApp con Twilio - CONFIGURADO CORRECTAMENTE
class SimpleWhatsAppService {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
  }

  // Función para formatear número de teléfono
  private formatPhoneNumber(phone: string): string {
    // Remover todos los caracteres no numéricos
    let cleanPhone = phone.replace(/\D/g, '');
    
    // Si no empieza con código de país, asumir que es de Argentina (+54)
    if (!cleanPhone.startsWith('54') && cleanPhone.length === 10) {
      cleanPhone = '54' + cleanPhone;
    }
    
    // Agregar el prefijo de WhatsApp
    return `whatsapp:+${cleanPhone}`;
  }

  async sendWhatsApp(to: string, message: string): Promise<boolean> {
    if (!this.accountSid || !this.authToken) {
      console.warn('🚫 Twilio WhatsApp credentials not configured');
      return false;
    }

    try {
      // Formatear número de teléfono
      const formattedTo = this.formatPhoneNumber(to);
      
      console.log(`📱 Enviando WhatsApp a: ${formattedTo}`);
      
      // Crear el cuerpo de la petición para Twilio
      const body = new URLSearchParams({
        From: this.fromNumber,
        To: formattedTo,
        Body: message
      });

      // Crear la autorización básica para Twilio
      const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');

      // Enviar mensaje usando Twilio API
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body.toString()
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ WhatsApp enviado exitosamente via Twilio. SID: ${result.sid}`);
        console.log(`📊 Estado: ${result.status}, Precio: ${result.price} ${result.price_unit}`);
        return true;
      } else {
        const error = await response.json();
        console.error('❌ Error Twilio WhatsApp:', error);
        console.error(`🔍 Detalles: ${error.message} (Código: ${error.code})`);
        return false;
      }
    } catch (error) {
      console.error('💥 Error crítico enviando WhatsApp via Twilio:', error);
      return false;
    }
  }

  // Método para verificar la configuración
  isConfigured(): boolean {
    return !!(this.accountSid && this.authToken);
  }

  // Método para obtener información de configuración (sin exponer credenciales)
  getConfigInfo() {
    return {
      configured: this.isConfigured(),
      fromNumber: this.fromNumber,
      accountSidPrefix: this.accountSid ? this.accountSid.substring(0, 8) + '...' : 'No configurado'
    };
  }
}

// Servicio principal simplificado
export class SimpleNotificationService {
  private emailService: SimpleEmailService;
  private whatsappService: SimpleWhatsAppService;

  constructor() {
    this.emailService = new SimpleEmailService();
    this.whatsappService = new SimpleWhatsAppService();
    
    // Log de configuración al inicializar
    console.log('🔧 Configuración de servicios de notificación:');
    console.log('📧 Email (SendGrid):', this.emailService.constructor.name);
    console.log('📱 WhatsApp (Twilio):', this.whatsappService.getConfigInfo());
  }

  // Obtener información de destinatarios
  async getRecipients(): Promise<RecipientInfo[]> {
    try {
      const recipients: RecipientInfo[] = [];

      // Obtener socios
      const sociosQuery = query(collection(db, 'socios'));
      const sociosSnapshot = await getDocs(sociosQuery);
      sociosSnapshot.forEach(doc => {
        const data = doc.data();
        recipients.push({
          id: doc.id,
          name: data.nombre || 'Sin nombre',
          email: data.email,
          phone: data.telefono,
          type: 'socio'
        });
      });

      // Obtener comercios
      const comerciosQuery = query(collection(db, 'comercios'));
      const comerciosSnapshot = await getDocs(comerciosQuery);
      comerciosSnapshot.forEach(doc => {
        const data = doc.data();
        recipients.push({
          id: doc.id,
          name: data.nombre || 'Sin nombre',
          email: data.email,
          phone: data.telefono,
          type: 'comercio'
        });
      });

      return recipients;
    } catch (error) {
      console.error('Error getting recipients:', error);
      return [];
    }
  }

  // Crear notificación
  async createNotification(
    data: SimpleNotificationFormData,
    createdBy: string
  ): Promise<string> {
    try {
      const notification: Omit<SimpleNotification, 'id'> = {
        ...data,
        createdAt: new Date(),
        createdBy,
        status: 'draft'
      };

      const docRef = await addDoc(collection(db, 'simpleNotifications'), {
        ...notification,
        createdAt: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Enviar notificación
  async sendNotification(
    notificationId: string,
    data: SimpleNotificationFormData
  ): Promise<SimpleNotificationResult> {
    const result: SimpleNotificationResult = {
      success: false,
      sentCount: 0,
      failedCount: 0,
      errors: []
    };

    try {
      // Actualizar estado a "enviando"
      await updateDoc(doc(db, 'simpleNotifications', notificationId), {
        status: 'sending'
      });

      // Obtener información de destinatarios
      const allRecipients = await this.getRecipients();
      const recipients = allRecipients.filter(r => data.recipientIds.includes(r.id));

      console.log(`📤 Enviando notificación "${data.title}" a ${recipients.length} destinatarios`);
      console.log(`📋 Canales seleccionados: ${data.channels.join(', ')}`);

      // Enviar por cada canal seleccionado
      for (const recipient of recipients) {
        console.log(`👤 Procesando destinatario: ${recipient.name} (${recipient.type})`);
        
        for (const channel of data.channels) {
          try {
            let sent = false;

            switch (channel) {
              case 'email':
                if (recipient.email) {
                  sent = await this.emailService.sendEmail(
                    recipient.email,
                    data.title,
                    data.message
                  );
                  if (sent) {
                    console.log(`✅ Email enviado a ${recipient.name} (${recipient.email})`);
                  } else {
                    console.log(`❌ Falló email a ${recipient.name} (${recipient.email})`);
                  }
                } else {
                  result.errors.push(`${recipient.name} no tiene email configurado`);
                  console.log(`⚠️ ${recipient.name} no tiene email`);
                }
                break;

              case 'whatsapp':
                if (recipient.phone) {
                  const whatsappMessage = `*${data.title}*\n\n${data.message}\n\n_Enviado desde Fidelya 🚀_`;
                  sent = await this.whatsappService.sendWhatsApp(
                    recipient.phone,
                    whatsappMessage
                  );
                  if (sent) {
                    console.log(`✅ WhatsApp enviado a ${recipient.name} (${recipient.phone})`);
                  } else {
                    console.log(`❌ Falló WhatsApp a ${recipient.name} (${recipient.phone})`);
                  }
                } else {
                  result.errors.push(`${recipient.name} no tiene teléfono configurado`);
                  console.log(`⚠️ ${recipient.name} no tiene teléfono`);
                }
                break;

              case 'app':
                // Para notificaciones en la app, crear registro en Firestore
                await addDoc(collection(db, 'notifications'), {
                  title: data.title,
                  message: data.message,
                  type: data.type,
                  recipientId: recipient.id,
                  status: 'unread',
                  createdAt: serverTimestamp(),
                  read: false
                });
                sent = true;
                console.log(`✅ Notificación en app enviada a ${recipient.name}`);
                break;
            }

            if (sent) {
              result.sentCount++;
            } else {
              result.failedCount++;
              if (!result.errors.some(e => e.includes(recipient.name))) {
                result.errors.push(`Error enviando ${channel} a ${recipient.name}`);
              }
            }

            // Pequeña pausa entre envíos para evitar rate limits
            await new Promise(resolve => setTimeout(resolve, 200));

          } catch (error) {
            result.failedCount++;
            result.errors.push(`Error enviando ${channel} a ${recipient.name}: ${error}`);
            console.error(`💥 Error crítico enviando ${channel} a ${recipient.name}:`, error);
          }
        }
      }

      // Actualizar estado final
      const finalStatus = result.failedCount === 0 ? 'sent' : 
                         result.sentCount === 0 ? 'failed' : 'sent';
      
      await updateDoc(doc(db, 'simpleNotifications', notificationId), {
        status: finalStatus
      });

      result.success = result.sentCount > 0;
      
      console.log(`📊 Resultado final: ${result.sentCount} enviadas, ${result.failedCount} fallidas`);
      if (result.errors.length > 0) {
        console.log(`🚨 Errores encontrados:`, result.errors);
      }

      return result;
    } catch (error) {
      console.error('💥 Error crítico enviando notificación:', error);
      
      // Actualizar estado a fallido
      await updateDoc(doc(db, 'simpleNotifications', notificationId), {
        status: 'failed'
      });

      result.errors.push(`Error general: ${error}`);
      return result;
    }
  }

  // Obtener historial de notificaciones
  async getNotifications(createdBy?: string): Promise<SimpleNotification[]> {
    try {
      let notificationsQuery = query(
        collection(db, 'simpleNotifications'),
        orderBy('createdAt', 'desc')
      );

      if (createdBy) {
        notificationsQuery = query(
          collection(db, 'simpleNotifications'),
          where('createdBy', '==', createdBy),
          orderBy('createdAt', 'desc')
        );
      }

      const snapshot = await getDocs(notificationsQuery);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          message: data.message,
          type: data.type,
          channels: data.channels,
          recipientIds: data.recipientIds,
          createdAt: data.createdAt?.toDate() || new Date(),
          createdBy: data.createdBy,
          status: data.status
        };
      });
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  // Obtener configuración de usuario
  async getUserSettings(userId: string) {
    try {
      const settingsQuery = query(
        collection(db, 'simpleNotificationSettings'),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(settingsQuery);
      
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        return {
          userId: data.userId,
          emailEnabled: data.emailEnabled ?? true,
          whatsappEnabled: data.whatsappEnabled ?? true,
          appEnabled: data.appEnabled ?? true,
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      }

      // Configuración por defecto
      return {
        userId,
        emailEnabled: true,
        whatsappEnabled: true,
        appEnabled: true,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error getting user settings:', error);
      return null;
    }
  }

  // Guardar configuración de usuario
  async saveUserSettings(settings: any) {
    try {
      const settingsQuery = query(
        collection(db, 'simpleNotificationSettings'),
        where('userId', '==', settings.userId)
      );
      
      const snapshot = await getDocs(settingsQuery);
      
      if (!snapshot.empty) {
        // Actualizar existente
        const docRef = snapshot.docs[0].ref;
        await updateDoc(docRef, {
          ...settings,
          updatedAt: serverTimestamp()
        });
      } else {
        // Crear nuevo
        await addDoc(collection(db, 'simpleNotificationSettings'), {
          ...settings,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error saving user settings:', error);
      throw error;
    }
  }

  // Método para verificar configuración de servicios
  getServicesStatus() {
    return {
      whatsapp: this.whatsappService.getConfigInfo(),
      email: {
        configured: !!process.env.SENDGRID_API_KEY,
        service: 'SendGrid'
      }
    };
  }
}

// Exportar instancia singleton
export const simpleNotificationService = new SimpleNotificationService();