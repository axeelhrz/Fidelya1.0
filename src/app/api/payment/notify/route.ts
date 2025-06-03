import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/client'

// Configuración GetNet
const GETNET_CONFIG = {
  login: process.env.GETNET_LOGIN!,
  secretKey: process.env.GETNET_SECRET!,
  baseUrl: process.env.GETNET_BASE_URL!
}

interface GetNetNotification {
  requestId: string
  status: {
    status: string
    reason: string
    message: string
    date: string
  }
  payment?: {
    status: {
      status: string
      reason: string
      message: string
      date: string
    }
    amount: {
      currency: string
      total: number
    }
    authorization?: string
    receipt?: string
    franchise?: string
    reference: string
  }
  signature: string
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Webhook GetNet recibido')

    // 1. Validar configuración
    if (!GETNET_CONFIG.login || !GETNET_CONFIG.secretKey) {
      console.error('❌ Variables de entorno GetNet no configuradas')
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }

    // 2. Obtener datos del webhook
    const notification: GetNetNotification = await request.json()
    console.log('📦 Datos del webhook:', JSON.stringify(notification, null, 2))

    // 3. Validar firma (si GetNet la proporciona)
    if (notification.signature) {
      const expectedSignature = crypto
        .createHmac('sha256', GETNET_CONFIG.secretKey)
        .update(JSON.stringify(notification))
        .digest('hex')

      if (notification.signature !== expectedSignature) {
        console.error('❌ Firma inválida del webhook')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    // 4. Obtener cliente Supabase
    const supabase = createServiceClient()

    // 5. Buscar el pago por requestId/sessionId
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select(`
        *,
        orders (
          id,
          guardian_id,
          student_id,
          status
        )
      `)
      .eq('getnet_transaction_id', notification.requestId)
      .single()

    if (paymentError || !payment) {
      console.error('❌ Pago no encontrado:', notification.requestId)
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    console.log('💳 Pago encontrado:', payment.id)

    // 6. Determinar el estado del pago
    const paymentStatus = notification.payment?.status?.status || notification.status?.status
    const paymentMessage = notification.payment?.status?.message || notification.status?.message

    let newPaymentStatus: string
    let newOrderStatus: string

    switch (paymentStatus?.toUpperCase()) {
      case 'APPROVED':
      case 'OK':
        newPaymentStatus = 'APPROVED'
        newOrderStatus = 'PAGADO'
        break
      case 'REJECTED':
      case 'FAILED':
        newPaymentStatus = 'REJECTED'
        newOrderStatus = 'CANCELADO'
        break
      case 'PENDING':
        newPaymentStatus = 'PENDING'
        newOrderStatus = 'PENDIENTE'
        break
      default:
        console.warn('⚠️ Estado de pago desconocido:', paymentStatus)
        newPaymentStatus = 'PENDING'
        newOrderStatus = 'PENDIENTE'
    }

    console.log(`🔄 Actualizando estado: ${payment.status} -> ${newPaymentStatus}`)

    // 7. Actualizar el pago
    const { error: updatePaymentError } = await supabase
      .from('payments')
      .update({
        status: newPaymentStatus,
        processed_at: new Date().toISOString(),
        getnet_response: {
          ...payment.getnet_response,
          notification: notification,
          updated_at: new Date().toISOString()
        }
      })
      .eq('id', payment.id)

    if (updatePaymentError) {
      console.error('❌ Error actualizando pago:', updatePaymentError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // 8. Actualizar el pedido si el pago fue aprobado
    if (newPaymentStatus === 'APPROVED' && payment.orders) {
      const { error: updateOrderError } = await supabase
        .from('orders')
        .update({
          status: newOrderStatus,
          payment_id: notification.requestId
        })
        .eq('id', payment.orders.id)

      if (updateOrderError) {
        console.error('❌ Error actualizando pedido:', updateOrderError)
        // No retornamos error aquí porque el pago ya se procesó
      } else {
        console.log('✅ Pedido actualizado a PAGADO')
      }

      // 9. Enviar notificación por email (opcional)
      try {
        await sendPaymentConfirmationEmail(payment.orders.guardian_id, payment.orders.id)
      } catch (emailError) {
        console.error('⚠️ Error enviando email de confirmación:', emailError)
        // No fallar por error de email
      }
    }

    console.log('✅ Webhook procesado exitosamente')
    return NextResponse.json({ 
      success: true, 
      message: 'Notification processed',
      paymentStatus: newPaymentStatus,
      orderStatus: newOrderStatus
    })

  } catch (error) {
    console.error('❌ Error procesando webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Función auxiliar para enviar email de confirmación
async function sendPaymentConfirmationEmail(guardianId: string, orderId: string) {
  try {
    const supabase = createServiceClient()
    
    // Obtener datos del guardian y pedido
    const { data: guardian } = await supabase
      .from('guardians')
      .select('email, full_name')
      .eq('id', guardianId)
      .single()

    if (!guardian?.email) {
      console.log('No se encontró email del guardian')
      return
    }
    
    // Aquí podrías integrar con un servicio de email como SendGrid, Resend, etc.
    console.log(`📧 Debería enviar email de confirmación a: ${guardian.email}`)
    
    // Ejemplo de integración con Resend:
    /*
    await resend.emails.send({
      from: 'casino@colegio.cl',
      to: guardian.email,
      subject: 'Confirmación de pago - Casino Escolar',
      html: `
        <h2>¡Pago confirmado!</h2>
        <p>Hola ${guardian.full_name},</p>
        <p>Tu pago para el pedido #${orderId.substring(0, 8)} ha sido procesado exitosamente.</p>
        <p>Gracias por usar nuestro sistema de casino escolar.</p>
      `
    })
    */
    
  } catch (error) {
    console.error('Error enviando email:', error)
    throw error
  }
}

// Manejar otros métodos HTTP
export async function GET() {
  return NextResponse.json({ message: 'GetNet webhook endpoint' })
}