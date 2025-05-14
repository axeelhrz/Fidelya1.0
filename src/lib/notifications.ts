interface Message {
    id: string;
    content: string;
    sender?: {
        photoURL?: string;
    };
}

interface ContactRequest {
    id: string;
    fromUserName: string;
    fromUserPhoto?: string;
}

export class NotificationService {
    private static instance: NotificationService;
    private audio: HTMLAudioElement | null = null;
  
    private constructor() {
      if (typeof window !== 'undefined') {
        this.audio = new Audio('/sounds/notification.mp3');
        this.requestPermission();
      }
    }
  
    static getInstance(): NotificationService {
      if (!NotificationService.instance) {
        NotificationService.instance = new NotificationService();
      }
      return NotificationService.instance;
    }
  
    async requestPermission(): Promise<void> {
      if (!('Notification' in window)) {
        console.log('Este navegador no soporta notificaciones de escritorio');
        return;
      }
  
      if (Notification.permission !== 'granted') {
        try {
          const permission = await Notification.requestPermission();
          console.log('Permiso de notificación:', permission);
        } catch (error) {
          console.error('Error al solicitar permiso de notificación:', error);
        }
      }
    }
  
    async playNotificationSound(): Promise<void> {
      try {
        if (this.audio) {
          this.audio.currentTime = 0;
          await this.audio.play();
        }
      } catch (error) {
        console.error('Error al reproducir sonido de notificación:', error);
      }
    }
  
    async showNotification(title: string, options: NotificationOptions): Promise<void> {
      if (Notification.permission === 'granted') {
        try {
          await this.playNotificationSound();
          new Notification(title, options);
        } catch (error) {
          console.error('Error al mostrar notificación:', error);
        }
      }
    }
  
    // Método para manejar notificaciones de mensajes
    async notifyNewMessage(message: Message): Promise<void> {
      await this.showNotification('Nuevo mensaje', {
        body: message.content,
        icon: message.sender?.photoURL || '/images/default-avatar.png',
        badge: '/images/notification-badge.png',
        tag: `message-${message.id}`,
        requireInteraction: false,
        silent: false,
      });
    }
  
    // Método para manejar notificaciones de solicitudes
    async notifyNewRequest(request: ContactRequest): Promise<void> {
        await this.showNotification('Nueva solicitud de contacto', {
          body: `${request.fromUserName} quiere conectar contigo`,
          icon: request.fromUserPhoto || '/images/default-avatar.png',
          badge: '/images/notification-badge.png',
          tag: `request-${request.id}`,
          requireInteraction: true,
          silent: false,
        });
    }
  }
  
  export const notificationService = NotificationService.getInstance();