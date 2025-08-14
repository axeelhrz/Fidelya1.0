import { Boom } from '@hapi/boom';

// Importaciones dinámicas para evitar errores de dependencias
import type { WASocket, SocketConfig } from '@whiskeysockets/baileys';
let makeWASocket: (config: SocketConfig) => WASocket;
import type { AuthenticationState } from '@whiskeysockets/baileys';
let multiFileAuthState: (sessionPath: string) => Promise<{ state: AuthenticationState; saveCreds: () => Promise<void>; }>;
import type { DisconnectReason as BaileysDisconnectReason } from '@whiskeysockets/baileys';
let DisconnectReason: typeof BaileysDisconnectReason;

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
  private socket: WASocket | null = null;
  private isConnected = false;
  private config: WhatsAppWebConfig;
  private retryCount = 0;
  private isInitialized = false;

  constructor(config?: Partial<WhatsAppWebConfig>) {
    this.config = {
      sessionPath: './whatsapp-sessions',
      autoReconnect: true,
      maxRetries: 3,
      ...config
    };
  }

  private async loadBaileys() {
    try {
      if (this.isInitialized) return true;

      const baileys = await import('@whiskeysockets/baileys');
      makeWASocket = baileys.default;
      multiFileAuthState = baileys.useMultiFileAuthState;
      DisconnectReason = baileys.DisconnectReason;
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ Error cargando Baileys:', error);
      return false;
    }
  }

  async initialize(): Promise<boolean> {
    try {
      console.log('🔄 Inicializando WhatsApp Web...');
      
      // Cargar Baileys dinámicamente
      const loaded = await this.loadBaileys();
      if (!loaded) {
        console.error('❌ No se pudo cargar Baileys. Instala las dependencias: npm install jimp sharp link-preview-js');
        return false;
      }

      // Configurar autenticación multi-archivo
      const { state, saveCreds } = await multiFileAuthState(this.config.sessionPath);
      
      // Crear socket de WhatsApp
      this.socket = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: {
          level: 'silent',
          trace: () => {},
          debug: () => {},
          info: () => {},
          warn: () => {},
          error: () => {},
          child: () => ({
            level: 'silent',
            trace: () => {},
            debug: () => {},
            info: () => {},
            warn: () => {},
            error: () => {},
            child: () => ({
              level: 'silent',
              trace: () => {},
              debug: () => {},
              info: () => {},
              warn: () => {},
              error: () => {},
              child: () => ({} as any)
            })
          })
        },
        browser: ['Fidelya', 'Chrome', '1.0.0'],
        generateHighQualityLinkPreview: false, // Desactivar para evitar dependencias opcionales
      });

      // Manejar eventos de conexión
      this.socket.ev.on('connection.update', (update: any) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
          console.log('📱 Escanea este QR con WhatsApp:');
          console.log('QR generado - revisa la terminal para escanearlo');
        }
        
        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
          
          console.log('🔌 Conexión cerrada. Reconectar:', shouldReconnect);
          this.isConnected = false;
          
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
      if (!this.isInitialized) {
        const loaded = await this.loadBaileys();
        if (!loaded) {
          return {
            success: false,
            error: 'Baileys no está disponible. Instala las dependencias opcionales.',
            timestamp: new Date()
          };
        }
      }

      if (!this.socket || !this.isConnected) {
        return {
          success: false,
          error: 'WhatsApp Web no está conectado. Ejecuta initialize() primero.',
          timestamp: new Date()
        };
      }

      // Formatear número
      const cleanNumber = to.replace(/\D/g, '');
      const formattedNumber = cleanNumber.includes('@') ? cleanNumber : `${cleanNumber}@s.whatsapp.net`;
      
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
      try {
        await this.socket.logout();
      } catch (error) {
        console.log('Error durante logout:', error);
      }
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 WhatsApp Web desconectado');
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  isAvailable(): boolean {
    return this.isInitialized;
  }

  isConfigured(): boolean {
    // WhatsApp Web is considered "configured" if Baileys can be loaded
    // The actual connection status is handled by isAvailable() and getConnectionStatus()
    return true;
  }
}

export const whatsAppWebService = new WhatsAppWebService();