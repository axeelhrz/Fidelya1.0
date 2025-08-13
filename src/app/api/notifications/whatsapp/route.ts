import { NextRequest, NextResponse } from 'next/server';

interface WhatsAppRequest {
  to: string;
  message: string;
  title?: string;
}

// Función para formatear número de teléfono
function formatPhoneNumber(phone: string): string {
  // Remover todos los caracteres no numéricos excepto el + inicial
  let cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Si empieza con +, remover el + para trabajar solo con números
  if (cleanPhone.startsWith('+')) {
    cleanPhone = cleanPhone.substring(1);
  }
  
  // Casos específicos para Argentina
  if (cleanPhone.startsWith('54')) {
    // Ya tiene código de país argentino, usar tal como está
    return `whatsapp:+${cleanPhone}`;
  }
  
  // Si empieza con 9 y tiene 11 dígitos, probablemente es argentino sin código de país
  if (cleanPhone.startsWith('9') && cleanPhone.length === 11) {
    return `whatsapp:+54${cleanPhone}`;
  }
  
  // Si tiene 10 dígitos y no empieza con código de país, asumir Argentina
  if (cleanPhone.length === 10 && !cleanPhone.startsWith('54')) {
    return `whatsapp:+54${cleanPhone}`;
  }
  
  // Para Uruguay (código +598)
  if (cleanPhone.startsWith('598')) {
    return `whatsapp:+${cleanPhone}`;
  }
  
  // Si no empieza con código de país y tiene 8-9 dígitos, podría ser Uruguay
  if (cleanPhone.length >= 8 && cleanPhone.length <= 9 && !cleanPhone.startsWith('54') && !cleanPhone.startsWith('598')) {
    return `whatsapp:+598${cleanPhone}`;
  }
  
  // Si ya tiene un código de país válido (más de 10 dígitos), usar tal como está
  if (cleanPhone.length > 10) {
    return `whatsapp:+${cleanPhone}`;
  }
  
  // Caso por defecto: asumir Argentina si no se puede determinar
  return `whatsapp:+54${cleanPhone}`;
}

// Función para formatear el mensaje con branding de Fidelya
function formatFidelyaMessage(title: string, message: string): string {
  const header = "🚀 *FIDELYA* 🚀";
  const separator = "━━━━━━━━━━━━━━━━━━━━";
  const footer = `${separator}\n📱 *Fidelya* - Tu plataforma de fidelización\n🌐 www.fidelya.com`;
  
  return `${header}\n\n*${title}*\n\n${message}\n\n${footer}`;
}

export async function POST(request: NextRequest) {
  try {
    const { to, message, title }: WhatsAppRequest = await request.json();

    // Verificar credenciales
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

    if (!accountSid || !authToken) {
      console.error('🚫 Twilio credentials not found in environment variables');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Twilio WhatsApp credentials not configured',
          debug: {
            accountSid: accountSid ? 'Present' : 'Missing',
            authToken: authToken ? 'Present' : 'Missing'
          }
        },
        { status: 500 }
      );
    }

    // Formatear número de teléfono con logging mejorado
    const formattedTo = formatPhoneNumber(to);
    
    console.log(`📱 API: Número original: ${to}`);
    console.log(`📱 API: Número formateado: ${formattedTo}`);
    
    // Formatear mensaje con branding de Fidelya
    const formattedMessage = title 
      ? formatFidelyaMessage(title, message)
      : `🚀 *FIDELYA*\n\n${message}\n\n━━━━━━━━━━━━━━━━━━━━\n📱 *Fidelya* - Tu plataforma de fidelización`;
    
    console.log(`📱 API: Enviando WhatsApp a: ${formattedTo}`);
    console.log(`🔧 API: Using Account SID: ${accountSid.substring(0, 8)}...`);
    console.log(`📝 API: Mensaje formateado con branding Fidelya`);
    
    // Crear el cuerpo de la petición para Twilio
    const body = new URLSearchParams({
      From: fromNumber,
      To: formattedTo,
      Body: formattedMessage
    });

    // Crear la autorización básica para Twilio
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    // Enviar mensaje usando Twilio API
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
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
      console.log(`✅ API: WhatsApp enviado exitosamente. SID: ${result.sid}`);
      console.log(`📊 API: Estado: ${result.status}, Precio: ${result.price} ${result.price_unit}`);
      
      return NextResponse.json({
        success: true,
        sid: result.sid,
        status: result.status,
        price: result.price,
        priceUnit: result.price_unit,
        formattedMessage: formattedMessage
      });
    } else {
      const error = await response.json();
      console.error('❌ API: Error Twilio WhatsApp:', error);
      
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Unknown Twilio error',
          code: error.code,
          details: error
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('💥 API: Error crítico enviando WhatsApp:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}