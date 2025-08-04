'use client';

import { toast } from 'react-hot-toast';
import { freeNotificationService } from '@/services/free-notifications.service';

interface NotificationConfig {
  enableInApp: boolean;
  enableEmail: boolean;
  enablePush: boolean;
  enableBrowser: boolean;
  enableSounds: boolean;
  enableBatch: boolean;
  batchDelay: number;
  maxNotifications: number;
  enableDebounce: boolean;
  debounceMs: number;
  autoRequestPermissions: boolean;
}

interface QueuedNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: number;
  actionUrl?: string;
  actionLabel?: string;
  userId?: string;
}

class FreeNotificationManager {
  private config: NotificationConfig;
  private notificationQueue: QueuedNotification[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;
  private lastNotificationTime = 0;
  private recentNotifications = new Set<string>();
  private initialized = false;
  private audioContext: AudioContext | null = null;
  private serviceAvailability = {
    email: false,
    push: false,
    browser: false
  };

  constructor(config: Partial<NotificationConfig> = {}) {
    this.config = {
      enableInApp: true,
      enableEmail: true,
      enablePush: true,
      enableBrowser: true,
      enableSounds: true,
      enableBatch: true,
      batchDelay: 2000,
      maxNotifications: 5,
      enableDebounce: true,
      debounceMs: 1000,
      autoRequestPermissions: true,
      ...config
    };

    // Auto-inicializar en el navegador
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  // Inicializar el gestor de notificaciones
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🔔 Inicializando gestor de notificaciones gratuitas...');

      // Verificar disponibilidad de servicios
      this.serviceAvailability = await freeNotificationService.checkServiceAvailability();
      console.log('📊 Service availability:', this.serviceAvailability);

      // Solicitar permisos automáticamente si está habilitado
      if (this.config.autoRequestPermissions) {
        await this.requestPermissions();
      }

      // Inicializar contexto de audio para sonidos
      if (this.config.enableSounds) {
        this.initAudioContext();
      }

      // Configurar limpieza periódica
      this.setupPeriodicCleanup();

      this.initialized = true;
      console.log('✅ Gestor de notificaciones inicializado correctamente');

      // Mostrar notificación de bienvenida si se obtuvieron permisos
      if (this.serviceAvailability.browser || this.serviceAvailability.push) {
        this.showWelcomeNotification();
      }

    } catch (error) {
      console.error('❌ Error inicializando gestor de notificaciones:', error);
    }
  }

  // Inicializar contexto de audio
  private initAudioContext(): void {
    try {
      if (typeof window !== 'undefined' && !this.audioContext) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioContext = new AudioContextClass();
        }
      }
    } catch (error) {
      console.warn('⚠️ Audio context not supported:', error);
    }
  }

  // Solicitar permisos necesarios
  async requestPermissions(): Promise<{
    browser: boolean;
    push: boolean;
  }> {
    try {
      const permissions = await freeNotificationService.requestPermissions();
      
      // Actualizar disponibilidad
      this.serviceAvailability.browser = permissions.browser;
      this.serviceAvailability.push = permissions.push;

      if (permissions.browser || permissions.push) {
        toast.success('¡Notificaciones activadas correctamente!', {
          duration: 4000,
          position: 'top-right',
        });
      }

      return permissions;
    } catch (error) {
      console.error('❌ Error requesting permissions:', error);
      return { browser: false, push: false };
    }
  }

  // Mostrar notificación de bienvenida
  private showWelcomeNotification(): void {
    setTimeout(() => {
      this.notify(
        '¡Notificaciones activadas!',
        'Recibirás actualizaciones importantes en tiempo real',
        'success',
        'low'
      );
    }, 2000);
  }

  // Configurar limpieza periódica
  private setupPeriodicCleanup(): void {
    // Limpiar notificaciones recientes cada 30 segundos
    setInterval(() => {
      this.recentNotifications.clear();
    }, 30000);

    // Limpiar cola cada 5 minutos
    setInterval(() => {
      const now = Date.now();
      this.notificationQueue = this.notificationQueue.filter(
        notif => now - notif.timestamp < 300000 // 5 minutos
      );
    }, 300000);
  }

  // Verificar si se debe mostrar la notificación
  private shouldShowNotification(message: string, type: string): boolean {
    const now = Date.now();
    
    // Debounce: evitar notificaciones muy frecuentes
    if (this.config.enableDebounce && now - this.lastNotificationTime < this.config.debounceMs) {
      return false;
    }

    // Evitar duplicados recientes
    const notificationKey = `${type}:${message}`;
    if (this.recentNotifications.has(notificationKey)) {
      return false;
    }

    return true;
  }

  // Agregar a notificaciones recientes
  private addToRecentNotifications(message: string, type: string): void {
    const notificationKey = `${type}:${message}`;
    this.recentNotifications.add(notificationKey);
  }

  // Reproducir sonido de notificación
  private playNotificationSound(priority: string = 'medium'): void {
    if (!this.config.enableSounds || !this.audioContext) return;

    try {
      // Diferentes frecuencias para diferentes prioridades
      const frequencies = {
        low: [400],
        medium: [600, 500],
        high: [800, 600],
        urgent: [1000, 800, 600, 400]
      };

      const freqs = frequencies[priority as keyof typeof frequencies] || frequencies.medium;
      
      freqs.forEach((freq, index) => {
        setTimeout(() => {
          if (this.audioContext) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
          }
        }, index * 150);
      });
    } catch (error) {
      console.warn('⚠️ Error playing notification sound:', error);
    }
  }

  // Procesar lote de notificaciones
  private processBatch(): void {
    if (this.notificationQueue.length === 0) return;

    const now = Date.now();
    const validNotifications = this.notificationQueue.filter(
      notif => now - notif.timestamp < this.config.batchDelay
    );

    if (validNotifications.length === 0) {
      this.notificationQueue = [];
      return;
    }

    // Agrupar por tipo y prioridad
    const grouped = validNotifications.reduce((acc, notif) => {
      const key = `${notif.type}-${notif.priority}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(notif);
      return acc;
    }, {} as Record<string, QueuedNotification[]>);

    // Mostrar notificaciones agrupadas
    Object.entries(grouped).forEach(([key, notifications]) => {
      const [type, priority] = key.split('-');
      
      if (notifications.length === 1) {
        this.showSingleNotification(notifications[0]);
      } else {
        this.showBatchNotification(notifications, type as any, priority as any);
      }
    });

    this.notificationQueue = [];
  }

  // Mostrar notificación individual
  private showSingleNotification(notification: QueuedNotification): void {
    // 1. Toast notification (siempre)
    const toastOptions = {
      duration: notification.priority === 'urgent' ? 8000 : 4000,
      position: 'top-right' as const,
      style: {
        background: this.getNotificationColors(notification.type).background,
        border: this.getNotificationColors(notification.type).border,
        color: '#1f2937',
      }
    };

    switch (notification.type) {
      case 'success':
        toast.success(notification.message, toastOptions);
        break;
      case 'error':
        toast.error(notification.message, toastOptions);
        break;
      case 'warning':
        toast(notification.message, { ...toastOptions, icon: '⚠️' });
        break;
      case 'info':
      default:
        toast(notification.message, { ...toastOptions, icon: 'ℹ️' });
        break;
    }

    // 2. Browser notification (si está disponible y habilitado)
    if (this.config.enableBrowser && this.serviceAvailability.browser) {
      freeNotificationService.sendNotificationToUser(
        notification.id,
        notification.userId || 'anonymous',
        {
          title: notification.title,
          message: notification.message,
          type: this.mapToNotificationType(notification.type),
          priority: notification.priority,
          category: 'general',
          actionUrl: notification.actionUrl,
          actionLabel: notification.actionLabel
        }
      ).catch(console.error);
    }

    // 3. Sonido
    this.playNotificationSound(notification.priority);

    // 4. Actualizar estado
    this.lastNotificationTime = Date.now();
    this.addToRecentNotifications(notification.message, notification.type);
  }

  // Mostrar notificación de lote
  private showBatchNotification(
    notifications: QueuedNotification[], 
    type: 'success' | 'error' | 'info' | 'warning',
    priority: 'low' | 'medium' | 'high' | 'urgent'
  ): void {
    const count = notifications.length;
    const firstNotification = notifications[0];
    const batchMessage = `${firstNotification.message} (+${count - 1} más)`;

    this.showSingleNotification({
      ...firstNotification,
      message: batchMessage
    });
  }

  // Obtener colores para tipos de notificación
  private getNotificationColors(type: string): { background: string; border: string } {
    const colors = {
      success: { background: '#f0fdf4', border: '1px solid #bbf7d0' },
      error: { background: '#fef2f2', border: '1px solid #fecaca' },
      warning: { background: '#fffbeb', border: '1px solid #fed7aa' },
      info: { background: '#f0f4ff', border: '1px solid #c7d2fe' }
    };

    return colors[type as keyof typeof colors] || colors.info;
  }

  // Mapear tipos de notificación
  private mapToNotificationType(type: string): 'info' | 'success' | 'warning' | 'error' | 'announcement' {
    const mapping = {
      success: 'success' as const,
      error: 'error' as const,
      warning: 'warning' as const,
      info: 'info' as const
    };

    return mapping[type as keyof typeof mapping] || 'info';
  }

  // Método principal para mostrar notificaciones
  public notify(
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium',
    options: {
      actionUrl?: string;
      actionLabel?: string;
      userId?: string;
      skipBatch?: boolean;
    } = {}
  ): void {
    if (!this.shouldShowNotification(message, type)) {
      return;
    }

    const notification: QueuedNotification = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      type,
      priority,
      timestamp: Date.now(),
      actionUrl: options.actionUrl,
      actionLabel: options.actionLabel,
      userId: options.userId
    };

    if (this.config.enableBatch && !options.skipBatch && priority !== 'urgent') {
      // Agregar a la cola para procesamiento en lote
      this.notificationQueue.push(notification);

      // Limitar tamaño de la cola
      if (this.notificationQueue.length > this.config.maxNotifications) {
        this.notificationQueue = this.notificationQueue.slice(-this.config.maxNotifications);
      }

      // Configurar timeout para procesar lote
      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
      }

      this.batchTimeout = setTimeout(() => {
        this.processBatch();
      }, this.config.batchDelay);
    } else {
      // Mostrar inmediatamente (notificaciones urgentes o batch deshabilitado)
      this.showSingleNotification(notification);
    }
  }

  // Métodos de conveniencia
  public success(title: string, message: string, options?: { actionUrl?: string; actionLabel?: string; userId?: string }): void {
    this.notify(title, message, 'success', 'medium', options);
  }

  public error(title: string, message: string, options?: { actionUrl?: string; actionLabel?: string; userId?: string }): void {
    this.notify(title, message, 'error', 'high', options);
  }

  public warning(title: string, message: string, options?: { actionUrl?: string; actionLabel?: string; userId?: string }): void {
    this.notify(title, message, 'warning', 'medium', options);
  }

  public info(title: string, message: string, options?: { actionUrl?: string; actionLabel?: string; userId?: string }): void {
    this.notify(title, message, 'info', 'low', options);
  }

  public urgent(title: string, message: string, options?: { actionUrl?: string; actionLabel?: string; userId?: string }): void {
    this.notify(title, message, 'error', 'urgent', { ...options, skipBatch: true });
  }

  // Enviar notificación externa (email, push, etc.)
  public async sendExternalNotification(
    userId: string,
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' | 'announcement' = 'info',
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium',
    options: {
      actionUrl?: string;
      actionLabel?: string;
      category?: string;
    } = {}
  ): Promise<{
    email: { success: boolean; messageId?: string; error?: string };
    push: { success: boolean; error?: string };
    browser: { success: boolean; error?: string };
    inApp: { success: boolean };
  }> {
    try {
      const notificationId = `external_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await freeNotificationService.sendNotificationToUser(
        notificationId,
        userId,
        {
          title,
          message,
          type,
          priority,
          category: options.category || 'general',
          actionUrl: options.actionUrl,
          actionLabel: options.actionLabel
        }
      );

      // Mostrar notificación local también
      this.notify(title, message, this.mapFromNotificationType(type), priority, {
        actionUrl: options.actionUrl,
        actionLabel: options.actionLabel,
        userId
      });

      return result;
    } catch (error) {
      console.error('❌ Error sending external notification:', error);
      throw error;
    }
  }

  // Mapear desde tipos de notificación
  private mapFromNotificationType(type: string): 'success' | 'error' | 'info' | 'warning' {
    const mapping = {
      success: 'success' as const,
      error: 'error' as const,
      warning: 'warning' as const,
      info: 'info' as const,
      announcement: 'info' as const
    };

    return mapping[type as keyof typeof mapping] || 'info';
  }

  // Limpiar cola
  public clearQueue(): void {
    this.notificationQueue = [];
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
  }

  // Actualizar configuración
  public updateConfig(newConfig: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Configuración de notificaciones actualizada');
  }

  // Obtener estado del gestor
  public getStatus(): {
    initialized: boolean;
    serviceAvailability: typeof this.serviceAvailability;
    queueSize: number;
    config: NotificationConfig;
  } {
    return {
      initialized: this.initialized,
      serviceAvailability: this.serviceAvailability,
      queueSize: this.notificationQueue.length,
      config: this.config
    };
  }

  // Diagnóstico del sistema
  public async runDiagnostics(): Promise<{
    status: 'healthy' | 'warning' | 'error';
    issues: string[];
    recommendations: string[];
    services: {
      email: boolean;
      push: boolean;
      browser: boolean;
      audio: boolean;
    };
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Verificar servicios
    const serviceAvailability = await freeNotificationService.checkServiceAvailability();
    const audioAvailable = !!this.audioContext;

    // Verificar problemas
    if (!serviceAvailability.email && !serviceAvailability.push && !serviceAvailability.browser) {
      issues.push('Ningún servicio de notificación externa está disponible');
      recommendations.push('Configurar EmailJS o solicitar permisos de notificación');
    }

    if (!serviceAvailability.browser) {
      issues.push('Notificaciones del navegador no disponibles');
      recommendations.push('Solicitar permisos de notificación del navegador');
    }

    if (!serviceAvailability.push) {
      issues.push('Notificaciones push no disponibles');
      recommendations.push('Configurar Firebase Cloud Messaging y VAPID key');
    }

    if (!serviceAvailability.email) {
      issues.push('Servicio de email no disponible');
      recommendations.push('Configurar EmailJS con service ID, template ID y public key');
    }

    if (!audioAvailable && this.config.enableSounds) {
      issues.push('Audio context no disponible');
      recommendations.push('Los sonidos de notificación no funcionarán');
    }

    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    if (issues.length > 0) {
      status = issues.length > 2 ? 'error' : 'warning';
    }

    return {
      status,
      issues,
      recommendations,
      services: {
        email: serviceAvailability.email,
        push: serviceAvailability.push,
        browser: serviceAvailability.browser,
        audio: audioAvailable
      }
    };
  }

  // Cleanup
  public cleanup(): void {
    this.clearQueue();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.initialized = false;
    console.log('🧹 Gestor de notificaciones limpiado');
  }
}

// Instancia global
export const freeNotificationManager = new FreeNotificationManager({
  enableInApp: true,
  enableEmail: true,
  enablePush: true,
  enableBrowser: true,
  enableSounds: true,
  enableBatch: true,
  batchDelay: 1500,
  maxNotifications: 5,
  enableDebounce: true,
  debounceMs: 800,
  autoRequestPermissions: true
});

// Funciones de conveniencia globales
export const showSuccess = (title: string, message: string, options?: { actionUrl?: string; actionLabel?: string; userId?: string }) => 
  freeNotificationManager.success(title, message, options);

export const showError = (title: string, message: string, options?: { actionUrl?: string; actionLabel?: string; userId?: string }) => 
  freeNotificationManager.error(title, message, options);

export const showWarning = (title: string, message: string, options?: { actionUrl?: string; actionLabel?: string; userId?: string }) => 
  freeNotificationManager.warning(title, message, options);

export const showInfo = (title: string, message: string, options?: { actionUrl?: string; actionLabel?: string; userId?: string }) => 
  freeNotificationManager.info(title, message, options);

export const showUrgent = (title: string, message: string, options?: { actionUrl?: string; actionLabel?: string; userId?: string }) => 
  freeNotificationManager.urgent(title, message, options);

// Cleanup automático
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    freeNotificationManager.cleanup();
  });
}