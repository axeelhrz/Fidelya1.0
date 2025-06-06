import { PaymentRequest, PaymentResponse } from '@/types/order'

// Configuración de GetNet (corregida)
const GETNET_CONFIG = {
  apiUrl: process.env.GETNET_BASE_URL || 'https://checkout.test.getnet.cl',
  login: process.env.GETNET_LOGIN || '',
  secret: process.env.GETNET_SECRET || '',
  returnUrl: typeof window !== 'undefined' 
    ? `${window.location.origin}/payment/return` 
    : `${process.env.NEXT_PUBLIC_APP_URL}/payment/return`,
  notifyUrl: typeof window !== 'undefined' 
    ? `${window.location.origin}/api/payment/notify` 
    : `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/notify`
}

export interface GetNetPaymentRequest {
  amount: number
  orderId: string
  description: string
  customerEmail: string
  customerName: string
  returnUrl?: string
  notifyUrl?: string
}

export interface GetNetPaymentResponse {
  success: boolean
  paymentId?: string
  redirectUrl?: string
  error?: string
  transactionId?: string
}

export interface GetNetNotificationData {
  status: string
  orderId: string
  transactionId: string
  amount: number
  signature?: string
}

export class PaymentService {
  // Crear pago con GetNet
  static async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('Creating GetNet payment with request:', request)

      const getNetRequest: GetNetPaymentRequest = {
        amount: request.amount, // GetNet espera el monto en pesos chilenos
        orderId: request.orderId,
        description: request.description || `Pedido Casino Escolar #${request.orderId}`,
        customerEmail: request.userEmail,
        customerName: request.userEmail, // Using userEmail as customerName since customerName doesn't exist on PaymentRequest
        returnUrl: GETNET_CONFIG.returnUrl,
        notifyUrl: GETNET_CONFIG.notifyUrl
      }

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(getNetRequest),
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
      
      const data: GetNetPaymentResponse = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Error en la respuesta del servicio de pago')
      }

      console.log('GetNet payment created successfully:', data)
      
      return {
        success: true,
        paymentId: data.paymentId || data.transactionId || '',
        redirectUrl: data.redirectUrl || ''
      }
    } catch (error) {
      console.error('Error creating GetNet payment:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al procesar el pago'
      }
    }
  }

  // Verificar estado del pago
  static async verifyPayment(paymentId: string): Promise<boolean> {
    try {
      console.log('Verifying GetNet payment:', paymentId)

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
      
      return data.success || false
    } catch (error) {
      console.error('Error verifying GetNet payment:', error)
      return false
    }
  }

  // Procesar notificación de GetNet (webhook)
  static async processNotification(notificationData: any): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Processing GetNet notification:', notificationData)

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
          console.log(`Payment approved for order ${orderId}, transaction: ${transactionId}, amount: ${amount}`)
          // Aquí se actualizaría el estado del pedido en la base de datos
          break
        
        case 'rejected':
        case 'failed':
          console.log(`Payment failed for order ${orderId}, transaction: ${transactionId}, amount: ${amount}`)
          // Manejar pago fallido
          break
        
        case 'pending':
          console.log(`Payment pending for order ${orderId}, transaction: ${transactionId}, amount: ${amount}`)
          // Manejar pago pendiente
          break
        
        default:
          console.log(`Unknown payment status: ${status} for order ${orderId}, transaction: ${transactionId}, amount: ${amount}`)
      }

      return {
        success: true,
        message: 'Notificación procesada correctamente'
      }
    } catch (error) {
      console.error('Error processing GetNet notification:', error)
      return {
        success: false,
        message: 'Error al procesar la notificación'
      }
    }
  }

  // Validar notificación de GetNet
  private static async validateNotification(notificationData: any): Promise<boolean> {
    try {
      // Implementar validación de firma según documentación de GetNet
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
      console.error('Error validating GetNet notification:', error)
      return false
    }
  }

  // Generar firma para validación (implementar según documentación de GetNet)
  private static generateSignature(data: any): string {
    // Implementar según la documentación de GetNet
    // Típicamente es un HMAC-SHA256 de los datos concatenados
    return ''
  }

  // Obtener configuración de GetNet (para debugging)
  static getConfig() {
    return {
      apiUrl: GETNET_CONFIG.apiUrl,
      login: GETNET_CONFIG.login,
      hasSecret: !!GETNET_CONFIG.secret,
      returnUrl: GETNET_CONFIG.returnUrl,
      notifyUrl: GETNET_CONFIG.notifyUrl
    }
  }
}
