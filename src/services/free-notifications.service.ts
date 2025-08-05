import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  NotificationFormData, 
  NotificationDelivery, 
  NotificationSettings,
} from '@/types/notification';

// EmailJS service (completamente gratuito)
class FreeEmailService {
  private serviceId: string;
  private templateId: string;
  private publicKey: string;
  private initialized = false;

  constructor() {
    this.serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'default_service';
    this.templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_1';
    this.publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
  }

  private async initEmailJS(): Promise<boolean> {
    if (this.initialized) return true;
    
    try {
      // Cargar EmailJS dinámicamente
      const emailjs = await import('@emailjs/browser');
      
      if (this.publicKey) {
        emailjs.init(this.publicKey);
        this.initialized = true;
        console.log('✅ EmailJS initialized successfully');
        return true;
      } else {
        console.warn('⚠️ EmailJS public key not configured');
        return false;
      }
    } catch (error) {
      console.error('❌ Error initializing EmailJS:', error);
      return false;
    }
  }

  async sendEmail(
    to: string, 
    subject: string, 
    message: string,
    userName: string = 'Usuario',
    actionUrl?: string,
    actionLabel?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const initialized = await this.initEmailJS();
      if (!initialized) {
        return { success: false, error: 'EmailJS not configured' };
      }

      const emailjs = await import('@emailjs/browser');
      
      const templateParams = {
        to_email: to,
        to_name: userName,
        subject: subject,
        message: message,
        action_url: actionUrl || '',
        action_label: actionLabel || 'Ver más',
        from_name: 'Fidelya',
        reply_to: 'noreply@fidelya.com'
      };

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      if (response.status === 200) {
        console.log(`✅ Email sent successfully to ${to}`);
        return { success: true, messageId: response.text };
      } else {
        console.error(`❌ EmailJS error:`, response);
        return { success: false, error: `EmailJS error: ${response.status}` };
      }
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Verificar si EmailJS está disponible
  async isAvailable(): Promise<boolean> {
    return await this.initEmailJS();
  }
}

// Servicio de notificaciones push gratuito usando Firebase
class FreePushNotificationService {
  private messaging: any = null;
  private initialized = false;

  private async initMessaging(): Promise<boolean> {
    if (this.initialized) return true;
    
    try {
      // Solo inicializar en el navegador
      if (typeof window === 'undefined') return false;

      // Verificar soporte
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('⚠️ Push notifications not supported');
        return false;
      }

      const { getMessaging, isSupported } = await import('firebase/messaging');
      
      const supported = await isSupported();
      if (!supported) {
        console.warn('⚠️ Firebase messaging not supported');
        return false;
      }

      this.messaging = getMessaging();
      this.initialized = true;
      console.log('✅ Firebase messaging initialized');
      return true;
    } catch (error) {
      console.error('❌ Error initializing Firebase messaging:', error);
      return false;
    }
  }

  async requestPermission(): Promise<string | null> {
    try {
      const initialized = await this.initMessaging();
      if (!initialized) return null;

      // Solicitar permiso de notificación
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('⚠️ Notification permission denied');
        return null;
      }

      // Registrar service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service worker registered');

      // Obtener token
      const { getToken } = await import('firebase/messaging');
      const vapidKey = process.env.NEXT_PUBLIC_FCM_VAPID_KEY;
      
      if (!vapidKey) {
        console.warn('⚠️ VAPID key not configured');
        return null;
      }

      const token = await getToken(this.messaging, {
        vapidKey,
        serviceWorkerRegistration: registration
      });

      if (token) {
        console.log('✅ FCM token obtained');
        return token;
      } else {
        console.warn('⚠️ No FCM token available');
        return null;
      }
    } catch (error) {
      console.error('❌ Error requesting push permission:', error);
      return null;
    }
  }

  async sendPushNotification(
    token: string, 
    title: string, 
    body: string, 
    data?: Record<string, string>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Para envío desde cliente, usamos la API de Firebase Functions
      const response = await fetch('/api/notifications/send-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          title,
          body,
          data
        })
      });

      if (response.ok) {
        console.log('✅ Push notification sent successfully');
        return { success: true };
      } else {
        const errorText = await response.text();
        console.error('❌ Push notification error:', errorText);
        return { success: false, error: `API error: ${response.status}` };
      }
    } catch (error) {
      console.error('❌ Error sending push notification:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async isAvailable(): Promise<boolean> {
    return await this.initMessaging();
  }
}

// Servicio de notificaciones del navegador nativas
class BrowserNotificationService {
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('⚠️ Browser notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
      return false;
    }
  }

  async showNotification(
    title: string,
    message: string,
    options: {
      icon?: string;
      badge?: string;
      tag?: string;
      requireInteraction?: boolean;
      actionUrl?: string;
      data?: Record<string, unknown>;
    } = {}
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (Notification.permission !== 'granted') {
        return { success: false, error: 'Permission not granted' };
      }

      const notification = new Notification(title, {
        body: message,
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
        tag: options.tag || 'fidelya-notification',
        requireInteraction: options.requireInteraction || false,
        data: {
          ...options.data,
          actionUrl: options.actionUrl
        }
      });

      // Manejar click
      notification.onclick = () => {
        window.focus();
        if (options.actionUrl) {
          window.open(options.actionUrl, '_blank');
        }
        notification.close();
      };

      // Auto-cerrar después de 8 segundos si no es crítica
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 8000);
      }

      console.log('✅ Browser notification shown');
      return { success: true };
    } catch (error) {
      console.error('❌ Error showing browser notification:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  isAvailable(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }
}

// Servicio principal de notificaciones gratuitas
export class FreeNotificationService {
  private emailService: FreeEmailService;
  private pushService: FreePushNotificationService;
  private browserService: BrowserNotificationService;

  constructor() {
    this.emailService = new FreeEmailService();
    this.pushService = new FreePushNotificationService();
    this.browserService = new BrowserNotificationService();
  }

  // Obtener configuración del usuario
  async getUserSettings(userId: string): Promise<NotificationSettings | null> {
    try {
      const settingsQuery = query(
        collection(db, 'notificationSettings'),
        where('userId', '==', userId),
        limit(1)
      );
      
      const snapshot = await getDocs(settingsQuery);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { ...doc.data(), id: doc.id } as unknown as NotificationSettings;
      }

      // Crear configuración por defecto
      const defaultSettings: Omit<NotificationSettings, 'id'> = {
        userId,
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false, // SMS deshabilitado por defecto (no gratuito)
        categories: {
          system: true,
          membership: true,
          payment: true,
          event: true,
          general: true
        },
        priorities: {
          low: true,
          medium: true,
          high: true,
          urgent: true
        },
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00'
        },
        frequency: 'immediate',
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'notificationSettings'), {
        ...defaultSettings,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { ...defaultSettings, id: docRef.id } as NotificationSettings & { id: string };
    } catch (error) {
      console.error('Error getting user settings:', error);
      return null;
    }
  }

  // Obtener información de contacto del usuario
  async getUserContactInfo(userId: string): Promise<{
    email?: string;
    pushTokens?: string[];
    name?: string;
  } | null> {
    try {
      const userQuery = query(
        collection(db, 'users'),
        where('uid', '==', userId),
        limit(1)
      );
      
      const snapshot = await getDocs(userQuery);
      
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        
        // Validar email
        const email = userData.email;
        const emailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        return {
          email: emailValid ? email : undefined,
          pushTokens: Array.isArray(userData.pushTokens) ? userData.pushTokens : [],
          name: userData.nombre || userData.name || 'Usuario'
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting user contact info:', error);
      return null;
    }
  }

  // Verificar disponibilidad de servicios
  async checkServiceAvailability(): Promise<{
    email: boolean;
    push: boolean;
    browser: boolean;
  }> {
    const [emailAvailable, pushAvailable] = await Promise.all([
      this.emailService.isAvailable(),
      this.pushService.isAvailable()
    ]);

    return {
      email: emailAvailable,
      push: pushAvailable,
      browser: this.browserService.isAvailable()
    };
  }

  // Crear registro de entrega
  private async createDeliveryRecord(
    notificationId: string,
    recipientId: string,
    channel: 'app' | 'email' | 'push' | 'browser',
    status: 'pending' | 'sent' | 'delivered' | 'failed',
    metadata: Record<string, unknown> = {}
  ): Promise<string> {
    const deliveryData: Omit<NotificationDelivery, 'id'> = {
      notificationId,
      recipientId,
      channel,
      status,
      retryCount: 0,
      metadata: {
        ...metadata,
        timestamp: Date.now(),
        service: 'free-notifications',
        version: '1.0'
      }
    };

    if (status === 'sent') {
      deliveryData.sentAt = new Date();
    }

    const docRef = await addDoc(collection(db, 'notificationDeliveries'), {
      ...deliveryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return docRef.id;
  }

  // Enviar notificación a un usuario con sistema de fallback
  async sendNotificationToUser(
    notificationId: string,
    userId: string,
    notificationData: NotificationFormData
  ): Promise<{
    email: { success: boolean; messageId?: string; error?: string };
    push: { success: boolean; error?: string };
    browser: { success: boolean; error?: string };
    inApp: { success: boolean };
  }> {
    const results = {
      email: { success: false, error: 'Not attempted' },
      push: { success: false, error: 'Not attempted' },
      browser: { success: false, error: 'Not attempted' },
      inApp: { success: true } // Las notificaciones in-app siempre funcionan
    };

    try {
      console.log(`📤 Starting free notification delivery for user ${userId}`);

      // Obtener configuración y contacto del usuario
      const [settings, contactInfo, serviceAvailability] = await Promise.all([
        this.getUserSettings(userId),
        this.getUserContactInfo(userId),
        this.checkServiceAvailability()
      ]);

      if (!settings || !contactInfo) {
        console.warn(`⚠️ No settings or contact info found for user ${userId}`);
        return results;
      }

      const trackingId = `${notificationId}_${userId}_${Date.now()}`;

      // 1. Notificación in-app (siempre se crea)
      try {
        await addDoc(collection(db, 'notifications'), {
          ...notificationData,
          recipientId: userId,
          status: 'unread',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          metadata: {
            trackingId,
            source: 'free-notifications'
          }
        });
        console.log('✅ In-app notification created');
      } catch (error) {
        console.error('❌ Error creating in-app notification:', error);
        results.inApp.success = false;
      }

      // 2. Email (si está habilitado y disponible)
      if (settings.emailNotifications && contactInfo.email && serviceAvailability.email) {
        console.log(`📧 Sending email to ${contactInfo.email}`);
        
        const deliveryId = await this.createDeliveryRecord(
          notificationId,
          userId,
          'email',
          'pending',
          { email: contactInfo.email, trackingId }
        );

        try {
          const emailResult = await this.emailService.sendEmail(
            contactInfo.email,
            notificationData.title,
            notificationData.message,
            contactInfo.name,
            notificationData.actionUrl,
            notificationData.actionLabel
          );

          results.email = emailResult;
          
          await updateDoc(doc(db, 'notificationDeliveries', deliveryId), {
            status: emailResult.success ? 'sent' : 'failed',
            sentAt: emailResult.success ? serverTimestamp() : undefined,
            failureReason: emailResult.error,
            metadata: {
              email: contactInfo.email,
              trackingId,
              messageId: emailResult.messageId
            },
            updatedAt: serverTimestamp()
          });
        } catch (error) {
          console.error('❌ Error sending email:', error);
          results.email = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      }

      // 3. Push notification (si está habilitado y disponible)
      if (settings.pushNotifications && contactInfo.pushTokens && contactInfo.pushTokens.length > 0 && serviceAvailability.push) {
        console.log(`🔔 Sending push notification to ${contactInfo.pushTokens.length} devices`);
        
        const deliveryId = await this.createDeliveryRecord(
          notificationId,
          userId,
          'push',
          'pending',
          { pushTokens: contactInfo.pushTokens, trackingId }
        );

        try {
          // Enviar a todos los tokens
          const pushResults = await Promise.all(
            contactInfo.pushTokens.map(token => 
              this.pushService.sendPushNotification(
                token,
                notificationData.title,
                notificationData.message,
                {
                  notificationId,
                  type: notificationData.type,
                  actionUrl: notificationData.actionUrl || '',
                  userId
                }
              )
            )
          );

          const successCount = pushResults.filter(r => r.success).length;
          results.push = { 
            success: successCount > 0,
            error: successCount === 0 ? 'All push notifications failed' : ''
          };
          
          await updateDoc(doc(db, 'notificationDeliveries', deliveryId), {
            status: successCount > 0 ? 'sent' : 'failed',
            sentAt: successCount > 0 ? serverTimestamp() : undefined,
            failureReason: successCount === 0 ? 'All push notifications failed' : undefined,
            metadata: {
              pushTokens: contactInfo.pushTokens,
              trackingId,
              successCount,
              failureCount: pushResults.length - successCount
            },
            updatedAt: serverTimestamp()
          });
        } catch (error) {
          console.error('❌ Error sending push notification:', error);
          results.push = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      }

      // 4. Browser notification como fallback (si push falló)
      if (!results.push.success && serviceAvailability.browser) {
        console.log('🌐 Sending browser notification as fallback');
        
        const deliveryId = await this.createDeliveryRecord(
          notificationId,
          userId,
          'browser',
          'pending',
          { trackingId }
        );

        try {
          const browserResult = await this.browserService.showNotification(
            notificationData.title,
            notificationData.message,
            {
              tag: trackingId,
              requireInteraction: notificationData.priority === 'urgent',
              actionUrl: notificationData.actionUrl,
              data: {
                notificationId,
                type: notificationData.type,
                userId
              }
            }
          );

          results.browser = { success: browserResult.success, error: browserResult.error ?? '' };
          
          await updateDoc(doc(db, 'notificationDeliveries', deliveryId), {
            status: browserResult.success ? 'sent' : 'failed',
            sentAt: browserResult.success ? serverTimestamp() : undefined,
            failureReason: browserResult.error,
            metadata: {
              trackingId
            },
            updatedAt: serverTimestamp()
          });
        } catch (error) {
          console.error('❌ Error sending browser notification:', error);
          results.browser = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      }

      console.log(`✅ Free notification delivery completed for user ${userId}`, results);

    } catch (error) {
      console.error('❌ Error sending notification to user:', error);
    }

    return results;
  }

  // Enviar notificación a múltiples usuarios
  async sendNotificationToUsers(
    notificationId: string,
    userIds: string[],
    notificationData: NotificationFormData
  ): Promise<{
    totalUsers: number;
    emailSent: number;
    pushSent: number;
    browserSent: number;
    inAppSent: number;
  }> {
    const results = {
      totalUsers: userIds.length,
      emailSent: 0,
      pushSent: 0,
      browserSent: 0,
      inAppSent: 0
    };

    console.log(`📤 Sending notifications to ${userIds.length} users`);

    // Procesar en lotes para evitar sobrecargar
    const batchSize = 5;
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (userId) => {
        const userResults = await this.sendNotificationToUser(
          notificationId,
          userId,
          notificationData
        );
        
        return userResults;
      });

      const batchResults = await Promise.all(batchPromises);
      
      // Agregar resultados
      batchResults.forEach(result => {
        if (result.email.success) results.emailSent++;
        if (result.push.success) results.pushSent++;
        if (result.browser.success) results.browserSent++;
        if (result.inApp.success) results.inAppSent++;
      });

      // Pequeña pausa entre lotes
      if (i + batchSize < userIds.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`✅ Batch notification completed:`, results);
    return results;
  }

  // Obtener estadísticas de entrega
  async getDeliveryStats(notificationId: string): Promise<{
    total: number;
    sent: number;
    failed: number;
    byChannel: Record<string, { sent: number; failed: number; rate: number }>;
  }> {
    try {
      const deliveriesQuery = query(
        collection(db, 'notificationDeliveries'),
        where('notificationId', '==', notificationId)
      );

      const snapshot = await getDocs(deliveriesQuery);
      const deliveries = snapshot.docs.map(doc => doc.data() as NotificationDelivery);

      const stats = {
        total: deliveries.length,
        sent: deliveries.filter(d => d.status === 'sent').length,
        failed: deliveries.filter(d => d.status === 'failed').length,
        byChannel: {} as Record<string, { sent: number; failed: number; rate: number }>
      };

      // Calcular por canal
      const channels = ['email', 'push', 'browser', 'app'];
      channels.forEach(channel => {
        const channelDeliveries = deliveries.filter(d => d.channel === channel);
        const sent = channelDeliveries.filter(d => d.status === 'sent').length;
        const failed = channelDeliveries.filter(d => d.status === 'failed').length;
        const total = channelDeliveries.length;
        
        stats.byChannel[channel] = {
          sent,
          failed,
          rate: total > 0 ? (sent / total) * 100 : 0
        };
      });

      return stats;
    } catch (error) {
      console.error('❌ Error getting delivery stats:', error);
      throw error;
    }
  }

  // Solicitar permisos necesarios
  async requestPermissions(): Promise<{
    browser: boolean;
    push: boolean;
  }> {
    const results = {
      browser: false,
      push: false
    };

    try {
      // Solicitar permisos de notificación del navegador
      results.browser = await this.browserService.requestPermission();
      
      // Solicitar permisos de push (incluye registro de token)
      const pushToken = await this.pushService.requestPermission();
      results.push = !!pushToken;

      console.log('📋 Permission results:', results);
      return results;
    } catch (error) {
      console.error('❌ Error requesting permissions:', error);
      return results;
    }
  }
}

// Exportar instancia singleton
export const freeNotificationService = new FreeNotificationService();