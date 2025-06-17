import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Función para verificar si estamos en fase de compilación o en tiempo de ejecución
function isRuntimeEnvironment() {
  return typeof window === 'undefined' && process.env.NODE_ENV === 'production';
}

// Solo registramos las variables si estamos en tiempo de ejecución, no en build time
if (isRuntimeEnvironment()) {
  console.log('Variables de entorno cargadas en runtime:', {
    GETNET_LOGIN: process.env.GETNET_LOGIN,
    GETNET_SECRET: process.env.GETNET_SECRET?.substring(0, 3) + '...',
    GETNET_BASE_URL: process.env.GETNET_BASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
  });
}
// Durante la compilación no mostraremos estos valores

export async function POST(req: NextRequest) {
  try {
    // 1. Extraer datos de la solicitud
    const { transactionId, montoTotal, orderData } = await req.json()
    console.log('Solicitud de pago recibida:', { transactionId, montoTotal, orderDataPresent: !!orderData })

    // 2. Verificar variables de entorno
    if (!process.env.GETNET_LOGIN || !process.env.GETNET_SECRET || !process.env.GETNET_BASE_URL || !process.env.NEXT_PUBLIC_APP_URL) {
      console.error('Variables de entorno faltantes:', { 
        login: !!process.env.GETNET_LOGIN, 
        secret: !!process.env.GETNET_SECRET,
        baseUrl: !!process.env.GETNET_BASE_URL,
        appUrl: !!process.env.NEXT_PUBLIC_APP_URL
      })
      return NextResponse.json({
        error: 'Configuración de GetNet incompleta',
        missingVars: {
          login: !process.env.GETNET_LOGIN,
          secret: !process.env.GETNET_SECRET,
          baseUrl: !process.env.GETNET_BASE_URL,
          appUrl: !process.env.NEXT_PUBLIC_APP_URL
        }
      }, { status: 500 })
    }

    // 3. Generar credenciales de autenticación exactamente como lo indica GetNet
    
    // Credenciales
    const login = process.env.GETNET_LOGIN || '';
    const secretKey = process.env.GETNET_SECRET || '';
    
    console.log('Credenciales:', { 
      login, 
      secretKeyLength: secretKey.length,
      secretKeyStart: secretKey.substring(0, 3) + '...' 
    });
    
    // Generar seed con formato ISO-8601 en UTC exacto sin manipulaciones
    // IMPORTANTE: Usando el tiempo exacto actual, siguiendo requerimientos de GetNet
    const seedDate = new Date();
    
    // Usar formato ISO completo con UTC (Z) sin manipular offsetes manualmente
    // GetNet compara contra UTC, no contra hora local de Chile
    const seed = seedDate.toISOString();
    
    // Debug de tiempo para diagnóstico
    console.log('⏰ Diagnóstico de tiempo:');
    console.log('- Seed enviado a GetNet (UTC):', seed);
    console.log('- Formato correcto según GetNet: ISO-8601 con Z');
    console.log('- Sin manipulaciones manuales ni offsetes estáticos');
    console.log('- Hora actual del sistema:', new Date().toISOString());
    
    // Generar nonce como bytes aleatorios y luego Base64
    const rawNonce = crypto.randomBytes(16);
    const nonce = rawNonce.toString('base64');
    
    // Generar tranKey concatenando rawNonce, seed y secretKey, luego SHA-256 y Base64
    const hash = crypto.createHash('sha256')
      .update(Buffer.concat([rawNonce, Buffer.from(seed), Buffer.from(secretKey)]))
      .digest();
    const tranKey = hash.toString('base64');
    
    // Imprimir datos de autenticación para depuración
    console.log('Datos de autenticación:', {
      login,
      seed,
      nonce: nonce.substring(0, 10) + '...',
      tranKeyLength: tranKey.length
    });

    // 4. Construir carga útil
    const payload = {
      auth: { login, tranKey, nonce, seed },
      payment: {
        reference: transactionId,
        description: `Pedido Casino TX ${transactionId}`,
        amount: { currency: 'CLP', total: montoTotal }
      },
      // Fecha de expiración coherente con el seed: formato ISO en UTC
      // 15 minutos desde el momento actual, sin manipulaciones manuales
      expiration: new Date(seedDate.getTime() + 15 * 60 * 1000).toISOString(), // 15 minutos en formato UTC
      // Añadimos parámetros a la URL de retorno para identificar la transacción
      // El requestId será agregado automáticamente por GetNet a la URL
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/result?transactionId=${transactionId}`,
      // Omitir pantalla de resultado y redirigir directamente a returnUrl
      skipResult: true,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent'),
      // Añadir configuración adicional que podría requerir GetNet
      locale: 'es_CL'
    }

    console.log('Enviando solicitud a GetNet:', {
      url: `${process.env.GETNET_BASE_URL}/api/session/`,
      payload
    })

    // 5. Enviar solicitud a GetNet
    // Asegurarnos de que la URL está bien formada
    if (!process.env.GETNET_BASE_URL) {
      throw new Error('URL base de GetNet no disponible')
    }
    
    const getnetApiUrl = `${process.env.GETNET_BASE_URL}/api/session/`
    console.log('URL completa de API GetNet:', getnetApiUrl)
    
    const response = await fetch(
      getnetApiUrl,
      { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify(payload) 
      }
    )

    // 6. Procesar respuesta
    const responseText = await response.text()
    console.log('Respuesta raw de GetNet:', responseText)
    
    // Intentar parsear como JSON si es posible
    let data
    try {
      data = JSON.parse(responseText)
      console.log('Respuesta JSON de GetNet:', data)
    } catch (parseError) {
      console.error('No se pudo parsear la respuesta como JSON:', parseError)
      return NextResponse.json({ 
        error: 'Respuesta no válida de GetNet', 
        responseText 
      }, { status: 500 })
    }
    
    // Verificar si hay error
    if (!response.ok) {
      // Extraer mensaje de error de manera segura
      let errorMessage = 'Error en la API de GetNet';
      
      try {
        if (data.status && data.status.status) {
          errorMessage = `GetNet status: ${data.status.status}`;
        } else if (data.error) {
          errorMessage = typeof data.error === 'string'
            ? data.error
            : JSON.stringify(data.error);
        } else if (data.message) {
          errorMessage = data.message;
        }
      } catch (e) {
        console.error('Error al procesar mensaje de error:', e);
      }
      
      console.error('Error en respuesta de GetNet:', JSON.stringify(data, null, 2));
      
      return NextResponse.json({ 
        error: errorMessage,
        statusCode: response.status,
        statusText: response.statusText
      }, { status: response.status });
    }
    
    // 7. Validar datos recibidos
    if (!data.processUrl) {
      console.error('Respuesta de GetNet no contiene processUrl:', data)
      
      // Devolver toda la respuesta para depuración
      return NextResponse.json({ 
        error: 'Respuesta inválida de GetNet', 
        data, 
        responseStatus: response.status,
        responseStatusText: response.statusText
      }, { status: 200 })
    }

    // 8. Guardamos los datos del pedido en localStorage en el cliente
    // En vez de usar supabase directamente, lo manejaremos desde el webhook 
    // con una implementación posterior
    if (orderData && Array.isArray(orderData) && orderData.length > 0) {
      console.log(`Recibidos ${orderData.length} registros de pedido para transaction_id: ${transactionId}`);
      // No hacemos nada en el servidor con estos datos por ahora
      // Para debugging
      console.log('Los datos del pedido serán procesados por el webhook cuando reciba la notificación de GetNet');
    } else {
      console.warn('No se recibieron datos de pedido');
    }
    
    // 9. Devolver resultado
    // Devolver processUrl, requestId y el returnUrl que debe usar el Lightbox
    const result = {
      processUrl: data.processUrl,
      requestId: data.requestId,
      originalTransactionId: transactionId,
      // Instrucción para el Lightbox: returnUrl con ambos parámetros y skipResult
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/result?transactionId=${transactionId}&requestId=${data.requestId}`,
      skipResult: true
    }
    return NextResponse.json(result)
  } catch (e: any) {
    console.error("Error completo de GetNet CREATE:", e)
    return NextResponse.json({ 
      error: e.message || 'Error al procesar la solicitud de pago' 
    }, { status: 500 })
  }
}
