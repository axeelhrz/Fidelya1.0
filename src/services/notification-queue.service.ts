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

export interface QueuedNotification {
  id?: string;
  notificationId: string;
  recipientId: string;
  recipientType: 'socio' | 'comercio' | 'asociacion';
  channel: 'email' | 'sms' | 'push' | 'app';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'processing' | 'sent' | 'failed' | 'cancelled';
  scheduledFor: Timestamp;
  attempts: number;
  maxAttempts: number;
  lastAttempt?: Timestamp;
  errorMessage?: string;
  metadata: {
    templateId?: string;
    variables?: Record<string, unknown>;
    segmentId?: string;
    campaignId?: string;
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
  total: number;
  avgProcessingTime: number;
  successRate: number;
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
  async markAsSent(queueId: string, deliveryInfo?: Record<string, unknown>): Promise<void> {
    try {
      const queueRef = doc(db, this.COLLECTION, queueId);
      await updateDoc(queueRef, {
        status: 'sent',
        updatedAt: serverTimestamp(),
        deliveryInfo
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

  // Cancelar múltiples notificaciones
  async cancelNotifications(queueIds: string[]): Promise<void> {
    try {
      const batch = writeBatch(db);

      for (const queueId of queueIds) {
        const queueRef = doc(db, this.COLLECTION, queueId);
        batch.update(queueRef, {
          status: 'cancelled',
          updatedAt: serverTimestamp()
        });
      }

      await batch.commit();
    } catch (error) {
      console.error('Error cancelling notifications:', error);
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

      const stats = {
        pending: 0,
        processing: 0,
        sent: 0,
        failed: 0,
        cancelled: 0,
        total: notifications.length,
        avgProcessingTime: 0,
        successRate: 0
      };

      let totalProcessingTime = 0;
      let processedCount = 0;

      notifications.forEach(notification => {
        stats[notification.status]++;

        if (notification.status === 'sent' && notification.lastAttempt) {
          const processingTime = notification.lastAttempt.toMillis() - notification.createdAt.toMillis();
          totalProcessingTime += processingTime;
          processedCount++;
        }
      });

      if (processedCount > 0) {
        stats.avgProcessingTime = totalProcessingTime / processedCount / 1000 / 60; // en minutos
      }

      if (stats.total > 0) {
        stats.successRate = (stats.sent / stats.total) * 100;
      }

      return stats;
    } catch (error) {
      console.error('Error getting queue stats:', error);
      throw error;
    }
  }

  // Obtener notificaciones por estado
  async getNotificationsByStatus(
    status: QueuedNotification['status'],
    asociacionId?: string,
    limitCount: number = 50
  ): Promise<QueuedNotification[]> {
    try {
      let q = query(
        collection(db, this.COLLECTION),
        where('status', '==', status),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (asociacionId) {
        q = query(q, where('metadata.asociacionId', '==', asociacionId));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as QueuedNotification));
    } catch (error) {
      console.error('Error getting notifications by status:', error);
      throw error;
    }
  }

  // Limpiar notificaciones antiguas
  async cleanupOldNotifications(daysOld: number = 30): Promise<number> {
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

  // Reenviar notificaciones fallidas
  async retryFailedNotifications(asociacionId?: string, maxAge?: number): Promise<number> {
    try {
      let q = query(
        collection(db, this.COLLECTION),
        where('status', '==', 'failed')
      );

      if (asociacionId) {
        q = query(q, where('metadata.asociacionId', '==', asociacionId));
      }

      if (maxAge) {
        const cutoffDate = new Date();
        cutoffDate.setHours(cutoffDate.getHours() - maxAge);
        q = query(q, where('createdAt', '>=', Timestamp.fromDate(cutoffDate)));
      }

      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      let retryCount = 0;

      snapshot.docs.forEach(doc => {
        const data = doc.data() as QueuedNotification;
        
        // Solo reintentar si no ha excedido el máximo de intentos
        if (data.attempts < data.maxAttempts) {
          batch.update(doc.ref, {
            status: 'pending',
            scheduledFor: serverTimestamp(),
            errorMessage: null,
            updatedAt: serverTimestamp()
          });
          retryCount++;
        }
      });

      await batch.commit();
      return retryCount;
    } catch (error) {
      console.error('Error retrying failed notifications:', error);
      throw error;
    }
  }

  // Obtener métricas de rendimiento por canal
  async getChannelPerformance(
    asociacionId?: string,
    days: number = 7
  ): Promise<Record<string, {
    total: number;
    sent: number;
    failed: number;
    pending: number;
    processing: number;
    cancelled: number;
    avgAttempts: number;
    successRate: number;
  }>> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      let q = query(
        collection(db, this.COLLECTION),
        where('createdAt', '>=', Timestamp.fromDate(startDate))
      );

      if (asociacionId) {
        q = query(q, where('metadata.asociacionId', '==', asociacionId));
      }

      const snapshot = await getDocs(q);
      const notifications = snapshot.docs.map(doc => doc.data() as QueuedNotification);

      const channelStats: Record<string, {
        total: number;
        sent: number;
        failed: number;
        pending: number;
        processing: number;
        cancelled: number;
        avgAttempts: number;
        successRate: number;
      }> = {};

      notifications.forEach(notification => {
        const channel = notification.channel;
        
        if (!channelStats[channel]) {
          channelStats[channel] = {
            total: 0,
            sent: 0,
            failed: 0,
            pending: 0,
            processing: 0,
            cancelled: 0,
            avgAttempts: 0,
            successRate: 0
          };
        }

        channelStats[channel].total++;
        channelStats[channel][notification.status]++;
        channelStats[channel].avgAttempts += notification.attempts;
      });

      // Calcular promedios y tasas de éxito
      Object.keys(channelStats).forEach(channel => {
        const stats = channelStats[channel];
        stats.avgAttempts = stats.avgAttempts / stats.total;
        stats.successRate = (stats.sent / stats.total) * 100;
      });

      return channelStats;
    } catch (error) {
      console.error('Error getting channel performance:', error);
      throw error;
    }
  }

  // Pausar/reanudar procesamiento de cola
  async pauseQueue(asociacionId: string): Promise<void> {
    try {
      // Marcar todas las notificaciones pendientes como pausadas
      const q = query(
        collection(db, this.COLLECTION),
        where('status', '==', 'pending'),
        where('metadata.asociacionId', '==', asociacionId)
      );

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
      console.error('Error pausing queue:', error);
      throw error;
    }
  }

  async resumeQueue(asociacionId: string): Promise<void> {
    try {
      // Reanudar todas las notificaciones pausadas
      const q = query(
        collection(db, this.COLLECTION),
        where('status', '==', 'paused'),
        where('metadata.asociacionId', '==', asociacionId)
      );

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
      console.error('Error resuming queue:', error);
      throw error;
    }
  }
}

export const notificationQueueService = new NotificationQueueService();