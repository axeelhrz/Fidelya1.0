import { NextRequest, NextResponse } from 'next/server'
import { GetNetPaymentRequest, GetNetPaymentResponse } from '@/services/paymentService'

// Configuración de GetNet corregida
const GETNET_CONFIG = {
  // GetNet Chile usa diferentes endpoints según el ambiente
  apiUrl: process.env.GETNET_BASE_URL || 'https://api.getnet.cl',
  testApiUrl: 'https://api-test.getnet.cl',
  login: process.env.GETNET_LOGIN || '',
  secret: process.env.GETNET_SECRET || '',
  environment: process.env.GETNET_ENVIRONMENT || 'test'
}

export async function POST(request: NextRequest) {
  try {
    const body: GetNetPaymentRequest = await request.json()
    
    console.log('Creating GetNet payment:', body)

    // Validar datos requeridos
    if (!body.amount || !body.orderId || !body.customerEmail) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos incompletos: amount, orderId y customerEmail son requeridos' 
        },
        { status: 400 }
      )
    }

    // Validar configuración de GetNet
    if (!GETNET_CONFIG.login || !GETNET_CONFIG.secret) {
      console.error('GetNet configuration missing:', {
        hasLogin: !!GETNET_CONFIG.login,
        hasSecret: !!GETNET_CONFIG.secret,
        environment: GETNET_CONFIG.environment
      })
      return NextResponse.json(
        { 
          success: false, 
          error: 'Configuración de pago no disponible' 
        },
        { status: 500 }
      )
    }

    // Determinar URL de API según el ambiente
    const baseUrl = GETNET_CONFIG.environment === 'production' 
      ? GETNET_CONFIG.apiUrl 
      : GETNET_CONFIG.testApiUrl

    // Preparar datos para GetNet según su API - CORREGIDO
    const getNetPayload = {
      merchant_id: GETNET_CONFIG.login,
      amount: Math.round(body.amount), // Asegurar que sea entero
      currency: 'CLP',
      order_id: body.orderId,
      description: body.description || `Pedido Casino Escolar #${body.orderId}`,
      customer: {
        email: body.customerEmail,
        name: body.customerName || body.customerEmail.split('@')[0]
      },
      urls: {
        return_url: body.returnUrl || `${request.nextUrl.origin}/payment/return`,
        notify_url: body.notifyUrl || `${request.nextUrl.origin}/api/payment/notify`,
        cancel_url: `${request.nextUrl.origin}/mi-pedido?cancelled=true`
      }
    }

    // Generar firma según documentación de GetNet
    const signature = generateGetNetSignature(getNetPayload, GETNET_CONFIG.secret)
    getNetPayload.signature = signature

    console.log('GetNet payload prepared:', { 
      ...getNetPayload, 
      signature: '[HIDDEN]',
      endpoint: `${baseUrl}/v1/payments/create`
    })

    // Llamar a la API de GetNet - ENDPOINT CORREGIDO
    const getNetResponse = await fetch(`${baseUrl}/v1/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'CasinoEscolar/1.0',
        'Authorization': `Bearer ${GETNET_CONFIG.login}` // Algunos proveedores requieren esto
      },
      body: JSON.stringify(getNetPayload)
    })

    let getNetData
    try {
      getNetData = await getNetResponse.json()
    } catch (parseError) {
      console.error('Error parsing GetNet response:', parseError)
      const responseText = await getNetResponse.text()
      console.error('Raw GetNet response:', responseText)
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Error en la respuesta del proveedor de pagos (${getNetResponse.status})` 
        },
        { status: 500 }
      )
    }
    
    console.log('GetNet API response:', {
      status: getNetResponse.status,
      statusText: getNetResponse.statusText,
      data: getNetData
    })

    if (!getNetResponse.ok) {
      // Manejar diferentes tipos de errores de GetNet
      let errorMessage = 'Error del proveedor de pagos'
      
      if (getNetResponse.status === 404) {
        errorMessage = 'Servicio de pagos no disponible temporalmente'
      } else if (getNetResponse.status === 401) {
        errorMessage = 'Error de autenticación con el proveedor de pagos'
      } else if (getNetResponse.status === 400) {
        errorMessage = getNetData?.message || 'Datos de pago inválidos'
      } else if (getNetData?.message) {
        errorMessage = getNetData.message
      }

      throw new Error(`${errorMessage} (${getNetResponse.status})`)
    }

    // Procesar respuesta exitosa de GetNet - MEJORADO
    if (getNetData.success === true || getNetData.status === 'created' || getNetData.payment_url) {
      const response: GetNetPaymentResponse = {
        success: true,
        paymentId: getNetData.payment_id || getNetData.transaction_id || getNetData.id || body.orderId,
        redirectUrl: getNetData.payment_url || getNetData.redirect_url || getNetData.checkout_url,
        transactionId: getNetData.transaction_id || getNetData.id
      }

      console.log('GetNet payment created successfully:', response)
      return NextResponse.json(response)
    } else {
      // Si la respuesta no indica éxito claramente
      throw new Error(getNetData.error || getNetData.message || 'Respuesta inesperada del proveedor de pagos')
    }

  } catch (error) {
    console.error('Error creating GetNet payment:', error)
    
    // Proporcionar mensaje de error más específico
    let errorMessage = 'Error interno del servidor'
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        errorMessage = 'No se pudo conectar con el proveedor de pagos'
      } else if (error.message.includes('404')) {
        errorMessage = 'Servicio de pagos no disponible. Por favor, intenta más tarde.'
      } else if (error.message.includes('401')) {
        errorMessage = 'Error de configuración del sistema de pagos'
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: 500 }
    )
  }
}

// Función mejorada para generar firma HMAC según documentación de GetNet
function generateGetNetSignature(payload: any, secret: string): string {
  try {
    const crypto = require('crypto')
    
    // Crear string para firmar según documentación de GetNet Chile
    // Formato típico: merchant_id + amount + currency + order_id + secret
    const stringToSign = [
      payload.merchant_id,
      payload.amount.toString(),
      payload.currency,
      payload.order_id,
      secret
    ].join('|') // Usar pipe como separador

    // Generar HMAC-SHA256
    const signature = crypto
      .createHmac('sha256', secret)
      .update(stringToSign, 'utf8')
      .digest('hex')

    console.log('Generated signature for GetNet (string length):', stringToSign.length)
    return signature
  } catch (error) {
    console.error('Error generating GetNet signature:', error)
    throw new Error('Error al generar firma de seguridad')
  }
}

// Manejar otros métodos HTTP
export async function GET() {
  return NextResponse.json(
    { error: 'Método no permitido' },
    { status: 405 }
  )
}