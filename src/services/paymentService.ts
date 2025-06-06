import { PaymentRequest, PaymentResponse } from '@/types/order'

// Configuración de NetGet
const NETGET_CONFIG = {
  apiUrl: process.env.NEXT_PUBLIC_NETGET_API_URL || 'https://api.netget.cl',
  merchantId: process.env.NEXT_PUBLIC_NETGET_MERCHANT_ID || '',
  secretKey: process.env.NETGET_SECRET_KEY || '',
  returnUrl: typeof window !== 'undefined' 
    ? `${window.location.origin}/payment/return` 
    : `${process.env.NEXT_PUBLIC_APP_URL}/payment/return`,
  notifyUrl: typeof window !== 'undefined' 
    ? `${window.location.origin}/api/payment/notify` 
    : `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/notify`
}

export interface NetGetPaymentRequest {
  amount: number
  orderId: string
  description: string
  customerEmail: string
  customerName: string
  returnUrl?: string
  notifyUrl?: string
}

export interface NetGetPaymentResponse {
  success: boolean
  paymentId?: string
  redirectUrl?: string
  error?: string
  transactionId?: string
}

export class PaymentService {
  // Crear pago con NetGet
  static async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('Creating NetGet payment with request:', request)

      const netGetRequest: NetGetPaymentRequest = {
        amount: Math.round(request.amount * 100), // NetGet espera centavos
        orderId: request.orderId,
        description: request.description || `Pedido Casino Escolar #${request.orderId}`,
        customerEmail: request.customerEmail,
        customerName: request.customerName,
        returnUrl: NETGET_CONFIG.returnUrl,
        notifyUrl: NETGET_CONFIG.notifyUrl
      }

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(netGetRequest),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Payment API error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        })
        throw new Error(errorData.message || `Error del servidor: ${response.status}`)
      }
      
      const data: NetGetPaymentResponse = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Error en la respuesta del servicio de pago')
      }

      console.log('NetGet payment created successfully:', data)
      
      return {
        success: true,
        paymentId: data.paymentId || data.transactionId || '',
        redirectUrl: data.redirectUrl || ''
      }
    } catch (error) {
      console.error('Error creating NetGet payment:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al procesar el pago'
      }
    }
  }

  // Verificar estado del pago
  static async verifyPayment(paymentId: string): Promise<boolean> {
    try {
      console.log('Verifying NetGet payment:', paymentId)

      const response = await fetch(`/api/payment/verify/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        console.error('Payment verification failed with status:', response.status)
        return false
      }
      
      const data = await response.json()
      console.log('Payment verification response:', data)
      
      return data.success && (data.status === 'paid' || data.status === 'approved' || data.status === 'completed')
    } catch (error) {
      console.error('Error verifying NetGet payment:', error)
      return false
    }
  }

  // Procesar notificación de NetGet (webhook)
  static async processNotification(notificationData: any): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Processing NetGet notification:', notificationData)

      // Validar la notificación (verificar firma, etc.)
      const isValid = await this.validateNotification(notificationData)
      
      if (!isValid) {
        return {
          success: false,
          message: 'Notificación inválida'
        }
      }

      // Procesar según el estado del pago
      const { status, orderId, transactionId, amount } = notificationData

      switch (status) {
        case 'approved':
        case 'paid':
        case 'completed':
          console.log(`Payment approved for order ${orderId}`)
          // Aquí se actualizaría el estado del pedido en la base de datos
          break
        
        case 'rejected':
        case 'failed':
          console.log(`Payment failed for order ${orderId}`)
          // Manejar pago fallido
          break
        
        case 'pending':
          console.log(`Payment pending for order ${orderId}`)
          // Manejar pago pendiente
          break
        
        default:
          console.log(`Unknown payment status: ${status} for order ${orderId}`)
      }

      return {
        success: true,
        message: 'Notificación procesada correctamente'
      }
    } catch (error) {
      console.error('Error processing NetGet notification:', error)
      return {
        success: false,
        message: 'Error al procesar la notificación'
      }
    }
  }

  // Validar notificación de NetGet
  private static async validateNotification(notificationData: any): Promise<boolean> {
    try {
      // Implementar validación de firma según documentación de NetGet
      // Por ahora retornamos true, pero en producción debe validarse la firma
      
      const requiredFields = ['status', 'orderId', 'transactionId', 'amount']
      const hasRequiredFields = requiredFields.every(field => 
        notificationData.hasOwnProperty(field) && notificationData[field] !== null
      )

      if (!hasRequiredFields) {
        console.error('Missing required fields in notification:', notificationData)
        return false
      }

      // Aquí se validaría la firma HMAC con la clave secreta
      // const expectedSignature = this.generateSignature(notificationData)
      // return expectedSignature === notificationData.signature

      return true
    } catch (error) {
      console.error('Error validating NetGet notification:', error)
      return false
    }
  }

  // Generar firma para validación (implementar según documentación de NetGet)
  private static generateSignature(data: any): string {
    // Implementar según la documentación de NetGet
    // Típicamente es un HMAC-SHA256 de los datos concatenados
    return ''
  }

  // Obtener configuración de NetGet (para debugging)
  static getConfig() {
    return {
      apiUrl: NETGET_CONFIG.apiUrl,
      merchantId: NETGET_CONFIG.merchantId,
      hasSecretKey: !!NETGET_CONFIG.secretKey,
      returnUrl: NETGET_CONFIG.returnUrl,
      notifyUrl: NETGET_CONFIG.notifyUrl
    }
  }
}