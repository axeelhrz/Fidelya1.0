import { NextRequest, NextResponse } from 'next/server'
import { GetNetPaymentRequest, GetNetPaymentResponse } from '@/services/paymentService'
import * as crypto from 'crypto'

// Configuración de GetNet corregida
const GETNET_CONFIG = {
  apiUrl: process.env.GETNET_BASE_URL || 'https://checkout.getnet.cl',
  testApiUrl: 'https://checkout.test.getnet.cl',
  login: process.env.GETNET_LOGIN || '',
  secret: process.env.GETNET_SECRET || '',
  environment: process.env.GETNET_ENVIRONMENT || 'test'
}

// Interface para el payload de GetNet Web Checkout según manual oficial
interface GetNetWebCheckoutPayload {
  locale: string
  buyer: {
    name: string
    surname: string
    email: string
    document: string
    documentType: string
    mobile: string
  }
  payment: {
    reference: string
    description: string
    amount: {
      currency: string
      total: number
    }
  }
  expiration: string // ISO8601 format
  ipAddress: string
  userAgent: string
  returnUrl: string
  cancelUrl: string
  notifyUrl: string
}

// Interface para la autenticación de GetNet
interface GetNetAuth {
  login: string
  tranKey: string
  nonce: string
  seed: string
}

// Interface para la respuesta de GetNet
interface GetNetSessionResponse {
  status: {
    status: string
    message: string
    reason?: string
    date?: string
  }
  requestId?: string
  processUrl?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GetNetPaymentRequest = await request.json()
    
    console.log('Creating GetNet Web Checkout session:', body)

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

    // Extraer nombre y apellido del customerName
    const fullName = body.customerName || body.customerEmail.split('@')[0]
    const nameParts = fullName.split(' ')
    const firstName = nameParts[0] || 'Cliente'
    const lastName = nameParts.slice(1).join(' ') || 'Usuario'

    // Generar fecha de expiración (5 minutos desde ahora)
    const expirationDate = new Date()
    expirationDate.setMinutes(expirationDate.getMinutes() + 5)
    const expiration = expirationDate.toISOString()

    // Obtener IP del cliente (simplificado para desarrollo)
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1'

    // Obtener User Agent
    const userAgent = request.headers.get('user-agent') || 'CasinoEscolar/1.0'

    // Preparar payload según manual oficial de GetNet Web Checkout
    const checkoutPayload: GetNetWebCheckoutPayload = {
      locale: 'es_CL',
      buyer: {
        name: firstName,
        surname: lastName,
        email: body.customerEmail,
        document: '11111111-9', // RUT por defecto para testing
        documentType: 'CLRUT',
        mobile: '56999999999' // Teléfono por defecto para testing
      },
      payment: {
        reference: body.orderId,
        description: body.description || `Pedido Casino Escolar #${body.orderId}`,
        amount: {
          currency: 'CLP',
          total: Math.round(body.amount)
        }
      },
      expiration: expiration,
      ipAddress: clientIP,
      userAgent: userAgent,
      returnUrl: body.returnUrl || `${request.nextUrl.origin}/payment/return`,
      cancelUrl: `${request.nextUrl.origin}/mi-pedido?cancelled=true`,
      notifyUrl: body.notifyUrl || `${request.nextUrl.origin}/api/payment/notify`
    }

    // Generar autenticación según manual de GetNet
    const auth = generateGetNetAuth(GETNET_CONFIG.login, GETNET_CONFIG.secret)

    console.log('GetNet Web Checkout payload prepared:', {
      ...checkoutPayload,
      auth: { ...auth, tranKey: '[HIDDEN]' },
      endpoint: `${baseUrl}/api/session/`
    })

    // Llamar a la API de GetNet Web Checkout
    const getNetResponse = await fetch(`${baseUrl}/api/session/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'CasinoEscolar/1.0'
      },
      body: JSON.stringify({
        auth: auth,
        ...checkoutPayload
      })
    })

    let getNetData: GetNetSessionResponse
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
    
    console.log('GetNet Web Checkout API response:', {
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
        errorMessage = getNetData?.status?.message || 'Datos de pago inválidos'
      } else if (getNetData?.status?.message) {
        errorMessage = getNetData.status.message
      }

      throw new Error(`${errorMessage} (${getNetResponse.status})`)
    }

    // Procesar respuesta exitosa de GetNet Web Checkout
    if (getNetData.status?.status === 'OK' && getNetData.processUrl) {
      const response: GetNetPaymentResponse = {
        success: true,
        paymentId: getNetData.requestId || body.orderId,
        redirectUrl: getNetData.processUrl,
        transactionId: getNetData.requestId
      }

      console.log('GetNet Web Checkout session created successfully:', response)
      return NextResponse.json(response)
    } else {
      // Si la respuesta no indica éxito claramente
      const errorMsg = getNetData.status?.message || 'Respuesta inesperada del proveedor de pagos'
      console.error('GetNet Web Checkout failed:', getNetData)
      throw new Error(errorMsg)
    }

  } catch (error) {
    console.error('Error creating GetNet Web Checkout session:', error)
    
    // Proporcionar mensaje de error más específico
    let errorMessage = 'Error interno del servidor'
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        errorMessage = 'No se pudo conectar con el proveedor de pagos'
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = 'Servicio de pagos no disponible. Verificando configuración...'
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

// Generar autenticación según manual de GetNet (páginas 11-12)
function generateGetNetAuth(login: string, secretKey: string): GetNetAuth {
  try {
    // Generar nonce (número aleatorio)
    const nonce = crypto.randomBytes(16).toString('base64')
    
    // Generar seed (timestamp actual en ISO8601)
    const seed = new Date().toISOString()
    
    // Crear tranKey según fórmula: Base64(SHA256(nonce + seed + secretKey))
    const tranKeyString = nonce + seed + secretKey
    const tranKeyHash = crypto.createHash('sha256').update(tranKeyString).digest()
    const tranKey = tranKeyHash.toString('base64')
    
    console.log('Generated GetNet auth:', {
      login,
      nonce: nonce.substring(0, 10) + '...',
      seed,
      tranKey: tranKey.substring(0, 10) + '...'
    })
    
    return {
      login,
      tranKey,
      nonce,
      seed
    }
  } catch (error) {
    console.error('Error generating GetNet auth:', error)
    throw new Error('Error al generar autenticación de seguridad')
  }
}

// Manejar otros métodos HTTP
export async function GET() {
  return NextResponse.json(
    { error: 'Método no permitido' },
    { status: 405 }
  )
}