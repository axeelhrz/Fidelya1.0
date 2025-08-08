import { NextRequest, NextResponse } from 'next/server';

interface WhatsAppRequest {
  to: string;
  message: string;
}

// Función para formatear número de teléfono
function formatPhoneNumber(phone: string): string {
  // Remover todos los caracteres no numéricos
  let cleanPhone = phone.replace(/\D/g, '');
  
  // Si no empieza con código de país, asumir que es de Argentina (+54)
  if (!cleanPhone.startsWith('54') && cleanPhone.length === 10) {
    cleanPhone = '54' + cleanPhone;
  }
  
  // Agregar el prefijo de WhatsApp
  return `whatsapp:+${cleanPhone}`;
}

export async function POST(request: NextRequest) {
  try {
    const { to, message }: WhatsAppRequest = await request.json();

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

    // Formatear número de teléfono
    const formattedTo = formatPhoneNumber(to);
    
    console.log(`📱 API: Enviando WhatsApp a: ${formattedTo}`);
    console.log(`🔧 API: Using Account SID: ${accountSid.substring(0, 8)}...`);
    
    // Crear el cuerpo de la petición para Twilio
    const body = new URLSearchParams({
      From: fromNumber,
      To: formattedTo,
      Body: message
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
        priceUnit: result.price_unit
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