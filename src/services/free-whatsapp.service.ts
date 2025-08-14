import { whatsAppWebService } from './whatsapp-web.service';
import { callMeBotService } from './callmebot.service';
import { greenAPIService } from './green-api.service';

interface WhatsAppProvider {
  name: string;
  service: any;
  isConfigured: () => boolean;
  priority: number;
  cost: 'free' | 'paid';
  limitations?: string;
}

interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider?: string;
  timestamp: Date;
  fallbackUsed?: boolean;
}

class FreeWhatsAppService {
  private providers: WhatsAppProvider[] = [
    {
      name: 'WhatsApp Web (Baileys)',
      service: whatsAppWebService,
      isConfigured: () => true, // Siempre disponible
      priority: 1,
      cost: 'free',
      limitations: 'Requiere escanear QR una vez'
    },
    {
      name: 'Green API',
      service: greenAPIService,
      isConfigured: () => greenAPIService.isConfigured(),
      priority: 2,
      cost: 'free',
      limitations: '3000 mensajes gratis/mes'
    },
    {
      name: 'CallMeBot',
      service: callMeBotService,
      isConfigured: () => callMeBotService.isConfigured(),
      priority: 3,
      cost: 'free',
      limitations: 'Limitado a números registrados'
    }
  ];

  async sendMessage(to: string, message: string, title?: string): Promise<SendResult> {
    console.log('🚀 Iniciando envío con proveedores gratuitos...');
    
    // Ordenar proveedores por prioridad y disponibilidad
    const availableProviders = this.providers
      .filter(p => p.isConfigured())
      .sort((a, b) => a.priority - b.priority);

    if (availableProviders.length === 0) {
      return {
        success: false,
        error: 'No hay proveedores de WhatsApp configurados',
        timestamp: new Date()
      };
    }

    console.log(`📋 Proveedores disponibles: ${availableProviders.map(p => p.name).join(', ')}`);

    // Intentar con cada proveedor hasta que uno funcione
    for (let i = 0; i < availableProviders.length; i++) {
      const provider = availableProviders[i];
      
      try {
        console.log(`🔄 Intentando con ${provider.name}...`);
        
        const result = await provider.service.sendMessage(to, message, title);
        
        if (result.success) {
          console.log(`✅ Mensaje enviado exitosamente con ${provider.name}`);
          return {
            ...result,
            provider: provider.name,
            fallbackUsed: i > 0
          };
        } else {
          console.log(`❌ Falló ${provider.name}: ${result.error}`);
          
          // Si no es el último proveedor, continuar con el siguiente
          if (i < availableProviders.length - 1) {
            console.log(`🔄 Intentando con siguiente proveedor...`);
            continue;
          }
        }
      } catch (error) {
        console.error(`💥 Error con ${provider.name}:`, error);
        
        // Si no es el último proveedor, continuar con el siguiente
        if (i < availableProviders.length - 1) {
          continue;
        }
      }
    }

    // Si llegamos aquí, todos los proveedores fallaron
    return {
      success: false,
      error: 'Todos los proveedores de WhatsApp fallaron',
      timestamp: new Date()
    };
  }

  async getAvailableProviders(): Promise<Array<{
    name: string;
    configured: boolean;
    cost: string;
    limitations?: string;
    status?: string;
  }>> {
    const results = [];
    
    for (const provider of this.providers) {
      const configured = provider.isConfigured();
      let status = 'unknown';
      
      // Verificar estado específico para algunos proveedores
      if (configured && provider.name === 'Green API') {
        try {
          const statusResult = await greenAPIService.getInstanceStatus();
          status = statusResult.status;
        } catch (error) {
          status = 'error';
        }
      } else if (configured && provider.name === 'WhatsApp Web (Baileys)') {
        status = whatsAppWebService.getConnectionStatus() ? 'connected' : 'disconnected';
      }
      
      results.push({
        name: provider.name,
        configured,
        cost: provider.cost,
        limitations: provider.limitations,
        status: configured ? status : 'not_configured'
      });
    }
    
    return results;
  }

  async initializeWhatsAppWeb(): Promise<boolean> {
    return await whatsAppWebService.initialize();
  }

  async disconnectWhatsAppWeb(): Promise<void> {
    await whatsAppWebService.disconnect();
  }
}

export const freeWhatsAppService = new FreeWhatsAppService();
