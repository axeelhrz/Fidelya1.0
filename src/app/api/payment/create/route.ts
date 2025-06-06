import { NextRequest, NextResponse } from 'next/server'
import { GetNetPaymentRequest, GetNetPaymentResponse } from '@/services/paymentService'

// Configuración de GetNet desde variables de entorno
const GETNET_CONFIG = {
  apiUrl: process.env.GETNET_BASE_URL || 'https://checkout.test.getnet.cl',
  login: process.env.GETNET_LOGIN || '',
  secret: process.env.GETNET_SECRET || '',
  environment: process.env.GETNET_ENVIRONMENT || 'test' // 'test' o 'production'
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
        apiUrl: GETNET_CONFIG.apiUrl
      })
      return NextResponse.json(
        { 
          success: false, 
          error: 'Configuración de pago no disponible' 
        },
        { status: 500 }
      )
    }

    // Preparar datos para GetNet según su API - CORREGIDO
    const getNetPayload = {
      login: GETNET_CONFIG.login,
      amount: body.amount,
      order_id: body.orderId,
      description: body.description || `Pedido Casino Escolar #${body.orderId}`,
      customer_email: body.customerEmail,
      customer_name: body.customerName || body.customerEmail.split('@')[0], // Extraer nombre del email si no se proporciona
      return_url: body.returnUrl || `${request.nextUrl.origin}/payment/return`,
      notify_url: body.notifyUrl || `${request.nextUrl.origin}/api/payment/notify`,
      currency: 'CLP'
    }

    // Generar firma (implementar según documentación de GetNet)
    const signature = generateGetNetSignature(getNetPayload, GETNET_CONFIG.secret)
    getNetPayload.signature = signature

    console.log('GetNet payload prepared:', { ...getNetPayload, signature: '[HIDDEN]' })

    // Llamar a la API de GetNet - ENDPOINT CORREGIDO
    const getNetResponse = await fetch(`${GETNET_CONFIG.apiUrl}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'CasinoEscolar/1.0'
      },
      body: JSON.stringify(getNetPayload)
    })

    const getNetData = await getNetResponse.json()
    
    console.log('GetNet API response:', getNetData)

    if (!getNetResponse.ok) {
      throw new Error(getNetData.message || `GetNet API error: ${getNetResponse.status}`)
    }

    // Procesar respuesta exitosa de GetNet - MEJORADO
    if (getNetData.success || getNetData.status === 'success') {
      const response: GetNetPaymentResponse = {
        success: true,
        paymentId: getNetData.payment_id || getNetData.transaction_id || getNetData.id,
        redirectUrl: getNetData.payment_url || getNetData.redirect_url || getNetData.url,
        transactionId: getNetData.transaction_id || getNetData.id
      }

      console.log('GetNet payment created successfully:', response)
      return NextResponse.json(response)
    } else {
      throw new Error(getNetData.error || getNetData.message || 'Error en la respuesta de GetNet')
    }

  } catch (error) {
    console.error('Error creating GetNet payment:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    )
  }
}

// Función para generar firma HMAC según documentación de GetNet
function generateGetNetSignature(payload: any, secret: string): string {
  try {
    const crypto = require('crypto')
    
    // Crear string para firmar según documentación de GetNet
    // Típicamente es: login + amount + order_id + currency + secret
    const stringToSign = [
      payload.login,
      payload.amount,
      payload.order_id,
      payload.currency || 'CLP',
      secret
    ].join('')

    // Generar HMAC-SHA256
    const signature = crypto
      .createHmac('sha256', secret)
      .update(stringToSign)
      .digest('hex')

    console.log('Generated signature for GetNet')
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