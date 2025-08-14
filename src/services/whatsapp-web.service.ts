import { Boom } from '@hapi/boom';
import makeWASocket, { 
  ConnectionState, 
  DisconnectReason, 
  useMultiFileAuthState,
  WAMessage,
  proto
} from '@whiskeysockets/baileys';
import { join } from 'path';

interface WhatsAppWebConfig {
  sessionPath: string;
  autoReconnect: boolean;
  maxRetries: number;
}

interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: Date;
}

class WhatsAppWebService {
  private socket: ReturnType<typeof makeWASocket> | null = null;
  private isConnected = false;
  private config: WhatsAppWebConfig;
  private retryCount = 0;

  constructor(config?: Partial<WhatsAppWebConfig>) {
    this.config = {
      sessionPath: join(process.cwd(), 'whatsapp-sessions'),
      autoReconnect: true,
      maxRetries: 3,
      ...config
    };
  }

  async initialize(): Promise<boolean> {
    try {
      console.log('🔄 Inicializando WhatsApp Web...');
      
      // Configurar autenticación multi-archivo
      const { state, saveCreds } = await useMultiFileAuthState(this.config.sessionPath);
      
      // Crear socket de WhatsApp
      this.socket = makeWASocket({
        auth: state,
        printQRInTerminal: true, // Mostrar QR en terminal para escanear
        logger: {
          level: 'silent', // Reducir logs
          child: () => ({ level: 'silent' } as any)
        } as any
      });

      // Manejar eventos de conexión
      this.socket.ev.on('connection.update', (update: Partial<ConnectionState>) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
          console.log('📱 Escanea este QR con WhatsApp Web:');
          console.log(qr);
        }
        
        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
          
          console.log('🔌 Conexión cerrada. Reconectar:', shouldReconnect);
          
          if (shouldReconnect && this.config.autoReconnect && this.retryCount < this.config.maxRetries) {
            this.retryCount++;
            setTimeout(() => this.initialize(), 5000);
          }
        } else if (connection === 'open') {
          console.log('✅ WhatsApp Web conectado exitosamente!');
          this.isConnected = true;
          this.retryCount = 0;
        }
      });

      // Guardar credenciales cuando cambien
      this.socket.ev.on('creds.update', saveCreds);

      return true;
    } catch (error) {
      console.error('❌ Error inicializando WhatsApp Web:', error);
      return false;
    }
  }

  async sendMessage(to: string, message: string, title?: string): Promise<SendMessageResult> {
    try {
      if (!this.socket || !this.isConnected) {
        return {
          success: false,
          error: 'WhatsApp Web no está conectado',
          timestamp: new Date()
        };
      }

      // Formatear número (agregar @s.whatsapp.net si no lo tiene)
      const formattedNumber = to.includes('@') ? to : `${to.replace(/\D/g, '')}@s.whatsapp.net`;
      
      // Formatear mensaje con branding
      const formattedMessage = title 
        ? `🚀 *FIDELYA* 🚀\n\n*${title}*\n\n${message}\n\n━━━━━━━━━━━━━━━━━━━━\n📱 *Fidelya* - Tu plataforma de fidelización\n🌐 www.fidelya.com`
        : `🚀 *FIDELYA*\n\n${message}\n\n━━━━━━━━━━━━━━━━━━━━\n📱 *Fidelya* - Tu plataforma de fidelización`;

      // Enviar mensaje
      const sentMessage = await this.socket.sendMessage(formattedNumber, {
        text: formattedMessage
      });

      console.log('✅ Mensaje enviado via WhatsApp Web:', sentMessage?.key?.id);

      return {
        success: true,
        messageId: sentMessage?.key?.id || `wa_${Date.now()}`,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('❌ Error enviando mensaje WhatsApp Web:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date()
      };
    }
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      await this.socket.logout();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 WhatsApp Web desconectado');
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const whatsAppWebService = new WhatsAppWebService();
