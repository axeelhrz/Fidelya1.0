import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/client'

// Configuración GetNet
const GETNET_CONFIG = {
  login: process.env.GETNET_LOGIN!,
  secretKey: process.env.GETNET_SECRET!,
  baseUrl: process.env.GETNET_BASE_URL!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!
}

interface PaymentRequest {
  orderId: string
  amount: number
  description: string
  buyerEmail: string
  buyerName: string
}

export async function POST(request: NextRequest) {
  try {
    // 1. Validar variables de entorno
    if (!GETNET_CONFIG.login || !GETNET_CONFIG.secretKey || !GETNET_CONFIG.baseUrl) {
      console.error('Variables de entorno GetNet no configuradas')
      return NextResponse.json(
        { error: 'Configuración de pagos no disponible' },
        { status: 500 }
      )
    }

    // 2. Obtener datos del request
    const body: PaymentRequest = await request.json()

    const { orderId, amount, description, buyerEmail, buyerName } = body

    // 3. Validar datos requeridos
    if (!orderId || !amount || !buyerEmail || !buyerName) {
      return NextResponse.json(
        { error: 'Datos de pago incompletos' },
        { status: 400 }
      )
    }

    // 4. Verificar que el pedido existe y está pendiente
    const supabase = createServiceClient()
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('status', 'PENDIENTE')
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado o ya procesado' },
        { status: 404 }
      )
    }

    // 5. Verificar que el monto coincide
    if (order.total_amount !== amount) {
      return NextResponse.json(
        { error: 'El monto no coincide con el pedido' },
        { status: 400 }
      )
    }

    // 6. Generar datos de autenticación GetNet
    const seed = new Date().toISOString()
    const rawNonce = crypto.randomBytes(16)
    const nonce = rawNonce.toString('base64')
    
    const hash = crypto.createHash('sha256')
      .update(Buffer.concat([
        rawNonce, 
        Buffer.from(seed), 
        Buffer.from(GETNET_CONFIG.secretKey)
      ]))
      .digest()
    const tranKey = hash.toString('base64')

    // 7. Preparar datos del pago
    const paymentData = {
      auth: {
        login: GETNET_CONFIG.login,
        tranKey,
        nonce,
        seed
      },
      payment: {
        reference: orderId,
        description: description || `Pedido Casino Escolar #${orderId.substring(0, 8)}`,
        amount: {
          currency: 'CLP',
          total: amount
        }
      },
      buyer: {
        name: buyerName,
        email: buyerEmail
      },
      returnUrl: `${GETNET_CONFIG.appUrl}/payment/result?orderId=${orderId}`,
      cancelUrl: `${GETNET_CONFIG.appUrl}/pedidos/nuevo?cancelled=true`,
      ipAddress: request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    }

    console.log('🔐 Datos de autenticación GetNet:', {
      login: GETNET_CONFIG.login,
      seed,
      nonce: nonce.substring(0, 10) + '...',
      tranKeyLength: tranKey.length
    })

    console.log('💳 Datos del pago:', {
      reference: paymentData.payment.reference,
      amount: paymentData.payment.amount,
      buyer: paymentData.buyer,
      returnUrl: paymentData.returnUrl
    })

    // 8. Crear registro de pago
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        amount,
        status: 'PENDING',
        payment_method: 'GETNET_CHECKOUT'
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Error creando registro de pago:', paymentError)
      return NextResponse.json(
        { error: 'Error interno procesando pago' },
        { status: 500 }
      )
    }

    // 9. Llamar a GetNet
    try {
      const getnetResponse = await fetch(`${GETNET_CONFIG.baseUrl}/api/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      const responseText = await getnetResponse.text()
      console.log('📡 Respuesta GetNet (raw):', responseText)

      if (!getnetResponse.ok) {
        console.error('Error en respuesta GetNet:', {
          status: getnetResponse.status,
          statusText: getnetResponse.statusText,
          body: responseText
        })

        // Actualizar estado del pago
        await supabase
          .from('payments')
          .update({ 
            status: 'REJECTED',
            getnet_response: { error: responseText, status: getnetResponse.status }
          })
          .eq('id', payment.id)

        return NextResponse.json(
          { error: 'Error en el servicio de pagos' },
          { status: 500 }
        )
      }

      let getnetData
      try {
        getnetData = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Error parseando respuesta GetNet:', parseError)
        return NextResponse.json(
          { error: 'Respuesta inválida del servicio de pagos' },
          { status: 500 }
        )
      }

      console.log('✅ Respuesta GetNet procesada:', getnetData)

      // 10. Actualizar registro de pago con respuesta de GetNet
      await supabase
        .from('payments')
        .update({
          getnet_transaction_id: getnetData.requestId || getnetData.sessionId,
          getnet_response: getnetData
        })
        .eq('id', payment.id)

      // 11. Verificar si GetNet devolvió URL de checkout
      if (getnetData.processUrl) {
        return NextResponse.json({
          success: true,
          checkoutUrl: getnetData.processUrl,
          sessionId: getnetData.requestId || getnetData.sessionId,
          paymentId: payment.id
        })
      } else {
        console.error('GetNet no devolvió URL de checkout:', getnetData)
        return NextResponse.json(
          { error: 'No se pudo generar el checkout de pago' },
          { status: 500 }
        )
      }

    } catch (fetchError) {
      console.error('Error conectando con GetNet:', fetchError)
      
      // Actualizar estado del pago
      await supabase
        .from('payments')
        .update({ 
          status: 'REJECTED',
          getnet_response: { error: 'Connection failed', details: String(fetchError) }
        })
        .eq('id', payment.id)

      return NextResponse.json(
        { error: 'Error conectando con el servicio de pagos' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error general en create payment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}