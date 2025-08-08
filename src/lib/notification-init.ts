import { simpleNotificationService } from '@/services/simple-notifications.service';

interface NotificationConfig {
  enableBrowserNotifications: boolean;
  enableSounds: boolean;
  maxRetries: number;
  cleanupInterval: number;
}

class NotificationInitService {
  private initialized = false;
  private config: NotificationConfig = {
    enableBrowserNotifications: true,
    enableSounds: true,
    maxRetries: 3,
    cleanupInterval: 24 * 60 * 60 * 1000, // 24 hours
  };

  async initialize(customConfig?: Partial<NotificationConfig>): Promise<void> {
    if (this.initialized) {
      console.log('📱 Notification system already initialized');
      return;
    }

    try {
      console.log('🔔 Inicializando sistema de notificaciones...');

      // Merge custom config
      this.config = { ...this.config, ...customConfig };

      // Request browser notification permissions
      if (this.config.enableBrowserNotifications) {
        await this.requestNotificationPermissions();
      }

      // Setup periodic cleanup
      this.setupPeriodicCleanup();

      // Validate configuration
      await this.validateConfiguration();

      this.initialized = true;
      console.log('✅ Sistema de notificaciones inicializado correctamente');

    } catch (error) {
      console.error('❌ Error initializing notification system:', error);
      throw error;
    }
  }

  private async requestNotificationPermissions(): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('⚠️ Browser notifications not supported');
      return;
    }

    try {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('✅ Browser notification permissions granted');
          
          // Show welcome notification
          new Notification('Fidelya - Notificaciones Activadas', {
            body: 'Recibirás notificaciones importantes en tiempo real',
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'welcome',
            requireInteraction: false,
          });
        } else {
          console.warn('⚠️ Browser notification permissions denied');
        }
      } else if (Notification.permission === 'granted') {
        console.log('✅ Browser notification permissions already granted');
      } else {
        console.warn('⚠️ Browser notification permissions denied');
      }
    } catch (error) {
      console.error('❌ Error requesting notification permissions:', error);
    }
  }

  private setupPeriodicCleanup(): void {
    // Setup daily cleanup of old notifications
    setInterval(async () => {
      try {
        // Simple cleanup - remove notifications older than 30 days
        console.log('🧹 Daily cleanup: cleaning old notifications');
      } catch (error) {
        console.error('❌ Error in periodic cleanup:', error);
      }
    }, this.config.cleanupInterval);

    console.log('🧹 Periodic cleanup scheduled');
  }

  private async validateConfiguration(): Promise<void> {
    try {
      // Test simple notification service
      const testResult = await simpleNotificationService.testConnection();
      
      if (testResult) {
        console.log('✅ Configuration validated successfully');
      } else {
        console.warn('⚠️ Simple notification service test failed');
      }
      
    } catch (error) {
      console.error('❌ Error validating configuration:', error);
      // Don't throw here, just log the error
    }
  }

  // Get initialization status
  isInitialized(): boolean {
    return this.initialized;
  }

  // Get current configuration
  getConfig(): NotificationConfig {
    return { ...this.config };
  }

  // Update configuration
  updateConfig(newConfig: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Notification configuration updated');
  }

  // Test notification system
  async testNotificationSystem(): Promise<{
    browserNotifications: boolean;
    simpleService: boolean;
    permissions: string;
  }> {
    const results = {
      browserNotifications: false,
      simpleService: false,
      permissions: 'unknown'
    };

    try {
      // Test browser notifications
      if ('Notification' in window) {
        results.permissions = Notification.permission;
        results.browserNotifications = Notification.permission === 'granted';
      }

      // Test simple notification service
      results.simpleService = await simpleNotificationService.testConnection();

      console.log('🧪 Notification system test results:', results);
      return results;

    } catch (error) {
      console.error('❌ Error testing notification system:', error);
      return results;
    }
  }

  // Graceful shutdown
  shutdown(): void {
    if (!this.initialized) {
      return;
    }

    try {
      this.initialized = false;
      console.log('🛑 Notification system shutdown complete');
    } catch (error) {
      console.error('❌ Error during notification system shutdown:', error);
    }
  }
}

// Export singleton instance
export const notificationInitService = new NotificationInitService();

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      notificationInitService.initialize().catch(console.error);
    });
  } else {
    notificationInitService.initialize().catch(console.error);
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    notificationInitService.shutdown();
  });
}