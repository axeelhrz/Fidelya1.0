import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/services/orderService'

// Configuración de GetNet para validación
const GETNET_CONFIG = {
  secret: process.env.GETNET_SECRET || '',
  login: process.env.GETNET_LOGIN || ''
}

// Interface para notificaciones de GetNet
interface GetNetNotification {
  status: {
    status: string
    message: string
    reason?: string
    date: string
  }
  requestId: string
  reference: string // Este es nuestro orderId
  signature?: string
  authorization?: string
  receipt?: string
  franchise?: string
  franchiseName?: string
  bank?: string
  bankName?: string
  internalReference?: number
  paymentMethod?: string
  paymentMethodName?: string
  issuerName?: string
  amount?: {
    from: {
      currency: string
      total: number
    }
    to: {
      currency: string
      total: number
    }
  }
  authorization_code?: string
  transaction?: {
    transactionID: string
    cus: string
    reference: string
    description: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const notificationData: GetNetNotification = await request.json()
    
    console.log('Received GetNet notification:', {
      status: notificationData.status?.status,
      requestId: notificationData.requestId,
      reference: notificationData.reference,
      message: notificationData.status?.message
    })

    // Validar que tenemos los datos mínimos requeridos
    if (!notificationData.reference || !notificationData.status) {
      console.error('Invalid GetNet notification - missing required fields')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Notificación inválida - faltan campos requeridos' 
        },
        { status: 400 }
      )
    }

    // Validar firma si está presente (recomendado para producción)
    if (notificationData.signature && !validateGetNetSignature(notificationData)) {
      console.error('Invalid GetNet signature')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Firma inválida' 
        },
        { status: 401 }
      )
    }

    const orderId = notificationData.reference
    const paymentStatus = notificationData.status.status
    const requestId = notificationData.requestId

    console.log(`Processing payment notification for order ${orderId}: ${paymentStatus}`)

    // Obtener el pedido de Firebase
    const order = await OrderService.getOrderById(orderId)
    if (!order) {
      console.error(`Order not found: ${orderId}`)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Pedido no encontrado' 
        },
        { status: 404 }
      )
    }

    // Procesar según el estado del pago
    let orderUpdateData: Partial<typeof order> = {}

    switch (paymentStatus.toUpperCase()) {
      case 'OK':
      case 'APPROVED':
      case 'PAID':
      case 'COMPLETED':
      case 'SUCCESS':
        // Pago exitoso
        console.log(`Payment approved for order ${orderId}`)
        orderUpdateData = {
          status: 'pagado',
          paidAt: new Date(),
          paymentId: requestId,
          metadata: {
            ...order.metadata,
            version: order.metadata?.version || '1.0',
            source: order.metadata?.source || 'payment-notification',
            paymentMethod: notificationData.paymentMethodName || 'GetNet',
            authorization: notificationData.authorization ?? null,
            franchise: notificationData.franchiseName ?? null,
            bank: notificationData.bankName ?? null,
            processedAt: new Date().toISOString()
          }
        }
        break
      
      case 'FAILED':
      case 'REJECTED':
      case 'CANCELLED':
      case 'DECLINED':
        orderUpdateData = {
          status: 'cancelado',
          metadata: {
            ...order.metadata,
            version: order.metadata?.version || '1.0',
            source: order.metadata?.source || 'payment-notification',
            failureReason: notificationData.status.message,
            failureCode: notificationData.status.reason ?? null,
            processedAt: new Date().toISOString()
          }
        }
        break
      
      case 'PENDING':
      case 'PROCESSING':
        orderUpdateData = {
          status: 'procesando_pago',
          paymentId: requestId,
          metadata: {
            ...order.metadata,
            version: order.metadata?.version || '1.0',
            source: order.metadata?.source || 'payment-notification',
            pendingReason: notificationData.status.message,
            processedAt: new Date().toISOString()
          }
        }
        break
      
      default:
        orderUpdateData = {
          metadata: {
            ...order.metadata,
            version: order.metadata?.version || '1.0',
            source: order.metadata?.source || 'payment-notification',
            unknownStatus: paymentStatus,
            unknownMessage: notificationData.status.message,
            processedAt: new Date().toISOString()
          }
        }
        break
    }

    // Actualizar el pedido en Firebase
    if (Object.keys(orderUpdateData).length > 0) {
      await OrderService.updateOrder(orderId, orderUpdateData)
      console.log(`Order ${orderId} updated successfully with status: ${orderUpdateData.status || 'metadata only'}`)
    }

    // Responder a GetNet
    return NextResponse.json({ 
      success: true, 
      message: 'Notificación procesada correctamente',
      orderId: orderId,
      status: orderUpdateData.status || order.status
    })

  } catch (error) {
    console.error('Error processing GetNet notification:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno al procesar la notificación' 
      },
      { status: 500 }
    )
  }
}

// Validar firma de GetNet (implementar según documentación)
function validateGetNetSignature(notification: GetNetNotification): boolean {
  try {
    if (!notification.signature || !GETNET_CONFIG.secret) {
      return true // Si no hay firma o secreto, no validamos (para desarrollo)
    }

    // Implementar validación de firma según documentación de GetNet
    // Por ahora retornamos true, pero en producción debe implementarse
    console.log('Signature validation not implemented - accepting notification')
    return true
  } catch (error) {
    console.error('Error validating GetNet signature:', error)
    return false
  }
}

// Manejar método GET para verificaciones de webhook
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    service: 'getnet-payment-notification',
    timestamp: new Date().toISOString()
  })
}