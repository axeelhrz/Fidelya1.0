import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  notificationProvidersService, 
  EmailProvider, 
  WhatsAppProvider, 
  SMSProvider,
  NotificationPayload,
  DeliveryResult
} from './notification-providers.service';

export interface QueuedNotification {
  id?: string;
  notificationId: string;
  recipientId: string;
  recipientType: 'socio' | 'comercio' | 'asociacion';
  channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'app';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'processing' | 'sent' | 'failed' | 'cancelled' | 'paused';
  scheduledFor: Timestamp;
  attempts: number;
  maxAttempts: number;
  lastAttempt?: Timestamp;
  errorMessage?: string;
  deliveryResult?: DeliveryResult;
  metadata: {
    templateId?: string;
    variables?: Record<string, unknown>;
    segmentId?: string;
    campaignId?: string;
    asociacionId?: string;
    providerConfig?: EmailProvider | WhatsAppProvider | SMSProvider;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface QueueStats {
  pending: number;
  processing: number;
  sent: number;
  failed: number;
  cancelled: number;
  paused: number;
  total: number;
  processed: number;
  avgProcessingTime: number;
  successRate: number;
  isProcessing: boolean;
  lastProcessed?: Date;
  channelStats: Record<string, {
    pending: number;
    sent: number;
    failed: number;
    successRate: number;
  }>;
}

export interface RetryConfig {
  maxAttempts: number;
  backoffMultiplier: number;
  initialDelay: number; // en minutos
  maxDelay: number; // en minutos
}

class NotificationQueueService {
  private readonly COLLECTION = 'notification_queue';
  private readonly DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxAttempts: 3,
    backoffMultiplier: 2,
    initialDelay: 5,
    maxDelay: 60
  };

  // Configuraciones por defecto de proveedores
  private readonly DEFAULT_PROVIDERS = {
    email: {
      name: 'resend' as const,
      apiKey: process.env.RESEND_API_KEY || '',
      fromEmail: process.env.FROM_EMAIL || 'noreply@asociacion.com',
      fromName: process.env.FROM_NAME || 'Mi Asociación'
    },
    whatsapp: {
      name: 'meta' as const,
      apiKey: process.env.WHATSAPP_API_KEY || '',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || ''
    },
    sms: {
      name: 'twilio' as const,
      apiKey: process.env.TWILIO_API_KEY || '',
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      fromNumber: process.env.TWILIO_FROM_NUMBER || ''
    }
  };

  // Agregar notificación a la cola
  async enqueue(notification: Omit<QueuedNotification, 'id' | 'createdAt' | 'updatedAt' | 'attempts' | 'status'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...notification,
        status: 'pending',
        attempts: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error enqueuing notification:', error);
      throw error;
    }
  }

  // Agregar múltiples notificaciones a la cola (batch)
  async enqueueBatch(notifications: Omit<QueuedNotification, 'id' | 'createdAt' | 'updatedAt' | 'attempts' | 'status'>[]): Promise<string[]> {
    try {
      const batch = writeBatch(db);
      const docIds: string[] = [];

      for (const notification of notifications) {
        const docRef = doc(collection(db, this.COLLECTION));
        batch.set(docRef, {
          ...notification,
          status: 'pending',
          attempts: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        docIds.push(docRef.id);
      }

      await batch.commit();
      return docIds;
    } catch (error) {
      console.error('Error enqueuing batch notifications:', error);
      throw error;
    }
  }

  // Obtener próximas notificaciones para procesar
  async getNextNotifications(limitCount: number = 10, channel?: string): Promise<QueuedNotification[]> {
    try {
      const constraints = [
        where('status', '==', 'pending'),
        where('scheduledFor', '<=', new Date()),
        orderBy('scheduledFor', 'asc'),
        orderBy('priority', 'desc'),
        limit(limitCount)
      ];

      if (channel) {
        constraints.push(where('channel', '==', channel));
      }

      const q = query(
        collection(db, this.COLLECTION),
        ...constraints
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as QueuedNotification));
    } catch (error) {
      console.error('Error getting next notifications:', error);
      throw error;
    }
  }

  // Procesar una notificación específica
  async processNotification(queueId: string): Promise<DeliveryResult> {
    try {
      // Marcar como procesándose
      await this.markAsProcessing(queueId);

      // Obtener la notificación
      const queueDoc = await getDocs(query(
        collection(db, this.COLLECTION),
        where('__name__', '==', queueId)
      ));

      if (queueDoc.empty) {
        throw new Error('Queue item not found');
      }

      const queueData = queueDoc.docs[0].data() as QueuedNotification;
      
      // Preparar el payload
      const payload: NotificationPayload = {
        to: this.getRecipientContact(queueData),
        subject: this.generateSubject(queueData),
        content: this.generateContent(queueData),
        htmlContent: this.generateHtmlContent(queueData),
        variables: queueData.metadata.variables || {}
      };

      // Obtener configuración del proveedor
      const provider = queueData.metadata.providerConfig || this.getDefaultProvider(queueData.channel);

      // Enviar notificación
      const result = await notificationProvidersService.sendNotification(
        queueData.channel,
        provider,
        payload
      );

      // Actualizar estado según resultado
      if (result.success) {
        await this.markAsSent(queueId, result);
      } else {
        await this.markAsFailed(queueId, result.error || 'Unknown error');
      }

      return result;
    } catch (error: any) {
      console.error('Error processing notification:', error);
      await this.markAsFailed(queueId, error.message);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // Procesar cola automáticamente
  async processQueue(batchSize: number = 10): Promise<{
    processed: number;
    successful: number;
    failed: number;
    results: DeliveryResult[];
  }> {
    try {
      const notifications = await this.getNextNotifications(batchSize);
      const results: DeliveryResult[] = [];
      let successful = 0;
      let failed = 0;

      for (const notification of notifications) {
        if (notification.id) {
          const result = await this.processNotification(notification.id);
          results.push(result);
          
          if (result.success) {
            successful++;
          } else {
            failed++;
          }
        }
      }

      return {
        processed: notifications.length,
        successful,
        failed,
        results
      };
    } catch (error) {
      console.error('Error processing queue:', error);
      throw error;
    }
  }

  // Marcar notificación como procesándose
  async markAsProcessing(queueId: string): Promise<void> {
    try {
      const queueRef = doc(db, this.COLLECTION, queueId);
      await updateDoc(queueRef, {
        status: 'processing',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking notification as processing:', error);
      throw error;
    }
  }

  // Marcar notificación como enviada
  async markAsSent(queueId: string, deliveryResult: DeliveryResult): Promise<void> {
    try {
      const queueRef = doc(db, this.COLLECTION, queueId);
      await updateDoc(queueRef, {
        status: 'sent',
        deliveryResult,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking notification as sent:', error);
      throw error;
    }
  }

  // Marcar notificación como fallida y programar reintento si es necesario
  async markAsFailed(queueId: string, errorMessage: string, retryConfig?: RetryConfig): Promise<void> {
    try {
      const queueRef = doc(db, this.COLLECTION, queueId);
      const config = retryConfig || this.DEFAULT_RETRY_CONFIG;

      // Obtener la notificación actual
      const queueDoc = await getDocs(query(
        collection(db, this.COLLECTION),
        where('__name__', '==', queueId)
      ));

      if (queueDoc.empty) {
        throw new Error('Queue item not found');
      }

      const queueData = queueDoc.docs[0].data() as QueuedNotification;
      const newAttempts = queueData.attempts + 1;

      if (newAttempts >= config.maxAttempts) {
        // Máximo de intentos alcanzado, marcar como fallida permanentemente
        await updateDoc(queueRef, {
          status: 'failed',
          attempts: newAttempts,
          lastAttempt: serverTimestamp(),
          errorMessage,
          updatedAt: serverTimestamp()
        });
      } else {
        // Programar reintento con backoff exponencial
        const delay = Math.min(
          config.initialDelay * Math.pow(config.backoffMultiplier, newAttempts - 1),
          config.maxDelay
        );
        
        const nextAttempt = new Date();
        nextAttempt.setMinutes(nextAttempt.getMinutes() + delay);

        await updateDoc(queueRef, {
          status: 'pending',
          attempts: newAttempts,
          lastAttempt: serverTimestamp(),
          scheduledFor: Timestamp.fromDate(nextAttempt),
          errorMessage,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error marking notification as failed:', error);
      throw error;
    }
  }

  // Cancelar notificación
  async cancelNotification(queueId: string): Promise<void> {
    try {
      const queueRef = doc(db, this.COLLECTION, queueId);
      await updateDoc(queueRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error cancelling notification:', error);
      throw error;
    }
  }

  // Pausar/reanudar procesamiento de cola
  async pauseProcessing(asociacionId?: string): Promise<void> {
    try {
      let q = query(
        collection(db, this.COLLECTION),
        where('status', '==', 'pending')
      );

      if (asociacionId) {
        q = query(q, where('metadata.asociacionId', '==', asociacionId));
      }

      const snapshot = await getDocs(q);
      const batch = writeBatch(db);

      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          status: 'paused',
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error pausing processing:', error);
      throw error;
    }
  }

  async resumeProcessing(asociacionId?: string): Promise<void> {
    try {
      let q = query(
        collection(db, this.COLLECTION),
        where('status', '==', 'paused')
      );

      if (asociacionId) {
        q = query(q, where('metadata.asociacionId', '==', asociacionId));
      }

      const snapshot = await getDocs(q);
      const batch = writeBatch(db);

      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          status: 'pending',
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error resuming processing:', error);
      throw error;
    }
  }

  // Obtener estadísticas de la cola
  async getQueueStats(asociacionId?: string, timeRange?: { start: Date; end: Date }): Promise<QueueStats> {
    try {
      let q = query(collection(db, this.COLLECTION));

      if (asociacionId) {
        q = query(q, where('metadata.asociacionId', '==', asociacionId));
      }

      if (timeRange) {
        q = query(q, 
          where('createdAt', '>=', Timestamp.fromDate(timeRange.start)),
          where('createdAt', '<=', Timestamp.fromDate(timeRange.end))
        );
      }

      const snapshot = await getDocs(q);
      const notifications = snapshot.docs.map(doc => doc.data() as QueuedNotification);

      const stats: QueueStats = {
        pending: 0,
        processing: 0,
        sent: 0,
        failed: 0,
        cancelled: 0,
        paused: 0,
        total: notifications.length,
        processed: 0,
        avgProcessingTime: 0,
        successRate: 0,
        isProcessing: false,
        channelStats: {}
      };

      let totalProcessingTime = 0;
      let processedCount = 0;

      notifications.forEach(notification => {
        stats[notification.status]++;

        // Estadísticas por canal
        if (!stats.channelStats[notification.channel]) {
          stats.channelStats[notification.channel] = {
            pending: 0,
            sent: 0,
            failed: 0,
            successRate: 0
          };
        }

        const channelStat = stats.channelStats[notification.channel];
        if (notification.status === 'pending') channelStat.pending++;
        if (notification.status === 'sent') channelStat.sent++;
        if (notification.status === 'failed') channelStat.failed++;

        if (notification.status === 'sent' && notification.lastAttempt) {
          const processingTime = notification.lastAttempt.toMillis() - notification.createdAt.toMillis();
          totalProcessingTime += processingTime;
          processedCount++;
        }
      });

      // Calcular estadísticas finales
      stats.processed = stats.sent + stats.failed;
      stats.isProcessing = stats.processing > 0;

      if (processedCount > 0) {
        stats.avgProcessingTime = totalProcessingTime / processedCount / 1000 / 60; // en minutos
      }

      if (stats.total > 0) {
        stats.successRate = (stats.sent / stats.total) * 100;
      }

      // Calcular success rate por canal
      Object.keys(stats.channelStats).forEach(channel => {
        const channelStat = stats.channelStats[channel];
        const channelTotal = channelStat.pending + channelStat.sent + channelStat.failed;
        if (channelTotal > 0) {
          channelStat.successRate = (channelStat.sent / channelTotal) * 100;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting queue stats:', error);
      throw error;
    }
  }

  // Limpiar notificaciones antiguas
  async clearOldNotifications(daysOld: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const q = query(
        collection(db, this.COLLECTION),
        where('createdAt', '<', Timestamp.fromDate(cutoffDate)),
        where('status', 'in', ['sent', 'failed', 'cancelled'])
      );

      const snapshot = await getDocs(q);
      const batch = writeBatch(db);

      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      return snapshot.docs.length;
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      throw error;
    }
  }

  // Métodos auxiliares privados
  private getRecipientContact(notification: QueuedNotification): string {
    // En un caso real, esto buscaría en la base de datos el contacto del destinatario
    // Por ahora, simulamos que está en los metadatos
    return notification.metadata.variables?.email || 
           notification.metadata.variables?.phone || 
           notification.metadata.variables?.whatsapp || 
           'unknown@example.com';
  }

  private generateSubject(notification: QueuedNotification): string {
    const template = notification.metadata.variables?.subject || 'Notificación de {{asociacion}}';
    return this.replaceVariables(template, notification.metadata.variables || {});
  }

  private generateContent(notification: QueuedNotification): string {
    const template = notification.metadata.variables?.content || 'Tienes una nueva notificación de {{asociacion}}';
    return this.replaceVariables(template, notification.metadata.variables || {});
  }

  private generateHtmlContent(notification: QueuedNotification): string {
    const template = notification.metadata.variables?.htmlContent || this.generateContent(notification);
    return this.replaceVariables(template, notification.metadata.variables || {});
  }

  private replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });
    return result;
  }

  private getDefaultProvider(channel: string): EmailProvider | WhatsAppProvider | SMSProvider {
    switch (channel) {
      case 'email':
        return this.DEFAULT_PROVIDERS.email;
      case 'whatsapp':
        return this.DEFAULT_PROVIDERS.whatsapp;
      case 'sms':
        return this.DEFAULT_PROVIDERS.sms;
      default:
        throw new Error(`No default provider for channel: ${channel}`);
    }
  }
}

export const NotificationQueueService = new NotificationQueueService();